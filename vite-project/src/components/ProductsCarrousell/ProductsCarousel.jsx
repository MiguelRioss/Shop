    import React, { useRef, useState, useEffect } from "react";
    import ProductCard from "./ProductCard";

    /**
     * ProductCarousel
     *
     * Props:
     *  - products: array of product objects { id, image, price, title, description }
     *  - onBuy: function(product)
     *  - showDots: boolean (show pagination dots on mobile)
     *  - arrowStepCount: number (optional) how many items to advance when clicking arrow
     *
     * NOTE: does NOT import any default product image (uses p.image).
     */
    export function ProductCarousel({
    products = [],
    onBuy = () => {},
    showDots = true,
    arrowStepCount = 1,
    }) {
    const containerRef = useRef(null);
    const [active, setActive] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    // store a measured px step if you want to use pixel-based scrolling (not required here)
    const stepRef = useRef(0);

    // ---------- breakpoint detection ----------
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(min-width: 768px)");
        const update = (e) => setIsDesktop(e.matches);
        setIsDesktop(mq.matches);
        if (mq.addEventListener) mq.addEventListener("change", update);
        else mq.addListener(update);
        return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", update);
        else mq.removeListener(update);
        };
    }, []);

    // ---------- measure card spacing and set scroll-padding so first/last center ----------
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        function measure() {
        const snaps = Array.from(container.querySelectorAll(".snap-center"));
        if (!snaps.length) return;

        // accurate step between successive snap items
        const first = snaps[0];
        let step = first.offsetWidth;
        if (snaps.length > 1) {
            const second = snaps[1];
            step = Math.abs(second.offsetLeft - first.offsetLeft);
        }
        stepRef.current = Math.round(step);

        // compute scroll-padding-inline so first / last items are centered
        const pad = Math.max(0, Math.round((container.clientWidth - first.offsetWidth) / 2));
        container.style.scrollPaddingInline = `${pad}px`;

        // prefer native touch momentum
        container.style.WebkitOverflowScrolling = "touch";
        }

        const raf = requestAnimationFrame(measure);
        window.addEventListener("resize", measure);
        return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", measure);
        };
    }, [products]);

    // ---------- update active index while the user scrolls ----------
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let raf = null;
        function onScroll() {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = null;
            const snaps = Array.from(container.querySelectorAll(".snap-center"));
            if (!snaps.length) return;
            const center = container.scrollLeft + container.clientWidth / 2;
            let bestIndex = 0;
            let bestDist = Infinity;
            snaps.forEach((snap, i) => {
            const snapCenter = snap.offsetLeft + snap.offsetWidth / 2;
            const dist = Math.abs(snapCenter - center);
            if (dist < bestDist) {
                bestDist = dist;
                bestIndex = i;
            }
            });
            setActive(bestIndex);
        });
        }

        container.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // init
        return () => {
        container.removeEventListener("scroll", onScroll);
        if (raf) cancelAnimationFrame(raf);
        };
    }, [products]);

    // ---------- helpers: nearest index and programmatic center scrolling ----------
    function getNearestIndex() {
        const container = containerRef.current;
        if (!container) return 0;
        const snaps = Array.from(container.querySelectorAll(".snap-center"));
        if (!snaps.length) return 0;
        const center = container.scrollLeft + container.clientWidth / 2;
        let bestIndex = 0;
        let bestDist = Infinity;
        snaps.forEach((snap, i) => {
        const snapCenter = snap.offsetLeft + snap.offsetWidth / 2;
        const dist = Math.abs(snapCenter - center);
        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
        }
        });
        return bestIndex;
    }

    function scrollToIndex(index) {
        const container = containerRef.current;
        if (!container) return;
        const snaps = Array.from(container.querySelectorAll(".snap-center"));
        const safeIndex = Math.max(0, Math.min(index, snaps.length - 1));
        const snap = snaps[safeIndex];
        if (!snap) return;
        const targetScrollLeft = Math.round(snap.offsetLeft + snap.offsetWidth / 2 - container.clientWidth / 2);
        container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
        setActive(safeIndex);
    }

    // ---------- arrows: compute nearest index at click time, then move exactly N indexes ----------
    function prevOne() {
        const current = getNearestIndex();
        scrollToIndex(current - arrowStepCount);
    }
    function nextOne() {
        const current = getNearestIndex();
        scrollToIndex(current + arrowStepCount);
    }

    // ---------- snapping on interaction end (touch/pointer/mouse) ----------
    function handleInteractionEnd() {
        const idx = getNearestIndex();
        scrollToIndex(idx);
    }

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener("touchend", handleInteractionEnd, { passive: true });
        container.addEventListener("pointerup", handleInteractionEnd);
        container.addEventListener("mouseup", handleInteractionEnd);
        return () => {
        container.removeEventListener("touchend", handleInteractionEnd);
        container.removeEventListener("pointerup", handleInteractionEnd);
        container.removeEventListener("mouseup", handleInteractionEnd);
        };
    }, [products]);

    // dots visible only when showDots true AND not desktop
    const showDotsVisible = showDots && !isDesktop;

    return (
        <div className="w-full product-carousel relative">
        {/* Local sizing & snap CSS (keeps your previous sizing rules) */}
        <style>{`
            .product-carousel .product-card article { width: 18rem !important; } /* mobile */
            .product-carousel .product-card img { object-fit: contain !important; object-position: center top !important; height: 180px !important; }
            @media (min-width: 640px) {
            .product-carousel .product-card article { width: 20rem !important; } /* tablet */
            .product-carousel .product-card img { height: 220px !important; }
            }
            @media (min-width: 1024px) {
            .product-carousel .product-card article { width: 22.5rem !important; } /* desktop */
            .product-carousel .product-card img { height: 240px !important; }
            }
            .product-carousel .product-card article .p-6 { padding: 0.9rem !important; }

            /* reduce fling skipping when browser supports it */
            .product-carousel .snap-center { scroll-snap-stop: always; }
        `}</style>

        <div className="relative">
            {/* scrollable area */}
            <div
            ref={containerRef}
            className="flex gap-12 ml-4 overflow-x-auto snap-x snap-mandatory px-6 py-3"
            style={{ WebkitOverflowScrolling: "touch" }}
            >
            {products.map((p) => (
                <div key={p.id ?? p.title} className="snap-center">
                <div className="product-card">
                    <ProductCard
                    image={p.image}
                    price={p.priceInEuros ?? p.price}
                    title={p.title}
                    description={p.description}
                    onBuy={() => onBuy(p)}
                    />
                </div>
                </div>
            ))}
            </div>

            {/* arrows: visible on mobile & desktop */}
            <button
            onClick={prevOne}
            aria-label="prev"
            className="absolute z-20 left-3 md:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center
                        w-9 h-9 md:w-10 md:h-10 rounded-full shadow-md
                        bg-white/30 hover:bg-white/60 backdrop-blur-sm border border-white/40 text-black"
            >
            <span className="text-lg md:text-xl select-none">‹</span>
            </button>

            <button
            onClick={nextOne}
            aria-label="next"
            className="absolute z-20 right-3 md:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center
                        w-9 h-9 md:w-10 md:h-10 rounded-full shadow-md
                        bg-white/30 hover:bg-white/60 backdrop-blur-sm border border-white/40 text-black"
            >
            <span className="text-lg md:text-xl select-none">›</span>
            </button>
        </div>

        {/* dots for mobile when requested */}
        {showDotsVisible && (
            <div className="flex items-center justify-center gap-2 mt-3">
            {products.map((_, i) => (
                <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`go to ${i + 1}`}
                className={`w-2 h-2 rounded-full ${i === active ? "bg-gray-800" : "bg-gray-300"}`}
                />
            ))}
            </div>
        )}
        </div>
    );
    }
