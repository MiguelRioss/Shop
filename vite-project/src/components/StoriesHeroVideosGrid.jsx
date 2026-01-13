import React from "react";

const YT_PARAMS =
  "autoplay=0&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1";
const YT_ORIGIN =
  typeof window !== "undefined"
    ? `&origin=${encodeURIComponent(window.location.origin)}`
    : "";

function extractYouTubeId(input = "") {
  const s = String(input || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const match = s.match(
    /(?:v=|youtu\.be\/|\/embed\/|shorts\/)([A-Za-z0-9_-]{11})/i,
  );
  return match ? match[1] : null;
}

function VideoCard({
  src,
  poster,
  title,
  fit = "cover",
  type,
  youtubeId,
  url,
  aspectRatio,
  itemAspectRatio,
}) {
  const ref = React.useRef(null);
  const resolvedAspectRatio = itemAspectRatio || aspectRatio || "16 / 9";
  const [ratio, setRatio] = React.useState(resolvedAspectRatio);
  const resolvedYouTubeId =
    youtubeId || extractYouTubeId(url) || extractYouTubeId(src);
  const isYouTube = Boolean(resolvedYouTubeId) || type === "youtube";

  React.useEffect(() => {
    setRatio(resolvedAspectRatio);
  }, [resolvedAspectRatio]);

  const onLoadedMeta = () => {
    if (itemAspectRatio || aspectRatio) return;
    const v = ref.current;
    if (!v) return;
    const w = v.videoWidth || 16;
    const h = v.videoHeight || 9;
    setRatio(`${w} / ${h}`);
  };

  return (
    <li className="group">
      <div
        className="relative overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.01]"
        style={{ aspectRatio: ratio }}
      >
        {isYouTube && resolvedYouTubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${resolvedYouTubeId}?${YT_PARAMS}${YT_ORIGIN}`}
            title={title || "Community video"}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={ref}
            className="absolute inset-0 w-full"
            style={{ objectFit: fit }}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={onLoadedMeta}
          />
        )}
      </div>
      {title && (
        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{title}</p>
      )}
    </li>
  );
}

export default function StoriesHeroVideosGrid({
  videos = [],
  fit = "cover",
  className = "",
  listClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
  aspectRatio,
}) {
  return (
    <div className={className}>
      <ul className={listClass} aria-label="Community stories">
        {videos.map((v, i) => (
          <VideoCard
            key={i}
            {...v}
            fit={fit}
            aspectRatio={aspectRatio}
            itemAspectRatio={v.aspectRatio}
          />
        ))}
      </ul>
    </div>
  );
}
