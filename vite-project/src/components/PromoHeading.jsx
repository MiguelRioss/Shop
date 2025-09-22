// src/components/PromoHeading.jsx

export default function PromoHeading({ heading, intro, imageSrc, imageAlt, wrapperClass, imageClass }) {
  return (
    <section className={`mx-auto max-w-7xl   mb-10 sm:mb-16 ${wrapperClass || ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">
        {/* Image block: on top on mobile, right on desktop/tablet */}
        <div className="order-1 sm:order-2 mt-2 m-5 sm:mt-0 sm:flex-shrink-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={"w-xl rounded-2xl"}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Text block */}
        <div className="order-2 sm:order-1 p-5 sm:mx-0  sm:text-left mt-4 sm:mt-0">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
            {heading}
          </h2>
          <p className="mt-4  text-gray-700 text-base text-left sm:text-lg leading-relaxed">
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
}
 
