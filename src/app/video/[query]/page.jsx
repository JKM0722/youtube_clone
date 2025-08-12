import VideoGrid from "../../../components/VideoGrid";
import { searchVideos } from "../../../utils/youtube";
import styles from "./SearchPage.module.css";

export default async function VideoSearchPage({ params }) {
  const query = decodeURIComponent(params.query);
  const results = await searchVideos(query);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        "{query}" 검색 결과 ({results.length})
      </h1>
      {results.length ? (
        <VideoGrid videos={results} />
      ) : (
        <p className={styles.empty}>결과가 없습니다.</p>
      )}
    </div>
  );
} 