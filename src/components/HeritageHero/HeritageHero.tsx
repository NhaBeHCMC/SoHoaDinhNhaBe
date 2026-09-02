import Image from "next/image";
import styles from "./HeritageHero.module.css";

export function HeritageHero() {
  return (
    <section className={styles.hero} aria-label="Công trình số hóa di tích đình tại xã Nhà Bè">
      <Image
        className={styles.banner}
        src="/cong-trinh-so-hoa-di-tich-dinh-nha-be.jpg"
        alt="Công trình số hóa di tích đình tại xã Nhà Bè"
        width={1280}
        height={426}
        sizes="100vw"
        loading="eager"
        unoptimized
      />
    </section>
  );
}
