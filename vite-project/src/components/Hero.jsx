// src/components/Hero.jsx
import React from "react";

export default function Hero({
  bgImage,
  overlay,          // { show: boolean, color: string }
  heading,
  subheading,
  cta,               // { show, label, href }
  productImage,

  // 👇 layout slots (all strings of Tailwind classes)
  sectionClass,          // e.g. "relative bg-cover bg-center overflow-hidden"
  containerClass,        // e.g. "relative mx-auto max-w-7xl px-6 py-20 lg:py-40"
  gridClass,             // e.g. "grid items-center gap-10 lg:grid-cols-2 lg:pr-56"
  textColClass,          // e.g. "space-y-6 text-center lg:text-left"
  headingClass,          // e.g. "text-4xl sm:text-5xl font-bold leading-tight text-gray-900"
  subheadingClass,       // e.g. "max-w-xl text-lg text-gray-700 mx-auto lg:mx-0"
  ctaClass,              // e.g. "inline-flex items-center rounded-full px-6 py-3 text-white font-medium text-lg hover:opacity-90 transition-opacity"
  mobileImgWrapClass,    // e.g. "mt-8 lg:hidden overflow-visible"
  mobileImgClass,        // e.g. "ml-auto w-[78vw] sm:w-[65vw] md:w-[58vw] max-w-none object-contain mr-[-10vw] sm:mr-[-12vw] md:mr-[-14vw]"
  desktopImgWrapClass,   // e.g. "pointer-events-none absolute bottom-6 right-0 hidden lg:block z-10"
  desktopImgClass        // e.g. "h-[92vh] max-h-[1060px] object-contain mr-[-24px]"
}) {
  const handleCtaClick = (e) => {
    const href = (typeof cta?.href === 'string') ? cta.href : '';
    if (!href) return;
    const isHash = href.startsWith('#') || href.startsWith('/#');
    if (isHash) {
      e.preventDefault();
      const id = href.replace('/#', '').replace('#', '');
      const el = document.getElementById(id);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = id;
      }
    }
  };
  return (
    <section
      className={sectionClass}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {overlay?.show && (
        <div className="absolute inset-0" style={{ background: overlay.color }} />
      )}

      <div className={containerClass}>
        <div className={gridClass}>
          <div className={textColClass}>
            <h1 className={headingClass}>{heading}</h1>

            {subheading && (
              <p className={subheadingClass}>{subheading}</p>
            )}

            {cta?.show && (
              <div>
                <a
                  href={cta.href}
                  onClick={handleCtaClick}
                  className={ctaClass}
                  style={{ background: "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
                >
                  {cta.label}
                </a>
              </div>
            )}

            {productImage && (
              <div className={mobileImgWrapClass}>
                <img src={productImage} alt="Product" className={mobileImgClass} />
              </div>
            )}
          </div>

          <div /> {/* spacer col */}
        </div>
      </div>

      {productImage && (
        <div className={desktopImgWrapClass}>
          <img src={productImage} alt="Product" className={desktopImgClass} />
        </div>
      )}
    </section>
  );
}
