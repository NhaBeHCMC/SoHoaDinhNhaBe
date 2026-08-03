import { buildLargeUrl } from "@/lib/image-url";
import type { GeolocatedMapSummary, MapData, MapSummary } from "@/types/map";
import { phuXuanMap } from "./phu-xuan";

export const maps: MapData[] = [phuXuanMap];

export const futureMapSlots: MapSummary[] = Array.from({ length: 8 }, (_, index) => ({
  id: `future-map-${index + 1}`,
  slug: `ban-do-tuong-lai-${index + 1}`,
  title: `Bản đồ di tích tiếp theo ${index + 1}`,
  description: "Vị trí dành sẵn cho bản đồ số tiếp theo trong hệ thống.",
  status: "planned"
}));

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
    image: buildLargeUrl(map.mapImage),
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
  return [...getMapSummaries(), ...futureMapSlots];
}
