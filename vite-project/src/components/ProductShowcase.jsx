import React from "react";
import Lucia from "/LUCIA.png";
import TA from "/DROPS.png";
import RB from "/RB.png";
import Clara from "/CLARA.png";
import TaniaImg from "/TANIA.png";
import { useCart } from "../components/CartContext.jsx";

/** NOVO SCHEMA: cada produto pode ter
 * overview: string
 * benefits: string[]
 * formula: string[]
 * usage: string[]
 */
const OPTIONS = [
  {
    id: 0,
    label: "LUCIA",
    price: 39,
    title: "Ibogenics LUCIA (60 ml)",
    bullets: ["Botanical food supplement", "Vegan • Gluten-free • Natural", "Contains alcohol"],
    description: "Bright, uplifting daytime profile. Great starter for gentle clarity and focus.",
    image: Lucia,
    thumb: Lucia,
    overview:
      "Daytime support for clear focus and gentle mood lift.",
    benefits: ["Light clarity & focus", "Easy daytime pairing", "Gentle, beginner-friendly"],
    formula: ["Iboga profile", "Ethanol (food grade), distilled water"],
    usage: ["Shake well", "5–20 drops, 1–2x/dia", "Ciclos 5–7 dias ON / 2–3 OFF"],
  },
  {
    id: 1,
    label: "TANIA",
    price: 39,
    title: "Ibogenics TANIA (60 ml)",
    bullets: ["Botanical food supplement", "Vegan • Gluten-free • Natural", "Contains alcohol"],
    description:
      "Warm grounding blend designed for calm presence and emotional balance.",
    image: TaniaImg,
    thumb: TaniaImg,

    // === Conteúdo que enviaste, estruturado ===
    overview:
      "TANIA™ is formulated to support those navigating stress, fatigue, and burnout-like states. By pairing Iboga Total Alkaloid (TA) with Niacinamide (Vitamin B3), TANIA™ combines plant wisdom with vitamin science to provide steady, balanced energy support.",
    benefits: [
      "May support clarity and resilience during times of stress.",
      "Ajuda a manter o metabolismo energético normal (graças à Niacinamida)",
      "Pensado para profissionais, cuidadores e quem recupera de ciclos de burnout",
    ],
    formula: [
      "1 g Iboga TA (por frasco de 60 ml)",
      "500 mg Niacinamida (Vitamina B3)",
      "~55% etanol (food grade), água destilada",
    ],
    usage: [
      "Agitar bem antes de usar",
      "Definir uma intenção antes de cada toma",
      "Começar com 5 gotas/dia; aumentar gradualmente até 20 gotas 2x/dia (após pequeno-almoço & almoço)",
      "Seguir ciclo 5–7 dias ON / 2–3 dias OFF",
      "Pode ser usado em rondas sucessivas",
      "Descontinuar se sentir indisposição",
    ],
  },
  {
    id: 2,
    label: "CLARA",
    price: 39,
    title: "Ibogenics CLARA (60 ml)",
    bullets: ["Botanical food supplement", "Vegan • Gluten-free • Natural", "Contains alcohol"],
    description: "Clean, clarifying profile—ideal for study, creative work, or mindful routines.",
    image: Clara,
    thumb: Clara,
    featured: true,
    overview: "Claridade limpa para estudo, trabalho criativo e rituais mindful.",
    benefits: ["Foco estável", "Sensação clean", "Boa para rotina diária"],
    formula: ["Iboga profile", "Ethanol (food grade), água destilada"],
    usage: ["Agitar bem", "5–15 gotas 1–2x/dia", "Ciclos 5–7/2–3"],
  },
  {
    id: 3,
    label: "DROPS RB",
    price: 45,
    title: "Ibogenics DROPS RB (60 ml)",
    bullets: ["Botanical food supplement", "Refined Blend (RB)", "Vegan • Gluten-free • Natural"],
    description: "Refined Blend para efeitos suaves e consistentes — pensado para regularidade.",
    image: RB,
    thumb: RB,
    note: "Popular",
    overview: "Mistura refinada para consistência dia-a-dia.",
    benefits: ["Suavidade", "Perfil equilibrado", "Boa tolerabilidade"],
    formula: ["Refined blend", "Ethanol (food grade), água destilada"],
    usage: ["Agitar", "5–20 gotas 1–2x/dia", "Ciclos 5–7/2–3"],
  },
  {
    id: 4,
    label: "DROPS TA",
    price: 45,
    title: "Ibogenics DROPS TA (60 ml)",
    bullets: ["Botanical food supplement", "Traditional Alkaloids (TA)", "Vegan • Gluten-free • Natural"],
    description: "Traditional Alkaloids com caráter clássico e robusto.",
    image: TA,
    thumb: TA,
    overview: "Perfil tradicional com presença robusta.",
    benefits: ["Caráter clássico", "Sensação mais marcante"],
    formula: ["Traditional alkaloids", "Ethanol (food grade), água destilada"],
    usage: ["Agitar", "5–15 gotas 1–2x/dia", "Ciclos 5–7/2–3"],
  },
];

export default function ProductShowcase() {
  const { addItem } = useCart();
  const [plan, setPlan] = React.useState(OPTIONS.find(o => o.featured)?.id ?? OPTIONS[0].id);
  const current = OPTIONS.find(o => o.id === plan);

  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Imagem central */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-[#e8f0f9]">
              <div className="aspect-[4/3] w-full">
                {current?.image ? (
                  <img
                    src={current.image}
                    alt={current.title}
                    className="mx-auto h-full w-full object-contain p-6"
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

          {/* Painel de compra + conteúdo */}
          <div className="order-2 lg:col-span-5">
            {/* Thumbs */}
            <div className="mb-6 flex flex-wrap gap-4">
              {OPTIONS.map((o) => (
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
                    <img src={o.thumb} alt={`${o.label} thumbnail`} className="h-full w-full object-contain p-2" />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-slate-200" />
                  )}
                </button>
              ))}
            </div>

            <h1 className="mb-1 font-serif text-3xl text-gray-900">{current?.title}</h1>
            <p className="text-gray-700">{current?.description}</p>

            {/* Preço + CTA */}
            <div className="mt-5 flex items-center gap-3 text-2xl font-semibold"
            style={{ color: "var(--brand)" }}>
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
                className="w-full sm:w-auto rounded-full bg-[#f5653b] px-8 py-3 text-base font-semibold text-white shadow hover:opacity-90"
                 style={{
                  background:
                    "linear-gradient(to right, var(--brand-from), var(--brand-to))",
                }}
                disabled={!current}
              >
                Add to Cart
              </button>
            </div>

         

            {/* SEÇÕES ESTRUTURADAS */}
            <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
              <Details title="Overview" defaultOpen>
                <p className="text-gray-700">{current?.overview}</p>
              </Details>
              <Details title={`Why ${current?.label}?`}>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {current?.benefits?.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </Details>
              <Details title="Formula">
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {current?.formula?.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </Details>
              <Details title="Usage Guidelines">
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {current?.usage?.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </Details>
            </div>

            {/* Badges */}
            <div className="mt-5 grid gap-3 sm:max-w-md" >
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background-column-3Balons)] px-4 py-3 text-sm "
              style={{ color: "var(--brand)" }}>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">★</span>
                Over 5k 5-Stars Reviews
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background-column-3Balons)] px-4 py-3 text-sm"
              style={{ color: "var(--brand)" }}>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">↺</span>
                Try it Free for 90 Days
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background-column-3Balons)] px-4 py-3 text-sm "
              style={{ color: "var(--brand)" }}>
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

/** Pequeno componente para “accordion”/details */
function Details({ title, children, defaultOpen = false }) {
  return (
    <details className="group p-4" open={defaultOpen}
    style={{ color: "var(--brand)" }}>
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="ml-4 transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed">{children}</div>
    </details>
  );
}
