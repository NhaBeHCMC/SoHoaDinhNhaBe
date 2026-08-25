"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./MainMenu.module.css";

export interface MainMenuItem {
  href: string;
  label: string;
}

interface MainMenuProps {
  homeItem: MainMenuItem;
  heritageItems: MainMenuItem[];
}

export function MainMenu({ homeItem, heritageItems }: MainMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.menu} ref={menuRef} data-open={isOpen}>
      <button
        type="button"
        className={styles.toggle}
        aria-label={isOpen ? "Đóng menu chính" : "Mở menu chính"}
        aria-expanded={isOpen}
        aria-controls="main-menu-panel"
        data-open={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="main-menu-panel"
        className={styles.panel}
        data-open={isOpen}
        hidden={!isOpen}
      >
        <Link className={styles.homeLink} href={homeItem.href} onClick={() => setIsOpen(false)}>{homeItem.label}</Link>
        <p className={styles.groupLabel}>Danh sách các Đình</p>
        <div className={styles.heritageList}>
          {heritageItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
