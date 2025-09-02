import React from "react";

/**
 * StoriesCarousel
 * Minimal dependency-free testimonial carousel matching the screenshot vibe.
 * - Top: title + CTA pill + subtitle + thin divider
 * - Center: large orange headline, body with bold spans, author line
 * - Left/right circular arrows
 * - Auto-play (can be disabled), pauses on hover, keyboard accessible
 */

const ITEMS = [
  {
    headline: "Better than I had even hoped for",
    body: (
      <>
        The experience of using Sensate has been better than I had even hoped for. <strong>Have not slept as well for very many years and feel relaxed during the day.</strong>
      </>
    ),
    author: "Jon E, London, UK.",
  },
  {
    headline: "Anxiety down, calm up",
    body: (
      <>
        I can finally unwind on demand. <strong>Ten minutes</strong> with Sensate resets my day and helps me focus without the jitters.
      </>
    ),
    author: "Sofia R, Madrid, ES.",
  },
  {
    headline: "My new nightly ritual",
    body: (
      <>
        It has become part of my bedtime routine. <strong>Sleep quality improved</strong> and I wake up refreshed.
      </>
    ),
    author: "Alex G, Toronto, CA.",
  },
];

export default function CarouselsHero({ autoPlay = true, intervalMs = 6000 }) {
  const [i, setI] = React.useState(0);
  const count = ITEMS.length;
  const wrap = (n) => (n + count) % count;

  const next = React.useCallback(() => setI((v) => wrap(v + 1)), [count]);
  const prev = React.useCallback(() => setI((v) => wrap(v - 1)), [count]);

  // autoplay with pause on hover
  const hoverRef = React.useRef(null);
  React.useEffect(() => {
    if (!autoPlay) return;
    let id;
    const start = () => (id = window.setInterval(next, intervalMs));
    const stop = () => id && window.clearInterval(id);
    start();
    const el = hoverRef.current;
    if (el) {
      el.addEventListener("mouseenter", stop);
      el.addEventListener("mouseleave", start);
    }
    return () => {
      stop();
      if (el) {
        el.removeEventListener("mouseenter", stop);
        el.removeEventListener("mouseleave", start);
      }
    };
  }, [autoPlay, intervalMs, next]);

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section className="bg-[#fbfbf3]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20" ref={hoverRef}>
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">Sensate Stories</h2>
          <a
            href="#get"
            className="mt-4 inline-flex items-center rounded-full border border-[#f5653b] px-6 py-2 text-[#f5653b] font-semibold hover:bg-[#f5653b] hover:text-white transition"
          >
            Get Sensate
          </a>
          <p className="mx-auto mt-5 max-w-3xl text-gray-700">
            Sensate cares about its community and strives to make a difference in the wellness space.
            Here’s what some of our members are saying:
          </p>
          <div className="mx-auto mt-6 h-px w-48 bg-black/10" />
        </div>

        {/* Slide */}
        <div className="relative mt-10">
          {/* arrows */}
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black/60 hover:bg-black/5"
          >
            ←
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black/60 hover:bg-black/5"
          >
            →
          </button>

          {/* content */}
          <div className="mx-auto max-w-4xl text-center px-12">
            <h3 className="font-serif text-3xl sm:text-5xl text-[#f5653b]">
              {ITEMS[i].headline}
            </h3>
            <p className="mt-6 text-gray-800 text-lg leading-relaxed">{ITEMS[i].body}</p>
            <p className="mt-5 text-gray-600 italic">{ITEMS[i].author}</p>
          </div>

          {/* dots */}
          <div className="mt-8 flex justify-center gap-2">
            {ITEMS.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === idx ? "bg-[#f5653b] w-6" : "bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
