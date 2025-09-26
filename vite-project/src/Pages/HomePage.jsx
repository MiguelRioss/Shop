// Pages/HomePage.jsx
import Hero from "../components/Hero";
import ProductShowcase from "../components/ProductShowcase";
import PromoBanner from "../components/PromoBanner";
import PromoHeading from "../components/PromoHeading";
import BubblesHeroSection from "../components/BubblesHeroSection";
import HeroWithVideo from "../components/HeroWithVideo";
import ThreeFloatHeadersHero from "../components/ThreeFloatHeadersHero";
import TestimonialsCarousselHero from "../components/TestimonialsCarousselHero";
import PressCarousel from "../components/PressCarousel";
import FAQ from "../components/FAQ";
import ProductCarousel from "../components/ProductsCarrousell/ProductsCarousel";

function HomePage({
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
  return (
    <div className="NavBar">
      <Hero {...hero} />
      <div className="max-w-7xl p-2 mx-auto">
        {/* ProductCarousel WILL fill this container width */}
        <ProductCarousel products={productShowcase.products} />
      </div>
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
