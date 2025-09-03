import { useState } from 'react'
import Hero from '../components/Hero'
import ProductShowcase from '../components/ProductShowcase'
import PromoBanner from '../components/PromoBanner'
import BubblesHeroSection from '../components/BubblesHeroSection'
import HeroWithVideo from '../components/HeroWithVideo'
import ThreeFloatHeadersHero from '../components/ThreeFloatHeadersHero'
import CarouselsHero from '../components/CarousselHero'
import PressCarousel from '../components/PressCarousel'
import FAQ from '../components/FAQ'


function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="NavBar">
      <Hero />
      <ProductShowcase  />
      <PromoBanner />
      <BubblesHeroSection />
      <HeroWithVideo/>
      <ThreeFloatHeadersHero />
      <CarouselsHero />
      <PressCarousel />
      <FAQ />
    </div>
    </>
  )
}

export default HomePage
