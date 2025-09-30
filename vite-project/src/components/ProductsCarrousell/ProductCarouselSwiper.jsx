import React from "react";
import ProductCard from "./ProductCard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Keyboard } from "swiper/modules";

export default function ProductCarouselSwiper({
  products = [],
  space = 12, // px between slides
  className = "",
}) {
  if (!products?.length) return null;

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 ${className}`}>
      <style>{`
        /* Make slides center their content and let the card fill */
        .swiper { overflow: hidden; }
        .swiper-slide { display: flex; justify-content: center; box-sizing: border-box; }
        .swiper-slide .product-card-root { width: 100% !important; max-width: none !important; box-sizing: border-box; }
        /* Optional: lock height so nothing jiggles */
        /* .swiper-slide .product-card-root { height: 520px; } */

        /* Simple nav styling you can tweak */
        .swiper-button-prev, .swiper-button-next {
          width: 40px; height: 40px; border-radius: 9999px;
          background: white; box-shadow: 0 6px 18px rgba(83,98,255,.18);
          border: 1px solid rgba(83,98,255,.18);
        }
        .swiper-button-prev::after, .swiper-button-next::after {
          font-size: 16px; color: #6b6bff;
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, A11y, Keyboard]}
        spaceBetween={space}
        slidesPerView={1}
        breakpoints={{
          640:  { slidesPerView: 2, spaceBetween: space },
          1024: { slidesPerView: 3, spaceBetween: space },
        }}
        loop
        speed={420}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        watchOverflow
        observer
        observeParents
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard
              id={p.id}
              image={p.image}
              price={p.priceInEuros ?? p.price}
              title={p.title}
              description={p.description}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
