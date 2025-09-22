// ProductCarousel.jsx
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard.jsx";

/**
 * ProductCarousel (pixel-accurate, 1-by-1 navigation, mobile-centered, arrows hidden on mobile,
 * subtle arrows, pagination dots)
 *
 * Props:
 *  - products: array of product objects
 *  - cardMaxWidth: string e.g. "420px"
 *  - gap: css gap string, e.g. "0.6rem"
 *  - className: extra wrapper classes
 */
export default function ProductCarousel({
  products = [],
  cardMaxWidth = "420px",
  gap = "0.6rem",
  className = "",
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const transitionMs = 420;

  const productsLen = products.length;
  const slides = productsLen > 0 ? [...products, ...products] : [];
  const slidesLen = slides.length;

  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(productsLen || 0);
  const isTransitioningRef = useRef(false);

  // pixel measures
  const [slidePx, setSlidePx] = useState({ width: 0, gapPx: 0, containerWidth: 0 });

  // measure slide width, gap and container width
  useEffect(() => {
    function measure() {
      if (!trackRef.current || !containerRef.current) return;
      const firstSlide = trackRef.current.querySelector(".pc-slide");
      if (!firstSlide) return;
      const rect = firstSlide.getBoundingClientRect();
      const computed = getComputedStyle(trackRef.current);
      const gapPx = parseFloat(computed.gap || "0") || 0;
      const containerWidth = Math.round(containerRef.current.clientWidth);
      setSlidePx({
        width: Math.round(rect.width),
        gapPx: Math.round(gapPx),
        containerWidth,
      });
    }

    measure();
    let rAF = null;
    const onResize = () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    const t = setTimeout(measure, 70);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      clearTimeout(t);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, [visible, gap, productsLen]);

  // responsive visible count
  useEffect(() => {
    function updateVisible() {
      const w = window.innerWidth;
      const v = w >= 1024 ? 3 : w >= 768 ? 2 : 1;
      setVisible(v);
    }
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // reset to middle when visible changes to keep duplication safe
  useEffect(() => {
    setIndex(productsLen);
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }, 0);
    }
  }, [visible, productsLen]);

  // compute transform in px. when visible===1, center the single slide
  const computeTransformPx = (i = index) => {
    const w = slidePx.width;
    const g = slidePx.gapPx;
    const containerW = slidePx.containerWidth || (containerRef.current ? containerRef.current.clientWidth : 0);

    if (!w) return `translateX(0px)`;
    const stepPx = w + g;
    let x = -(i * stepPx);

    if (visible === 1 && containerW && w) {
      const centerOffset = Math.round((containerW - w) / 2);
      x += centerOffset;
    }

    return `translateX(${x}px)`;
  };

  // single-slide step
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
        trackRef.current.offsetHeight; // force reflow
        trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }

      if (newIndex < minIndex) {
        const corrected = newIndex + productsLen;
        trackRef.current.style.transition = "none";
        setIndex(corrected);
        trackRef.current.style.transform = computeTransformPx(corrected);
        trackRef.current.offsetHeight; // force reflow
        trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 20);
    };

    if (trackRef.current) {
      trackRef.current.addEventListener("transitionend", onTransitionEnd, { once: true });
    } else {
      setTimeout(() => (isTransitioningRef.current = false), transitionMs + 20);
    }
  };

  const prev = () => step(-1);
  const next = () => step(+1);

  // sync transform whenever index/measurements change
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
    trackRef.current.style.transform = computeTransformPx(index);
  }, [index, slidePx.width, slidePx.gapPx, slidePx.containerWidth, visible]);

  if (!products || products.length === 0) return null;

  // logical active index for dots (0..productsLen-1)
  const logicalIndex = ((index % productsLen) + productsLen) % productsLen;

  return (
    <div
      ref={containerRef}
      className={`product-carousel relative overflow-hidden ${className}`}
      aria-roledescription="carousel"
    >
      <style>{`
        .product-carousel {
          padding: 1.25rem 1.25rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pc-viewport {
          width: 100%;
          overflow: hidden;
        }

        .pc-track {
          display:flex;
          gap: ${gap};
          align-items: stretch;
          will-change: transform;
        }

        .pc-slide {
          flex: 0 0 calc(100% / var(--visible));
          display:flex;
          justify-content:center;
        }

        .card-wrap {
          width:100%;
          max-width: ${cardMaxWidth};
        }

        .pc-arrow {
          position:absolute;
          top:50%;
          transform: translateY(-50%);
          z-index:30;
          width:44px;
          height:44px;
          border-radius:999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 12px 28px rgba(15,23,42,0.06);
          cursor:pointer;
          border: none;
          opacity: 0.65;
          transition: opacity .18s ease, transform .12s ease;
        }
        .pc-arrow:hover { opacity: 1; transform: translateY(-50%) scale(1.02); }
        .pc-arrow:active { transform: translateY(-50%) scale(0.98); }
        .pc-arrow-left { left: 8px; }
        .pc-arrow-right { right: 8px; }

        /* hide arrows on small mobile screens */
        @media (max-width: 767px) {
          .pc-arrow { display: none; }
        }

        /* dots container */
        .pc-dots { margin-top: 14px; display:flex; justify-content:center; gap:8px; align-items:center; }
        .pc-dot { width:9px; height:9px; border-radius:50%; border:none; padding:0; cursor:pointer; }
      `}</style>

      <button className="pc-arrow pc-arrow-left" onClick={prev} aria-label="Previous" title="Previous">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className="pc-arrow pc-arrow-right" onClick={next} aria-label="Next" title="Next">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 6l6 6-6 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div
        className="pc-viewport"
        style={{
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
                  image={p.image}
                  price={p.price}
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

      {/* pagination dots */}
      <div className="pc-dots" aria-hidden>
        {products.map((_, i) => {
          const active = logicalIndex === i;
          return (
            <button
              key={`dot-${i}`}
              className="pc-dot"
              onClick={() => {
                // jump to middle copy + i
                const target = productsLen + i;
                if (!trackRef.current) return;
                // ensure a smooth jump
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
  );
}
