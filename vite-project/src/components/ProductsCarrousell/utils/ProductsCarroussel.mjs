// ProductsCarroussel.utils.js
import { useEffect, useCallback } from "react";

/**
 * Compute translateX in px that centers the current visible group.
 * @param {Object} params
 * @param {{slideWidth:number, gapPx:number, containerWidth:number}} params.measure - Current measurements.
 * @param {number} params.visible - How many slides are visible at once.
 * @param {number} params.index - Current slide index on the (duplicated) track.
 * @returns {string} CSS translateX() string like `translateX(-123px)`.
 */
export function computeTransformPx({ measure, visible, index }) {
  const { slideWidth, gapPx, containerWidth } = measure || {};
  if (!slideWidth || !containerWidth) return `translateX(0px)`;

  const stepPx = slideWidth + (gapPx || 0);
  let x = -(index * stepPx);

  // center the visible group (works for visible = 1,2,3,...)
  const groupWidth = visible * slideWidth + Math.max(0, visible - 1) * (gapPx || 0);
  const centerOffset = Math.round((containerWidth - groupWidth) / 2);
  x += centerOffset;

  return `translateX(${x}px)`;
}

/**
 * Measure container + slide widths based on current visibility and track gap.
 * Expects refs: outerRef (container) and trackRef (the flex track with gap).
 * @param {Object} params
 * @param {{current:HTMLElement|null}} params.outerRef - Ref to the outer container element.
 * @param {{current:HTMLElement|null}} params.trackRef - Ref to the inner track (flex with gap).
 * @param {number} params.visible - How many slides are visible at once.
 * @param {number} params.productsLen - Number of unique products (not duplicated).
 * @param {(m:{containerWidth:number,gapPx:number,slideWidth:number})=>void} params.setMeasure - Setter for measurement state.
 */
export function useMeasureCarousel({ outerRef, trackRef, visible, productsLen, setMeasure }) {
  useEffect(() => {
    function measureNow() {
      if (!outerRef?.current || !trackRef?.current) return;
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
  }, [visible, productsLen, outerRef, trackRef, setMeasure]);
}

/**
 * Keep `visible` in sync with window width.
 * Defaults: desktop>=1024 → 3, tablet>=768 → 2, else → 1.
 * @param {Object} params
 * @param {(n:number)=>void} params.setVisible - Setter for visible count.
 * @param {number} [params.desktopMin=1024] - Min width for desktop.
 * @param {number} [params.tabletMin=768] - Min width for tablet.
 * @param {number} [params.desktopCount=3] - Visible count on desktop.
 * @param {number} [params.tabletCount=2] - Visible count on tablet.
 * @param {number} [params.mobileCount=1] - Visible count on mobile.
 */
export function useResponsiveVisible({
  setVisible,
  desktopMin = 1024,
  tabletMin = 768,
  desktopCount = 3,
  tabletCount = 2,
  mobileCount = 1,
}) {
  useEffect(() => {
    function updateVisible() {
      const w = window.innerWidth;
      const v = w >= desktopMin ? desktopCount : w >= tabletMin ? tabletCount : mobileCount;
      setVisible(v);
    }
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, [setVisible, desktopMin, tabletMin, desktopCount, tabletCount, mobileCount]);
}

/**
 * Reset index to the middle (for duplicated items loop) when grid changes.
 * Temporarily disables transition to avoid visible jump.
 * @param {Object} params
 * @param {{current:HTMLElement|null}} params.trackRef - Track element ref.
 * @param {number} params.visible - Visible count.
 * @param {number} params.productsLen - Number of unique products (used as middle index).
 * @param {(n:number)=>void} params.setIndex - Setter for current index.
 * @param {number} [params.transitionMs=300] - Transition duration in ms.
 */
export function useResetIndexOnChange({
  trackRef,
  visible,
  productsLen,
  setIndex,
  transitionMs = 300,
}) {
  useEffect(() => {
    setIndex(productsLen); // middle (assuming items duplicated left/right)
    const el = trackRef?.current;
    if (!el) return;

    const prevTransition = el.style.transition;
    el.style.transition = "none";

    const id = setTimeout(() => {
      if (trackRef?.current) {
        trackRef.current.style.transition = `transform ${transitionMs}ms ease`;
      }
    }, 0);

    return () => {
      clearTimeout(id);
      if (el) el.style.transition = prevTransition;
    };
  }, [visible, productsLen, setIndex, trackRef, transitionMs]);
}

/**
 * Apply transform whenever index or measurements change.
 * @param {Object} params
 * @param {{current:HTMLElement|null}} params.trackRef - Track element ref.
 * @param {number} params.index - Current index on the (duplicated) track.
 * @param {{slideWidth:number, gapPx:number, containerWidth:number}} params.measure - Current measurements.
 * @param {number} params.visible - Visible count.
 * @param {number} [params.transitionMs=300] - Transition duration in ms.
 */
export function useApplyTransform({ trackRef, index, measure, visible, transitionMs = 300 }) {
  useEffect(() => {
    const el = trackRef?.current;
    if (!el) return;
    el.style.transition = `transform ${transitionMs}ms ease`;
    el.style.transform = computeTransformPx({ measure, visible, index });
  }, [
    trackRef,
    index,
    visible,
    transitionMs,
    measure?.slideWidth,
    measure?.gapPx,
    measure?.containerWidth,
  ]);
}

/**
 * Create step/prev/next handlers (1-by-1) with infinite-loop correction.
 * @param {Object} params
 * @param {{current:HTMLElement|null}} params.trackRef - Track element ref.
 * @param {number} params.slidesLen - Total number of slides on the track (after duplication).
 * @param {number} params.productsLen - Number of unique products (used for wrap correction).
 * @param {number} params.visible - Visible count.
 * @param {number} params.index - Current index.
 * @param {(n:number)=>void} params.setIndex - Setter for current index.
 * @param {number} [params.transitionMs=300] - Transition duration in ms.
 * @param {{current:boolean}} params.isTransitioningRef - Mutable ref flag to gate re-entries.
 * @param {{slideWidth:number, gapPx:number, containerWidth:number}} params.measure - Current measurements.
 * @returns {{ step: (n:number)=>void, prev: ()=>void, next: ()=>void }}
 */
export function useCarouselStepper({
  trackRef,
  slidesLen,
  productsLen,
  visible,
  index,
  setIndex,
  transitionMs = 300,
  isTransitioningRef,
  measure,
}) {
  const step = useCallback(
    (n) => {
      if (!productsLen) return;
      if (isTransitioningRef?.current) return;
      isTransitioningRef.current = true;

      const newIndex = index + n;
      setIndex(newIndex);

      const maxIndex = slidesLen - visible;
      const minIndex = 0;

      const onTransitionEnd = () => {
        const el = trackRef?.current;
        if (!el) return;

        el.removeEventListener("transitionend", onTransitionEnd);

        if (newIndex > maxIndex) {
          const corrected = newIndex - productsLen;
          el.style.transition = "none";
          setIndex(corrected);
          el.style.transform = computeTransformPx({ measure, visible, index: corrected });
          // force reflow
          el.offsetHeight; // eslint-disable-line no-unused-expressions
          el.style.transition = `transform ${transitionMs}ms ease`;
        }

        if (newIndex < minIndex) {
          const corrected = newIndex + productsLen;
          el.style.transition = "none";
          setIndex(corrected);
          el.style.transform = computeTransformPx({ measure, visible, index: corrected });
          // force reflow
          el.offsetHeight; // eslint-disable-line no-unused-expressions
          el.style.transition = `transform ${transitionMs}ms ease`;
        }

        setTimeout(() => {
          if (isTransitioningRef) isTransitioningRef.current = false;
        }, 20);
      };

      const el = trackRef?.current;
      if (el) {
        el.addEventListener("transitionend", onTransitionEnd, { once: true });
      } else {
        // Fallback: clear lock even if there's no track yet
        setTimeout(() => {
          if (isTransitioningRef) isTransitioningRef.current = false;
        }, transitionMs + 20);
      }
    },
    [
      index,
      productsLen,
      slidesLen,
      visible,
      trackRef,
      setIndex,
      transitionMs,
      isTransitioningRef,
      measure,
    ]
  );

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(+1), [step]);

  return { step, prev, next };
}
