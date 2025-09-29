// src/components/CarouselsHero.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // <-- FIXED
import { goToProducts } from "./ProductsCarrousell/utils/ScrollToCarroussel";
import Arrow from "./UtilsComponent/Arrows.jsx";

export default function TestimonialsCarousselHero({
  title, // string (e.g., "Meso Stories")
  cta, // { label: string, href: string }
  paragraphs = [], // string[]
  items = [], // [{ headline, body, author }]
  disclaimer, // string
  autoPlay = true,
  intervalMs = 6000,
}) {
  const navigate = useNavigate();
  const location = useLocation();
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

          {cta?.label && (
            <button
              type="button"
              onClick={() => goToProducts(navigate, location)}
              className="mt-4 inline-flex items-center rounded-full border border-[var(--brand)] px-6 py-2 text-[var(--brand)] font-semibold transition hover:bg-[var(--brand)] hover:text-white"
            >
              {cta.label}
            </button>
          )}
          {paragraphs.map((p, idx) =>
            idx === 1 ? (
              <a
                key={`para-${idx}`}
                href="https://www.facebook.com/groups/1297206078804311/?ref=share&mibextid=wwXIfr&rdid=chIosIYShHXfOp7g&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F19xVkCF85s%2F%3Fmibextid%3DwwXIfr#"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center rounded-full px-6 py-2 mt-5 text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "var(--brand-gradient)" }}
                aria-label="Join Meso Movement on Facebook"
              >
                {p}
              </a>
            ) : (
              <p
                key={`para-${idx}`}
                className="mx-auto mt-5 max-w-3xl text-gray-700"
              >
                {p}
              </p>
            )
          )}

          <div className="mx-auto mt-6 h-px w-48 bg-black/10" />
        </div>

        {/* Slide */}
        <div className="relative mt-10">
          {/* arrows: replaced with shared Arrow component (classes preserved) */}
          <Arrow
            dir="prev"
            onClick={prev}
            variant="desktop"
            posClass="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          />
          <Arrow
            dir="next"
            onClick={next}
            variant="desktop"
            posClass="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          />

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




