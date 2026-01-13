export default function PromoBanner({
  bgGradient,
  image,
  imageAlt,
  textHeading,
  textLines,
  contactUrl = "https://mesodose.com/mesocontact?subject=Get%20a%2010ml%20Sample",
  contactLabel = "Contact us",
  contactToken = "[[contact]]",
  useBullets = false, // 👈 NEW
}) {
  // --- link helper ---
  const renderLine = (line) => {
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

    const match = line.match(/contact us/i);
    if (!match) return line;

    const idx = match.index;
    const before = line.slice(0, idx);
    const middle = line.slice(idx, idx + match[0].length);
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
  };

  return (
    <section
      className="relative mt-30 text-white overflow-visible"
      style={{
        background:
          bgGradient ||
          "linear-gradient(to right, var(--brand-from), var(--brand-to))",
      }}
    >
      {/* Image always floats above the section */}
      {image && (
        <div
          className="
            absolute left-1/2 top-0 
            -translate-x-1/2 -translate-y-1/4
            sm:left-[35%] sm:top-1/4 sm:-translate-y-1/2
            z-20 flex justify-center w-full sm:w-auto
          "
        >
          <img
            src={image}
            alt={imageAlt}
            className="max-h-60 mb-20 sm:max-h-90 w-auto drop-shadow-2xl"
            loading="lazy"
            width="320"
            height="240"
            decoding="async"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-12 pt-40 pb-8 sm:pt-10 sm:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:text-right gap-6">
          <div className="w-full sm:w-1/2 sm:ml-auto">
            <h2 className="text-2xl font-bold sm:text-3xl">{textHeading}</h2>

            {textLines &&
              (useBullets ? (
                <ul
                  className="
                    mt-4 space-y-2 text-base leading-relaxed
                    list-disc list-outside pl-6
                    text-left inline-block
                  "
                >
                  {textLines.map((line, i) => (
                    <li key={i}>
                      {renderLine(line.replace(/^\s*-\s*/, ""))}
                      {/* strip leading "- " so you don't get double bullets */}
                    </li>
                  ))}
                </ul>
              ) : (
                textLines.map((line, i) => (
                  <p key={i} className="mt-3 text-base leading-relaxed">
                    {renderLine(line)}
                  </p>
                ))
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
