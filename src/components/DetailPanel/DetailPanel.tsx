"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MapLocation, MapMediaConfig } from "@/types/map";
import { ImageGallery } from "@/components/ImageGallery/ImageGallery";
import styles from "./DetailPanel.module.css";

interface DetailPanelProps {
  location: MapLocation | null;
  media: MapMediaConfig;
  open: boolean;
  onClose: () => void;
}

type DetailTab = "info" | "images";

export function DetailPanel({ location, media, open, onClose }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("info");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    }
  }, [open, location?.id]);

  const handleClose = useCallback(() => {
    setActiveTab("info");
    onClose();
  }, [onClose]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open && !document.querySelector("dialog[open]")) {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, open]);

  if (!location) {
    return null;
  }

  const hasImages = location.images.length > 0;

  return (
    <aside
      className={styles.panel}
      data-open={open}
      data-testid="detail-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="detail-panel-title"
    >
      <div className={styles.header}>
        <div>
          <p>Hiện vật và không gian thờ tự</p>
          <h2 id="detail-panel-title">{location.title}</h2>
        </div>
        <button
          type="button"
          ref={closeButtonRef}
          className={styles.close}
          onClick={handleClose}
          aria-label="Đóng thông tin hiện vật"
        >
          ×
        </button>
      </div>

      <div className={styles.tabs} role="tablist" aria-label={`Nội dung ${location.title}`}>
        <button
          type="button"
          role="tab"
          id="location-tab-info"
          aria-selected={activeTab === "info"}
          aria-controls="location-panel-info"
          className={styles.tab}
          onClick={() => setActiveTab("info")}
        >
          Thông tin
        </button>
        <button
          type="button"
          role="tab"
          id="location-tab-images"
          aria-selected={activeTab === "images"}
          aria-controls="location-panel-images"
          className={styles.tab}
          disabled={!hasImages}
          onClick={() => setActiveTab("images")}
        >
          Hình ảnh
        </button>
      </div>

      <div className={styles.body}>
        <section
          id="location-panel-info"
          role="tabpanel"
          aria-labelledby="location-tab-info"
          hidden={activeTab !== "info"}
          className={styles.info}
        >
          <dl className={styles.facts}>
            <Fact label="Tên hiện vật" value={location.title} />
            <Fact label="Niên đại" value={location.period} />
            <Fact label="Chất liệu" value={location.material?.join(", ")} />
            <Fact label="Kích thước" value={location.dimensions} />
            <Fact label="Vị trí" value={location.physicalLocation} />
          </dl>

          <TextBlock title="Miêu tả" value={location.description} />
          <TextBlock title="Giá trị hiện vật" value={location.historicalValue} />
          <ListBlock title="Chữ Hán" items={location.chineseText} han />
          <ListBlock title="Phiên âm" items={location.transliteration} />
          <ListBlock title="Phiên nghĩa" items={location.translation} />
          <ListBlock title="Ghi chú" items={location.notes} />
        </section>

        <section
          id="location-panel-images"
          role="tabpanel"
          aria-labelledby="location-tab-images"
          hidden={activeTab !== "images"}
        >
          <ImageGallery images={location.images} title={location.title} media={media} />
        </section>
      </div>
    </aside>
  );
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <section className={styles.block}>
      <h3>{title}</h3>
      {value.split(/\n+/).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}

function ListBlock({
  title,
  items,
  han = false
}: {
  title: string;
  items?: string[];
  han?: boolean;
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className={styles.block}>
      <h3>{title}</h3>
      <ul className={han ? styles.han : undefined}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
