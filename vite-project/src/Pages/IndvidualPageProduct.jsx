import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductCarouselSwiper from "../components/ProductsCarrousell/ProductCarouselSwiper.jsx";

export default function IndvidualPageProduct({ products = [] }) {
  const { id } = useParams();
  const product = React.useMemo(() => {
    if (!Array.isArray(products)) return null;
    return (
      products.find((item) => {
        if (!item) return false;
        if (typeof item.id === "number") {
          return item.id === Number(id);
        }
        return String(item.id) === String(id);
      }) || null
    );
  }, [products, id]);

  const otherProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((item) => (product ? item?.id !== product.id : true));
  }, [products, product]);

  if (!product) {
    return (
      <main className="bg-[var(--secondBackground)] min-h-[60vh]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Product not found</h1>
          <p className="mt-4 text-gray-600">
            We couldn&apos;t find that item. Please return to the product list.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="bg-[var(--secondBackground)] rounded-3xl p-4 shadow-sm sm:p-6 lg:p-8">
            <img
              src={product.image}
              alt={product.title}
              className="mx-auto h-full max-h-[360px] w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl text-gray-900 sm:text-4xl">{product.title}</h1>
              <p className="mt-2 text-base text-gray-600 sm:text-lg">{product.description}</p>
            </div>

            <div
              className="flex items-center gap-3 text-xl font-semibold sm:text-2xl"
              style={{ color: "var(--brand)" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
                aria-hidden="true"
              >
                <path
                  d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                <circle cx="17" cy="20" r="1.5" fill="currentColor" />
              </svg>
              €{product.priceInEuros ?? product.price}
            </div>

            {product.overview && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Overview</h2>
                <p className="text-gray-600">{product.overview}</p>
              </div>
            )}

            {product.benefits?.length ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Why you&apos;ll love it</h2>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.chakra && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Chakra connection</h2>
                <p className="mt-1 text-gray-600">{product.chakra}</p>
              </div>
            )}

            <Link
              to="/cart"
              className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white sm:px-6"
              style={{ background: "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </section>

      {otherProducts.length > 0 && (
        <section className="bg-[var(--secondBackground)] py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
            <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">
              Explore more tinctures
            </h2>
            <div className="mt-8 sm:mt-10">
              <ProductCarouselSwiper products={otherProducts} single />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

