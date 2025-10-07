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
    return products.filter((item) =>
      product ? item?.id !== product.id : true
    );
  }, [products, product]);

  if (!product) {
    return (
      <main className="bg-[var(--secondBackground)] min-h-[60vh]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Product not found
          </h1>
          <p className="mt-4 text-gray-600">
            We couldn&apos;t find that item. Please return to the product list.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{
              background:
                "linear-gradient(to right, var(--brand-from), var(--brand-to))",
            }}
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

          <div className="space-y-4">
            <div>
              <h1 className="font-serif text-3xl text-gray-900 sm:text-4xl">
                {product.title}
              </h1>
              <p className="mt-2 text-base text-gray-600 sm:text-lg">
                {product.description}
              </p>
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
            {product.sections?.map((s, i) => (
              <Details key={i} title={s.title} defaultOpen={s.defaultOpen}>
                {s.description && (
                  <p className="text-gray-600">{s.description}</p>
                )}
                {s.bullets?.length ? (
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                    {s.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}

                {s.descriptionNote?.length ? (
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                    <p className="text-gray-600">{s.descriptionNote}</p>
                  </ul>
                ) : null}
              </Details>
            ))}
            {/* Highlights */}
            <div className="mt-4">
              <div className="rounded-2xl bg-[var(--background-column-3Balons)] p-4 sm:p-5 text-[var(--brand)]">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      ★
                    </span>
                    <span>Trustpilot 4.3 score</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      ✉️
                    </span>
                    <span>
                      Try a 10 ml tester — you only pay the postage.{" "}
                      <Link to="/mesocontact" className="underline">
                        Contact us
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      👥
                    </span>
                    <span>
                      Over 1,000,000 drops shared.{" "}
                      <a
                        href="https://www.facebook.com/groups/1297206078804311/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Join the Facebook community
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>{" "}
            <Link
              to="/cart"
              className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white sm:px-6"
              style={{
                background:
                  "linear-gradient(to right, var(--brand-from), var(--brand-to))",
              }}
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </section>

      {otherProducts.length > 0 && (
        <section className="bg-[var(--secondBackground)] py-12">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
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

function Details({ title, children, defaultOpen = false }) {
  return (
    <details
      className="group p-3 rounded-xl border border-gray-200 bg-white/80"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="ml-2 transition-transform duration-200 group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-1 overflow-hidden">
        <div className="max-h-0 group-open:max-h-[1000px] transition-[max-height] duration-300 ease-out">
          <div className="text-sm leading-relaxed text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </details>
  );
}
