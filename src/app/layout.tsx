import type { Metadata, Viewport } from "next";
import { buildMediaUrl } from "@/lib/image-url";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bản đồ số di tích Đình Phú Xuân",
    template: "%s | Bản đồ số di tích Đình Phú Xuân"
  },
  description:
    "Hệ thống bản đồ số hóa thông tin di tích kiến trúc nghệ thuật Đình Phú Xuân và các bản đồ di tích tiếp theo.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Bản đồ số di tích Đình Phú Xuân",
    description:
      "Nền tảng bản đồ số hóa di tích với dữ liệu hiện vật, vị trí và gallery hình ảnh.",
    url: "/",
    siteName: "Bản đồ số di tích Đình Phú Xuân",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: buildMediaUrl("map.jpg"),
        width: 2000,
        height: 1646,
        alt: "Sơ đồ số hóa Đình Phú Xuân"
      }
    ]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4F1715"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
