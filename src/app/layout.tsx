import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const siteUrl = getSiteUrl();
const socialImage = {
  url: "/cong-trinh-so-hoa-di-tich-dinh-nha-be.jpg",
  width: 1280,
  height: 426,
  alt: "Công trình số hóa di tích đình tại xã Nhà Bè"
};

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
    images: [socialImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè",
    description:
      "Nền tảng bản đồ số hóa di tích với dữ liệu hiện vật, vị trí và gallery hình ảnh.",
    images: [socialImage.url]
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
