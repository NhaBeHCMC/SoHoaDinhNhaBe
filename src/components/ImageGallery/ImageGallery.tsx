"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildMapMediaUrl } from "@/lib/image-url";
import type { MapImage, MapMediaConfig } from "@/types/map";
import styles from "./ImageGallery.module.css";

interface ImageGalleryProps {
  images: MapImage[];
  title: string;
  media: MapMediaConfig;
}

export function ImageGallery({ images, title, media }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const galleryLabel = useMemo(() => `${title} (${images.length} ảnh)`, [images.length, title]);

  const showPrevious = useCallback(function showPrevious() {
    setActiveIndex((index) => {
      if (index === null) {
        return index;
      }

      return (index - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(function showNext() {
    setActiveIndex((index) => {
      if (index === null) {
        return index;
      }

      return (index + 1) % images.length;
    });
  }, [images.length]);

  const closeLightbox = useCallback(function closeLightbox() {
    setActiveIndex(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
    }

    if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    function handleCancel(event: Event) {
      event.preventDefault();
      closeLightbox();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  });

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault();
        showNext();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length, showNext, showPrevious]);

  function openLightbox(index: number, opener: HTMLElement) {
    openerRef.current = opener;
    setActiveIndex(index);
  }

  function handleLightboxClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeLightbox();
    }
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDialogElement>) {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.screenX, y: touch.screenY };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDialogElement>) {
    if (images.length <= 1 || !touchStartRef.current) {
      return;
    }

    const touch = event.changedTouches[0];
    const diffX = touch.screenX - touchStartRef.current.x;
    const diffY = touch.screenY - touchStartRef.current.y;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0) {
        showPrevious();
      } else {
        showNext();
      }
    }
  }

  if (images.length === 0) {
    return <p className={styles.empty}>Chưa có hình ảnh cho mục này.</p>;
  }

  return (
    <>
      <div className={styles.grid} aria-label={galleryLabel}>
        {images.map((image, index) => (
          <button
            type="button"
            className={styles.thumb}
            data-testid="gallery-thumb"
            key={`${image.src}-${index}`}
            onClick={(event) => openLightbox(index, event.currentTarget)}
          >
            <FallbackImage
              src={image.thumbnailSrc ?? buildMapMediaUrl(image.src, media, "thumbs")}
              fallbackSrc={buildMapMediaUrl(image.src, media, "large")}
              alt={image.alt}
              width={320}
              height={220}
              loading="lazy"
            />
            <span>{image.caption ?? image.alt}</span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        data-testid="image-lightbox"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        onClick={handleLightboxClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeImage ? (
          <div className={styles.lightboxInner}>
            <div className={styles.lightboxTop}>
              <h2 id="lightbox-title">{activeImage.caption ?? activeImage.alt}</h2>
              <button type="button" className={styles.close} onClick={closeLightbox} aria-label="Đóng ảnh">
                ×
              </button>
            </div>

            <div className={styles.stage}>
              {images.length > 1 ? (
                <button type="button" className={styles.previous} onClick={showPrevious} aria-label="Ảnh trước">
                  ‹
                </button>
              ) : null}

              <FallbackImage
                src={activeImage.viewerSrc ?? buildMapMediaUrl(activeImage.src, media, "viewer")}
                fallbackSrc={buildMapMediaUrl(activeImage.src, media, "large")}
                alt={activeImage.alt}
                width={1200}
                height={900}
                priority
              />

              {images.length > 1 ? (
                <button type="button" className={styles.next} onClick={showNext} aria-label="Ảnh sau">
                  ›
                </button>
              ) : null}
            </div>

            <p className={styles.caption}>
              {activeIndex === null ? "" : `${activeIndex + 1} / ${images.length}`}
              {activeImage.caption ? ` · ${activeImage.caption}` : ""}
            </p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function FallbackImage({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  loading,
  priority = false
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  width: number;
  height: number;
  loading?: "eager" | "lazy";
  priority?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc = failedSrc === src ? fallbackSrc : src;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? undefined : loading}
      priority={priority}
      unoptimized
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setFailedSrc(src);
        }
      }}
    />
  );
}
