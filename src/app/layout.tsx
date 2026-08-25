import type { Metadata, Viewport } from "next";
import { buildMediaUrl } from "@/lib/image-url";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè",
    template: "%s | Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè"
  },
  description:
    "Hệ thống bản đồ số hóa thông tin di tích kiến trúc nghệ thuật các đình trên địa bàn xã Nhà Bè.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè",
    description:
      "Nền tảng bản đồ số hóa di tích với dữ liệu hiện vật, vị trí và gallery hình ảnh.",
    url: "/",
    siteName: "Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè",
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
