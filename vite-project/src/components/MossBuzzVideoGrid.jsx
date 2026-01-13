import React from "react";
import StoriesHeroVideosGrid from "./StoriesHeroVideosGrid.jsx";

function buildTitle(item) {
  if (item.title) return item.title;
  if (item.user && item.location) return `${item.user} - ${item.location}`;
  return item.user || item.caption || item.description || "";
}

function isYouTubeUrl(value = "") {
  return /youtu\.be|youtube\.com/i.test(value);
}

export default function MossBuzzVideoGrid({
  videos = [],
  shorts = [],
  className = "",
  listClass,
}) {
  const items = React.useMemo(() => {
    const merged = [];
    if (Array.isArray(shorts) && shorts.length) {
      merged.push(
        ...shorts.map((short) => ({
          ...short,
          key: short.id || short.youtubeId,
          type: "youtube",
          aspectRatio: short.aspectRatio || "9 / 16",
        })),
      );
    }
    if (Array.isArray(videos) && videos.length) {
      merged.push(
        ...videos.map((video) => {
          const url = video.shareUrl || video.url || video.src || "";
          const isYouTube = Boolean(video.youtubeId) || isYouTubeUrl(url);
          return {
            ...video,
            key: video.id || video.youtubeId || video.src || video.poster || url,
            type: isYouTube ? "youtube" : "file",
            aspectRatio:
              video.aspectRatio || (isYouTube ? "16 / 9" : undefined),
          };
        }),
      );
    }
    return merged;
  }, [shorts, videos]);

  if (items.length === 0) return null;

  const gridItems = items.map((item) => ({
    ...item,
    title: buildTitle(item),
    url: item.shareUrl || item.url || item.src,
  }));

  return (
    <StoriesHeroVideosGrid
      videos={gridItems}
      className={className}
      listClass={listClass}
      aspectRatio="16 / 9"
    />
  );
}
