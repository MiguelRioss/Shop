import React from "react";
import { useCart } from "../components/CartContext.jsx";

export default function ProductShowcase({
  products,           // array of products
  usageDefault,      // array of strings
  warningsDefault,   // array of strings
}) {
  const { addItem } = useCart();

  // sort by id (keeps the original behavior)
  const SORTED = React.useMemo(() => products.slice().sort((a, b) => a.id - b.id), [products]);
  const [plan, setPlan] = React.useState(SORTED[0]?.id);
  const current = SORTED.find((o) => o.id === plan);

  return (
    <section id="get" className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Image */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-[#e8f0f9]">
              {current?.note && (
      <span
        className="absolute left-3 top-3 rounded-full bg-[var(--brand)]/95 px-3 py-1 text-xs font-semibold text-white shadow"
        aria-label={current.note}
      >
        {current.note}
      </span>
    )}
                  <div className="aspect-[4/3] w-full">
                {current?.image ? (
                  <img
                    src={current.image}
                    alt={current.title}
                    className="mx-auto h-full w-full object-contain p-6"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buy panel + content */}
          <div className="order-2 lg:col-span-5">
            {/* Thumbs */}
            <div className="mb-6 flex flex-wrap gap-4">
              {SORTED.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setPlan(o.id)}
                  className={`relative w-28 h-28 rounded-xl border bg-white flex items-center justify-center shadow-sm transition hover:shadow ${
                    plan === o.id ? "border-[var(--brand)] ring-2 ring-[var(--brand)]" : "border-black/10"
                  }`}
                  aria-label={o.label}
                  title={o.title}
                >
                  {o.note && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      {o.note}
                    </span>
                  )}
                  {o.thumb ? (
                    <img
                      src={o.thumb}
                      alt={`${o.label} thumbnail`}
                      className="h-full w-full object-contain p-2"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-slate-200" />
                  )}
                </button>
              ))}
            </div>

            <h1 className="mb-1 font-serif text-3xl text-gray-900 flex items-center gap-2">
  {current?.title}
  {current?.note && (
    <span className="rounded-full bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]">
      {current.note}
    </span>
  )}
</h1>
            <p className="text-gray-700">{current?.description}</p>

            {/* Price + CTA */}
            <div className="mt-5 flex items-center gap-3 text-2xl font-semibold" style={{ color: "var(--brand)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-600" aria-hidden="true">
                <path d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                <circle cx="17" cy="20" r="1.5" fill="currentColor" />
              </svg>
              €{current?.price}
            </div>

            <div className="mt-3">
              <button
                onClick={() => current && addItem(current, 1)}
                className="w-full sm:w-auto rounded-full px-8 py-3 text-base font-semibold text-white shadow hover:opacity-90"
                style={{ background: "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
                disabled={!current}
              >
                Add to Cart
              </button>
            </div>

            {/* Structured sections */}
            <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
              <Details title="Collection Overview" defaultOpen>
                <p className="text-gray-700">{current?.overview}</p>
              </Details>

              <Details title="Why / Benefits">
                {current?.benefits?.length ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {current.benefits.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                ) : (
                  <p className="text-gray-500">—</p>
                )}
              </Details>

              <Details title="Chakra Connection">
                <p className="text-gray-700">{current?.chakra || "—"}</p>
              </Details>

              <Details title="Usage Guidelines">
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {usageDefault.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </Details>

              <Details title="Warnings">
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {warningsDefault.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </Details>
            </div>

            {/* Badges */}
            <div className="mt-5 grid gap-3 sm:max-w-md">
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background-column-3Balons)] px-4 py-3 text-sm" style={{ color: "var(--brand)" }}>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">★</span>
                Over 5k 5-Stars Reviews
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background-column-3Balons)] px-4 py-3 text-sm" style={{ color: "var(--brand)" }}>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">↺</span>
                Try it Free for 90 Days
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background-column-3Balons)] px-4 py-3 text-sm" style={{ color: "var(--brand)" }}>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">✓</span>
                Pay Installments
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Small accordion/details */
function Details({ title, children, defaultOpen = false }) {
  return (
    <details className="group p-4" open={defaultOpen} style={{ color: "var(--brand)" }}>
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="ml-4 transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed">{children}</div>
    </details>
  );
}
