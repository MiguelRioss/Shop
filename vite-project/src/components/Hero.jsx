import React from "react";

export default function Hero() {
  return (
    <section
      className="relative bg-[#f2f7fc] bg-cover bg-center"
      style={{
        backgroundImage: "url('../../public/backgroundHero.jpg')",
      }}
    >
      {/* optional overlay to make text more readable */}
      <div className="absolute inset-0 bg-white/70"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left side: text */}
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
                className="inline-flex items-center rounded-full bg-[#f5653b] px-6 py-3 text-white font-medium text-lg hover:opacity-90 transition-opacity"
              >
                Get Sensate
              </a>
            </div>
          </div>

          {/* Right side: image */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-sm lg:ml-12">
              <div className=" w-full rounded-xl  overflow-hidden">
                <img
                  src="../../public/product.png"
                  alt="Placeholder"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
