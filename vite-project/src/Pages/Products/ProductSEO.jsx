export default function ProductSEO({
  title = "Ibogaine Tincture – Mesodose",
  description = "Shop artisanal ibogaine tinctures for mesodosing — functional, perceptible dosing for calm focus and balance.",
  keywords = [
    "ibogaine tincture",
    "mesodosing",
    "ibotincture",
    "buy ibogaine",
    "functional dose",
    "plant medicine",
  ],
  slug = "",
  image = "https://mesodose.com/assets/og-product.jpg",
  price = "0.00",
  currency = "EUR",
  availability = "InStock",
  brand = "Mesodose",
}) {
  const baseUrl = "https://mesodose.com";
  const pageUrl = slug ? `${baseUrl}/shop/${slug}` : baseUrl;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: title,
    image: [image],
    description,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: currency,
      price,
      availability: `https://schema.org/${availability}`,
      seller: { "@type": "Organization", name: brand },
    },
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </>
  );
}
