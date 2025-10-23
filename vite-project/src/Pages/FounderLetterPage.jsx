
export default function FounderLetterPage(webConfig,props) {
  const letter = props.letter ?? webConfig.founderLetter;
  if (!letter) return null;

  const hero = letter.hero || {};
  const alignRight = (hero.align || "right") === "right";

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {letter.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          By {letter.author} • Updated {letter.updatedAt}
        </p>
      </header>

      <article className="font-serif text-[18px] leading-8 text-gray-900">
        {/* Hero image — centered on mobile/tablet, floated on desktop */}
        {hero.src && (
          <figure
            className={[
              "mb-8 sm:mb-10",
              "mx-auto md:mx-0 text-center",
              alignRight ? "md:float-right md:ml-8" : "md:float-left md:mr-8",
            ].join(" ")}
            style={{
              width: "100%",
              maxWidth: (hero.width || 320) + "px",
              shapeOutside: "inset(0 round 16px)",
              shapeMargin: "14px",
            }}
          >
            <img
              src={hero.src}
              alt={hero.alt || letter.title}
              loading="eager"
              decoding="async"
              className="block mx-auto w-[80%] sm:w-[70%] md:w-full h-auto rounded-xl shadow-md"
            />
            {hero.caption && (
              <figcaption className="mt-3 text-xs text-gray-500 text-center">
                {hero.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Text body — adds padding on mobile/tablet */}
        <article className="font-serif text-[18px] text-gray-900 leading-8 px-2 sm:px-4 md:px-0">
          <div className="space-y-8">
            {letter.body.split(/\n{2,}/).map((block, i) => (
              <div key={i}>
                {block.split(/\n/).map((line, j) => (
                  <span key={j} className="block mb-3 last:mb-0">
                    {line || "\u00A0"}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </article>

        {/* Clears float so footer or following content doesn’t wrap */}
        <div className="clear-both" />
      </article>
    </main>
  );
}
