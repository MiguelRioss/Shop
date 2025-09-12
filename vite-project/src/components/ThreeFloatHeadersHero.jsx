import React from "react";

export default function ThreeFloatHeadersHero({
  heading,
  subheading,
  items,
  disclaimer
}) {
  return (
    <section style={{ background: "var(--background-column-3Balons)" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
            {heading}
          </h2>
          <p className="mt-3 text-gray-700">{subheading}</p>
        </div>

        {/* Rows */}
        <div className="mt-12 space-y-10 sm:space-y-12">
          {items?.map((item, i) => (
            <article
              key={i}
              className="grid gap-0 overflow-hidden rounded-3xl sm:rounded-[28px] lg:grid-cols-12"
            >
              {/* Image left */}
              <div className="lg:col-span-6">
                <div className="h-72 sm:h-80 lg:h-96 overflow-hidden rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Balloon card right */}
              <div
                className="lg:col-span-6 p-6 sm:p-8 lg:p-10 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl"
                style={{ background: "var(--ballons-background)" }}
              >
                <h3 className="font-serif text-2xl text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-700">{item.copy}</p>

                <ul className="mt-6 space-y-4">
                  {item.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-800">
                      <span
                        className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-white text-[11px] font-bold"
                        style={{ background: "var(--brand)" }}
                      >
                        •
                      </span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        {disclaimer && (
          <div className="text-center max-w-3xl mx-auto">
            <p className="mt-3 text-gray-700">{disclaimer}</p>
          </div>
        )}
      </div>
    </section>
  );
}
