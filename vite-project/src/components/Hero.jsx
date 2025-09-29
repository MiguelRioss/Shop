// src/components/Hero.jsx
import Button from "./UtilsComponent/Button";
import { goToProducts } from "./ProductsCarrousell/utils/ScrollToCarroussel";
import { useLocation, useNavigate } from "react-router-dom";

export default function Hero({
  bgImage,
  overlay, // { show: boolean, color: string }
  heading,
  subheading,
  cta, // { show, label, href }
  productImage,
  sectionClass,
  containerClass,
  gridClass,
  textColClass,
  headingClass,
  subheadingClass,
  ctaClass,
  mobileImgWrapClass,
  mobileImgClass,
  desktopImgWrapClass,
  desktopImgClass,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <section className={sectionClass} style={{ backgroundImage: `url(${bgImage})` }}>
      {overlay?.show && (
        <div className="absolute inset-0" style={{ background: overlay.color }} />
      )}

      <div className={containerClass}>
        <div className={gridClass}>
          <div className={textColClass}>
            <h1 className={headingClass}>{heading}</h1>

            {subheading && <p className={subheadingClass}>{subheading}</p>}

            {cta?.show && (
              <div>
                <Button
                  className={ctaClass}
                  style={{ background: "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
                  onClick={() => {
                    goToProducts(navigate, location);
                  }}
                >
                  {cta.label}
                </Button>
              </div>
            )}

            {productImage && (
              <div className={mobileImgWrapClass}>
                <img src={productImage} alt="Product" className={mobileImgClass} />
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
