import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const cloudName = [
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_CLOUD_NAME
].find((value) => value && value !== "your-cloud-name");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloudName ?? ""
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
