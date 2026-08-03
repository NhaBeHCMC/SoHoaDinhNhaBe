import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const optimizedRoot = join(projectRoot, "optimized");
const viewerRoot = join(optimizedRoot, "viewer");
const dryRun = process.argv.includes("--dry-run");
const overwrite = process.argv.includes("--overwrite");

loadLocalEnvironment();

const config = {
  cloudName: firstConfigured(
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ),
  apiKey: firstConfigured(process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API),
  apiSecret: firstConfigured(process.env.CLOUDINARY_API_SECRET, process.env.CLOUDINARY_SECRET),
  assetFolder:
    process.env.CLOUDINARY_ASSET_FOLDER ??
    process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_FOLDER ??
    "nha-be/di-tich-phu-xuan",
  concurrency: parseConcurrency(process.env.CLOUDINARY_UPLOAD_CONCURRENCY)
};

if (!dryRun) {
  assertConfigured(config);
  await verifyCredentials();
}

const assets = await collectAssets();

console.log(
  [
    `Cloudinary folder: ${config.assetFolder}`,
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
  const staticAssets = [{ filePath: join(optimizedRoot, "map.jpg"), logicalPath: "map.jpg" }];
  const galleryFiles = await walk(viewerRoot);
  const galleryAssets = galleryFiles.map((filePath) => ({
    filePath,
    logicalPath: normalizeSlashes(relative(viewerRoot, filePath))
  }));

  return [...staticAssets, ...galleryAssets]
    .map((asset) => ({
      ...asset,
      publicId: buildPublicId(asset.logicalPath, config.assetFolder)
    }))
    .sort((left, right) => left.logicalPath.localeCompare(right.logicalPath, "vi"));
}

async function uploadAsset(asset) {
  const bytes = await readFile(asset.filePath);
  const form = new FormData();

  form.set("file", new Blob([bytes], { type: getMimeType(asset.filePath) }), basename(asset.filePath));
  form.set("public_id", asset.publicId);
  form.set("asset_folder", stripEdgeSlashes(config.assetFolder));
  form.set("display_name", basename(asset.logicalPath, extname(asset.logicalPath)));
  form.set("overwrite", String(overwrite));
  form.set("invalidate", String(overwrite));
  form.set("tags", "nha-be,di-tich-phu-xuan");

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

  try {
    process.loadEnvFile(join(projectRoot, ".env.local"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
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
