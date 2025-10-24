import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";

const defaultVideos = [];

function formatCount(value) {
  if (!value) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  return value.toString();
}

export default function MossBuzzVideoFeed({
  videos = defaultVideos,
  title = "Featured Community Videos",
  subtitle = "Real clips from the MOSBUZZ community. Swipe to explore.",
}) {
  if (!Array.isArray(videos) || videos.length === 0) return null;

  const videoRefs = React.useRef([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [muted, setMuted] = React.useState(true);

  const playVideoAt = React.useCallback(
    (index, muteSetting) => {
      const shouldMute =
        typeof muteSetting === "boolean" ? muteSetting : muted;

      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        video.pause();

        if (i === index) {
          video.currentTime = 0;
          video.muted = shouldMute;

          const startPlayback = () => {
            const maybePromise = video.play();
            if (maybePromise?.catch) {
              maybePromise.catch(() => {});
            }
          };

          if (video.readyState >= 2) {
            startPlayback();
          } else {
            const onCanPlay = () => {
              startPlayback();
              video.removeEventListener("canplay", onCanPlay);
            };
            video.addEventListener("canplay", onCanPlay);
          }
        } else {
          video.currentTime = 0;
        }
      });
    },
    [muted],
  );

  const handleSlideChange = React.useCallback((swiper) => {
    setActiveIndex(swiper?.activeIndex ?? 0);
  }, []);

  const toggleMute = React.useCallback(() => setMuted((prev) => !prev), []);

  const togglePlay = React.useCallback((index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      const maybePromise = video.play();
      if (maybePromise?.catch) {
        maybePromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, []);

  React.useEffect(() => {
    playVideoAt(activeIndex, muted);
  }, [activeIndex, muted, playVideoAt, videos]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [videos]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--brand)]">
          Section 2
        </p>
        <h2 className="mt-2 text-2xl font-serif text-gray-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{subtitle}</p>
      </header>

      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={32}
        mousewheel={{ releaseOnEdges: true }}
        keyboard={{ enabled: true }}
        modules={[Mousewheel, Keyboard]}
        onSlideChange={handleSlideChange}
        onInit={handleSlideChange}
        className="h-[68vh] max-h-[760px] max-w-xs sm:max-w-sm mx-auto"
        threshold={10}
      >
        {videos.map((video, index) => (
          <SwiperSlide
            key={video.id || index}
            className="flex justify-center items-center"
          >
            <div className="relative aspect-[9/16] w-full max-w-[210px] sm:max-w-[250px] overflow-hidden rounded-[28px] bg-black shadow-[0_24px_60px_-24px_rgba(15,23,42,0.6)] mx-auto">
              {video.tag && (
                <span className="absolute left-5 top-5 rounded-full bg-black/60 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                  {video.tag}
                </span>
              )}

              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                src={video.src}
                poster={video.poster}
                loop
                muted={muted}
                playsInline
                preload="metadata"
                onClick={() => togglePlay(index)}
                className="h-full w-full cursor-pointer object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 text-white">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{video.user}</span>
                  {video.location && (
                    <span className="text-xs uppercase tracking-wide text-white/80">
                      {video.location}
                    </span>
                  )}
                </div>
                {video.caption && (
                  <p className="mt-2 text-sm text-white/90">{video.caption}</p>
                )}
              </div>

              <div className="absolute bottom-32 right-4 flex flex-col items-center gap-5 text-white drop-shadow-lg">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 transition hover:bg-black/75"
                  aria-label={muted ? "Unmute video" : "Mute video"}
                >
                  <span className="text-xl">{muted ? "🔇" : "🔊"}</span>
                </button>

                {video.likes && (
                  <div className="flex flex-col items-center text-xs font-semibold">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-lg">
                      ❤️
                    </span>
                    <span className="mt-1 text-white/90">
                      {formatCount(video.likes)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
