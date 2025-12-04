import React from "react";

/**
 * BlogArticleTemplate — Tailwind v4 + Typography
 * Layout: 2/5 TOC (left) + 3/5 article (right)
 * Supports: per-section images with alt/caption + SEO meta
 */

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
};

const readingTimeFromHTML = (sections) => {
  const text = sections
    .map((s) => String(s.html || "").replace(/<[^>]+>/g, " "))
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const ensureHtmlBlocks = (raw = "") => {
  const html = String(raw).trim();
  if (/(<(p|ul|ol|li|blockquote|pre|table|img|figure|h[1-6])\b)/i.test(html))
    return html;
  return html
    .split(/\r?\n{2,}/g)
    .map((p) => `<p>${p.replace(/\r?\n/g, "<br/>")}</p>`)
    .join("");
};

// Function to process HTML and style hyperlinks with bold and italic
const processHyperlinks = (html) => {
  return html.replace(
    /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1([^>]*?)>(.*?)<\/a>/gi,
    '<a href="$2" $3 class="font-bold italic underline underline-offset-2 hover:no-underline">$4</a>'
  );
};

export default function BlogArticleTemplate({ blog }) {
  const data = blog || {};
  const {
    title = "",
    description = "",
    slug = "",
    keywords = [],
    author = "Mesodose",
    heroImageId, // optional legacy
    heroImageSrc, // ✅ NEW: data URL from DOCX
    updatedAtISO = new Date().toISOString(),
    sections = [],
    ctas = [],
    tags = [],
    breadcrumbs = [],
  } = data;
s
  // Check if we have valid data
  if (!blog || !sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Blog
          </h1>
          <p className="mt-2 text-neutral-600">
            Blog data is missing or invalid
          </p>
        </div>
      </div>
    );
  }

  const readingTime = readingTimeFromHTML(sections);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* SEO (React 19 hoists these) */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords?.length && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      {slug && (
        <link rel="canonical" href={`https://mesodose.com/mesoblog/${slug}`} />
      )}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {slug && (
        <meta
          property="og:url"
          content={`https://mesodose.com/mesoblog/${slug}`}
        />
      )}
      <meta name="twitter:card" content="summary_large_image" />

      {/* ───────── Hero Section ───────── */}
      <header
        className="relative isolate overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--brand-from) 20%, white 80%) 0%, color-mix(in srgb, var(--brand-to) 20%, white 80%) 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          {breadcrumbs.length > 0 && (
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
              {breadcrumbs.map((b, i) => (
                <span key={b.href} className="flex items-center gap-2">
                  <a
                    href={b.href}
                    className="underline-offset-4 hover:underline hover:text-neutral-900"
                  >
                    {b.name}
                  </a>
                  {i < breadcrumbs.length - 1 && <span aria-hidden>›</span>}
                </span>
              ))}
            </nav>
          )}

          <div className="grid gap-8 md:grid-cols-[1fr,22rem] md:items-start">
            <div>
              {!!tags.length && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {tags.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide"
                      style={{
                        background:
                          "color-mix(in srgb, var(--brand-to) 20%, white 80%)",
                        color: "var(--brand-from)",
                        border: "1px solid var(--brand-to)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {title || "Untitled Blog Post"}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-700">
                {description || "No description available"}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <span>{author}</span>
                <span aria-hidden>•</span>
                <span>{readingTime}</span>
                <span aria-hidden>•</span>
                <span>Updated {formatDate(updatedAtISO)}</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur">
                {heroImageSrc ? (
                  // ✅ NEW: preferred path – data URL from DOCX
                  <img
                    src={heroImageSrc}
                    alt={title}
                    className="h-full w-full object-cover rounded-2xl shadow-md"
                    style={{
                      boxShadow: "0 0 30px rgba(138,156,240,0.25)",
                      border: "2px solid var(--brand-to)",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : typeof heroImageId === "number" ? (
                  // ✅ BACKWARDS COMPAT: old file-based hero images
                  <img
                    src={`/blogs/${slug}/${heroImageId}.jpg`}
                    alt={title}
                    className="h-full w-full object-cover rounded-2xl shadow-md"
                    style={{
                      boxShadow: "0 0 30px rgba(138,156,240,0.25)",
                      border: "2px solid var(--brand-to)",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  // Fallback when nothing available
                  <div className="flex h-70 items-center justify-center text-neutral-400">
                    No hero image
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ───────── Body: TOC + Content ───────── */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* TOC */}
          <aside className="lg:col-span-2 order-last lg:order-first">
            <div
              className="sticky rounded-2xl border border-neutral-200 bg-white/80 p-7 mt-5 shadow-sm backdrop-blur"
              style={{
                top: "7rem",
                marginTop: "1.5rem",
              }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Contents
              </h2>
              <nav className="flex flex-col gap-2 text-sm text-neutral-700">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-md px-2 py-1 hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Article */}
          <article
            className="lg:col-span-3 prose prose-neutral max-w-none prose-h2:mt-12 prose-h2:font-bold
            [&_a]:font-bold [&_a]:italic [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline
          "
          >
            {sections.map((s) => (
              <section id={s.id} key={s.id} className="mt-0 scroll-mt-[8rem]">
                <h2 className="font-bold">{s.title}</h2>

                <div
                  className="
    [&_p]:mt-3 [&_p]:mb-3
    [&_ul]:my-4 [&_ol]:my-4
    [&_ul]:list-disc [&_ol]:list-decimal
    [&_ul]:ml-6  [&_ul]:pl-2   /* 👈 add this */
    [&_li]:my-1  [&_li]:ml-2   /* optional: reduce li margin */
  "
                  dangerouslySetInnerHTML={{
                    __html: processHyperlinks(ensureHtmlBlocks(s.html)),
                  }}
                />

                {typeof s.imageId === "number" && (
                  <figure className="my-8">
                    <img
                      src={`/blogs/${slug}/${s.imageId}.jpg`}
                      alt={s.title}
                      className="mx-auto rounded-xl shadow-md"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </figure>
                )}
              </section>
            ))}

            <hr
              className="my-8 border-t"
              style={{ borderColor: "var(--brand-to)" }}
            />

            {!!ctas.length && (
              <div
                className="not-prose mt-12 rounded-2xl border p-6"
                style={{
                  borderColor: "var(--brand-to)",
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--brand-from) 15%, white 85%) 5%, color-mix(in srgb, var(--brand-to) 15%, white 85%) 100%)",
                }}
              >
                <h3 className="text-lg font-semibold">
                  Explore Ibogaine Ibotincture™
                </h3>
                <p className="mt-1 text-sm text-neutral-700">
                  Considering a gentle, felt-sense protocol? Browse our
                  artisanal tinctures and community resources. Always follow
                  guidance; start low, go slow.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {ctas.map((c) => (
                    <a
                      key={c.href}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-xs text-neutral-500">
                  Legal status varies by country. This article is informational
                  only and not medical advice.
                </p>
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
