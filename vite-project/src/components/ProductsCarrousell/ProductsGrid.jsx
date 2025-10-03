import ProductSquareCard from "./ProductSquareCard.jsx"; // adjust the path

export default function ProductsGrid({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-5xl px-10 sm:px-4 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-20 sm:gap-6">
        {products.map((p) => (
          <ProductSquareCard
            key={p.id}
            id={p.id}
            image={p.image}
            title={p.title}
            description={p.description}
            priceInEuros={p.priceInEuros}
            fewTag={p.fewTag}
            soldOut={p.soldOut}
          />
        ))}
      </div>
    </div>
  );
}
