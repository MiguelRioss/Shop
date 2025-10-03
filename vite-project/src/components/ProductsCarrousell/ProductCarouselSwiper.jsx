import React from "react";
import ProductCard from "./ProductCard.jsx";
import Arrow from "../UtilsComponent/Arrows.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Keyboard } from "swiper/modules";

export default function ProductCarouselSwiper({
  products = [],
  space = 12, // px between slides
  className = "",
}) {
  const swiperRef = React.useRef(null);
  if (!products?.length) return null;

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 pb-10 relative ${className}`}>
      <style>{`
        /* Make slides center their content and let the card fill */
        .swiper { overflow: hidden; }
        .swiper-slide { display: flex; justify-content: center; box-sizing: border-box; }
        .swiper-slide .product-card-root { width: 100% !important; max-width: none !important; box-sizing: border-box; }
      `}</style>
      <style>{`
        .swiper { padding-bottom: 28px; }
        .swiper-pagination { bottom: 4px !important; }
        @media (min-width: 1024px) { .swiper-pagination { bottom: 8px !important; } }
      `}</style>

      {/* Custom Arrows (desktop + mobile) */}
      <Arrow dir="prev" variant="desktop" posClass="absolute top-1/2 -translate-y-1/2 left-2 lg:left-0 lg:-translate-x-full lg:-ml-3 z-20" onClick={() => swiperRef.current?.slidePrev()} />
      <Arrow dir="next" variant="desktop" posClass="absolute top-1/2 -translate-y-1/2 right-2 lg:right-0 lg:translate-x-full lg:ml-3 z-20" onClick={() => swiperRef.current?.slideNext()} />
      <Arrow dir="prev" variant="mobile" posClass="absolute top-1/2 -translate-y-1/2 left-2 z-20" onClick={() => swiperRef.current?.slidePrev()} />
      <Arrow dir="next" variant="mobile" posClass="absolute top-1/2 -translate-y-1/2 right-2 z-20" onClick={() => swiperRef.current?.slideNext()} />

      <Swiper
        modules={[Pagination, A11y, Keyboard]}
        spaceBetween={space}
        slidesPerView={1}
        breakpoints={{
          640:  { slidesPerView: 2, spaceBetween: space },
          1024: { slidesPerView: 3, spaceBetween: space },
        }}
        loop
        speed={420}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        watchOverflow
        observer
        observeParents
        onSwiper={(sw) => (swiperRef.current = sw)}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard
              id={p.id}
              image={p.image}
              price={p.priceInEuros ?? p.price}
              title={p.title}
              description={p.description}
              fewTag={p.fewTag}
              soldOut={p.soldOut}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}







