import React from "react";
import productPng from '/product.png'; // adjust path

/**
 * Promo banner: product image is in its own container, overlapping the banner.
 * - Mobile: image centered above text
 * - Tablet/Desktop: image left, text right
 * (Image is positioned relative to the inner container to avoid tablet misalignment.)
 */
export default function PromoBanner() {
  return (
    <section className="bg-[#f5653b] text-white">
      {/* Orange banner (now relative so the absolute image anchors here) */}
      <div className="relative mx-auto max-w-5xl px-4 py-16">
        {/* Separate image container positioned on top, but now INSIDE the wrapper */}
        <div
          className="
            absolute
            left-1/2 top-0 -translate-x-1/2 -translate-y-20
            sm:left-10 sm:translate-x-0 sm:-translate-y-6
          "
        >
          <img
            src={productPng}
            alt="Sensate Device"
            className="h-40 w-auto sm:h-80 drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-12 sm:justify-center">
          {/* Spacer reserves room for the absolute image on tablet/desktop */}
          <div className="hidden sm:block w-40 md:w-48" />

          {/* Text */}
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Try Sensate free for 90 days!
            </h2>
            <p className="mt-3 text-base leading-relaxed">
              Discover being stress-free with no commitment. Experience the
              effects of Sensate, or return it hassle-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
