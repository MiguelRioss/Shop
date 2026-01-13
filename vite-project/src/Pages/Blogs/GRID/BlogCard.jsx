import React from "react";
import GenericCard from "../../../components/Grid/GenericCard";
import { formatBlogDate } from "../../../services/blogsScript";

export default function BlogCard({ blog, type = "individual" }) {
  if (!blog) return null;

  const isSeries = type === "series";
  const seriesSlug = blog.slug || blog.id;

  const to = isSeries
    ? `/mesoblog/series/${seriesSlug}`
    : `/mesoblog/${blog.slug}`;

  // For series: pick a post with an image
  const posts = isSeries ? blog.blogs || [] : [];
  const bestPost =
    posts.find((p) => p?.heroImageSrc) ||
    posts.find((p) => typeof p?.heroImageId === "number") ||
    posts[0] ||
    null;

  const heroImageSrc = isSeries ? bestPost?.heroImageSrc : blog.heroImageSrc;
  const heroImageId = isSeries ? bestPost?.heroImageId : blog.heroImageId;
  const heroSlug = isSeries ? bestPost?.slug : blog.slug;

  const fallbackJpg =
    typeof heroImageId === "number" && heroSlug
      ? `/blogs/${heroSlug}/${heroImageId}.jpg`
      : null;

  const meta = (
    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
      <span>{blog.author || "Mesodose"}</span>
      <span aria-hidden>•</span>

      {isSeries ? (
        <span>{posts.length} posts</span>
      ) : (
        <span>{readingTime(blog.sections)} min read</span>
      )}

      {blog.updatedAtISO && (
        <>
          <span aria-hidden>•</span>
          <span>{formatBlogDate(blog.updatedAtISO)}</span>
        </>
      )}
    </div>
  );

  return (
    <GenericCard
      to={to}
      title={blog.title}
      description={blog.description}
      meta={meta}
      imageSrc={heroImageSrc}
      imageFallbackSrc={fallbackJpg}
      imageAlt={blog.title}
    />
  );
}

function readingTime(sections = []) {
  const text = (sections || []).map((s) => s?.html || "").join(" ");
  const words = text
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
