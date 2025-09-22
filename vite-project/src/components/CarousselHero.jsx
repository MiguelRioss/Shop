// src/components/CarouselsHero.jsx
import React from "react";
import { Link } from "react-router-dom"; // <-- FIXED

export default function CarouselsHero({
  title,                 // string (e.g., "Meso Stories")
  cta,                   // { label: string, href: string }
  paragraphs = [],       // string[]
  items = [],            // [{ headline, body, author }]
  disclaimer,            // string
  autoPlay = true,
  intervalMs = 6000,
}) {
  const [i, setI] = React.useState(0);
  const count = items.length;
  const wrap = (n) => (count ? (n + count) % count : 0);

  const next = React.useCallback(() => setI((v) => wrap(v + 1)), [count]);
  const prev = React.useCallback(() => setI((v) => wrap(v - 1)), [count]);

  // autoplay with pause on hover
  const hoverRef = React.useRef(null);
  React.useEffect(() => {
    if (!autoPlay || !count) return;
    let id;
    const start = () => (id = window.setInterval(next, intervalMs));
    const stop = () => {
      if (id) window.clearInterval(id);
      id = undefined;
    };
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
  }, [autoPlay, intervalMs, next, count]);

  // keyboard arrows
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (!count) return null;
  const current = items[i];

  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20" ref={hoverRef}>
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
            {title}
          </h2>

          {cta?.label && cta?.href && (
            <a
              href={cta.href}
              className="mt-4 inline-flex items-center rounded-full border border-[var(--brand)] px-6 py-2 text-[var(--brand)] font-semibold transition hover:bg-[var(--brand)] hover:text-white"
            >
              {cta.label}
            </a>
          )}

          {paragraphs.map((p, idx) =>
            idx === 1 ? (
              <Link
                key={`para-${idx}`}             // <-- key on the outer element
                to="/stories"                   // <-- your requested link
                className="group block"
                aria-label="Read our stories"
              >
                <p className="mx-auto mt-5 max-w-3xl text-gray-700 underline-offset-4 group-hover:underline">
                  {p}
                </p>
              </Link>
            ) : (
              <p key={`para-${idx}`} className="mx-auto mt-5 max-w-3xl text-gray-700">
                {p}
              </p>
            )
          )}

          <div className="mx-auto mt-6 h-px w-48 bg-black/10" />
        </div>

        {/* Slide */}
        <div className="relative mt-10">
          {/* arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black/60 hover:bg-black/5"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black/60 hover:bg-black/5"
          >
            →
          </button>

          {/* content */}
          <div className="mx-auto max-w-4xl text-center px-12">
            <h3 className="font-serif text-3xl sm:text-5xl text-[var(--brand)]">
              {current.headline}
            </h3>
            <p className="mt-6 text-gray-800 text-lg leading-relaxed">
              {current.body}
            </p>
            <p className="mt-5 text-gray-600 italic">{current.author}</p>
          </div>

          {/* dots */}
          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, idx) => (
              <button
                type="button"
                key={`dot-${idx}`}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-[var(--brand)]" : "bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>

        {disclaimer && (
          <p className="mx-auto mt-5 max-w-3xl text-gray-700">{disclaimer}</p>
        )}
      </div>
    </section>
  );
}
  