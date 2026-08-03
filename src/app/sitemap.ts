import type { MetadataRoute } from "next";
import { maps } from "@/data/maps";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1
    },
    ...maps.map((map) => ({
      url: `${siteUrl}/ban-do/${map.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9
    }))
  ];
}
