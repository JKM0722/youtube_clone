import { fetchVideoDetails, fetchRelatedVideos, searchVideos } from "../../../utils/youtube";
import { formatViewCount, formatRelativeDate } from "../../../utils/format";
import styles from "./WatchPage.module.css";
import VideoListItem from "../../../components/VideoListItem";

export const metadata = {
  title: "Video",
};

export default async function WatchPage({ params }) {
  // Await params destructure (Next 15 warning)
  const { id } = await Promise.resolve(params);
  const video = await fetchVideoDetails(id);

  let related = await fetchRelatedVideos(id);
  if (!related.length && video?.title) {
    related = await searchVideos(video.title, 15);
  }

  if (!video) {
    return <div className={styles.wrapper}>비디오를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.main}`}>
        <div className={styles.playerContainer}>
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={video.title}
            allowFullScreen
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className={styles.player}
          />
        </div>
        <h1 className={styles.title}>{video.title}</h1>
        <p className={styles.meta}>
          {formatViewCount(video.viewCount)} · {formatRelativeDate(video.publishedAt)}
        </p>
        <p className={styles.channel}>{video.channelTitle}</p>
        <pre className={styles.description}>{video.description}</pre>
      </div>

      <aside className={styles.sidebar}>
        {related.length ? (
          related.map((v) => <VideoListItem key={v.id} video={v} />)
        ) : (
          <p>관련 영상이 없습니다.</p>
        )}
      </aside>
    </div>
  );
} 