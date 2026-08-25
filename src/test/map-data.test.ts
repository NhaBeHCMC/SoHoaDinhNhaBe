import { describe, expect, it } from "vitest";
import { getAllMapSummaries, getGeolocatedMapSummaries, maps } from "../data/maps";
import { PHU_XUAN_SOURCE_MARKER_COUNT, phuXuanMap } from "../data/phu-xuan";
import {
  LONG_KIEN_SOURCE_MARKER_COUNT,
  longKienMap
} from "../heritage-sites/long-kien/map-data";
import {
  LEGACY_IMAGE_HEIGHT,
  LEGACY_IMAGE_WIDTH,
  legacyPixelToNormalized,
  normalizedToLeafletLatLng
} from "../lib/map-coordinate";
import {
  buildCloudinaryPublicId,
  buildLargeUrl,
  buildMapMediaUrl,
  buildMediaUrl,
  buildThumbnailUrl,
  buildViewerUrl
} from "../lib/image-url";

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "nha-be-test";
process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_FOLDER = "nha-be/di-tich-phu-xuan";

describe("map data", () => {
  it("does not duplicate map slugs", () => {
    const slugs = maps.map((map) => map.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("does not duplicate location ids inside a map", () => {
    for (const map of maps) {
      const ids = map.locations.map((location) => location.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("keeps the original Phu Xuan marker count", () => {
    expect(phuXuanMap.locations).toHaveLength(PHU_XUAN_SOURCE_MARKER_COUNT);
  });

  it("keeps the original Long Kien marker and gallery counts", () => {
    expect(longKienMap.locations).toHaveLength(LONG_KIEN_SOURCE_MARKER_COUNT);
    expect(longKienMap.galleries[0].images).toHaveLength(16);
    expect(longKienMap.galleries[1].images).toHaveLength(12);
  });

  it("lists only registered maps", () => {
    expect(getAllMapSummaries()).toHaveLength(2);
    expect(maps.map((map) => map.slug)).toEqual([
      "dinh-phu-xuan",
      "dinh-long-kien"
    ]);
  });

  it("keeps all coordinates normalized", () => {
    for (const map of maps) {
      for (const location of map.locations) {
        expect(location.position.x).toBeGreaterThanOrEqual(0);
        expect(location.position.x).toBeLessThanOrEqual(1);
        expect(location.position.y).toBeGreaterThanOrEqual(0);
        expect(location.position.y).toBeLessThanOrEqual(1);
      }
    }
  });

  it("publishes verified geographic coordinates for both home-map sites", () => {
    const [phuXuan, longKien] = getGeolocatedMapSummaries();

    expect(phuXuan.slug).toBe("dinh-phu-xuan");
    expect(phuXuan.geographicLocation.latitude).toBeCloseTo(10.69838, 5);
    expect(phuXuan.geographicLocation.longitude).toBeCloseTo(106.73501, 5);
    expect(phuXuan.geographicLocation.address).toContain("Nhà Bè");

    expect(longKien.slug).toBe("dinh-long-kien");
    expect(longKien.geographicLocation.latitude).toBeCloseTo(10.6973805, 6);
    expect(longKien.geographicLocation.longitude).toBeCloseTo(106.7060156, 6);
    expect(longKien.geographicLocation.address).toContain("Lê Văn Lương");
  });

  it("keeps required location fields and image paths", () => {
    for (const map of maps) {
      for (const location of map.locations) {
        expect(location.title.trim()).not.toBe("");
        expect(location.description.trim()).not.toBe("");
        for (const image of location.images) {
          expect(image.src.trim()).not.toBe("");
          expect(image.alt.trim()).not.toBe("");
        }
      }
    }
  });

  it("converts legacy pixel coordinates with the original formula", () => {
    const legacy = { x: 1429000, y: 1772800 };
    const normalized = legacyPixelToNormalized(legacy);
    const [lat, lng] = normalizedToLeafletLatLng(normalized, {
      mapWidth: LEGACY_IMAGE_WIDTH,
      mapHeight: LEGACY_IMAGE_HEIGHT
    });

    expect(lng).toBeCloseTo(legacy.x / LEGACY_IMAGE_WIDTH, 8);
    expect(lat).toBeCloseTo(legacy.y / LEGACY_IMAGE_HEIGHT, 8);
  });
});

describe("image adapter", () => {
  const cloudinaryOptions = {
    cloudName: "nha-be-test",
    assetFolder: "nha-be/di-tich-phu-xuan"
  };

  it("builds Cloudinary URLs with context-specific transformations", () => {
    expect(buildMediaUrl("map.jpg", undefined, cloudinaryOptions)).toBe(
      "https://res.cloudinary.com/nha-be-test/image/upload/f_auto,q_auto/nha-be/di-tich-phu-xuan/map"
    );
    expect(buildThumbnailUrl("AnhDinh/dinh (1).JPG", cloudinaryOptions)).toBe(
      "https://res.cloudinary.com/nha-be-test/image/upload/f_auto,q_auto,c_fill,g_auto,w_480,h_320/nha-be/di-tich-phu-xuan/AnhDinh/dinh%20(1)"
    );
    expect(buildLargeUrl("AnhDinh/dinh (1).JPG", cloudinaryOptions)).toContain(
      "/f_auto,q_auto,c_limit,w_1600/"
    );
    expect(buildViewerUrl("AnhDinh/dinh (1).JPG", cloudinaryOptions)).toContain(
      "/f_auto,q_auto,c_limit,w_2200/"
    );
  });

  it("keeps existing remote and public-local URLs unchanged", () => {
    expect(buildMediaUrl("https://example.test/image.jpg")).toBe("https://example.test/image.jpg");
    expect(buildMediaUrl("/heritage-sites/long-kien/map.jpg")).toBe(
      "/heritage-sites/long-kien/map.jpg"
    );
  });

  it("resolves every Long Kien image from its own Cloudinary folder", () => {
    const logicalPaths = [
      longKienMap.mapImage,
      ...longKienMap.locations.flatMap((location) => location.images.map((item) => item.src)),
      ...longKienMap.galleries.flatMap((gallery) => gallery.images.map((item) => item.src))
    ];

    for (const logicalPath of logicalPaths) {
      const publicUrl = buildMapMediaUrl(logicalPath, longKienMap.media, "large");
      expect(publicUrl).toContain(
        "/v1787658101/nha-be/di-tich-long-kien/"
      );
    }
  });

  it("uses stable public IDs without file extensions", () => {
    expect(buildCloudinaryPublicId("AnhCacBanTho/CHINHDIEN.JPG")).toBe(
      "nha-be/di-tich-phu-xuan/AnhCacBanTho/CHINHDIEN"
    );
  });
});
