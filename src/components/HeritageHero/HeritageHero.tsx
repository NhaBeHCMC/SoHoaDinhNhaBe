import Image from "next/image";
import Link from "next/link";
import { buildLargeUrl } from "@/lib/image-url";
import styles from "./HeritageHero.module.css";

export function HeritageHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Image
        className={styles.backgroundImage}
        src={buildLargeUrl("AnhDinh/dinh (1).JPG")}
        alt="Toàn cảnh Đình Phú Xuân giữa khu dân cư và dòng sông Nhà Bè"
        fill
        sizes="100vw"
        priority
        unoptimized
      />
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="home-title">Di sản xã Nhà Bè</h1>
          <p className={styles.lede}>
            Giữa nhịp sống ven sông, những mái đình và không gian thờ tự vẫn lưu giữ
            ký ức, tín ngưỡng cùng nét đẹp lịch sử của cộng đồng qua nhiều thế hệ.
          </p>
          <Link className={styles.cta} href="#ban-do-nha-be">
            Khám phá bản đồ số
          </Link>
        </div>

        <p className={styles.collaboration}>
          <span>Đồng hành số hóa</span>
          Bản đồ số được thực hiện từ sự phối hợp giữa Khoa Công nghệ Thông tin,
          Trường Đại học Mở TP.HCM và Đoàn xã Nhà Bè.
        </p>
      </div>
    </section>
  );
}
