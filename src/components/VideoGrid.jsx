import VideoCard from "./VideoCard";
import styles from "./VideoGrid.module.css";

export default function VideoGrid({ videos }) {
  return (
    <div className={styles.grid}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
} 