"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { GeolocatedMapSummary } from "@/types/map";
import styles from "./HeritageLocator.module.css";

interface HeritageLocatorProps {
  sites: GeolocatedMapSummary[];
}

type MapStatus = "loading" | "ready" | "error";

export function HeritageLocator({ sites }: HeritageLocatorProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [activeSiteId, setActiveSiteId] = useState(sites[0]?.id ?? "");
  const [mapStatus, setMapStatus] = useState<MapStatus>(
    sites.length ? "loading" : "error",
  );
  const [retryKey, setRetryKey] = useState(0);

  const activeSite = useMemo(
    () => sites.find((site) => site.id === activeSiteId) ?? sites[0],
    [activeSiteId, sites],
  );

  useEffect(() => {
    let disposed = false;
    const markers = new Map<string, Marker>();
    markersRef.current = markers;

    async function setupMap() {
      if (!mapElementRef.current || sites.length === 0) {
        setMapStatus("error");
        return;
      }

      setMapStatus("loading");

      try {
        const L = await import("leaflet");

        if (disposed || !mapElementRef.current) {
          return;
        }

        mapRef.current?.remove();
        markers.clear();

        const firstLocation = sites[0].geographicLocation;
        const map = L.map(mapElementRef.current, {
          center: [firstLocation.latitude, firstLocation.longitude],
          zoom: 16,
          minZoom: 11,
          maxZoom: 19,
          zoomControl: false,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);
        L.control.zoom({ position: "bottomright" }).addTo(map);

        const bounds = L.latLngBounds([]);

        sites.forEach((site, index) => {
          const { latitude, longitude } = site.geographicLocation;
          const marker = L.marker([latitude, longitude], {
            keyboard: true,
            title: site.shortTitle ?? site.title,
            alt: `Chọn ${site.shortTitle ?? site.title}`,
            icon: createMarkerIcon(L, index + 1, site.id === sites[0].id),
          });

          marker.bindTooltip(site.shortTitle ?? site.title, {
            permanent: true,
            direction: "top",
            offset: [0, -26],
            className: styles.markerLabel,
          });
          marker.on("click", () => setActiveSiteId(site.id));
          marker.on("keydown", (event) => {
            const keyboardEvent = event.originalEvent as KeyboardEvent;
            if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
              keyboardEvent.preventDefault();
              setActiveSiteId(site.id);
            }
          });
          marker.addTo(map);
          markers.set(site.id, marker);
          bounds.extend([latitude, longitude]);
        });

        if (sites.length > 1) {
          map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
        }

        mapRef.current = map;
        map.whenReady(() => {
          if (!disposed) {
            map.invalidateSize();
            setMapStatus("ready");
          }
        });
      } catch {
        if (!disposed) {
          setMapStatus("error");
        }
      }
    }

    void setupMap();

    return () => {
      disposed = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [retryKey, sites]);

  useEffect(() => {
    if (!activeSite || !mapRef.current) {
      return;
    }

    void import("leaflet").then((L) => {
      markersRef.current.forEach((marker, siteId) => {
        const index = sites.findIndex((site) => site.id === siteId);
        marker.setIcon(
          createMarkerIcon(L, index + 1, siteId === activeSite.id),
        );
      });

      const { latitude, longitude } = activeSite.geographicLocation;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        mapRef.current?.setView([latitude, longitude], 16);
      } else {
        mapRef.current?.flyTo([latitude, longitude], 16, { duration: 0.42 });
      }
    });
  }, [activeSite, sites]);

  return (
    <section
      className={styles.section}
      id="ban-do-nha-be"
      aria-labelledby="locator-title"
    >
      <div className={styles.heading}>
        <div>
          <h2 id="locator-title">Bản đồ di tích xã Nhà Bè</h2>
        </div>
        <p className={styles.count}>
          <strong>{sites.length}</strong> địa điểm đã có tọa độ
        </p>
      </div>

      <div className={styles.explorer}>
        <div className={styles.mapPanel} data-state={mapStatus}>
          <div
            ref={mapElementRef}
            className={styles.map}
            aria-label="Bản đồ vị trí các di tích tại Nhà Bè"
          />

          {mapStatus === "loading" ? (
            <div className={styles.mapState} role="status" aria-live="polite">
              <span className={styles.loader} aria-hidden="true" />
              <span>Đang tải bản đồ khu vực…</span>
            </div>
          ) : null}

          {mapStatus === "error" ? (
            <div className={styles.mapState} role="alert">
              <strong>Chưa tải được nền bản đồ.</strong>
              <span>Kiểm tra kết nối mạng rồi thử lại.</span>
              <button
                type="button"
                onClick={() => setRetryKey((value) => value + 1)}
              >
                Tải lại bản đồ
              </button>
            </div>
          ) : null}
        </div>

        <aside
          className={styles.directory}
          aria-label="Danh sách di tích trên bản đồ"
        >
          <div className={styles.directoryHead}>
            <h3>Địa điểm</h3>
            <p>Chọn một tên để đưa bản đồ về đúng vị trí.</p>
          </div>

          <ol className={styles.siteList}>
            {sites.map((site, index) => {
              const isActive = site.id === activeSite?.id;
              return (
                <li key={site.id}>
                  <button
                    type="button"
                    className={styles.siteButton}
                    aria-pressed={isActive}
                    onClick={() => setActiveSiteId(site.id)}
                  >
                    <span className={styles.siteIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{site.shortTitle ?? site.title}</strong>
                      <small>{site.geographicLocation.address}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {activeSite ? (
            <div className={styles.activeSite} aria-live="polite">
              <p className={styles.activeLabel}>Đang chọn</p>
              <h3>{activeSite.shortTitle ?? activeSite.title}</h3>
              <address>{activeSite.geographicLocation.address}</address>
              <div className={styles.actions}>
                <Link href={`/ban-do/${activeSite.slug}`}>
                  Xem bản đồ di tích
                </Link>
                <a
                  href={activeSite.geographicLocation.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chỉ đường
                </a>
              </div>
              <a
                className={styles.sourceLink}
                href={activeSite.geographicLocation.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Xem điểm trên OpenStreetMap
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function createMarkerIcon(
  L: typeof import("leaflet"),
  index: number,
  active: boolean,
) {
  return L.divIcon({
    className: styles.markerIcon,
    html: `<span class="${styles.markerSeal}" data-active="${active}"><span class="${styles.markerNumber}">${index}</span></span>`,
    iconSize: [44, 52],
    iconAnchor: [22, 48],
    tooltipAnchor: [0, -44],
  });
}
