// src/components/PromoHeading.jsx

export default function PromoHeading({ heading, intro, wrapperClass }) {
  return (
    <section className={`mx-auto max-w-5xl px-4 ${wrapperClass || ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">
        {/* Text block */}
        <div className="mx-auto sm:mx-0 max-w-3xl text-center sm:text-left mb-6 sm:mb-0">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
            {heading}
          </h2>
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Image block: right on desktop/tablet, below on mobile */}
        <div className="mt-2 sm:mt-0 sm:flex-shrink-0">
          <img
            src="/bottles.png" /* hardcoded for now */
            alt="Promo visual"
            className="w-52 sm:w-64 md:w-80 h-auto object-contain mx-auto sm:mx-0 drop-shadow"
          />
        </div>
      </div>
    </section>
  );
}
