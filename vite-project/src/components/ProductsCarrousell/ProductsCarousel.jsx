// src/components/ProductCarousel.jsx
import React, { useRef, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import Arrow from "../UtilsComponent/Arrows.jsx";
import Button from "../UtilsComponent/Button.jsx";

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
  gap = "0.12rem", // gap between slides
  className = "",
}) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const transitionMs = 420;

  const productsLen = products.length;
  const slides = productsLen > 0 ? [...products, ...products] : [];
  const slidesLen = slides.length;

  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(productsLen || 0);
  const isTransitioningRef = useRef(false);

  // measurements (set by hooks)
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

  const { prev, next } = useCarouselStepper({
    trackRef,
    slidesLen,
    productsLen,
    visible,
    index,
    setIndex,
    transitionMs,
    isTransitioningRef,
    measure,
  });

  if (!productsLen) return null;

  const logicalIndex = ((index % productsLen) + productsLen) % productsLen;

  /* -------------------- SWIPE (mobile) -------------------- */
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    dx: 0,
    lockedAxis: null, // "x" | "y"
    timeStart: 0,
  });

  function getCurrentTranslateX() {
    const el = trackRef.current;
    if (!el) return 0;
    // Try inline transform first
    const inline = el.style.transform;
    if (inline) {
      const m = inline.match(/translateX\((-?\d+(\.\d+)?)px\)/);
      if (m) return parseFloat(m[1]);
    }
    // Fallback: parse from computeTransformPx(index)
    const t = computeTransformPx(index);
    const n = t && t.match(/-?\d+(\.\d+)?/);
    return n ? parseFloat(n[0]) : 0;
  }

  const onTouchStart = (e) => {
    if (isTransitioningRef.current || !trackRef.current) return;
    const t = e.touches[0];
    const st = dragRef.current;
    st.active = true;
    st.startX = t.clientX;
    st.startY = t.clientY;
    st.dx = 0;
    st.lockedAxis = null;
    st.timeStart = performance.now();
    st.baseX = getCurrentTranslateX();
    // freeze transition while dragging
    trackRef.current.style.transition = "none";
  };

  const onTouchMove = (e) => {
    const st = dragRef.current;
    if (isTransitioningRef.current || !st.active || !trackRef.current) return;

    const t = e.touches[0];
    const dx = t.clientX - st.startX;
    const dy = t.clientY - st.startY;

    // lock axis after small move so vertical-page scroll still works
    if (!st.lockedAxis) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        st.lockedAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (st.lockedAxis === "y") return; // let the page scroll

    st.dx = dx;
    trackRef.current.style.transform = `translateX(${st.baseX + dx}px)`;
  };

  const restoreToIndex = () => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
    trackRef.current.style.transform = computeTransformPx(index);
  };

  const onTouchEnd = () => {
    const st = dragRef.current;
    if (!st.active || !trackRef.current) return;

    const distance = st.dx;
    const dt = Math.max(1, performance.now() - st.timeStart); // ms
    const vx = distance / dt; // px/ms

    const distanceHit = Math.abs(distance) > Math.max(40, (measure.slideWidth || 0) * 0.15);
    const velocityHit = Math.abs(vx) > 0.5; // tweak 0.35–0.6 to taste

    trackRef.current.style.transition = `transform ${transitionMs}ms ease`;

    if (distanceHit || velocityHit) {
      distance > 0 ? prev() : next();
    } else {
      restoreToIndex();
    }

    // reset state
    st.active = false;
    st.dx = 0;
    st.lockedAxis = null;
  };

  const onTouchCancel = () => {
    // treat like end but always snap back safely
    dragRef.current.active = false;
    dragRef.current.dx = 0;
    dragRef.current.lockedAxis = null;
    restoreToIndex();
  };
  /* -------------------------------------------------------- */

  return (
    <div  className="max-w-7xl p-2 mx-auto">
      <div ref={outerRef} className={`pc-outer w-full ${className || ""}`}>
        <div
          className="product-carousel relative overflow-hidden p-0"
          aria-roledescription="carousel"
          style={{
            "--gap": gap,
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
            .pc-slide .product-card-root { width: calc(100% - 0.5rem); max-width: none; box-sizing: border-box; }
          `}</style>

          {/* Desktop arrows (perfectly centered) */}
          <Arrow
            dir="prev"
            onClick={prev}
            variant="desktop"
            posClass="absolute left-6 top-1/2 -translate-y-1/2 z-30"
          />
          <Arrow
            dir="next"
            onClick={next}
            variant="desktop"
            posClass="absolute right-2 top-1/2 -translate-y-1/2 z-30"
          />

          {/* Mobile arrows */}
          <Arrow
            dir="prev"
            onClick={prev}
            variant="mobile"
            posClass="absolute left-3 top-1/2 -translate-y-1/2 z-30"
          />
          <Arrow
            dir="next"
            onClick={next}
            variant="mobile"
            posClass="absolute right-3 top-1/2 -translate-y-1/2 z-30"
          />

          <div
            className="pc-viewport touch-pan-y select-none"
            style={{ "--visible": visible }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
          >
            <div
              ref={trackRef}
              className="pc-track"
              style={{ transform: computeTransformPx(index) }}
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
        </div>
      </div>
    </div>
  );
}
