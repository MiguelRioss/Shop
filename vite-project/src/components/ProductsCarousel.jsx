import React from "react";
import { useMemo, useRef, useState, useEffect } from "react";

function classNames(...s) { return s.filter(Boolean).join(" "); }

function Star({ fill = 0 }) {
  return (
    <svg aria-hidden className="w-4 h-4 inline" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {fill === 1 && (
        <path fill="currentColor" d="m12 17.27 6.18 3.73-1.64-7.03 5.46-4.73-7.19-.62L12 2 9.19 8.62l-7.19.62 5.46 4.73L5.82 21z"/>
      )}
      {fill === 0.5 && (
        <>
          <path fill="url(#half)" d="m12 17.27 6.18 3.73-1.64-7.03 5.46-4.73-7.19-.62L12 2 9.19 8.62l-7.19.62 5.46 4.73L5.82 21z"/>
          <path fill="none" stroke="currentColor" strokeWidth="1" d="m12 17.27 6.18 3.73-1.64-7.03 5.46-4.73-7.19-.62L12 2 9.19 8.62l-7.19.62 5.46 4.73L5.82 21z"/>
        </>
      )}
      {fill === 0 && (
        <path fill="none" stroke="currentColor" strokeWidth="1" d="m12 17.27 6.18 3.73-1.64-7.03 5.46-4.73-7.19-.62L12 2 9.19 8.62l-7.19.62 5.46 4.73L5.82 21z"/>
      )}
    </svg>
  );
}

function Stars({ rating = 0, count }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const diff = rating - i + 1;
    stars.push(<Star key={i} fill={diff >= 1 ? 1 : diff >= 0.5 ? 0.5 : 0} />);
  }
  return (
    <div className="flex items-center gap-1 text-black/80">
      <div className="flex gap-1">{stars}</div>
      {typeof count === "number" && (
        <span className="ml-1 text-xs text-black/60">({count})</span>
      )}
    </div>
  );
}

function formatEUR(n) {
  try { return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n); } catch { return `€${n}`; }
}



function ProductCard({ p, onBuy }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="snap-center shrink-0 w-[220px] sm:w-[240px]">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden flex flex-col items-center">
        <div className="relative w-full h-[280px] flex items-center justify-center overflow-hidden">
          <img src={p.image} alt={p.title} className="h-full object-contain" loading="lazy" />
          {p.badge && (
            <span className="absolute left-3 top-3 text-xs font-semibold bg-black text-white rounded-full px-2 py-1">
              {p.badge}
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="text-center text-2xl  ">{formatEUR(p.price)}</div>
          <div className="text-center text-base font-medium leading-snug">
            {p.title}
          </div>
          <div className="mx-auto mt-1">
            {typeof p.rating === "number" ? (
              <Stars rating={p.rating} count={p.ratingCount} />
            ) : (
              <span className="text-xs text-black/50">Não existem análises</span>
            )}
          </div>
          <button
            onClick={() => onBuy?.(p)}
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-black text-white h-10 px-4 font-semibold hover:translate-y-[1px] active:translate-y-[2px] transition-transform"
          >
            Buy Now
          </button>
          <button
            onClick={() => onBuy?.(p)}
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-black text-white h-10 px-4 font-semibold hover:translate-y-[1px] active:translate-y-[2px] transition-transform"
          >
            Learn More 
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCarousel({ products, onBuy }) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const pages = products?.length ?? 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const i = Math.round(el.scrollLeft / (el.firstElementChild?.clientWidth || 1));
      setIndex(Math.min(Math.max(i, 0), pages - 1));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [pages]);

  const scrollByCards = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.firstElementChild?.clientWidth || 220;
    el.scrollBy({ left: dir * (w + 16), behavior: "smooth" });
  };


  return (
  <div className="w-full flex flex-col items-center">
    <div className="w-full flex flex-col items-center mb-3">
      <h2 className="text-xl sm:text-2xl text-center">Produtos em destaque</h2>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => scrollByCards(-1)}
          className="h-10 w-10 rounded-full border border-slate-300 bg-white shadow-sm grid place-items-center hover:bg-slate-50"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={() => scrollByCards(1)}
          className="h-10 w-10 rounded-full border border-slate-300 bg-white shadow-sm grid place-items-center hover:bg-slate-50"
          aria-label="Seguinte"
        >
          ›
        </button>
      </div>
    </div>

    <div
      ref={containerRef}
      className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 justify-center px-4"
    >
      {products.map((p) => (
        <ProductCard key={p.id} p={p} onBuy={onBuy} />
      ))}
    </div>

    <div className="flex items-center justify-center gap-2 mt-2">
      {products.map((_, i) => (
        <button
          key={i}
          aria-label={`Ir para slide ${i + 1}`}
          onClick={() => {
            const el = containerRef.current;
            if (!el) return;
            const w = el.firstElementChild?.clientWidth || 220;
            el.scrollTo({ left: i * (w + 16), behavior: "smooth" });
          }}
          className={classNames(
            "h-2.5 rounded-full transition-all",
            index === i ? "w-5 bg-black" : "w-2.5 bg-black/30"
          )}
        />
      ))}
    </div>
  </div>
);

}