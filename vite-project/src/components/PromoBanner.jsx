const defaultImageWrapClass =
  "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-11 sm:left-10 sm:translate-x-10 sm:-translate-y-10";
const defaultImageClass = "h-30 w-auto sm:h-60 drop-shadow-lg";

export default function PromoBanner({
  heading,            // string
  intro,              // string (unused here, but keep if you use it above the banner)
  bgGradient,         // CSS string (fallback linear-gradient)
  image,              // string path
  imageAlt,           // string
  imageClass,         // Tailwind classes for <img>
  imageWrapClass,     // Tailwind classes for wrapper positioning
  textHeading,        // string (heading inside the banner)
  textLines,          // array of strings
  // NEW (optional)
  contactUrl = "https://mesodose.com/mesocontact?subject=Get%20a%2010ml%20Sample",
  contactLabel = "Contact us",
  contactToken = "[[contact]]",
}) {
  const resolvedImageWrapClass = imageWrapClass || defaultImageWrapClass;
  const resolvedImageClass = imageClass || defaultImageClass;

  // Minimal helper: inject link where the token appears.
  // Also gracefully handles lines that literally contain "Contact us".
  function renderLine(line) {
    // Prefer explicit token
    if (line.includes(contactToken)) {
      const parts = line.split(contactToken);
      return parts.map((part, i) =>
        i < parts.length - 1 ? (
          <span key={i}>
            {part}
            <a
              href={contactUrl}
              className="underline font-semibold text-white hover:text-gray-100"
            >
              {contactLabel}
            </a>
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    }

    // Fallback: first occurrence of "Contact us" (case-insensitive)
    const match = line.match(/contact us/i);
    if (!match) return line;

    const idx = match.index;
    const before = line.slice(0, idx);
    const middle = line.slice(idx, idx + match[0].length); // preserves original case
    const after = line.slice(idx + match[0].length);

    return (
      <>
        {before}
        <a
          href={contactUrl}
          className="underline font-semibold text-white hover:text-gray-100"
        >
          {middle}
        </a>
        {after}
      </>
    );
  }

  return (
    <div>
      <section
        className="text-white"
        style={{
          background:
            bgGradient || "linear-gradient(to right, var(--brand-from), var(--brand-to))",
        }}
      >
        <div className="relative mx-auto max-w-5xl px-4 py-16">
          {/* Image */}
          {image && (
            <div className={resolvedImageWrapClass}>
              <img
                src={image}
                alt={imageAlt}
                className={resolvedImageClass}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-12 sm:justify-center">
            <div className="hidden sm:block w-40 md:w-48" />
            <div className="max-w-2xl mt-5">
              <h2 className="text-2xl font-bold sm:text-3xl">{textHeading}</h2>
              {textLines?.map((line, i) => (
                <p key={i} className="mt-3 text-base leading-relaxed">
                  {renderLine(line)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
