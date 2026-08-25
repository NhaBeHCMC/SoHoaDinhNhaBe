import Link from "next/link";
import styles from "./HeritageHero.module.css";

export function HeritageHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="home-title">Hệ thống bản đồ số hóa thông tin di tích các Đình trên địa bàn xã Nhà Bè</h1>
        </div>

        <div className={styles.summary}>
          <p className={styles.lede}>
            Khám phá các đình, không gian thờ tự và tư liệu lịch sử được số hóa trên
            địa bàn xã Nhà Bè.
          </p>
          <Link className={styles.cta} href="#ban-do-nha-be">
            Xem bản đồ <span aria-hidden="true">→</span>
          </Link>

          <p className={styles.collaboration}>
            Bản đồ số được thực hiện từ sự phối hợp giữa Khoa Công nghệ Thông tin,
            Trường Đại học Mở TP.HCM và Đoàn xã Nhà Bè.
          </p>
        </div>
      </div>
    </section>
  );
}
