// src/components/ProductCarousel.jsx
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import Arrow from "../UtilsComponent/Arrows.jsx";

import {
  useMeasureCarousel,
  useResponsiveVisible,
  useResetIndexOnChange,
  useApplyTransform,
  useCarouselStepper,
  computeTransformPx,
} from "./utils/ProductsCarroussel.mjs";

export default function ProductCarousel({
  products = [],
  gap = "0.12rem", // default gap between slides (change to "0rem" for touching)
  className = "",
}) {
  const outerRef = useRef(null); // container measured (parent container width)
  const trackRef = useRef(null);
  const transitionMs = 420;

  const productsLen = products.length;
  const slides = productsLen > 0 ? [...products, ...products] : [];
  const slidesLen = slides.length;

  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(productsLen || 0);
  const isTransitioningRef = useRef(false);

  // measured numbers (slide width determined from container / visible later)
  const [measure, setMeasure] = useState({
    containerWidth: 0,
    gapPx: 0,
    slideWidth: 0,
  });

  useResponsiveVisible({ setVisible });
  useMeasureCarousel({ outerRef, trackRef, visible, productsLen, setMeasure });
  useResetIndexOnChange({
    trackRef,
    visible,
    productsLen,
    setIndex,
    transitionMs,
  });

  useApplyTransform({ trackRef, index, measure, visible, transitionMs });

  const { prev, next, step } = useCarouselStepper({
    trackRef,
    slidesLen, // total items in track (including duplicates)
    productsLen, // unique items count
    visible,
    index,
    setIndex,
    transitionMs,
    isTransitioningRef,
    measure,
  });

  if (!products || products.length === 0) return null;

  const logicalIndex = ((index % productsLen) + productsLen) % productsLen;

  return (
    // IMPORTANT: no fixed viewport-width here — we rely on the parent container width.
    <div ref={outerRef} className={`pc-outer w-full ${className || ""}`}>
      <div
        className="product-carousel relative overflow-hidden p-0"
        aria-roledescription="carousel"
        style={{
          // dynamic vars consumed by Tailwind arbitrary values below
          "--gap": gap, // e.g., "0.5rem" or "8px"
          "--visible": String(visible),
        }}
      >
        <style>{`
          .product-carousel { padding: 0; }
          .pc-viewport { width: 100%; overflow: hidden; }

          /* track uses gap (css variable provided by prop) */
          .pc-track { display:flex; gap: ${gap}; align-items: flex-start; will-change: transform; }

          /* slides are a fixed proportion of the container via calc(100% / var(--visible)) */
          .pc-slide { flex: 0 0 calc(100% / var(--visible)); display:flex; justify-content:center; padding: 0; box-sizing: border-box; }

          .card-wrap { padding: 0.25rem; box-sizing: border-box; width: 100%; display:flex; justify-content:center; }

          /* Product card should fill most of the slide */
          .pc-slide .product-card-root {
            width: calc(100% - 0.5rem);
            max-width: none;
            box-sizing: border-box;
          }


        `}</style>

        {/* Desktop arrows — moved a bit further from the left/right edges */}
        <Arrow
          dir="prev"
          onClick={prev}
          variant="desktop"
          posClass="absolute left-8 lg:left-10 top-1/2 -translate-y-1/2 z-30"
        />
        <Arrow
          dir="next"
          onClick={next}
          variant="desktop"
          posClass="absolute right-8 lg:right-10 top-1/2 -translate-y-1/2 z-30"
        />

        {/* Mobile arrows — slightly smaller inset so they sit closer on small screens */}
        <Arrow
          dir="prev"
          onClick={prev}
          variant="mobile"
          posClass="absolute left-4 top-1/2 -translate-y-1/2 z-30"
        />
        <Arrow
          dir="next"
          onClick={next}
          variant="mobile"
          posClass="absolute right-4 top-1/2 -translate-y-1/2 z-30"
        />

        <div
          className="pc-viewport"
          style={{
            // expose visible to CSS so we can compute slide basis via calc(100% / var(--visible))
            // this affects the .pc-slide rule above
            "--visible": visible,
          }}
        >
          <div
            ref={trackRef}
            className="pc-track"
            style={{
              transform: computeTransformPx(index),
            }}
          >
            {slides.map((p, idx) => (
              <div className="pc-slide" key={`slide-${idx}-${p?.id ?? idx}`}>
                <div className="card-wrap">
                  <ProductCard
                    id={p.id}
                    image={p.image}
                    price={p.priceInEuros}
                    title={p.title}
                    description={p.description}
                    liked={p.liked}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pc-dots" aria-hidden>
          {products.map((_, i) => {
            const active = logicalIndex === i;
            return (
              <button
                key={`dot-${i}`}
                className="pc-dot"
                onClick={() => {
                  const target = productsLen + i;
                  if (!trackRef.current) return;
                  trackRef.current.style.transition = `transform 280ms ease`;
                  setIndex(target);
                }}
                style={{
                  background: active ? "#111827" : "#E5E7EB",
                  boxShadow: active ? "0 6px 16px rgba(17,24,39,0.12)" : "none",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
