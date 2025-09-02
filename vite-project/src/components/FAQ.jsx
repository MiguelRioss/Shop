import React, { useState } from "react";

const FAQS = [
  {
    q: "How does Sensate work?",
    a: "Sensate is placed on your chest where it emits infrasonic waves through bone conduction, gently stimulating the vagus nerve to help your nervous system relax.",
  },
  {
    q: "Can Sensate help with sleep issues?",
    a: "Yes, many users report falling asleep faster and enjoying deeper, more restorative sleep after using Sensate regularly.",
  },
  {
    q: "How long does it take to see results?",
    a: "Most people notice immediate relaxation after the first 10‑minute session, with long‑term benefits developing from daily use.",
  },
  {
    q: "What's your shipping policy?",
    a: "We ship worldwide. Delivery times vary by region, but you will receive tracking details once your order is dispatched.",
  },
  {
    q: "What's your return policy?",
    a: "You can try Sensate risk‑free for 90 days. If you are not satisfied, simply return it for a full refund.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[#fbfbf3]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl text-gray-900">FAQ</h2>

        <div className="mt-10 divide-y divide-gray-300">
          {FAQS.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-gray-900 hover:text-[#f5653b] focus:outline-none"
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