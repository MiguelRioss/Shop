import { Helmet } from "react-helmet-async";

export default function OtherProductsSEO({ products = [] }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Related Products",
    itemListElement: products.map((p, i) => ({
      "@type": "Product",
      position: i + 1,
      name: p.title,
      description: p.description,
      image: p.image,
      offers: {
        "@type": "Offer",
        price: p.priceInEuros ?? p.price,
        priceCurrency: "EUR",
        availability: p.soldOut
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
