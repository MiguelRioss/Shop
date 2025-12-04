// In ShopPage.jsx or ProductsGrid.jsx

export default function ProductCollectionSEO({ products }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mesodose Ibogaine Tinctures",
    description:
      "Browse our handcrafted ibogaine tinctures and mesodosing products for calm focus and balanced living.",
    hasPart: products.map((p) => ({
      "@type": "Product",
      name: p.title,
      image: p.image,
      description: p.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: p.priceInEuros ?? p.price,
        availability: p.soldOut
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      },
    })),
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}
