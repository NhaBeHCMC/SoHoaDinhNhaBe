"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./MainMenu.module.css";

const menuItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/#bo-ban-do", label: "Bộ bản đồ" },
  { href: "/ban-do/dinh-phu-xuan", label: "Đình Phú Xuân" }
];

export function MainMenu() {
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
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.toggle}
        aria-label={isOpen ? "Đóng menu chính" : "Mở menu chính"}
        aria-expanded={isOpen}
        aria-controls="main-menu-panel"
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
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
