export default function PromoBanner({
  heading,          // string
  intro,            // string (paragraph above the banner)
  bgGradient,       // CSS string (fallback linear-gradient)
  image,            // string path
  imageAlt,         // string
  imageClass,       // Tailwind classes for <img>
  imageWrapClass,   // Tailwind classes for wrapper positioning
  textHeading,      // string (heading inside the banner)
  textLines         // array of strings
}) {
  return (
    <div>
     
      {/* Banner section */}
      <section
        className="text-white"
        style={{ background: bgGradient || "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
      >
        <div className="relative mx-auto max-w-5xl px-4 py-16">
          {/* Image container */}
          {image && (
            <div className={imageWrapClass}>
              <img src={image} alt={imageAlt} className={imageClass} />
            </div>
          )}
          {/* Text */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-12 sm:justify-center">
            {/* Spacer for image on larger screens */}
            <div className="hidden sm:block w-40 md:w-48" />
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold sm:text-3xl">
                {textHeading}
              </h2>
              {textLines?.map((line, i) => (
                <p key={i} className="mt-3 text-base leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}