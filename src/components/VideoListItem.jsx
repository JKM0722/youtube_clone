import Image from "next/image";
import Link from "next/link";
import styles from "./VideoListItem.module.css";
import { formatViewCount, formatRelativeDate } from "../utils/format";

export default function VideoListItem({ video }) {
  return (
    <Link href={`/watch/${video.id}`} className={styles.item}>
      <div className={styles.thumbWrap}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="168px"
          className={styles.thumbImg}
        />
      </div>
      <div>
        <p className={styles.title}>{video.title}</p>
        <p className={styles.channel}>{video.channelTitle}</p>
        {video.viewCount && (
          <p className={styles.meta}>
            {formatViewCount(video.viewCount)} · {formatRelativeDate(video.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
} 