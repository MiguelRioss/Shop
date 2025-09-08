import React, { useState } from "react";

const FAQS = [
  {
    q: "How does Meso work?",
    a: "Meso are plant-based drops used as a moderate daily ritual—more noticeable than a very light dose, yet still functional for everyday life. Think of it as the “sweet spot” between subtle and strong: a few drops, slow breaths, and ~10 minutes of unwind. Many people follow a simple rhythm (for example, 5–7 days on, 2–3 days off) to build consistency.",
  },
  {
    q: "Can Meso help with sleep issues?",
    a: "Some customers prefer to take Meso after lunch, as they’ve reported it can interfere with sleep. Others, on the contrary, have experienced more vivid dreams. Everyone is different, so pair your drops with healthy sleep habits (dim lights, no screens, gentle music) and see what works best for you.",
  },
  {
    q: "How long does it take to see results?",
    a: "Some people notice a shift within about 10–30 minutes of a dose; others feel benefits accumulate over a week or two with steady use. Treat it like a small daily practice; results and timing vary from person to person.",
  },
  {
    q: "What’s the difference between microdosing and mesodosing?",
    a: "Microdosing is often described as “just-below-perception.” Mesodosing is a touch more noticeable while remaining manageable for daily life, aimed at helping you stay present, notice patterns, and build new habits in real time.",
  },
  {
    q: "What’s your shipping policy?",
    a: "We ship orders on business days and provide tracking once your parcel is on the way. Delivery times and fees depend on destination and carrier. Any customs duties or import taxes are the customer’s responsibility.",
  },
  {
    q: "What countries do you ship to?",
    a: "We ship to the following countries: Australia, Brazil, Canada, Costa Rica, Denmark, Finland, Gabon, Germany, Greece, Hungary, Mexico, Netherlands, New Zealand, Portugal, South Africa, Uruguay.",
  },
  {
    q: "What’s your return policy?",
    a: "If your order arrives damaged or incorrect, contact us within 14 days with your order number and photos so we can help. Unopened items may be eligible for return subject to inspection.",
  },
];


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl text-gray-900">FAQ</h2>

        <div className="mt-10 divide-y divide-gray-300">
          {FAQS.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-gray-900 hover:text-[var(--brand)] focus:outline-none"
                aria-expanded={openIndex === idx}
              >
                {faq.q}
                <span className="ml-4 text-2xl leading-none">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="pb-4 text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}