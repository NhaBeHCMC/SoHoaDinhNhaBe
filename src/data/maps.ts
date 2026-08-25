import { longKienMap } from "@/heritage-sites/long-kien/map-data";
import { phuXuanMap } from "@/heritage-sites/phu-xuan/map-data";
import { buildMapMediaUrl } from "@/lib/image-url";
import type { GeolocatedMapSummary, MapData, MapSummary } from "@/types/map";

export const maps: MapData[] = [phuXuanMap, longKienMap];

export function getMapBySlug(slug: string): MapData | undefined {
  return maps.find((map) => map.slug === slug);
}

export function getMapSummaries(): MapSummary[] {
  return maps.map((map) => ({
    id: map.id,
    slug: map.slug,
    title: map.title,
    shortTitle: map.shortTitle,
    description: map.description,
    image: buildMapMediaUrl(map.mapImage, map.media, "large"),
    status: "available",
    geographicLocation: map.geographicLocation
  }));
}

export function getGeolocatedMapSummaries(): GeolocatedMapSummary[] {
  return getMapSummaries().filter(
    (map): map is GeolocatedMapSummary => map.geographicLocation !== undefined
  );
}

export function getAllMapSummaries(): MapSummary[] {
  return getMapSummaries();
}
