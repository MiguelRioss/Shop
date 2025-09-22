import React from "react";

function VideoCard({ src, poster, title, fit = "cover" }) {
  const ref = React.useRef(null);
  const [ratio, setRatio] = React.useState("16 / 9");

  const onLoadedMeta = () => {
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
}) {
  return (
    <div className={className}>
      <ul className={listClass} aria-label="Community stories">
        {videos.map((v, i) => (
          <VideoCard key={i} {...v} fit={fit} />
        ))}
      </ul>
    </div>
  );
}
