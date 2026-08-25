import Link from "next/link";
import Image from "next/image";
import { MainMenu } from "@/components/MainMenu/MainMenu";
import { maps } from "@/data/maps";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  compact?: boolean;
}

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const homeItem = { href: "/", label: "Trang chủ" };
  const heritageItems = maps.map((map) => ({
    href: `/ban-do/${map.slug}`,
    label: map.shortTitle ?? map.title
  }));

  return (
    <header className={styles.header} data-compact={compact}>
      <Link className={styles.brand} href="/" aria-label="Về trang chủ Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè">
        <Image
          src="/logo.png"
          alt="Logo hệ thống số hóa thông tin di tích xã Nhà Bè"
          width={600}
          height={149}
          priority
        />
      </Link>

      <nav className={styles.nav} aria-label="Điều hướng chính">
        <Link href={homeItem.href}>{homeItem.label}</Link>
        <div className={styles.dropdown}>
          <button type="button" aria-haspopup="menu">Danh sách các Đình</button>
          <div className={styles.dropdownPanel}>
            {heritageItems.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
        </div>
      </nav>

      <MainMenu homeItem={homeItem} heritageItems={heritageItems} />
    </header>
  );
}
