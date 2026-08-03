import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapViewer } from "@/components/MapViewer/MapViewer";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getMapBySlug, maps } from "@/data/maps";
import { buildMediaUrl } from "@/lib/image-url";
import { getSiteUrl } from "@/lib/seo";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return maps.map((map) => ({
    slug: map.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mapData = getMapBySlug(slug);

  if (!mapData) {
    return {
      title: "Không tìm thấy bản đồ"
    };
  }

  const siteUrl = getSiteUrl();
  const path = `/ban-do/${mapData.slug}`;
  const title = `${mapData.shortTitle ?? mapData.title} - Bản đồ số`;

  return {
    title,
    description: mapData.description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description: mapData.description,
      url: `${siteUrl}${path}`,
      siteName: "Bản đồ số di tích Đình Phú Xuân",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: buildMediaUrl(mapData.mapImage),
          width: mapData.intrinsicMapWidth ?? mapData.mapWidth,
          height: mapData.intrinsicMapHeight ?? mapData.mapHeight,
          alt: `Sơ đồ ${mapData.shortTitle ?? mapData.title}`
        }
      ]
    }
  };
}

export default async function MapPage({ params }: PageProps) {
  const { slug } = await params;
  const mapData = getMapBySlug(slug);

  if (!mapData) {
    notFound();
  }

  return (
    <>
      <SiteHeader compact />
      <main className={styles.page}>
        <div className={styles.titleBar}>
          <Link href="/#bo-ban-do">Quay về danh sách bản đồ</Link>
          <h1>{mapData.shortTitle ?? mapData.title}</h1>
          <p>{mapData.locations.length} marker hiện vật và không gian thờ tự.</p>
        </div>
        <MapViewer mapData={mapData} />
      </main>
    </>
  );
}
