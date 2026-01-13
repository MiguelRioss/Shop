import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductCarouselSwiper from "../../components/ProductsCarrousell/ProductCarouselSwiper.jsx";
import Details from "../../components/IndivualPageDetailsComponent.jsx";
import ProductSEO from "./ProductSEO.jsx";
import OtherProductsSEO from "./OtherProductSEO.jsx";
import { useCart } from "../../components/CartContext.jsx";

export default function IndvidualPageProduct({ products = [], page = {} }) {
  const { id } = useParams();
  const { addItem } = useCart();
  const [activeDetail, setActiveDetail] = React.useState(null);
  const [shareStatus, setShareStatus] = React.useState("");

  const baseUrl = "https://mesodose.com";

  // ---------- Safe product lookup ----------
  const product = React.useMemo(() => {
    if (!Array.isArray(products)) return null;
    return products.find((item) => item.slug === id) || null;
  }, [products, id]);

  // ---------- Canonical image (ONLY after product exists) ----------
  const canonicalImage = React.useMemo(() => {
    if (!product?.slug) return null;
    return `${baseUrl}/${product.slug}-60ml.png`;
  }, [product, baseUrl]);

  const otherProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return product ? products.filter((p) => p.id !== product.id) : products;
  }, [products, product]);

  const shareUrl = React.useMemo(() => {
    if (!product?.slug) return "";
    if (typeof window !== "undefined") return window.location.href;
    return `${baseUrl}/products/${product.slug}`;
  }, [product, baseUrl]);

  const handleShare = async () => {
    if (!shareUrl) return;
    setShareStatus("");
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title || "Mesodose product",
          text: product?.description || "",
          url: shareUrl,
        });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("Link copied.");
        return;
      }
    } catch (err) {
      setShareStatus("Could not share right now.");
      return;
    }
    setShareStatus("Copy not supported on this device.");
  };

  // ---------- Fallback page ----------
  const fallbackPage = {
    notFound: {
      title: "Product Not Found",
      message:
        "We couldn’t locate this item. It may have been removed or renamed.",
      button: {
        label: "Back to Shop",
        href: "/shop",
        gradient: "linear-gradient(90deg, var(--brand-from), var(--brand-to))",
      },
    },
    pageLayout: { bg: "bg-white", container: "mx-auto max-w-7xl px-6 py-12" },
  };

  const safePage = { ...fallbackPage, ...page };

  // ---------- Product not found ----------
  if (!product || !canonicalImage) {
    return (
      <main className="bg-[var(--secondBackground)] min-h-[60vh]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            {safePage.notFound.title}
          </h1>
          <p className="mt-4 text-gray-600">{safePage.notFound.message}</p>
          <Link
            to={safePage.notFound.button.href}
            className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: safePage.notFound.button.gradient }}
          >
            {safePage.notFound.button.label}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={page.pageLayout.bg}>
      {/* ---------- SEO ---------- */}
      <ProductSEO
        title={`${product.title} – Mesodose`}
        description={product.description}
        keywords={[
          product.title,
          "ibogaine tincture",
          "mesodosing",
          "functional dose",
          "plant medicine",
          "buy ibotincture",
        ]}
        slug={product.slug}
        image={canonicalImage}
        price={product.priceInEuros ?? product.price}
        currency="EUR"
        availability="InStock"
        brand="Mesodose"
      />

      {/* ---------- Main content ---------- */}
      <section className={page.pageLayout.container}>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex justify-center items-start w-full p-4 sm:p-6 lg:p-8">
            <img
              src={canonicalImage}
              alt={`Ibotincture ${product.title} 60 ml by Mesodose`}
              width="600"
              height="600"
              loading="eager"
              fetchPriority="high"
              className="w-2/5"
            />
          </div>

          <div className="space-y-4">
            <h1 className={page.sections.headingClass}>{product.title}</h1>
            <p className={page.sections.descriptionClass}>
              {product.description}
            </p>

            <div
              className="flex items-center gap-3 text-xl font-semibold sm:text-2xl"
              style={{ color: page.price.color }}
            >
              {page.price.currencySymbol}
              {product.priceInEuros ?? product.price}
            </div>

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
                {s.bullets?.length > 0 && (
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                    {s.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </Details>
            ))}
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
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={() => addItem(product, 1)}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white sm:px-6"
                style={{ background: page.cartButton.gradient }}
              >
                Add to cart
              </button>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold border border-gray-300 text-gray-800 sm:px-6"
              >
                Go to cart
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold border border-gray-300 text-gray-800 sm:px-6"
              >
                Share
              </button>
            </div>
            {shareStatus && (
              <p className="text-xs text-gray-500">{shareStatus}</p>
            )}
          </div>
        </div>
      </section>

      {otherProducts.length > 0 && (
        <section className={page.related.bg}>
          <OtherProductsSEO products={otherProducts} />
          <div className="mx-auto w-full max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold text-gray-900">
              {page.related.heading}
            </h2>
            <ProductCarouselSwiper products={otherProducts} single />
          </div>
        </section>
      )}
    </main>
  );
}
