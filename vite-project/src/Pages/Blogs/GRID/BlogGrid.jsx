import React, { useEffect, useState } from "react";
import BlogGridSEO from "../BlogGridSEO";
import BlogCard from "./BlogCard";
import GenericGrid from "../../../components/Grid/GenericGrid";

import { getAllBlogs,getAllBlogSeries } from "../../../services/blogsScript";


export default function BlogGrid() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("individual"); // "individual" | "series"

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setError(null);

    const fetchFn =
      viewMode === "series" ? getAllBlogSeries : getAllBlogs;

    fetchFn()
      .then((arr) => {
        if (!alive) return;

        const sorted = (arr || []).sort((a, b) => {
          const da = new Date(a.updatedAtISO || a.createdAtISO || 0);
          const db = new Date(b.updatedAtISO || b.createdAtISO || 0);
          return db - da;
        });

        setItems(sorted);
      })
      .catch((err) => alive && setError(err?.message || "Failed to load blogs"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [viewMode]);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <BlogGridSEO />

      {/* ───────── Header ───────── */}
      <header
        className="relative isolate overflow-hidden text-center text-neutral-900"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--brand-from) 20%, white 80%) 0%, color-mix(in srgb, var(--brand-to) 25%, white 75%) 100%)",
        }}
      >
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

          {/* ───────── Toggle Buttons ───────── */}
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setViewMode("individual")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition 
                ${
                  viewMode === "individual"
                    ? "bg-[var(--brand-from)] text-white shadow"
                    : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
                }`}
            >
              All Blogs 
            </button>

            <button
              onClick={() => setViewMode("series")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition 
                ${
                  viewMode === "series"
                    ? "bg-[var(--brand-from)] text-white shadow"
                    : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
                }`}
            >
              Blog series
            </button>
          </div>

          {/* ───────── Links ───────── */}
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

      {/* ───────── Grid ───────── */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <GenericGrid
          items={items}
          loading={loading}
          error={error}
          emptyText={`No ${
            viewMode === "series" ? "blog series" : "individual posts"
          } found.`}
          renderItem={(blog) => (
            <BlogCard
              key={blog.slug || blog.id}
              blog={blog}
              type={viewMode}
            />
          )}
        />
      </section>
    </main>
  );
}
