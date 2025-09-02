import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import PromoBanner from './components/PromoBanner'
import BubblesHeroSection from './components/BubblesHeroSection'
import HeroWithVideo from './components/HeroWithVideo'
import Footer from './components/Footer'
import ThreeFloatHeadersHero from './components/ThreeFloatHeadersHero'
import CarouselsHero from './components/CarousselHero'
import PressCarousel from './components/PressCarousel'
import FAQ from './components/FAQ'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="NavBar">
      <Navbar />
      <Hero />
      <ProductShowcase  />
      <PromoBanner />
      <BubblesHeroSection />
      <HeroWithVideo/>
      <ThreeFloatHeadersHero />
      <CarouselsHero />
      <PressCarousel />
      <FAQ />
      <Footer />
    </div>
    </>
  )
}

export default App
