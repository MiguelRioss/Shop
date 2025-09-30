// Pages/HomePage.jsx
import Hero from "../components/Hero";
import ProductShowcase from "../components/ProductShowcase";
import PromoBanner from "../components/PromoBanner";
import PromoHeading from "./PromoHeading.jsx";
import BubblesHeroSection from "../components/BubblesHeroSection";
import HeroWithVideo from "../components/HeroWithVideo";
import ThreeFloatHeadersHero from "../components/ThreeFloatHeadersHero";
import TestimonialsCarousselHero from "../components/TestimonialsCarousselHero";
import PressCarousel from "../components/PressCarousel";
import FAQ from "../components/FAQ";
import ProductCarouselSwiper from "../components/ProductsCarrousell/ProductCarouselSwiper.jsx";
import ProductsGrid from "../components/ProductsCarrousell/ProductsGrid";
import { useLocation, useNavigate } from "react-router-dom";
import {
  scrollToTarget,
  headerOffset,
} from "../components/ProductsCarrousell/utils/ScrollToCarroussel.js";
import { useEffect, useState } from "react";
import { AnnouncementHero } from "../components/AnnoncementHero.jsx";
import ProductViewSwitcher from "../components/ProductViewSwitcher.jsx";
function HomePage({
  announcement,
  hero,
  productShowcase,
  promoBanner,
  HowItWorks,
  heroWithVideo,
  threeFloatHero,
  caroussel,
  pressCarousel,
  faq,
}) {
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const key = location.state?.scrollTo;
    if (!key) return;

    const selector = `[data-scroll="${key}"]`;
    // run after paint so layout/height is correct
    requestAnimationFrame(() => {
      scrollToTarget(selector, headerOffset());
    });

    // clear state so subsequent clicks always work
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);
  return (
    <div>
      <AnnouncementHero announcement={announcement} />
      <Hero {...hero} />
      {/* ProductCarousel WILL fill this container width */}
      <section
        data-scroll="products"
        className="scroll-mt-32 md:scroll-mt-40 lg:scroll-mt-48"
      >
        <ProductViewSwitcher
          products={productShowcase.products}
          Grid={ProductsGrid}
          Carousel={ProductCarouselSwiper}
          initial="scroll"
          onViewChange={(mode) => console.log("view:", mode)}
        />
      </section>
      <PromoHeading
        heading={promoBanner.heading}
        intro={promoBanner.intro}
        imageSrc={promoBanner.imageText}
        imageAlt={promoBanner.imageTextAlt}
        imageClass={promoBanner.imageTextClass}
      />
      <PromoBanner {...promoBanner} />
      <BubblesHeroSection {...HowItWorks} />
      <HeroWithVideo {...heroWithVideo} />
      <ThreeFloatHeadersHero {...threeFloatHero} />
      <TestimonialsCarousselHero {...caroussel} />
      <PressCarousel {...pressCarousel} />
      <FAQ {...faq} />
    </div>
  );
}

export default HomePage;

