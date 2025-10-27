import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const ICON_MUTE = "\u{1F507}";
const ICON_SOUND = "\u{1F50A}";
const ICON_HEART = "\u2764\uFE0F";
const ICON_ARROW_UP = "\u2191";
const ICON_ARROW_DOWN = "\u2193";

const YT_BASE_PARAMS =
  "autoplay=0&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&loop=1";

function buildEmbedUrl(id) {
  const origin =
    typeof window !== "undefined"
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";
  return `https://www.youtube.com/embed/${id}?${YT_BASE_PARAMS}&playlist=${id}${origin}`;
}

function formatCount(value) {
  if (!value) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  return value.toString();
}

function locationLabel(item) {
  if (item.location) return item.location;
  if (item.city && item.country) return `${item.city}, ${item.country}`;
  return item.city || item.country || "";
}

function postYouTubeCommand(iframe, command) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: command,
      args: [],
    }),
    "*",
  );
}

export default function MossBuzzVideoFeed({
  shorts = [],
  videos = [],
  title = "Featured Community Videos",
  subtitle = "Tap the video to move through the MOSBUZZ community stories.",
  showHeader = true,
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
  const iframeRefs = React.useRef([]);
  const videoRefs = React.useRef([]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [muted, setMuted] = React.useState(true);
  const [showHint, setShowHint] = React.useState(true);
  const [isDesktop, setIsDesktop] = React.useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 768,
  );
  const hintTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const markInteraction = React.useCallback(() => {
    if (showHint) setShowHint(false);
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
  }, [showHint]);

  const applyPlaybackState = React.useCallback(
    (index, forceMute) => {
      const shouldMute = typeof forceMute === "boolean" ? forceMute : muted;

      items.forEach((item, i) => {
        if (item.type === "youtube") {
          const iframe = iframeRefs.current[i];
          if (!iframe?.contentWindow) return;
          if (i === index) {
            postYouTubeCommand(iframe, shouldMute ? "mute" : "unMute");
            postYouTubeCommand(iframe, "playVideo");
          } else {
            postYouTubeCommand(iframe, "pauseVideo");
          }
        } else {
          const video = videoRefs.current[i];
          if (!video) return;
          if (i === index) {
            video.currentTime = 0;
            video.muted = shouldMute;
            const maybe = video.play();
            if (maybe?.catch) maybe.catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    },
    [items, muted],
  );

  const handleSlideChange = React.useCallback(
    (swiper) => {
      const idx = swiper?.activeIndex ?? 0;
      setActiveIndex(idx);
      markInteraction();
    },
    [markInteraction],
  );

  React.useEffect(() => {
    applyPlaybackState(activeIndex, muted);
  }, [activeIndex, muted, applyPlaybackState]);

  React.useEffect(() => {
    hintTimeoutRef.current = setTimeout(() => setShowHint(false), 5000);
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  const goToSlide = React.useCallback(
    (target) => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (target === "next") {
        if (swiper.activeIndex >= items.length - 1) {
          swiper.slideTo(0);
        } else {
          swiper.slideNext();
        }
      } else {
        if (swiper.activeIndex <= 0) {
          swiper.slideTo(items.length - 1);
        } else {
          swiper.slidePrev();
        }
      }
    },
    [items.length],
  );

  const enableTapNavigation =
    typeof window !== "undefined" ? window.innerWidth >= 768 : true;

  const handleTap = React.useCallback(
    (event) => {
      if (!isDesktop) return;

      markInteraction();
      const rect = event.currentTarget.getBoundingClientRect();
      const native = event.nativeEvent || {};
      const touch = native.changedTouches?.[0] || native.touches?.[0];
      const clientY =
        touch?.clientY ?? native.clientY ?? event.clientY ?? rect.top;
      const relativeY = clientY - rect.top;
      if (relativeY < rect.height / 2) {
        goToSlide("prev");
      } else {
        goToSlide("next");
      }
    },
    [goToSlide, isDesktop, markInteraction],
  );

  const toggleMute = React.useCallback(() => {
    markInteraction();
    const next = !muted;
    setMuted(next);

    const current = items[activeIndex];
    if (current?.type === "youtube") {
      const iframe = iframeRefs.current[activeIndex];
      postYouTubeCommand(iframe, next ? "mute" : "unMute");
      postYouTubeCommand(iframe, "playVideo");
    } else if (current?.type === "file") {
      const video = videoRefs.current[activeIndex];
      if (video) {
        video.muted = next;
        const maybe = video.play();
        if (maybe?.catch) maybe.catch(() => {});
      }
    }
  }, [activeIndex, items, markInteraction, muted]);

  const paddingClass = showHeader ? "py-12" : "py-6";

  return (
    <section className={`mx-auto w-full max-w-3xl px-4 ${paddingClass} sm:px-6`}>
      {showHeader && (
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--brand)]">
            Section 2
          </p>
          <h2 className="mt-2 text-2xl font-serif text-gray-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">{subtitle}</p>
        </header>
      )}

      <div className="relative">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={32}
          allowTouchMove={!isDesktop}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            handleSlideChange(swiper);
          }}
          className="h-[68vh] max-h-[760px] max-w-[220px] sm:max-w-[260px] mx-auto"
          threshold={10}
        >
          {items.map((item, index) => {
            const loc = locationLabel(item);
            const description = item.caption || item.description;
            const displayName = item.user || item.title || "MOSBUZZ Creator";

            return (
              <SwiperSlide key={item.key || index} className="flex items-center justify-center">
                <div
                  className={`relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-black ${
                    isDesktop ? "cursor-pointer" : ""
                  }`}
                  onClick={handleTap}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                  {item.tag && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-black/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                      {item.tag}
                    </span>
                  )}

                  {item.type === "youtube" ? (
                    <iframe
                      ref={(node) => {
                        iframeRefs.current[index] = node;
                      }}
                      src={buildEmbedUrl(item.youtubeId)}
                      title={item.title || "MOSBUZZ Short"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                      onLoad={() => {
                        const iframe = iframeRefs.current[index];
                        postYouTubeCommand(iframe, "mute");
                        if (index === activeIndex) {
                          postYouTubeCommand(iframe, muted ? "mute" : "unMute");
                          postYouTubeCommand(iframe, "playVideo");
                        }
                      }}
                    />
                  ) : (
                    <video
                      ref={(node) => {
                        videoRefs.current[index] = node;
                      }}
                      src={item.src}
                      poster={item.poster}
                      loop
                      muted={muted}
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                      <span>{displayName}</span>
                      {loc && <span>{loc}</span>}
                    </div>
                    {description && (
                      <p className="mt-2 text-xs text-white/90 sm:text-sm">{description}</p>
                    )}
                  </div>

                  <div className="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col items-center gap-3 text-white pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markInteraction();
                        goToSlide("prev");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-base text-white transition hover:bg-black/75 sm:h-10 sm:w-10 sm:text-lg"
                      aria-label="Previous video"
                    >
                      {ICON_ARROW_UP}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markInteraction();
                        goToSlide("next");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-base text-white transition hover:bg-black/75 sm:h-10 sm:w-10 sm:text-lg"
                      aria-label="Next video"
                    >
                      {ICON_ARROW_DOWN}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-base text-white transition hover:bg-black/75 sm:h-10 sm:w-10 sm:text-lg"
                      aria-label={muted ? "Unmute video" : "Mute video"}
                    >
                      <span>{muted ? ICON_MUTE : ICON_SOUND}</span>
                    </button>

                    {item.likes && (
                      <div className="flex flex-col items-center text-[11px] font-semibold">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-base text-white sm:h-10 sm:w-10 sm:text-lg">
                          {ICON_HEART}
                        </span>
                        <span className="mt-1 text-white/90">
                          {formatCount(item.likes)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                markInteraction();
                goToSlide("prev");
              }}
              className="hidden lg:flex absolute top-10 right-1/2 translate-x-1/2 items-center justify-center rounded-full bg-black/55 px-3 py-2 text-white transition hover:bg-black/75"
              aria-label="Previous video"
            >
              {ICON_ARROW_UP}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                markInteraction();
                goToSlide("next");
              }}
              className="hidden lg:flex absolute bottom-10 right-1/2 translate-x-1/2 items-center justify-center rounded-full bg-black/55 px-3 py-2 text-white transition hover:bg-black/75"
              aria-label="Next video"
            >
              {ICON_ARROW_DOWN}
            </button>
          </>
        )}

        {showHint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <div className="flex items-center gap-3 rounded-full bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-white animate-bounce">
              <span>{ICON_ARROW_UP}</span>
              <span>Tap</span>
              <span>{ICON_ARROW_DOWN}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
