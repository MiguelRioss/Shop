import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Arrow from "./UtilsComponent/Arrows.jsx";

const defaultShorts = [];
const defaultVideos = [];

const YT_ORIGIN =
  typeof window !== "undefined" ? `&origin=${encodeURIComponent(window.location.origin)}` : "";

function extractYouTubeId(input = "") {
  const s = String(input || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const match = s.match(
    /(?:v=|youtu\.be\/|\/embed\/|shorts\/)([A-Za-z0-9_-]{11})/i,
  );
  return match ? match[1] : null;
}

export default function MossBuzzVideoCarousel({
  videos = defaultVideos,
  shorts = defaultShorts,
}) {
  const items = React.useMemo(() => {
    const merged = [];
    if (Array.isArray(shorts) && shorts.length) {
      merged.push(
        ...shorts.map((short) => ({
          ...short,
          key: short.id || short.youtubeId,
          type: "youtube",
          youtubeId: short.youtubeId || extractYouTubeId(short.shareUrl),
          aspectRatio: short.aspectRatio || "9 / 16",
        })),
      );
    }
    if (Array.isArray(videos) && videos.length) {
      merged.push(
        ...videos.map((video) => {
          const url = video.shareUrl || video.url || video.src || "";
          const youtubeId = video.youtubeId || extractYouTubeId(url);
          const isYouTube = Boolean(youtubeId);
          return {
            ...video,
            key: video.id || video.youtubeId || video.src || video.poster || url,
            type: isYouTube ? "youtube" : "file",
            youtubeId,
            aspectRatio:
              video.aspectRatio || (isYouTube ? "16 / 9" : undefined),
          };
        }),
      );
    }
    return merged;
  }, [shorts, videos]);

  const swiperRef = React.useRef(null);

  if (items.length === 0) return null;

  const buildEmbed = (id) =>
    `https://www.youtube.com/embed/${id}?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1${YT_ORIGIN}`;

  const buildLocation = (item) => {
    if (item.location) return item.location;
    if (item.city && item.country) return `${item.city}, ${item.country}`;
    return item.city || item.country || "";
  };

  return (
    <div className="relative w-full px-2 py-10 sm:px-4">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        className="pb-10"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {items.map((item, index) => {
          const description = item.caption || item.description;
          const locationText = buildLocation(item);
          return (
            <SwiperSlide key={item.key || index} className="pt-2">
              <div className="overflow-hidden rounded-3xl bg-black mx-auto w-full max-w-[240px] sm:max-w-[270px]">
                <div
                  className="w-full"
                  style={{ aspectRatio: item.aspectRatio || "9 / 16" }}
                >
                  {item.type === "youtube" && item.youtubeId ? (
                    <iframe
                      src={buildEmbed(item.youtubeId)}
                      title={item.title || "MOSBUZZ Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.src}
                      poster={item.poster}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div
                  className="flex flex-col gap-1 px-5 py-4 text-sm text-white sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(16,24,39,0.85), rgba(16,24,39,0.65))",
                  }}
                >
                  <div className="font-semibold">
                    {item.user || item.title || "MOSBUZZ Creator"}
                    {locationText && (
                      <p className="text-xs font-normal text-white/80">
                        {locationText}
                      </p>
                    )}
                  </div>
                  {description && (
                    <p className="max-w-sm text-xs text-white/80 line-clamp-2 sm:text-right">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {items.length > 1 && (
        <>
          <Arrow
            dir="prev"
            variant="desktop"
            onClick={() => swiperRef.current?.slidePrev()}
            posClass="hidden sm:inline-flex absolute left-3 top-1/2 -translate-y-1/2 z-10"
          />
          <Arrow
            dir="next"
            variant="desktop"
            onClick={() => swiperRef.current?.slideNext()}
            posClass="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 z-10"
          />
          <Arrow
            dir="prev"
            variant="mobile"
            onClick={() => swiperRef.current?.slidePrev()}
            posClass="inline-flex sm:hidden absolute left-3 top-1/2 -translate-y-1/2 z-10"
          />
          <Arrow
            dir="next"
            variant="mobile"
            onClick={() => swiperRef.current?.slideNext()}
            posClass="inline-flex sm:hidden absolute right-3 top-1/2 -translate-y-1/2 z-10"
          />
        </>
      )}
    </div>
  );
}
