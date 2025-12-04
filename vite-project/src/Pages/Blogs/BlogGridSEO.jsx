// src/components/BlogGridSEO.jsx
export default function BlogGridSEO() {
  const title = "MesoBlog – Ibogaine, Mesodosing & Functional Balance";
  const description =
    "Explore guides, insights, and scientific perspectives on mesodosing ibogaine tinctures for calm focus, neurobalance, and sustainable mental clarity.";
  const canonical = "https://mesodose.com/mesoblog";
  const keywords = [
    "ibogaine",
    "mesodosing",
    "microdosing",
    "ibotinctures",
    "functional medicine",
    "burnout recovery",
    "plant-based nootropics",
  ];

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta
        property="og:image"
        content="https://mesodose.com/logo.png"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
