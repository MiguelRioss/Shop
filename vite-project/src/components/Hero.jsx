import React from "react";
import bgHero from "/backgroundIbogenics.jpg";
import productPng from "/handsTA.png";

export default function Hero() {
  return (
    <section
      className="relative bg-[#f2f7fc] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative mx-auto max-w-7xl px-8 py-30 lg:py-44">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:pr-56">
          {/* TEXT COLUMN */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Stress relief has never <br /> been easier
            </h1>
            <p className="max-w-xl text-lg text-gray-700 mx-auto lg:mx-0">
              Sensate is a sensory device that uses vibrations and sound to
              destress your nervous system, in just 10 minutes.
            </p>
            <div>
              <a
                href="#get"
                className="inline-flex items-center rounded-full px-6 py-3 text-white font-medium text-lg hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(to right, var(--brand-from), var(--brand-to))",
                }}
              >
                Get Sensate
              </a>
            </div>

            {/* MOBILE IMAGE — inline under text */}
            <div className="mt-8 lg:hidden overflow-visible">
              <img
                src={productPng}
                alt="Product"
                className="
                  ml-auto
                  w-[78vw]
                  sm:w-[65vw] md:w-[58vw]
                  max-w-none
                  object-contain
                  mr-[-10vw]
                  sm:mr-[-12vw] md:mr-[-14vw]
                "
              />
            </div>
          </div>

          {/* Empty right column (desktop spacing) */}
          <div />
        </div>
      </div>

      {/* DESKTOP IMAGE — absolute to right edge */}
      <div className="pointer-events-none absolute bottom-6 right-0 hidden lg:block z-10">
        <img
          src={productPng}
          alt="Product"
          className="h-[92vh] max-h-[1060px] object-contain mr-[-24px]"
        />
      </div>
    </section>
  );
}
