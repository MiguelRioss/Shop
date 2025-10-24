// src/components/PromoHeading.jsx

const defaultImageClass = "w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl object-cover";

export default function PromoHeading({
  heading,
  intro,
  imageSrc,
  imageAlt,
  wrapperClass,
  imageClass,
}) {
  const resolvedImageClass = imageClass || defaultImageClass;
  return (
    <section
      className={`mx-auto max-w-7xl px-6 lg:px-12 mt-10 mb-10 sm:mb-16 ${wrapperClass || ""}`}
    >
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1.1fr_minmax(0,_0.9fr)] gap-10 lg:gap-14 items-center">
        {/* Text block */}
        <div className="w-full text-left space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
            {heading}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Image block */}
        {imageSrc && (
          <div className="w-full flex justify-center lg:justify-end">
            <img
              src={imageSrc}
              alt={imageAlt}
              className={resolvedImageClass}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>
    </section>
  );
}
 
