"use client";

import { useEffect, useRef, useState } from "react";
import type { Marker, Map as LeafletMap } from "leaflet";
import { createHeritageMarkerHtml } from "@/components/HeritageMarker/HeritageMarker";
import { DetailPanel } from "@/components/DetailPanel/DetailPanel";
import { ImageGallery } from "@/components/ImageGallery/ImageGallery";
import { buildMapMediaUrl } from "@/lib/image-url";
import { normalizedToLeafletLatLng } from "@/lib/map-coordinate";
import type { MapData, MapLocation } from "@/types/map";
import styles from "./MapViewer.module.css";

interface MapViewerProps {
  mapData: MapData;
}

type ResourcePanel =
  | { type: "none" }
  | { type: "info" }
  | { type: "gallery"; galleryId: string };

export function MapViewer({ mapData }: MapViewerProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [resourcePanel, setResourcePanel] = useState<ResourcePanel>({ type: "none" });

  useEffect(() => {
    let disposed = false;

    async function setupMap() {
      if (!mapElementRef.current || mapRef.current) {
        return;
      }

      const L = await import("leaflet");

      if (disposed || !mapElementRef.current) {
        return;
      }

      const bounds: [[number, number], [number, number]] = [
        [0, 0],
        [mapData.mapHeight, mapData.mapWidth]
      ];

      const map = L.map(mapElementRef.current, {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomControl: false,
        attributionControl: false
      });

      L.imageOverlay(buildMapMediaUrl(mapData.mapImage, mapData.media), bounds).addTo(map);

      map.fitBounds(bounds);
      map.setMaxBounds(bounds);
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      markersRef.current = mapData.locations.map((location, index) => {
        const marker = L.marker(normalizedToLeafletLatLng(location.position, mapData), {
          keyboard: true,
          title: location.title,
          alt: `Mở thông tin ${location.title}`,
          icon: L.divIcon({
            className: styles.markerIcon,
            html: createHeritageMarkerHtml(index + 1),
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          })
        });

        marker.on("click", () => {
          setResourcePanel({ type: "none" });
          setSelectedLocation(location);
        });

        marker.on("keydown", (event) => {
          const keyboardEvent = event.originalEvent as KeyboardEvent;
          if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
            keyboardEvent.preventDefault();
            setResourcePanel({ type: "none" });
            setSelectedLocation(location);
          }
        });

        marker.addTo(map);
        return marker;
      });

      mapRef.current = map;
      fitMap(map, bounds);
    }

    setupMap();

    return () => {
      disposed = true;
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const bounds: [[number, number], [number, number]] = [
      [0, 0],
      [mapData.mapHeight, mapData.mapWidth]
    ];

    function handleResize() {
      if (map) {
        fitMap(map, bounds);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mapData.mapHeight, mapData.mapWidth]);

  useEffect(() => {
    void import("leaflet").then((L) => {
      markersRef.current.forEach((marker, index) => {
        const location = mapData.locations[index];
        marker.setIcon(
          L.divIcon({
            className: styles.markerIcon,
            html: createHeritageMarkerHtml(index + 1, location.id === selectedLocation?.id),
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          })
        );
      });
    });
  }, [mapData.locations, selectedLocation?.id]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        resourcePanel.type !== "none" &&
        !document.querySelector("dialog[open]")
      ) {
        closeResourcePanel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [resourcePanel.type]);

  function closeLocationPanel() {
    setSelectedLocation(null);
  }

  function openInfoPanel() {
    setSelectedLocation(null);
    setResourcePanel({ type: "info" });
  }

  function openGallery(galleryId: string) {
    setSelectedLocation(null);
    setResourcePanel({ type: "gallery", galleryId });
  }

  function closeResourcePanel() {
    setResourcePanel({ type: "none" });
  }

  const activeGallery =
    resourcePanel.type === "gallery"
      ? mapData.galleries.find((gallery) => gallery.id === resourcePanel.galleryId)
      : undefined;

  return (
    <section className={styles.viewer} aria-label={`Bản đồ ${mapData.shortTitle ?? mapData.title}`}>
      <div className={styles.mapShell}>
        <div className={styles.toolbar} aria-label="Tư liệu bản đồ">
          <button type="button" onClick={openInfoPanel}>
            Thông tin đình
          </button>
          {mapData.galleries.map((gallery) => (
            <button type="button" key={gallery.id} onClick={() => openGallery(gallery.id)}>
              {gallery.id === "temple-images" ? "Ảnh đình" : "Hoạt động"}
            </button>
          ))}
        </div>

        <div className={styles.guide}>
          Chọn dấu triện trên sơ đồ để xem thông tin hiện vật. Có thể kéo, thu phóng bản đồ.
        </div>

        <div ref={mapElementRef} className={styles.map} />
      </div>

      <DetailPanel
        key={selectedLocation?.id ?? "closed-location"}
        location={selectedLocation}
        media={mapData.media}
        open={Boolean(selectedLocation)}
        onClose={closeLocationPanel}
      />

      <ResourcePanelView
        mapData={mapData}
        open={resourcePanel.type !== "none"}
        gallery={activeGallery}
        type={resourcePanel.type}
        onClose={closeResourcePanel}
      />
    </section>
  );
}

function fitMap(map: LeafletMap, bounds: [[number, number], [number, number]]) {
  map.invalidateSize();

  if (window.innerWidth < 768) {
    map.fitBounds(bounds, {
      paddingTopLeft: [20, 82],
      paddingBottomRight: [20, 110]
    });
    return;
  }

  if (window.innerWidth <= 1024) {
    map.fitBounds(bounds, {
      padding: [42, 42]
    });
    return;
  }

  map.fitBounds(bounds, {
    paddingTopLeft: [48, 72],
    paddingBottomRight: [430, 48]
  });
}

function ResourcePanelView({
  mapData,
  open,
  gallery,
  type,
  onClose
}: {
  mapData: MapData;
  open: boolean;
  gallery?: MapData["galleries"][number];
  type: ResourcePanel["type"];
  onClose: () => void;
}) {
  if (type === "none") {
    return null;
  }

  return (
    <aside
      className={styles.resourcePanel}
      data-open={open}
      data-testid="resource-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="resource-panel-title"
    >
      <div className={styles.resourceHeader}>
        <h2 id="resource-panel-title">
          {type === "info" ? "Thông tin tiểu sử đình thần" : gallery?.title}
        </h2>
        <button type="button" onClick={onClose} aria-label="Đóng tư liệu">
          ×
        </button>
      </div>
      <div className={styles.resourceBody}>
        {type === "info"
          ? mapData.infoSections.map((section) => (
              <section className={styles.infoSection} key={section.id}>
                <h3>{section.title}</h3>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))
          : gallery && (
              <ImageGallery images={gallery.images} title={gallery.title} media={mapData.media} />
            )}
      </div>
    </aside>
  );
}
