export type ImageVariant = "thumbs" | "large" | "viewer";

const CLOUDINARY_DELIVERY_ROOT = "https://res.cloudinary.com";
const DEFAULT_ASSET_FOLDER = "nha-be/di-tich-phu-xuan";

const TRANSFORMATIONS: Record<ImageVariant | "default", string> = {
  default: "f_auto,q_auto",
  thumbs: "f_auto,q_auto,c_fill,g_auto,w_480,h_320",
  large: "f_auto,q_auto,c_limit,w_1600",
  viewer: "f_auto,q_auto,c_limit,w_2200"
};

interface ImageUrlOptions {
  cloudName?: string;
  assetFolder?: string;
}

export function buildMediaUrl(
  src: string,
  variant?: ImageVariant,
  options: ImageUrlOptions = {}
): string {
  const cleanSrc = normalizeSlashes(src).trim();

  if (!cleanSrc) {
    return "";
  }

  if (isRemoteUrl(cleanSrc)) {
    return cleanSrc;
  }

  if (cleanSrc.startsWith("/")) {
    throw new Error(
      `Ảnh local không còn được hỗ trợ: ${cleanSrc}. Hãy dùng public ID hoặc URL Cloudinary.`
    );
  }

  const cloudName =
    options.cloudName ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  if (!cloudName.trim()) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. Hãy cấu hình Cloudinary trong .env.local."
    );
  }

  const assetFolder =
    options.assetFolder ??
    process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_FOLDER ??
    DEFAULT_ASSET_FOLDER;
  const transformation = TRANSFORMATIONS[variant ?? "default"];
  const publicId = buildCloudinaryPublicId(cleanSrc, assetFolder);

  return [
    CLOUDINARY_DELIVERY_ROOT,
    encodeURIComponent(cloudName.trim()),
    "image",
    "upload",
    transformation,
    encodeCloudinaryPath(publicId)
  ].join("/");
}

export function buildThumbnailUrl(src: string, options?: ImageUrlOptions): string {
  return buildMediaUrl(src, "thumbs", options);
}

export function buildLargeUrl(src: string, options?: ImageUrlOptions): string {
  return buildMediaUrl(src, "large", options);
}

export function buildViewerUrl(src: string, options?: ImageUrlOptions): string {
  return buildMediaUrl(src, "viewer", options);
}

export function buildCloudinaryPublicId(src: string, assetFolder = DEFAULT_ASSET_FOLDER): string {
  const cleanFolder = stripEdgeSlashes(normalizeSlashes(assetFolder).trim());
  const cleanSrc = stripEdgeSlashes(normalizeSlashes(src).trim()).replace(/\.[^./]+$/, "");

  if (!cleanSrc) {
    throw new Error("Không thể tạo Cloudinary public ID từ đường dẫn ảnh rỗng.");
  }

  const publicId = cleanFolder ? `${cleanFolder}/${cleanSrc}` : cleanSrc;

  if (/[?&#\\%<>+]/.test(publicId)) {
    throw new Error(`Cloudinary public ID chứa ký tự không hợp lệ: ${publicId}`);
  }

  return publicId;
}

export function isRemoteUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function encodeCloudinaryPath(src: string): string {
  return src
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function normalizeSlashes(src: string): string {
  return src.replace(/\\/g, "/");
}

function stripEdgeSlashes(src: string): string {
  return src.replace(/^\/+|\/+$/g, "");
}
