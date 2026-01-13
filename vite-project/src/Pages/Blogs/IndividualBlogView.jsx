import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllBlogs, formatBlogDate } from "../../services/blogsScript";
import BlogCard from "./GRID/BlogCard";

export default function IndividualPostView() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllBlogs()
      .then((arr) => {
        setBlogs(arr || []);
        const found = (arr || []).find((b) => b.slug === slug);
        setBlog(found || null);
      })
      .catch((e) => setError(e.message || "Failed to load blog"))
      .finally(() => setLoading(false));
  }, [slug]);

  const related = useMemo(() => {
    // simple “related”: newest 4 other individual posts
    return blogs
      .filter((b) => !b?.isSeries && b.slug !== slug)
      .sort((a, b) => new Date(b.updatedAtISO) - new Date(a.updatedAtISO))
      .slice(0, 4);
  }, [blogs, slug]);

  if (loading) return <div className="p-10 text-center">Loading…</div>;
  if (error) return <div className="p-10 text-center text-red-600">⚠️ {error}</div>;
  if (!blog) return <div className="p-10 text-center">Post not found.</div>;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <article className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/mesoblog" className="text-sm text-neutral-600 hover:underline">
          ← Back to blog
        </Link>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{blog.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <span>{blog.author || "Mesodose"}</span>
          <span aria-hidden>•</span>
          <span>{formatBlogDate(blog.updatedAtISO)}</span>
        </div>

        {blog.heroImageSrc && (
          <img
            src={blog.heroImageSrc}
            alt={blog.title}
            className="mt-6 w-full rounded-2xl border border-neutral-200 object-cover"
          />
        )}

        <div className="prose prose-neutral max-w-none mt-8">
          {(blog.sections || []).map((s, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: s?.html || "" }} />
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <h2 className="text-xl font-semibold mb-6">More posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((b) => (
              <BlogCard key={b.slug} blog={b} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
