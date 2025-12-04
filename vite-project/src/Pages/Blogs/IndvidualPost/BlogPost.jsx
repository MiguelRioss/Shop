// src/pages/BlogPost.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogSEO from "./BlogSEO";
import BlogArticleTemplate from "./BlogArticleTemplate";
import { getBlogBySlug } from "../../../services/blogsScript.js";

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    getBlogBySlug(slug).then((data) => {
      if (data?.error) setError(data.error);
      else setBlog(data);
    });
  }, [slug]);

  if (error) return <div className="p-8 text-red-600">⚠️ {error}</div>;
  if (!blog) return <div className="p-8">Loading…</div>;

  return (
    <>
      <BlogSEO blog={blog} />
      <BlogArticleTemplate blog={blog} />
    </>
  );
}
