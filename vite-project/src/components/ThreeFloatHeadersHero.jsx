import React from "react";

/**
 * WhyChoose
 * Three "balloon" rows: large image on the left, rounded off‑white text card on the right.
 * Background is a soft blue, like the reference.
 */

const ITEMS = [
  {
    title: "Immediate Stress Relief",
    copy:
      "Find calm in just 10 minutes whenever you feel stressed.",
    bullets: [
      "Quick relaxation on demand",
      "Helps reduce symptoms of anxieties",
      "Easy to use anytime, anywhere",
    ],
    img: "/Images/car.JPG",
  },
  {
    title: "Better Focus, Fewer Worries",
    copy:
      "Gently tone your nervous system and improve day‑to‑day resilience.",
    bullets: [
      "Feel more balanced and present",
      "Lower baseline stress levels",
      "Create a simple daily habit",
    ],
    img: "/Images/girl.JPG",
  },
  {
    title: "Sleep better at night",
    copy:
      "Rest easy and wake refreshed, without pills or hangovers.",
    bullets: [
      "Calms racing thoughts before bed",
      "Promotes deeper, more restful sleep",
      "Wake up feeling energized",
    ],
    img: "/Images/Lisbon.JPG",
  },
];

export default function ThreeFloatHeadersHero() {
  return (
    <section className="bg-[#dee7f7]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">Why choose Sensate?</h2>
          <p className="mt-3 text-gray-700">The simplest way to deal with stress and anxieties.</p>
        </div>

        {/* Rows */}
        <div className="mt-12 space-y-10 sm:space-y-12">
          {ITEMS.map((item, i) => (
            <article key={i} className="grid gap-0 overflow-hidden rounded-3xl sm:rounded-[28px] lg:grid-cols-12">
              {/* Image left */}
              <div className="lg:col-span-6">
                <div className="h-72 sm:h-80 lg:h-96 overflow-hidden rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
                  <img src={item.img} alt="" className="h-full w-full object-cover" />
                </div>
              </div>

              {/* Balloon card right */}
              <div className="lg:col-span-6 bg-[#fbfbf3] p-6 sm:p-8 lg:p-10 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
                <h3 className="font-serif text-2xl text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-700">{item.copy}</p>

                <ul className="mt-6 space-y-4">
                  {item.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-800">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6a3d] text-white text-[11px] font-bold">•</span>
                      <span className="leading-relaxed">
                        {b.includes("more restful") || b.includes("feeling energized") ? (
                          <>
                            {b.split(/(more restful|feeling energized)/).map((part, i2) => (
                              <strong key={i2} className={part === "more restful" || part === "feeling energized" ? "font-semibold" : "font-normal"}>
                                {part}
                              </strong>
                            ))}
                          </>
                        ) : (
                          b
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
