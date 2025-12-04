// Pages/HomePage.jsx
import Hero from "../../components/Hero.jsx";
import PromoBanner from "../../components/PromoBanner.jsx";
import PromoHeading from "../PromoHeading.jsx";
import BubblesHeroSection from "../../components/BubblesHeroSection.jsx";

import HeroWithVideo from "../../components/HeroWithVideo.jsx";

import ThreeFloatHeadersHero from "../../components/ThreeFloatHeadersHero.jsx";

import TestimonialsCarousselHero from "../../components/TestimonialsCarousselHero.jsx";
import PressCarousel from "../../components/PressCarousel.jsx";
import FAQ from "../../components/FAQ.jsx";

import ProductCarouselSwiper from "../../components/ProductsCarrousell/ProductCarouselSwiper.jsx";
import ProductsGrid from "../../components/ProductsCarrousell/ProductsGrid.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import {
  scrollToTarget,
  headerOffset,
} from "../../components/ProductsCarrousell/utils/ScrollToCarroussel.js";


import { useEffect } from "react";

import { AnnouncementHero } from "../../components/AnnoncementHero.jsx";
import ProductViewSwitcher from "../../components/ProductViewSwitcher.jsx";
import HomePageSEO from "./HomePageSEO.jsx";

const defaultPromoBanner = {
  heading: "",
  intro: "",
  imageText: "",
  imageTextAlt: "",
  imageTextClass: "",
};

const defaultHowItWorks = {
  heading: "",
  steps: [],
};

const defaultHeroWithVideo = {};
const defaultThreeFloatHero = {};
const defaultCaroussel = {};
const defaultPressCarousel = {};
const defaultFaq = { items: [] };

function HomePage({
  announcement = {},
  hero = {},
  products = [],
  promoBanner = defaultPromoBanner,
  HowItWorks = defaultHowItWorks,
  heroWithVideo = defaultHeroWithVideo,
  threeFloatHero = defaultThreeFloatHero,
  caroussel = defaultCaroussel,
  pressCarousel = defaultPressCarousel,
  faq = defaultFaq,
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
       <HomePageSEO />
      <AnnouncementHero announcement={announcement} />
      <Hero {...hero} />
      {/* ProductCarousel WILL fill this container width */}
      <section
        data-scroll="products"
        className="scroll-mt-32 md:scroll-mt-40 lg:scroll-mt-48"
      >
        <ProductViewSwitcher
          products={products}
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

