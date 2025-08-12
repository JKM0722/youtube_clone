const API_KEY = process.env.YT_API_KEY || process.env.NEXT_PUBLIC_YT_API_KEY;

if (!API_KEY) {
  console.warn("[YouTube API] 환경 변수 YT_API_KEY 가 설정되지 않았습니다. 더미 데이터가 사용됩니다.");
}

/**
 * 인기 동영상 목록을 가져옵니다.
 * @param {number} [maxResults=25]
 * @param {string} [region="KR"]- ISO 3166-1 alpha-2 국가 코드
 * @returns {Promise<Array<{id:string,title:string,thumbnail:string}>>}
 */
export async function fetchPopularVideos(maxResults = 25, region = "KR") {
  if (!API_KEY) return [];
  const params = new URLSearchParams({
    part: "snippet,statistics",
    chart: "mostPopular",
    maxResults: String(maxResults),
    regionCode: region,
    key: API_KEY,
  });
  const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return (data.items || []).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      viewCount: item.statistics?.viewCount,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (err) {
    console.error("[YouTube API] 인기 동영상 조회 실패:", err);
    return [];
  }
}

/**
 * 검색 결과를 가져옵니다.
 * @param {string} query
 * @param {number} [maxResults=25]
 * @returns {Promise<Array<{id:string,title:string,thumbnail:string}>>}
 */
export async function searchVideos(query, maxResults = 25) {
  if (!API_KEY) return [];
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: String(maxResults),
    q: query,
    key: API_KEY,
  });
  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const items = data.items || [];

    // 통계 정보 가져오기 (viewCount)
    const ids = items.map((it) => it.id.videoId || it.id).join(",");
    let statsMap = {};
    if (ids) {
      try {
        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`
        );
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          statsMap = (statsData.items || []).reduce((acc, cur) => {
            acc[cur.id] = cur.statistics?.viewCount;
            return acc;
          }, {});
        }
      } catch (err) {
        console.warn("[YouTube API] 통계 조회 실패:", err);
      }
    }

    return items.map((item) => {
      const vid = item.id.videoId || item.id;
      return {
        id: vid,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: statsMap[vid],
      };
    });
  } catch (err) {
    console.error("[YouTube API] 검색 실패:", err);
    return [];
  }
}

/**
 * 비디오 ID로 상세 정보를 가져옵니다
 * @param {string} id
 * @returns {Promise<{id:string,title:string,description:string,channelTitle:string,thumbnail:string,viewCount:string,publishedAt:string}>}
 */
export async function fetchVideoDetails(id) {
  if (!API_KEY) return null;
  const params = new URLSearchParams({
    part: "snippet,statistics",
    id,
    key: API_KEY,
  });
  const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const item = (data.items || [])[0];
    if (!item) return null;
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      viewCount: item.statistics?.viewCount,
      publishedAt: item.snippet.publishedAt,
    };
  } catch (err) {
    console.error("[YouTube API] 비디오 상세 조회 실패:", err);
    return null;
  }
}

/**
 * 관련 동영상을 가져옵니다
 * @param {string} videoId
 * @param {number} [maxResults=15]
 * @returns {Promise<Array<{id:string,title:string,thumbnail:string,channelTitle:string,viewCount?:string,publishedAt:string}>>}
 */
export async function fetchRelatedVideos(videoId, maxResults = 15) {
  if (!API_KEY) return [];
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    relatedToVideoId: videoId,
    maxResults: String(maxResults),
    key: API_KEY,
  });
  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.warn("[YouTube API] 관련 동영상 요청 실패:", res.status);
      return [];
    }
    const data = await res.json();
    const items = data.items || [];

    // 통계 정보
    const ids = items.map((it) => it.id.videoId || it.id).join(",");
    let statsMap = {};
    if (ids) {
      try {
        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`
        );
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          statsMap = (statsData.items || []).reduce((acc, cur) => {
            acc[cur.id] = cur.statistics?.viewCount;
            return acc;
          }, {});
        }
      } catch (err) {
        console.warn("[YouTube API] 관련 영상 통계 조회 실패:", err);
      }
    }

    return items.map((item) => {
      const vid = item.id.videoId || item.id;
      return {
        id: vid,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: statsMap[vid],
      };
    });
  } catch (err) {
    console.error("[YouTube API] 관련 동영상 조회 실패:", err);
    return [];
  }
} 