import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.meta}>
        <span>2026</span>
        <span>Khoa Công nghệ Thông tin, Trường Đại học Mở TP.HCM</span>
      </div>
    </footer>
  );
}
