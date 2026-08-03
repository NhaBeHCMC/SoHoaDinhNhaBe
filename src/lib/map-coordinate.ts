import type { MapData, MapPosition } from "@/types/map";

export const LEGACY_IMAGE_WIDTH = 2000;
export const LEGACY_IMAGE_HEIGHT = 1600;

interface LegacyCoordinateOptions {
  x: number;
  y: number;
  legacyWidth?: number;
  legacyHeight?: number;
  mapWidth?: number;
  mapHeight?: number;
}

export function legacyPixelToNormalized({
  x,
  y,
  legacyWidth = LEGACY_IMAGE_WIDTH,
  legacyHeight = LEGACY_IMAGE_HEIGHT,
  mapWidth = LEGACY_IMAGE_WIDTH,
  mapHeight = LEGACY_IMAGE_HEIGHT
}: LegacyCoordinateOptions): MapPosition {
  const position = {
    x: x / legacyWidth / mapWidth,
    y: y / legacyHeight / mapHeight
  };

  assertNormalizedPosition(position);
  return position;
}

export function normalizedToLeafletLatLng(
  position: MapPosition,
  mapData: Pick<MapData, "mapWidth" | "mapHeight">
): [number, number] {
  assertNormalizedPosition(position);
  return [position.y * mapData.mapHeight, position.x * mapData.mapWidth];
}

export function normalizedToMapPoint(
  position: MapPosition,
  mapData: Pick<MapData, "mapWidth" | "mapHeight">
): { x: number; y: number } {
  assertNormalizedPosition(position);
  return {
    x: position.x * mapData.mapWidth,
    y: position.y * mapData.mapHeight
  };
}

export function assertNormalizedPosition(position: MapPosition): void {
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
    throw new Error("Map position must use finite numeric coordinates.");
  }

  if (position.x < 0 || position.x > 1 || position.y < 0 || position.y > 1) {
    throw new Error(
      `Map position must be normalized between 0 and 1. Received x=${position.x}, y=${position.y}.`
    );
  }
}
