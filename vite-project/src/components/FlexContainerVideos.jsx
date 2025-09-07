import React from "react";

/**
 * Responsive hero section that mirrors the layout in your screenshot:
 * - A large left-aligned heading
 * - A responsive grid of videos that flexes to fill space
 * - Works across phones, tablets, and laptops
 *
 * Tailwind-only, single-file component. Paste into your project and render <HeroVideos />.
 */

const sampleVideos = [
  { src: "/videos/video1.mp4", poster: "", title: "Community story — Hal" },
  { src: "/videos/video2.mp4", poster: "", title: "Community story — Hal" },
    { src: "/videos/video9.mp4", poster: "", title: "Community story — Pedro" },
  { src: "/videos/video3.mp4", poster: "", title: "Community story — Hal" },
//   { src: "video4.mp4", poster: "", title: "Community story — 4" },
//   { src: "video5.mp4", poster: "", title: "Community story — 5" },
//   { src: "video6.mp4", poster: "", title: "Community story — 6" },
//   { src: "video7.mp4", poster: "", title: "Community story — 7" },
//   { src: "video8.mp4", poster: "", title: "Community story — 8" },
//   { src: "video9.mp4", poster: "", title: "Community story — 9" },

];


function FlexContainerVideos({ src, poster, title, fit = "cover" }) {
  const ref = React.useRef(null);
  const [ratio, setRatio] = React.useState("16 / 9"); // fallback for first paint

  const onLoadedMeta = () => {
    const v = ref.current;
    if (!v) return;
    // Use the actual video dimensions
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
          className="absolute inset-0  w-full"
          style={{ objectFit: fit }}             // "cover" or "contain"
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

export default function HeroVideos({
  heading = "Sensate community stories",
  videos = sampleVideos,
}) {
  return (
    <section className="relative isolate w-full bg-[#E7EEF8]">
      {/* Decorative lines to echo the screenshot's vibe */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_10%_-10%,rgba(255,255,255,.6),transparent_60%),linear-gradient(120deg,transparent_0,transparent_40%,rgba(255,255,255,.45)_40%,transparent_41%),linear-gradient(-120deg,transparent_0,transparent_45%,rgba(255,255,255,.45)_45%,transparent_46%)]" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Heading */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl xl:text-5xl">
              {heading.split(" ").slice(0, 2).join(" ")}
            </h2>
            <h2 className="mt-1 text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl xl:text-5xl">
              {heading.split(" ").slice(2).join(" ")}
            </h2>
            <p className="mt-4 max-w-md text-neutral-600">
              /* Texto para introduzir */
            </p>
          </div>

          {/* Videos grid */}
          <div className="lg:col-span-8">
            <ul
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              aria-label="Community stories"
            >
              {videos.map((v, i) => (
                <FlexContainerVideos key={i} {...v} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
