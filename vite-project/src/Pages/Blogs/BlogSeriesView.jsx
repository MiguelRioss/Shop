import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllBlogSeries, formatBlogDate } from "../../services/blogsScript";
import BlogCard from "./GRID/BlogCard";

export default function BlogSeriesView() {
  const { slug } = useParams(); // "slug" here will be the series id, like "0"
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAllBlogSeries()
      .then((seriesArr) => {
        // slug is "0" from the URL, match against id or slug
        const found = seriesArr.find(
          (s) => s.id === slug || s.slug === slug
        );
        setSeries(found || null);
      })
      .catch((e) => setError(e.message || "Failed to load series"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading…</div>;
  if (error) return <div className="p-10 text-center text-red-600">⚠️ {error}</div>;
  if (!series) return <div className="p-10 text-center">Series not found.</div>;

  const posts = series.blogs || [];

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="mx-auto max-w-4xl px-6 pt-10 pb-6">
        <Link to="/mesoblog" className="text-sm text-neutral-600 hover:underline">
          ← Back to blog
        </Link>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {series.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <span>Mesodose</span>
          {series.updatedAtISO && (
            <>
              <span aria-hidden>•</span>
              <span>{formatBlogDate(series.updatedAtISO)}</span>
            </>
          )}
        </div>

        {series.description && (
          <p className="mt-4 text-neutral-700 leading-7">{series.description}</p>
        )}
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-xl font-semibold mb-6">Posts in this series</h2>

        {posts.length === 0 ? (
          <div className="text-neutral-600">No posts found in this series.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {posts.map((b) => (
              <BlogCard key={b.slug || b.id} blog={b} type="individual" />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
