import webConfig from "../websiteConfig.json";

export default function FounderLetterPage(props) {
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
        {/* Hero image that wraps with text on md+ */}
        {hero.src && (
          <figure
            className={[
              // mobile stack
              "mb-6 sm:mb-8", // ⬅ bigger bottom margin so text resumes lower
              // float + horizontal gutter on md+
              alignRight ? "md:float-right md:ml-6" : "md:float-left md:mr-6",
              "md:mb-10", // ⬅ extra gap on larger screens
            ].join(" ")}
            style={{
              width: (hero.width || 280) + "px",
              height: (hero.height || 340) + "px",
              shapeOutside: "inset(0 round 16px)",
              shapeMargin: "14px", // ⬅ add buffer around the wrap area
            }}
          >
            <img
              src={hero.src}
              alt={hero.alt || letter.title}
              loading="eager"
              decoding="async"
              className="block w-full h-full object-cover rounded-xl shadow-md"
            />
            {hero.caption && (
              <figcaption className="mt-2 text-xs text-gray-500">
                {hero.caption}
              </figcaption>
            )}
          </figure>
        )}

        <article className="font-serif text-[18px] text-gray-900 leading-8">
          <div className="space-y-8">
            {letter.body.split(/\n{2,}/).map((block, i) => (
              <div key={i}>
                {block.split(/\n/).map((line, j, arr) => (
                  <span key={j} className="block mb-3 last:mb-0">
                    {line || "\u00A0"}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </article>

        {/* Clear the float at the end so following content doesn't wrap around */}
        <div className="clear-both" />
      </article>
    </main>
  );
}
