import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Arrow from "./UtilsComponent/Arrows.jsx";

const defaultShorts = [];
const defaultVideos = [];

const YT_ORIGIN =
  typeof window !== "undefined" ? `&origin=${encodeURIComponent(window.location.origin)}` : "";

export default function MossBuzzVideoCarousel({
  videos = defaultVideos,
  shorts = defaultShorts,
}) {
  const items = React.useMemo(() => {
    if (Array.isArray(shorts) && shorts.length) {
      return shorts.map((short) => ({
        ...short,
        key: short.id || short.youtubeId,
        type: "youtube",
      }));
    }
    if (Array.isArray(videos) && videos.length) {
      return videos.map((video) => ({
        ...video,
        key: video.id || video.src || video.poster,
        type: "file",
      }));
    }
    return [];
  }, [shorts, videos]);

  if (items.length === 0) return null;

  const swiperRef = React.useRef(null);

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
        slidesPerView={1.05}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          960: { slidesPerView: 1.4 },
          1280: { slidesPerView: 1.6 },
        }}
        centeredSlides
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
              <div className="overflow-hidden rounded-3xl bg-black">
                {item.type === "youtube" ? (
                  <iframe
                    src={buildEmbed(item.youtubeId)}
                    title={item.title || "MOSBUZZ Short"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-[420px] w-full object-cover sm:h-[480px]"
                  />
                ) : (
                  <video
                    src={item.src}
                    poster={item.poster}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-[420px] w-full object-cover sm:h-[480px]"
                  />
                )}
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
