  import PageSEO from "../Pages/PageSEO.jsx"; // ✅ import

  export default function FounderLetterPage({ letter, webConfig }) {
    const resolvedLetter = letter || webConfig?.founderLetter;
    if (!resolvedLetter) return null;

    const hero = resolvedLetter.hero || {};
    const alignRight = (hero.align || "right") === "right";

    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        {/* ✅ SEO Section */}
        <PageSEO
          title={`A Letter from the Founder – ${resolvedLetter.author || "Mesodose"}`}
          description={
            resolvedLetter.summary ||
            "A personal message from the founder of Mesodose on the philosophy behind mesodosing, balance, and modern healing."
          }
          keywords={[
            "Mesodose founder",
            "ibogaine story",
            "mesodosing philosophy",
            "plant medicine journey",
            "functional dosing",
            "ibotincture origin",
          ]}
          slug="founder-letter"
          imageUrl={hero.src || "https://mesodose.com/assets/og-founder.jpg"}
          type="article"
        />

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {resolvedLetter.title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            By {resolvedLetter.author} – Updated {resolvedLetter.updatedAt}
          </p>
        </header>

        {/* Hero Image */}
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
              alt={hero.alt || resolvedLetter.title}
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

        {/* Body Content */}
        <article className="font-serif text-[18px] leading-8 text-gray-900 px-2 sm:px-4 md:px-0 space-y-10">
          {resolvedLetter.body?.map((section, i) => (
            <section key={section.id || i} id={section.id}>
              {section.heading && (
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-4">
                {section.content?.map((para, j) => (
                  <p key={j} className="text-gray-800">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
          <div className="clear-both" />
        </article>
      </main>
    );
  }
