// src/components/Hero.jsx
import Button from "./UtilsComponent/Button";
import { useLocation, useNavigate } from "react-router-dom";
import runCta from "./ProductsCarrousell/utils/ctaRunner.mjs";
const defaultSectionClass =
  "relative bg-[#f2f7fc] bg-cover bg-center overflow-hidden";
const defaultContainerClass =
  "relative mx-auto max-w-7xl px-8 py-30 lg:py-44";
const defaultGridClass =
  "grid items-center gap-10 lg:grid-cols-2 lg:pr-56";
const defaultTextColClass = "space-y-10 text-center lg:text-left";
const defaultHeadingClass =
  "text-4xl font-bold leading-tight text-gray-900 sm:text-5xl";
const defaultSubheadingClass = "max-w-xl text-lg text-gray-700 mx-auto lg:mx-0";
const defaultMobileImgWrapClass = "mt-10 lg:hidden overflow-visible";
const defaultMobileImgClass =
  "ml-auto w-[78vw] sm:w-[65vw] md:w-[58vw] max-w-none object-contain mr-[-10vw] sm:mr-[-12vw] md:mr-[-14vw]";
const defaultDesktopImgWrapClass =
  "pointer-events-none absolute bottom-6 right-0 hidden lg:block z-10";
const defaultDesktopImgClass = "h-170 object-contain";

export default function Hero({
  bgImage = "",
  overlay, // { show: boolean, color: string }
  heading = "",
  subheading = "",
  cta = [], // [{ show, label, href }, { show, label, href }...]
  productImage = "",
  sectionClass = defaultSectionClass,
  containerClass = defaultContainerClass,
  gridClass = defaultGridClass,
  textColClass = defaultTextColClass,
  headingClass = defaultHeadingClass,
  subheadingClass = defaultSubheadingClass,
  mobileImgWrapClass = defaultMobileImgWrapClass,
  mobileImgClass = defaultMobileImgClass,
  desktopImgWrapClass = defaultDesktopImgWrapClass,
  desktopImgClass = defaultDesktopImgClass,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <section
      className={sectionClass}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {overlay?.show && (
        <div
          className="absolute inset-0"
          style={{ background: overlay.color }}
        />
      )}

      <div className={containerClass}>
        <div className={gridClass}>
          <div className={textColClass}>
            <h1 className={headingClass}>{heading}</h1>

            {subheading && <p className={subheadingClass}>{subheading}</p>}

            <div className="space-x-7">
              {cta
                .filter((x) => x?.show)
                .map((item, i) => (
                  <Button
                    key={item.label || i}
                    disabled={item.disabled}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        return;
                      }
                      runCta(e, item, navigate, location);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
            </div>

            {productImage && (
              <div className={mobileImgWrapClass}>
                <img
                  src={productImage}
                  alt="Product"
                  className={mobileImgClass}
                />
              </div>
            )}
          </div>
          <div />
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
