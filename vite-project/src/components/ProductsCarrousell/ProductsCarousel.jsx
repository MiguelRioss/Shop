// src/components/ProductCarousel.jsx
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { useCart } from "../CartContext.jsx";
import Arrow from "../UtilsComponent/Arrows.jsx";

export default function ProductCarousel({
  products = [],
  gap = "0.12rem", // default gap between slides (change to "0rem" for touching)
  className = "",
}) {
  const { addItem } = useCart();

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

  // measure container width + computed gap
  useEffect(() => {
    function measureNow() {
      if (!outerRef.current || !trackRef.current) return;
      const containerWidth = Math.round(outerRef.current.clientWidth);
      const computed = getComputedStyle(trackRef.current);
      const gapPx = parseFloat(computed.gap || "0") || 0;
      const slideWidth =
        containerWidth && visible
          ? Math.round((containerWidth - (visible - 1) * gapPx) / visible)
          : 0;
      setMeasure({ containerWidth, gapPx, slideWidth });
    }

    measureNow();
    let rAF = null;
    const onResize = () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(measureNow);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measureNow);
    const t = setTimeout(measureNow, 60);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measureNow);
      clearTimeout(t);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, [visible, productsLen]);

  // responsive visible count
  useEffect(() => {
    function updateVisible() {
      const w = window.innerWidth;
      // desktop >= 1024 -> 3, tablet >= 768 -> 2, else 1
      const v = w >= 1024 ? 3 : w >= 768 ? 2 : 1;
      setVisible(v);
    }
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // reset to middle when visible or products length changes
  useEffect(() => {
    setIndex(productsLen);
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      setTimeout(() => {
        if (trackRef.current)
          trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }, 0);
    }
  }, [visible, productsLen]);

  // compute transform in px using measured container and slide width
  const computeTransformPx = (i = index) => {
    const { slideWidth, gapPx, containerWidth } = measure;
    if (!slideWidth || !containerWidth) return `translateX(0px)`;
    const stepPx = slideWidth + gapPx;
    let x = -(i * stepPx);

    // center the visible group (works for visible=1,2,3)
    const groupWidth = visible * slideWidth + Math.max(0, visible - 1) * gapPx;
    const centerOffset = Math.round((containerWidth - groupWidth) / 2);
    x += centerOffset;

    return `translateX(${x}px)`;
  };

  // step logic (1-by-1)
  const step = (n) => {
    if (!productsLen) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const newIndex = index + n;
    setIndex(newIndex);

    const maxIndex = slidesLen - visible;
    const minIndex = 0;

    const onTransitionEnd = () => {
      if (!trackRef.current) return;
      trackRef.current.removeEventListener("transitionend", onTransitionEnd);

      if (newIndex > maxIndex) {
        const corrected = newIndex - productsLen;
        trackRef.current.style.transition = "none";
        setIndex(corrected);
        trackRef.current.style.transform = computeTransformPx(corrected);
        trackRef.current.offsetHeight;
        trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }

      if (newIndex < minIndex) {
        const corrected = newIndex + productsLen;
        trackRef.current.style.transition = "none";
        setIndex(corrected);
        trackRef.current.style.transform = computeTransformPx(corrected);
        trackRef.current.offsetHeight;
        trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 20);
    };

    if (trackRef.current) {
      trackRef.current.addEventListener("transitionend", onTransitionEnd, {
        once: true,
      });
    } else {
      setTimeout(() => (isTransitioningRef.current = false), transitionMs + 20);
    }
  };

  const prev = () => step(-1);
  const next = () => step(+1);

  // apply transform whenever index or measurements change
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
    trackRef.current.style.transform = computeTransformPx(index);
  }, [
    index,
    measure.slideWidth,
    measure.gapPx,
    measure.containerWidth,
    visible,
  ]);

  if (!products || products.length === 0) return null;

  const logicalIndex = ((index % productsLen) + productsLen) % productsLen;

  return (
    // IMPORTANT: no fixed viewport-width here — we rely on the parent container width.
    <div
      ref={outerRef}
      className={`pc-outer w-full ${className}`}
      style={{ width: "100%" }}
    >
      <div
        className="product-carousel relative overflow-hidden"
        aria-roledescription="carousel"
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
                    onBuy={() => p.onBuy && p.onBuy(p)}
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
