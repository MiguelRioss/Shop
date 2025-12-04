// src/components/PageSEO.jsx
import React from "react";

/**
 * Generic SEO component usable across all pages.
 * Handles meta tags, Open Graph, and Twitter.
 */
export default function PageSEO({
  title = "Mesodose – Ibogaine Tinctures for Calm Focus",
  description = "Discover mesodosing: the middle path between microdosing and full ibogaine therapy. Functional dosing for calm, focus, and balance.",
  keywords = [
    "ibogaine tincture",
    "mesodosing",
    "microdosing alternative",
    "plant medicine",
    "ibotincture",
    "functional dose",
  ],
  slug = "",
  imageUrl = "https://mesodose.com/assets/og-mesodose.jpg",
  type = "website",
}) {
  const baseUrl = "https://mesodose.com";
  const pageUrl = slug ? `${baseUrl}/${slug}` : baseUrl;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
