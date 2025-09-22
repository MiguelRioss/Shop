import React, { useState } from "react";




export default function FAQ(FAQS) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl text-gray-900">{FAQS.title}</h2>

        <div className="mt-10 divide-y divide-gray-300">
          {FAQS.items.map((faq, idx) => (
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
                <p className="pb-4 text-gray-700 leading-relaxed whitespace-pre-line">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}