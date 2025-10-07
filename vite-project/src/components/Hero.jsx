// src/components/Hero.jsx
import Button from "./UtilsComponent/Button";
import { useLocation, useNavigate } from "react-router-dom";
import runCta from "./ProductsCarrousell/utils/ctaRunner.mjs";
export default function Hero({
  bgImage,
  overlay, // { show: boolean, color: string }
  heading,
  subheading,
  cta, // [{ show, label, href }, { show, label, href }...]
  productImage,
  sectionClass,
  containerClass,
  gridClass,
  textColClass,
  headingClass,
  subheadingClass,
  mobileImgWrapClass,
  mobileImgClass,
  desktopImgWrapClass,
  desktopImgClass,
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
                    onClick={(e) =>
                      runCta(e, item, navigate, location)
                    }
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
