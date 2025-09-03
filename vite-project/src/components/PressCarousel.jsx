import React, { useState, useEffect } from "react";

// Import images at the top
import forbesLogo from "/forbes.jpg";
import bbcLogo from "/bbc.png";
import rollingStoneLogo from "/rolling-stone.png";
import nationalGeoLogo from "/national-geographic.png";
import timeLogo from "/time.png";

// Use them in your PRESS array
const PRESS = [
  {
    logo: forbesLogo,
    quote:
      "Works on concerns, such as post-traumatic stress disorder, depression, anxiety, or grief.",
  },
  {
    logo: bbcLogo,
    quote:
      "My mind has shifted now from what I used to be. I can look back at my childhood and deal with those issues without sobbing and feeling sorry for myself.",
  },
  {
    logo: rollingStoneLogo,
    quote:
      "An experience that often causes users to take an unflinching and critical look at their lives.",
  },
  {
    logo: nationalGeoLogo,
    quote:
      "I saw this really transform people by taking someone in an intractable cycle and breaking them free. — D.C. Mash, Professor of Neurology",
  },
  {
    logo: timeLogo,
    quote:
      "It’s just going to go down there and basically pull up any traumas, anything hiding in your subconscious that may be affecting you that you don’t even realize.",
  },
];

export default function PressCarousel({ autoPlay = true, intervalMs = 4500 }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  const wrap = (n) => (n + PRESS.length) % PRESS.length;
  const prev = () => setI((v) => wrap(v - 1));
  const next = () => setI((v) => wrap(v + 1));

  // Responsive: show 1 on mobile, 2 on tablet, 3 on desktop
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1044) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Calculate items to show in the current window
  const windowItems = Array.from({ length: itemsPerView }, (_, k) => {
    const idx = (i + k) % PRESS.length;
    return { ...PRESS[idx], _key: idx };
  });

  // Autoplay with pause on hover/touch
  useEffect(() => {
    if (!autoPlay || paused) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, paused]);

  return (
    <section className="bg-white">
      <div
        className="relative mx-auto max-w-6xl px-4 py-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Arrows for tablet/desktop - adaptive position */}
        <button
          aria-label="Previous"
          onClick={prev}
          className="hidden sm:inline-flex absolute left-2 md:-left-0.5 lg:-left-10 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-[#d9480f] text-white shadow-md hover:bg-[#f5653b]"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="hidden sm:inline-flex absolute right-2 md:-right-0.5 lg:-right-10 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-[#d9480f] text-white shadow-md hover:bg-[#f5653b]"
        >
          ›
        </button>

        {/* Content */}
        <div className={`grid gap-8`} style={{ gridTemplateColumns: `repeat(${itemsPerView}, 1fr)` }}>
          {windowItems.map((item, idx) => (
            <article
              key={item._key}
              className="relative flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center"
            >
              <img src={item.logo} alt="logo" className="mb-4 h-12 object-contain" />
              <p className="italic text-gray-700">“{item.quote}”</p>

              {/* Arrows only for mobile */}
              {itemsPerView === 1 && idx === 0 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d9480f] text-white shadow-md hover:bg-[#f5653b] sm:hidden"
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Next"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d9480f] text-white shadow-md hover:bg-[#f5653b] sm:hidden"
                  >
                    ›
                  </button>
                </>
              )}
            </article>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {PRESS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-[#f5653b]" : "w-2.5 bg-black/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
