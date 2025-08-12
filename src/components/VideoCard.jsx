import Image from "next/image";
import styles from "./VideoCard.module.css";
import Link from "next/link";
import { formatViewCount, formatRelativeDate } from "../utils/format";

export default function VideoCard({ video }) {
  return (
    <Link href={`/watch/${video.id}`} className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
          className={styles.img}
        />
      </div>
      <h3 className={styles.title}>{video.title}</h3>
      {video.channelTitle && <p className={styles.channel}>{video.channelTitle}</p>}
      {video.viewCount && (
        <p className={styles.info}>
          {formatViewCount(video.viewCount)} · {formatRelativeDate(video.publishedAt)}
        </p>
      )}
    </Link>
  );
} 