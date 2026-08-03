import Link from "next/link";
import Image from "next/image";
import { MainMenu } from "@/components/MainMenu/MainMenu";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  compact?: boolean;
}

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header className={styles.header} data-compact={compact}>
      <Link className={styles.brand} href="/" aria-label="Về trang chủ bản đồ số Đình Phú Xuân">
        <Image
          src="/logo.png"
          alt="Logo Công trình số hóa thông tin di tích kiến trúc nghệ thuật Đình Phú Xuân"
          width={600}
          height={149}
          priority
        />
      </Link>

      <nav className={styles.nav} aria-label="Điều hướng chính">
        <Link href="/">Trang chủ</Link>
        <Link href="/#ban-do-nha-be">Bản đồ Nhà Bè</Link>
        <Link href="/ban-do/dinh-phu-xuan">Đình Phú Xuân</Link>
      </nav>

      <MainMenu />
    </header>
  );
}
