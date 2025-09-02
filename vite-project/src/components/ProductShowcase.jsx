import React from "react";

/**
 * Responsive product showcase with dynamic text per option.
 * On desktop: show only product images (no placeholder text blocks inside cards).
 */

const OPTIONS = [
  {
    id: "basic",
    label: "Basic",
    price: 299,
    title: "Sensate Basic Pack",
    bullets: ["Sensate Device", "Lanyard for easy wearing"],
    description:
      "The essential Sensate experience: simple, effective, and affordable.",
  },
  {
    id: "plus",
    label: "1 Year Plus",
    price: 349,
    title: "1 Sensate Plus Pack",
    bullets: [
      "Sensate Device",
      "Lanyard for easy wearing",
      "1 Year Subscription to Sensate Plus",
      "Access to the Sensate app with free soundscapes",
    ],
    description:
      "Gain access to all soundscapes in our app and enjoy a fully immersive experience.",
    featured: true,
  },
  {
    id: "duo",
    label: "2nd at 50%",
    price: 523,
    title: "Duo Pack",
    bullets: [
      "2 Sensate Devices",
      "2 Lanyards",
      "1 Year Subscription to Sensate Plus for both",
    ],
    description:
      "Perfect for couples or friends — get a second Sensate at half price!",
    note: "2nd at 50%",
  },
];

export default function ProductShowcase() {
  const [plan, setPlan] = React.useState("plus");

  const current = OPTIONS.find((o) => o.id === plan);

  return (
    <section className="bg-[#fcfcf4]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Center image placeholder */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-[#e8f0f9] flex items-center justify-center">
              <div className="aspect-[4/3] w-full bg-gray-200 flex items-center justify-center text-gray-500">
                Image for {current?.label}
              </div>
            </div>
          </div>

          {/* Right: buy panel */}
          <div className="order-2 lg:col-span-5">
            {/* Options */}
            <div className="mb-6 flex gap-4">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setPlan(o.id)}
                  className={`relative w-24 h-24 rounded-xl border bg-white flex items-center justify-center shadow-sm transition hover:shadow ${
                    plan === o.id ? "border-orange-400 ring-2 ring-orange-200" : "border-black/10"
                  }`}
                >
                  {o.note && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#f5653b] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      {o.note}
                    </span>
                  )}
                  {/* Just image block on desktop */}
                  <div className="h-14 w-14 rounded-lg bg-slate-200" />
                </button>
              ))}
            </div>

            <h1 className="mb-3 font-serif text-3xl text-gray-900">{current?.title}</h1>

            <div className="prose prose-sm text-gray-800">
              <h3 className="m-0 text-sm font-semibold tracking-tight text-gray-900">What's included:</h3>
              <ul className="mt-2 list-disc pl-5">
                {current?.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <h3 className="mt-5 text-sm font-semibold tracking-tight text-gray-900">Details</h3>
              <p className="mt-1">{current?.description}</p>
            </div>

            <div className="mt-6 flex items-center gap-3 text-2xl font-semibold text-[#f5653b]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                <path d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1.5" fill="currentColor"/>
                <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
              </svg>
              €{current?.price}
            </div>

            <div className="mt-4">
              <button className="w-full sm:w-auto rounded-full bg-[#f5653b] px-8 py-3 text-base font-semibold text-white shadow hover:opacity-90">
                Add to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-5 grid gap-3 sm:max-w-md">
              <div className="flex items-center gap-3 rounded-xl bg-[#fde6de] px-4 py-3 text-sm text-[#b0482f]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">★</span>
                Over 5k 5‑Stars Reviews
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#fde6de] px-4 py-3 text-sm text-[#b0482f]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">↺</span>
                Try it Free for 90 Days
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#fde6de] px-4 py-3 text-sm text-[#b0482f]">
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
