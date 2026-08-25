"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { GeolocatedMapSummary } from "@/types/map";
import styles from "./HeritageLocator.module.css";

interface HeritageLocatorProps {
  sites: GeolocatedMapSummary[];
}

export function HeritageLocator({ sites }: HeritageLocatorProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [activeSiteId, setActiveSiteId] = useState("");
  const activeSite = useMemo(
    () => sites.find((site) => site.id === activeSiteId),
    [activeSiteId, sites],
  );

  useEffect(() => {
    let disposed = false;
    const markers = new Map<string, Marker>();
    markersRef.current = markers;

    async function setupMap() {
      if (!mapElementRef.current || sites.length === 0) return;
      const L = await import("leaflet");
      if (disposed || !mapElementRef.current) return;

      const first = sites[0].geographicLocation;
      const map = L.map(mapElementRef.current, {
        center: [first.latitude, first.longitude],
        zoom: 16,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const bounds = L.latLngBounds([]);
      sites.forEach((site, index) => {
        const { latitude, longitude } = site.geographicLocation;
        const marker = L.marker([latitude, longitude], {
          title: site.shortTitle ?? site.title,
          icon: createMarkerIcon(L, index + 1, false),
        });
        marker.bindTooltip(site.shortTitle ?? site.title, {
          permanent: true,
          direction: "top",
          offset: [0, -25],
          className: styles.markerLabel,
        });
        marker.on("click", () => setActiveSiteId(site.id));
        marker.addTo(map);
        markers.set(site.id, marker);
        bounds.extend([latitude, longitude]);
      });

      if (sites.length > 1) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
      mapRef.current = map;
    }

    void setupMap();
    return () => {
      disposed = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [sites]);

  useEffect(() => {
    if (!activeSite || !mapRef.current) return;
    void import("leaflet").then((L) => {
      markersRef.current.forEach((marker, siteId) => {
        const index = sites.findIndex((site) => site.id === siteId);
        marker.setIcon(createMarkerIcon(L, index + 1, siteId === activeSite.id));
      });
      const { latitude, longitude } = activeSite.geographicLocation;
      mapRef.current?.flyTo([latitude, longitude], 16, { duration: 0.42 });
    });
  }, [activeSite, sites]);

  return (
    <section className={styles.section} id="ban-do-nha-be" aria-labelledby="locator-title">
      <div className={styles.heading}>
        <h2 id="locator-title">Bản đồ di tích xã Nhà Bè</h2>
        <p className={styles.count}><strong>{sites.length}</strong> địa điểm đã có tọa độ</p>
      </div>
      <div className={styles.explorer}>
        <div ref={mapElementRef} className={styles.map} aria-label="Bản đồ vị trí các di tích tại Nhà Bè" />
        <aside className={styles.directory} aria-label="Danh sách di tích trên bản đồ">
          {activeSite ? (
            <div className={styles.activeSite} aria-live="polite">
              <p>Đang chọn</p>
              <h3>{activeSite.shortTitle ?? activeSite.title}</h3>
              <address>{activeSite.geographicLocation.address}</address>
              <div className={styles.actions}>
                <Link href={`/ban-do/${activeSite.slug}`}>Xem bản đồ di tích</Link>
                <a href={activeSite.geographicLocation.directionsUrl} target="_blank" rel="noreferrer">Chỉ đường</a>
              </div>
            </div>
          ) : (
            <div className={styles.activeSite} aria-live="polite">
              <p>Di tích các Đình trên địa bàn xã Nhà Bè</p>
            </div>
          )}
          <ol className={styles.siteList}>
            {sites.map((site, index) => (
              <li key={site.id}>
                <button type="button" className={styles.siteButton} aria-pressed={site.id === activeSite?.id} onClick={() => setActiveSiteId(site.id)}>
                  <span className={styles.siteIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{site.shortTitle ?? site.title}</strong><small>{site.geographicLocation.address}</small></span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function createMarkerIcon(L: typeof import("leaflet"), index: number, active: boolean) {
  return L.divIcon({
    className: styles.markerIcon,
    html: `<span class="${styles.markerSeal}" data-active="${active}"><span class="${styles.markerNumber}">${index}</span></span>`,
    iconSize: [44, 52],
    iconAnchor: [22, 48],
  });
}
