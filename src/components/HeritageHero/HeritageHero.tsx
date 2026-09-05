import Image from "next/image";
import styles from "./HeritageHero.module.css";

export function HeritageHero() {
  return (
    <section className={styles.hero} aria-label="Công trình số hóa di tích đình tại xã Nhà Bè">
      <Image
        className={styles.banner}
        src="/cong-trinh-so-hoa-di-tich-dinh-nha-be.png"
        alt="Công trình số hóa di tích đình tại xã Nhà Bè"
        width={2172}
        height={724}
        sizes="100vw"
        loading="eager"
      />
    </section>
  );
}
