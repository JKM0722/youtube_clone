import VideoGrid from "../components/VideoGrid";
import { fetchPopularVideos } from "../utils/youtube";

export default async function Home() {
  const videos = await fetchPopularVideos();
  return <VideoGrid videos={videos} />;
}
