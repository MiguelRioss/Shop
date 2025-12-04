// src/components/BlogSEO.jsx
export default function BlogSEO({ blog }) {
  if (!blog) return null;

  const {
    seoTitle,
    title,
    description,
    keywords = [],
    slug,
    heroImageUrl,
  } = blog;

  // Fallbacks
  const baseUrl = "https://mesodose.com";
  const pageUrl = slug ? `${baseUrl}/mesoblog/${slug}` : baseUrl;
  const ogImage = heroImageUrl || `${baseUrl}/assets/og-mesodose.jpg`;

  return (
    <>
      {/* SEO basics */}
      <title>{seoTitle || title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Mesodose" />
      <meta property="og:title" content={seoTitle || title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle || title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: blog.seoTitle || blog.title,
          description: blog.description,
          image: blog.heroImageUrl || `${baseUrl}/assets/og-mesodose.jpg`,
          author: {
            "@type": "Organization",
            name: "Mesodose",
            url: baseUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "Mesodose",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo.png`,
            },
          },
          url: pageUrl,
          datePublished: blog.updatedAtISO || new Date().toISOString(),
          dateModified: blog.updatedAtISO || new Date().toISOString(),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
        })}
      </script>
    </>
  );
}
