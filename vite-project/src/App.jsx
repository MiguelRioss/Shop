import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import HomePage from "./Pages/HomePage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./components/CartContext.jsx";
import CartToast from "./components/CartToast.jsx";
import HeroCheckout from "./Pages/CheckOutPage.jsx";
import StoriesP from "./Pages/StoriesPage.jsx";
import CheckoutCancel from "./Pages/CheckOutCancel.jsx";
import CheckoutSuccess from "./Pages/CheckOutSucess.jsx";

import config from "./websiteConfig.json";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Navbar {...config.navbar} />
        <Routes>
          <Route path="/" 
          element={
          <HomePage 
          hero={config.hero}
          productShowcase={config.productShowcase} 
          promoBanner={config.promoBanner} 
          HowItWorks={config.howItWorks}
          heroWithVideo={config.heroWithVideo}
          threeFloatHero={config.threeFloatHero}
          caroussel={config.caroussel}
          pressCarousel={config.pressCarousel}
          faq={config.faq}
          />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<HeroCheckout />} />
          <Route path="/stories" element={<StoriesP />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        </Routes>
        <Footer {...config.footer} />
        <CartToast />
      </Router>
    </CartProvider>
  );
}
