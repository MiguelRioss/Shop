// src/components/PressCarousel.jsx
import React, { useState, useEffect, useMemo } from "react";
import Arrow from "./UtilsComponent/Arrows.jsx";

export default function PressCarousel({
  items = [], // [{ logo: "/forbes.jpg", quote: "..." }, ...]
  autoPlay = true,
  intervalMs = 4500,
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  const count = items?.length ?? 0;
  const wrap = (n) => (count ? (n + count) % count : 0);
  const prev = () => setI((v) => wrap(v - 1));
  const next = () => setI((v) => wrap(v + 1));

  // Responsive: 1 (sm), 2 (md-ish), 3 (lg+)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1044) setItemsPerView(2);
      else setItemsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Windowed items to render
  const windowItems = useMemo(() => {
    if (!count) return [];
    return Array.from({ length: itemsPerView }, (_, k) => {
      const idx = (i + k) % count;
      // Keep a stable key per underlying item index to avoid unnecessary remounts
      return { ...items[idx], _key: idx };
    });
  }, [i, count, items, itemsPerView]);

  // Autoplay with hover/touch pause
  useEffect(() => {
    if (!autoPlay || paused || !count) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, paused, count]);

  // Preload all logo images once to avoid repeated network fetches when slides rotate
  useEffect(() => {
    if (!items?.length) return;
    const urls = items.map((it) => it.logo).filter(Boolean);
    const imgs = urls.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = src;
      return img;
    });
    return () => {
      // help GC in some browsers
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [items]);

  if (!count) return null;

  return (
    <section className="bg-white">
      <div
        className="relative mx-auto max-w-6xl px-4 py-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <Arrow
          dir="prev"
          onClick={prev}
          variant="desktop"
          posClass="absolute left-2 md:-left-0.5 lg:-left-10 top-1/2 -translate-y-1/2 z-10"
        />

        <Arrow
          dir="next"
          onClick={next}
          variant="desktop"
          posClass="absolute right-2 md:-right-0.5 lg:-right-10 top-1/2 -translate-y-1/2 z-10"
        />

        {/* Mobile arrows: render once and visible only on mobile (sm:hidden) */}
        <Arrow
          dir="prev"
          onClick={prev}
          variant="mobile"
          posClass="absolute left-2 top-1/2 -translate-y-1/2 z-10"
        />

        <Arrow
          dir="next"
          onClick={next}
          variant="mobile"
          posClass="absolute right-2 top-1/2 -translate-y-1/2 z-10"
        />

        {/* Cards */}
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${itemsPerView}, 1fr)` }}
        >
          {windowItems.map((item) => (
            <article
              key={item._key}
              className="relative flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center"
            >
              <img
                src={item.logo}
                alt={item.alt || "logo"}
                className="mb-4 h-12 object-contain"
                loading="lazy"
                decoding="async"
                width={160}
                height={48}
                onError={(e) => {
                  // Fallback to a small inline SVG placeholder to avoid broken image icon
                  const svg = encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48">\n  <rect width="160" height="48" fill="%23E5E7EB"/>\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="Arial,Helvetica,sans-serif" font-size="12">Press</text>\n</svg>'
                  );
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `data:image/svg+xml;charset=utf-8,${svg}`;
                }}
              />
              <p className="italic text-gray-700">“{item.quote}”</p>
            </article>
          ))}
        </div>

    
      </div>
    </section>
  );
}
