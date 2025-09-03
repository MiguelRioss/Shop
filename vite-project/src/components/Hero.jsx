import React from "react";
import bgHero from "/backgroundHero.jpg";
import productPng from "/hand_Dropping.png";

export default function Hero() {
  return (
    <section
      className="relative bg-[#f2f7fc] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative mx-auto max-w-7xl px-8 py-30 lg:py-44">
        {/* TEXT COLUMN (give it extra right padding on desktop so it doesn't hit the image) */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:pr-56">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Stress relief has never <br /> been easier
            </h1>
            <p className="max-w-xl text-lg text-gray-700 mx-auto lg:mx-0">
              Sensate is a sensory device that uses vibrations and sound to destress
              your nervous system, in just 10 minutes.
            </p>
            <div>
              <a
                href="#get"
                className="inline-flex items-center rounded-full bg-[#f5653b] px-6 py-3 text-white font-medium text-lg hover:opacity-90 transition-opacity"
              >
                Get Sensate
              </a>
            </div>
          </div>
          {/* (we leave the second grid column empty; image is absolutely positioned) */}
          <div />
        </div>
      </div>

      {/* ABSOLUTE PRODUCT IMAGE — touches the right margin */}
      <div className="pointer-events-none absolute bottom-6 right-0 hidden lg:block z-10">
        <img
          src={productPng}
          alt="Product"
          className="h-[102vh] max-h-[1060px] object-contain mr-[-24px]" /* tweak mr for tighter edge */
        />
      </div>
    </section>
  );
}
