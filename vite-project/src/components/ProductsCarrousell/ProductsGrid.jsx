  import { Link } from "react-router-dom";
  import Button from "../UtilsComponent/Button.jsx";
  import { useCart } from "../../components/CartContext.jsx";

  export default function ProductsGrid({ products = [] }) {
    const { addItem } = useCart();

    if (!products || products.length === 0) return null;

    return (
      <div className="max-w-7xl px-36 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-10 sm:gap-6">
          {products.map((p) => (
            <article
              key={p.id}
              className="relative aspect-square rounded-2xl border border-gray-200 bg-white shadow overflow-hidden p-3 grid"
              style={{ gridTemplateRows: '1fr auto auto' }}
            >
              <div className="min-h-0 flex items-center justify-center p-4 sm:p-2 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h3 className="mt-1 text-center text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                {p.title}
              </h3>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button className="w-full h-10 justify-center text-xs sm:text-sm font-semibold min-w-0" onClick={() => addItem && addItem(p, 1)}>
                  Buy Now
                </Button>
                <Link
                  to={`/products/${p.id}`}
                  className="w-full h-10 inline-flex items-center justify-center rounded-full border-2 border-[var(--brand-from)] text-[var(--brand-from)] bg-white font-semibold text-xs sm:text-sm min-w-0 px-3 sm:px-4 whitespace-nowrap transition-colors hover:bg-[var(--brand)] hover:text-white"
                  onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
                >
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }




