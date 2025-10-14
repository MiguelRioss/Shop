import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductCarouselSwiper from "../components/ProductsCarrousell/ProductCarouselSwiper.jsx";
import Details from "../components/IndivualPageDetailsComponent.jsx";

export default function IndvidualPageProduct({ products = [], page }) {
  const { id } = useParams();

  const [activeDetail, setActiveDetail] = React.useState(null);

  const product = React.useMemo(() => {
    if (!Array.isArray(products)) return null;
    return (
      products.find((item) =>
        typeof item.id === "number"
          ? item.id === Number(id)
          : String(item.id) === String(id)
      ) || null
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
            {page.notFound.title}
          </h1>
          <p className="mt-4 text-gray-600">{page.notFound.message}</p>
          <Link
            to={page.notFound.button.href}
            className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: page.notFound.button.gradient }}
          >
            {page.notFound.button.label}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={page.pageLayout.bg}>
      <section className={page.pageLayout.container}>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* IMAGE */}
          <div className={page.productImage.wrapperClass}>
            <img
              src={product.image}
              alt={product.title}
              className={page.productImage.imgClass}
              loading="lazy"
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-4">
            <h1 className={page.sections.headingClass}>{product.title}</h1>
            <p className={page.sections.descriptionClass}>
              {product.description}
            </p>

            {/* PRICE */}
            <div
              className="flex items-center gap-3 text-xl font-semibold sm:text-2xl"
              style={{ color: page.price.color }}
            >
              {page.price.currencySymbol}
              {product.priceInEuros ?? product.price}
            </div>

            {/* PRODUCT SECTIONS */}
            {product.sections?.map((s, i) => (
              <Details
                key={i}
                title={s.title}
                defaultOpen={false}
                isOpen={activeDetail === i}
                onToggle={() => setActiveDetail(activeDetail === i ? null : i)}
              >
                {s.description && (
                  <p className="text-gray-600">{s.description}</p>
                )}

                {s.bullets?.length && (
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                    {s.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}

                {s.descriptionNote && (
                  <p className="mt-2 text-gray-600">{s.descriptionNote}</p>
                )}
              </Details>
            ))}

            {/* HIGHLIGHTS */}
            <div className="mt-4">
              <div className={page.highlights.boxClass}>
                <ul className="space-y-3 text-sm">
                  {page.highlights.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                        {item.icon}
                      </span>
                      <span>
                        {item.text}{" "}
                        {item.link &&
                          (item.link.href.startsWith("http") ? (
                            <a
                              href={item.link.href}
                              target={item.link.target}
                              rel="noreferrer"
                              className="underline"
                            >
                              {item.link.label}
                            </a>
                          ) : (
                            <Link to={item.link.href} className="underline">
                              {item.link.label}
                            </Link>
                          ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CART BUTTON */}
            <Link
              to={page.cartButton.href}
              className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white sm:px-6"
              style={{ background: page.cartButton.gradient }}
            >
              {page.cartButton.label}
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {otherProducts.length > 0 && (
        <section className={page.related.bg}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
            <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">
              {page.related.heading}
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
