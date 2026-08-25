import Link from "next/link";
import Image from "next/image";
import type { MapSummary } from "@/types/map";
import styles from "./MapCollection.module.css";

interface MapCollectionProps {
  maps: MapSummary[];
}

export function MapCollection({ maps }: MapCollectionProps) {
  return (
    <section className={styles.section} id="bo-ban-do" aria-labelledby="collection-title">
      <div className={styles.heading}>
        <h2 id="collection-title">Bộ bản đồ di tích</h2>
        <p>
          Nền tảng được tách dữ liệu, tọa độ, ảnh và giao diện để có thể thêm các
          bản đồ di tích tiếp theo mà không copy lại trình xem bản đồ.
        </p>
      </div>

      <div className={styles.grid}>
        {maps.map((map) => (
          <article className={styles.card} key={map.id}>
            <Image
              src={map.image}
              alt=""
              loading="lazy"
              width={1200}
              height={800}
              unoptimized
            />
            <div className={styles.cardBody}>
              <h3>{map.shortTitle ?? map.title}</h3>
              <p>{map.description}</p>
              <Link href={`/ban-do/${map.slug}`}>Mở bản đồ</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
