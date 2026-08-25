import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const CLOUDINARY_IMAGE_LIMIT_BYTES = 10 * 1024 * 1024;
const SAFE_UPLOAD_TARGET_BYTES = Math.floor(9.5 * 1024 * 1024);

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const optimizedRoot = join(projectRoot, "optimized");
const viewerRoot = join(optimizedRoot, "viewer");
const cli = parseArguments(process.argv.slice(2));
const dryRun = cli.flags.has("dry-run");
const overwrite = cli.flags.has("overwrite");
const onlyLogicalPath = cli.options.only
  ? normalizeSlashes(cli.options.only).replace(/^\/+/, "")
  : undefined;
const sourceRoot = cli.options.source
  ? resolve(projectRoot, cli.options.source)
  : undefined;

loadLocalEnvironment();

const config = {
  cloudName: firstConfigured(
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ),
  apiKey: firstConfigured(process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API),
  apiSecret: firstConfigured(process.env.CLOUDINARY_API_SECRET, process.env.CLOUDINARY_SECRET),
  assetFolder:
    cli.options.folder ??
    process.env.CLOUDINARY_ASSET_FOLDER ??
    process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_FOLDER ??
    "nha-be/di-tich-phu-xuan",
  tags: cli.options.tags ?? "nha-be,di-tich-phu-xuan",
  concurrency: parseConcurrency(process.env.CLOUDINARY_UPLOAD_CONCURRENCY)
};

assertAssetFolder(config.assetFolder);
assertSourceRoot(sourceRoot);

if (!dryRun) {
  assertConfigured(config);
  await verifyCredentials();
}

const collectedAssets = await collectAssets();
const assets = onlyLogicalPath
  ? collectedAssets.filter((asset) => asset.logicalPath === onlyLogicalPath)
  : collectedAssets;

if (onlyLogicalPath && assets.length !== 1) {
  throw new Error(`Không tìm thấy đúng một ảnh khớp --only ${onlyLogicalPath}.`);
}

console.log(
  [
    `Cloudinary folder: ${config.assetFolder}`,
    `Source: ${sourceRoot ? relative(projectRoot, sourceRoot) : "optimized/map.jpg + optimized/viewer"}`,
    `Assets: ${assets.length}`,
    `Mode: ${dryRun ? "dry-run" : overwrite ? "overwrite" : "upload missing only"}`
  ].join("\n")
);

if (dryRun) {
  for (const asset of assets) {
    console.log(`${asset.logicalPath} -> ${asset.publicId}`);
  }
  process.exit(0);
}

let completed = 0;
const failures = [];

await runPool(assets, config.concurrency, async (asset) => {
  try {
    const result = await uploadAsset(asset);
    completed += 1;
    const state = result.existing ? "exists" : "uploaded";
    console.log(`[${completed}/${assets.length}] ${state}: ${asset.publicId}`);
  } catch (error) {
    completed += 1;
    failures.push({ asset, error });
    console.error(`[${completed}/${assets.length}] failed: ${asset.publicId}`);
    console.error(error instanceof Error ? error.message : String(error));
  }
});

if (failures.length > 0) {
  throw new Error(`${failures.length} ảnh upload thất bại. Các ảnh đã thành công không bị upload lại.`);
}

console.log(`Hoàn tất ${assets.length} ảnh. Khởi động lại Next.js để dùng URL Cloudinary.`);

async function collectAssets() {
  if (sourceRoot) {
    const files = await walk(sourceRoot);

    return files
      .map((filePath) => ({
        filePath,
        logicalPath: normalizeSlashes(relative(sourceRoot, filePath))
      }))
      .map(withPublicId)
      .sort(compareAssets);
  }

  const staticAssets = [{ filePath: join(optimizedRoot, "map.jpg"), logicalPath: "map.jpg" }];
  const galleryFiles = await walk(viewerRoot);
  const galleryAssets = galleryFiles.map((filePath) => ({
    filePath,
    logicalPath: normalizeSlashes(relative(viewerRoot, filePath))
  }));

  return [...staticAssets, ...galleryAssets].map(withPublicId).sort(compareAssets);
}

function withPublicId(asset) {
  return {
    ...asset,
    publicId: buildPublicId(asset.logicalPath, config.assetFolder)
  };
}

function compareAssets(left, right) {
  return left.logicalPath.localeCompare(right.logicalPath, "vi");
}

async function uploadAsset(asset) {
  const upload = await prepareUpload(asset);
  const form = new FormData();

  form.set("file", new Blob([upload.bytes], { type: upload.mimeType }), upload.fileName);
  form.set("public_id", asset.publicId);
  form.set("asset_folder", stripEdgeSlashes(config.assetFolder));
  form.set("display_name", basename(asset.logicalPath, extname(asset.logicalPath)));
  form.set("overwrite", String(overwrite));
  form.set("invalidate", String(overwrite));
  form.set("tags", config.tags);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
    {
      method: "POST",
      headers: {
        Authorization: getAuthorizationHeader()
      },
      body: form
    }
  );
  const result = await response.json();

  if (!response.ok) {
    const message = result?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`${message} (${asset.logicalPath})`);
  }

  return result;
}

async function prepareUpload(asset) {
  const originalBytes = await readFile(asset.filePath);

  if (originalBytes.byteLength <= CLOUDINARY_IMAGE_LIMIT_BYTES) {
    return {
      bytes: originalBytes,
      fileName: basename(asset.filePath),
      mimeType: getMimeType(asset.filePath)
    };
  }

  if (!/\.jpe?g$/i.test(asset.filePath)) {
    throw new Error(
      `Ảnh vượt 10 MB và không phải JPEG nên không thể tự tối ưu: ${asset.logicalPath}`
    );
  }

  const attempts = [
    { maxDimension: 6000, quality: 88 },
    { maxDimension: 5200, quality: 84 },
    { maxDimension: 4600, quality: 82 },
    { maxDimension: 4000, quality: 80 }
  ];

  for (const attempt of attempts) {
    const optimizedBytes = await sharp(originalBytes)
      .rotate()
      .resize({
        width: attempt.maxDimension,
        height: attempt.maxDimension,
        fit: "inside",
        withoutEnlargement: true
      })
      .jpeg({
        quality: attempt.quality,
        chromaSubsampling: "4:4:4",
        mozjpeg: true
      })
      .toBuffer();

    if (optimizedBytes.byteLength <= SAFE_UPLOAD_TARGET_BYTES) {
      console.log(
        `optimized: ${asset.logicalPath} (${formatMegabytes(originalBytes.byteLength)} -> ${formatMegabytes(optimizedBytes.byteLength)})`
      );

      return {
        bytes: optimizedBytes,
        fileName: `${basename(asset.filePath, extname(asset.filePath))}.jpg`,
        mimeType: "image/jpeg"
      };
    }
  }

  throw new Error(`Không thể tối ưu ${asset.logicalPath} xuống dưới giới hạn 10 MB.`);
}

async function verifyCredentials() {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/resources/image?max_results=1`,
    {
      headers: {
        Authorization: getAuthorizationHeader()
      }
    }
  );

  if (response.ok) {
    return;
  }

  const result = await response.json().catch(() => null);
  const message = result?.error?.message ?? `HTTP ${response.status}`;
  throw new Error(`Cloudinary credential không hợp lệ: ${message}`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      return isImageFile(entry.name) ? [fullPath] : [];
    })
  );

  return files.flat();
}

async function runPool(items, concurrency, worker) {
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const item = items[nextIndex];
      nextIndex += 1;
      await worker(item);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
}

function buildPublicId(logicalPath, assetFolder) {
  const pathWithoutExtension = normalizeSlashes(logicalPath).replace(/\.[^./]+$/, "");
  const publicId = [stripEdgeSlashes(assetFolder), stripEdgeSlashes(pathWithoutExtension)]
    .filter(Boolean)
    .join("/");

  if (/[?&#\\%<>+]/.test(publicId)) {
    throw new Error(`Cloudinary public ID chứa ký tự không hợp lệ: ${publicId}`);
  }

  return publicId;
}

function loadLocalEnvironment() {
  if (typeof process.loadEnvFile !== "function") {
    return;
  }

  for (const fileName of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(join(projectRoot, fileName));
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }
}

function parseArguments(args) {
  const flags = new Set();
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (!argument.startsWith("--")) {
      throw new Error(`Tham số không hợp lệ: ${argument}`);
    }

    const [rawName, inlineValue] = argument.slice(2).split("=", 2);

    if (["dry-run", "overwrite"].includes(rawName)) {
      flags.add(rawName);
      continue;
    }

    if (!["source", "folder", "tags", "only"].includes(rawName)) {
      throw new Error(`Tham số không được hỗ trợ: --${rawName}`);
    }

    const value = inlineValue ?? args[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Thiếu giá trị cho --${rawName}`);
    }

    options[rawName] = value;

    if (inlineValue === undefined) {
      index += 1;
    }
  }

  return { flags, options };
}

function assertSourceRoot(directory) {
  if (!directory) {
    return;
  }

  const relativePath = relative(projectRoot, directory);

  if (!relativePath || relativePath.startsWith("..") || resolve(projectRoot, relativePath) !== directory) {
    throw new Error("Thư mục source phải nằm bên trong project.");
  }
}

function assertAssetFolder(assetFolder) {
  const cleanFolder = stripEdgeSlashes(assetFolder);

  if (!cleanFolder || /[?&#\\%<>+]/.test(cleanFolder)) {
    throw new Error(`Cloudinary folder không hợp lệ: ${assetFolder}`);
  }
}

function assertConfigured(value) {
  const missing = [
    ["CLOUDINARY_CLOUD_NAME", value.cloudName],
    ["CLOUDINARY_API_KEY", value.apiKey],
    ["CLOUDINARY_API_SECRET", value.apiSecret]
  ]
    .filter(([, configuredValue]) => !configuredValue)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Thiếu biến môi trường: ${missing.join(", ")}. Xem .env.example.`);
  }
}

function parseConcurrency(value) {
  const parsed = Number(value ?? 4);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 8) : 4;
}

function firstConfigured(...values) {
  return values.find((value) => value && value !== "your-cloud-name") ?? "";
}

function getAuthorizationHeader() {
  const authorization = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64");
  return `Basic ${authorization}`;
}

function getMimeType(filePath) {
  const extension = extname(filePath).toLowerCase();

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

function isImageFile(fileName) {
  return /\.(jpe?g|png|webp)$/i.test(fileName);
}

function normalizeSlashes(value) {
  return sep === "/" ? value : value.replaceAll(sep, "/");
}

function stripEdgeSlashes(value) {
  return normalizeSlashes(value.trim()).replace(/^\/+|\/+$/g, "");
}

function formatMegabytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
