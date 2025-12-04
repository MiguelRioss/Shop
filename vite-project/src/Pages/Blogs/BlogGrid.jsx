import React, { useEffect, useState } from "react";
import BlogGridSEO from "./BlogGridSEO";
import { getAllBlogs, formatBlogDate } from "../../services/blogsScript";
export default function BlogGrid() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogs()
      .then((arr) => {
        // Sort by updatedAtISO (newest first)
        const sorted = arr.sort((a, b) => {
          const da = new Date(a.updatedAtISO);
          const db = new Date(b.updatedAtISO);
          return db - da;
        });

        setBlogs(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* ✅ SEO separated for readability */}
      <BlogGridSEO />

      {/* ───────── Header ───────── */}
      <header
        className="relative isolate overflow-hidden text-center text-neutral-900"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--brand-from) 20%, white 80%) 0%, color-mix(in srgb, var(--brand-to) 25%, white 75%) 100%)",
        }}
      >
        {/* soft overlay pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 40%, rgba(255,255,255,0.8) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            The <span className="text-[var(--brand-from)]">Meso</span>Blog
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-700 sm:text-lg">
            Gentle insights, neuroscience, and lived stories on the art of
            mesodosing.
          </p>
          <div className="mt-6 flex justify-center gap-3 text-sm">
            <a
              href="https://mesodose.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neutral-300 bg-white/60 px-4 py-2 hover:bg-white shadow-sm backdrop-blur-sm transition"
            >
              Visit Mesodose.com
            </a>
            <a
              href="https://www.facebook.com/groups/1297206078804311/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--brand-to)] bg-[var(--brand-from)]/10 px-4 py-2 text-[var(--brand-to)] hover:bg-[var(--brand-to)] hover:text-white transition"
            >
              Join the Community
            </a>
          </div>
        </div>
      </header>

      {/* ───────── Blog Grid ───────── */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {loading && <div className="p-10 text-center">Loading blogs...</div>}
        {error && (
          <div className="p-10 text-center text-red-600">⚠️ {error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {blogs.map((blog) => (
            <a
              key={blog.slug}
              href={`/mesoblog/${blog.slug}`}
              className="group block rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[16/10] w-full overflow-hidden">
                {blog.heroImageSrc ? (
                  // 1) New base64 / data URL from DOCX
                  <img
                    src={blog.heroImageSrc}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : typeof blog.heroImageId === "number" ? (
                  // 2) Old file-based images
                  <img
                    src={`/blogs/${blog.slug}/${blog.heroImageId}.jpg`}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  // 3) Fallback
                  <div className="h-full w-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-[var(--brand-from)] transition-colors">
                  {blog.title}
                </h2>
                <p className="text-sm text-neutral-600 line-clamp-3">
                  {blog.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span>{blog.author || "Mesodose"}</span>
                  <span aria-hidden>•</span>
                  <span>{readingTime(blog.sections)} min read</span>
                  <span>{formatBlogDate(blog.updatedAtISO)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function readingTime(sections = []) {
  const text = sections.map((s) => s.html || "").join(" ");
  const words = text
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
