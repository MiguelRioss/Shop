// Pages/HomePage.jsx
import Hero from "../components/Hero";
import ProductShowcase from "../components/ProductShowcase";
import PromoBanner from "../components/PromoBanner";
import PromoHeading from "../components/PromoHeading";
import BubblesHeroSection from "../components/BubblesHeroSection";
import HeroWithVideo from "../components/HeroWithVideo";
import ThreeFloatHeadersHero from "../components/ThreeFloatHeadersHero";
import CarouselsHero from "../components/CarousselHero";
import PressCarousel from "../components/PressCarousel";
import FAQ from "../components/FAQ";
import ProductCarousel from "../components/ProductsCarousel";

function HomePage({ hero, productShowcase , promoBanner, HowItWorks, heroWithVideo, threeFloatHero,caroussel,pressCarousel,faq}) {
  return (
    <div className="NavBar">
      <Hero {...hero} />
      <ProductCarousel products={productShowcase.products} onBuy={() => {}}/>
      <ProductShowcase
        products={productShowcase.products}
        usageDefault={productShowcase.usageDefault}
        warningsDefault={productShowcase.warningsDefault}
      />
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
      <CarouselsHero {...caroussel} />
      <PressCarousel {...pressCarousel} />
      <FAQ {...faq}/>
    </div>
  );
}

export default HomePage;
