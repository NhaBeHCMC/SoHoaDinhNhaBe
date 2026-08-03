export interface MapPosition {
  /**
   * Normalized horizontal coordinate from 0 to 1, relative to MapData.mapWidth.
   */
  x: number;
  /**
   * Normalized vertical coordinate from 0 to 1, relative to MapData.mapHeight.
   */
  y: number;
}

export interface LegacyMapPosition {
  x: number;
  y: number;
}

export interface GeographicLocation {
  latitude: number;
  longitude: number;
  address: string;
  sourceUrl: string;
  directionsUrl: string;
}

export interface MapImage {
  src: string;
  thumbnailSrc?: string;
  viewerSrc?: string;
  alt: string;
  caption?: string;
  photographer?: string;
  source?: string;
}

export interface MapInfoSection {
  id: string;
  title: string;
  body: string[];
  items?: string[];
}

export interface MapGallery {
  id: string;
  title: string;
  description?: string;
  images: MapImage[];
}

export interface MapLocation {
  id: string;
  title: string;
  position: MapPosition;
  legacyPosition?: LegacyMapPosition;
  period?: string;
  material?: string[];
  dimensions?: string;
  physicalLocation?: string;
  description: string;
  historicalValue?: string;
  chineseText?: string[];
  transliteration?: string[];
  translation?: string[];
  notes?: string[];
  legacyDescriptionHtml?: string;
  images: MapImage[];
}

export interface MapData {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  mapImage: string;
  mapWidth: number;
  mapHeight: number;
  intrinsicMapWidth?: number;
  intrinsicMapHeight?: number;
  geographicLocation?: GeographicLocation;
  locations: MapLocation[];
  infoSections: MapInfoSection[];
  galleries: MapGallery[];
  sourceCredit?: string;
}

export interface MapSummary {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  image?: string;
  status: "available" | "planned";
  geographicLocation?: GeographicLocation;
}

export type GeolocatedMapSummary = MapSummary & {
  geographicLocation: GeographicLocation;
};
