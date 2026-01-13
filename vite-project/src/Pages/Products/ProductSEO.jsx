import React from "react";

export default function ProductSEO({
  title,
  description,
  keywords = [],
  slug,
  image, // MUST be absolute URL
  price,
  currency = "EUR",
  availability = "InStock",
  brand = "Mesodose",
}) {
  const baseUrl = "https://mesodose.com";
  const pageUrl = `${baseUrl}/shop/${slug}`;

  // 🚨 HARD REQUIREMENT: image must be absolute
  const canonicalImage = image.startsWith("http")
    ? image
    : `${baseUrl}${image}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image: {
      "@type": "ImageObject",
      url: canonicalImage,
      width: 1200,
      height: 1200,
    },
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: currency,
      price,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: brand,
      },
    },
  };

  return (
    <>
      {/* ---------- CORE SEO ---------- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <link rel="canonical" href={pageUrl} />

      {/* ---------- OPEN GRAPH (PRODUCT ONLY) ---------- */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={canonicalImage} />

      {/* ---------- TWITTER CARD ---------- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={canonicalImage} />

      {/* ---------- STRUCTURED DATA ---------- */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </>
  );
}
