import React from "react";
import Lucia from "/LUCIA.png";
import TA from "/DROPS.png"; 
import RB from "/RB.png";
import Clara from "/CLARA.png";
import Tania from "/TANIA.png";
import {useCart} from "../components/CartContext.jsx"
/**
 * Drop your files in /public/products/...
 * Update titles, bullets, descriptions, prices as needed.
 */
const OPTIONS = [
  {
    id: 0,
    label: "LUCIA",
    price: 39, // € — update
    title: "Ibogenics LUCIA (60 ml)",
    bullets: [
      "Botanical food supplement",
      "Vegan • Gluten-free • Natural",
      "Contains alcohol",
    ],
    description:
      "Bright, uplifting daytime profile. Great starter for gentle clarity and focus.",
    image: Lucia,
    thumb: Lucia
  },
  {
    id: 1,
    label: "TANIA",
    price: 39,
    title: "Ibogenics TANIA (60 ml)",
    bullets: [
      "Botanical food supplement",
      "Vegan • Gluten-free • Natural",
      "Contains alcohol",
    ],
    description:
      "Warm grounding blend designed for calm presence and emotional balance.",
    image: Tania,
    thumb: Tania,
  },
  {
    id: 2,
    label: "CLARA",
    price: 39,
    title: "Ibogenics CLARA (60 ml)",
    bullets: [
      "Botanical food supplement",
      "Vegan • Gluten-free • Natural",
      "Contains alcohol",
    ],
    description:
      "Clean, clarifying profile—ideal for study, creative work, or mindful routines.",
    image: Clara,
    thumb: Clara,
    featured: true,
  },
  {
    id: 3,
    label: "DROPS RB",
    price: 45,
    title: "Ibogenics DROPS RB (60 ml)",
    bullets: [
      "Botanical food supplement",
      "Refined Blend (RB)",
      "Vegan • Gluten-free • Natural",
    ],
    description:
      "Refined Blend for smooth, even effects—built for consistency day to day.",
    image: RB,
    thumb: RB,
    note: "Popular",
  },
  {
    id: 4,
    label: "DROPS TA",
    price: 45,
    title: "Ibogenics DROPS TA (60 ml)",
    bullets: [
      "Botanical food supplement",
      "Traditional Alkaloids (TA)",
      "Vegan • Gluten-free • Natural",
    ],
    description:
      "Traditional Alkaloids profile with a classic, robust character.",
    image: TA,
    thumb: TA,
  },
];


export default function ProductShowcase() {
  const { items, setQty, removeItem, subtotal, addItem } = useCart();

  const [plan, setPlan] = React.useState(OPTIONS.find(o => o.featured)?.id || OPTIONS[0].id);
  const current = OPTIONS.find((o) => o.id === plan);

  return (
    <section className="bg-[#fcfcf4]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Center image */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-[#e8f0f9]">
              <div className="aspect-[4/3] w-full">
                {current?.image ? (
                  <img
                    src={current.image}
                    alt={current.title}
                    className="mx-auto max-h-150 p-25 object-contain"  // 👈 adjust height here
                    loading="eager"
                  />

                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: buy panel */}
          <div className="order-2 lg:col-span-5">
            {/* Options */}
            <div className="mb-6 flex flex-wrap gap-4">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setPlan(o.id)}
                  className={`relative w-30 h-30 rounded-xl border bg-white flex items-center justify-center shadow-sm transition hover:shadow ${
                    plan === o.id
                      ? "border-orange-400 ring-2 ring-orange-200"
                      : "border-black/10"
                  }`}
                  aria-label={o.label}
                  title={o.title}
                >
                  {o.note && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#f5653b] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      {o.note}
                    </span>
                  )}
                  {o.thumb || o.image ? (
                    <img
                      src={o.thumb || o.image}
                      alt={`${o.label} thumbnail`}
                       className="h-full w-full object-contain p-2"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-slate-200" />
                  )}
                </button>
              ))}
            </div>

            <h1 className="mb-3 font-serif text-3xl text-gray-900">
              {current?.title}
            </h1>

            <div className="prose prose-sm text-gray-800">
              <h3 className="m-0 text-sm font-semibold tracking-tight text-gray-900">
                What's included:
              </h3>
              <ul className="mt-2 list-disc pl-5">
                {current?.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <h3 className="mt-5 text-sm font-semibold tracking-tight text-gray-900">
                Details
              </h3>
              <p className="mt-1">{current?.description}</p>
            </div>

            <div className="mt-6 flex items-center gap-3 text-2xl font-semibold text-[#f5653b]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
                aria-hidden="true"
              >
                <path
                  d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                <circle cx="17" cy="20" r="1.5" fill="currentColor" />
              </svg>
              €{current?.price}
            </div>

            <div className="mt-4">
              <button
                onClick={() => current && addItem(current, 1)}
                className="w-full sm:w-auto rounded-full bg-[#f5653b] px-8 py-3 text-base font-semibold text-white shadow hover:opacity-90"
                disabled={!current}
              >
                Add to Cart
              </button>

            </div>

            {/* Trust badges */}
            <div className="mt-5 grid gap-3 sm:max-w-md">
              <div className="flex items-center gap-3 rounded-xl bg-[#fde6de] px-4 py-3 text-sm text-[#b0482f]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">★</span>
                Over 5k 5-Stars Reviews
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
