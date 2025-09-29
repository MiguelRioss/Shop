import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./Pages/HomePage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./components/CartContext.jsx";
import CartToast from "./components/CartToast.jsx";
import MobileCartFab from "./components/MobileCartFab.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import HeroCheckout from "./Pages/CheckOutPage.jsx";
import StoriesP from "./Pages/StoriesPage.jsx";
import CheckoutCancel from "./Pages/CheckOutCancel.jsx";
import CheckoutSuccess from "./Pages/CheckOutSucess.jsx";
import PlaceholderPage from "./Pages/PlaceholderPage.jsx";
import IndvidualPageProduct from "./Pages/IndvidualPageProduct.jsx";

import config from "./websiteConfig.json";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Navbar {...config.navbar} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                announcement={config.announcement}
                hero={config.hero}
                productShowcase={config.productShowcase}
                promoBanner={config.promoBanner}
                HowItWorks={config.howItWorks}
                heroWithVideo={config.heroWithVideo}
                threeFloatHero={config.threeFloatHero}
                caroussel={config.caroussel}
                pressCarousel={config.pressCarousel}
                faq={config.faq}
              />
            }
          />
          <Route path="/research" element={<PlaceholderPage title="Research" message="Our research hub is coming soon." />} />
          <Route path="/blog" element={<PlaceholderPage title="Blog" message="Our latest articles are on the way." />} />
          <Route path="/help" element={<PlaceholderPage title="Help" message="Support resources are on the way." />} />
          <Route path="/affiliate" element={<PlaceholderPage title="Affiliate" message="Affiliate program details are coming soon." />} />
          <Route path="/privacy-policy" element={<PlaceholderPage title="Privacy Policy" message="Privacy policy coming soon." />} />
          <Route path="/returns-policy" element={<PlaceholderPage title="Returns Policy" message="Returns policy coming soon." />} />
          <Route path="/terms-of-sale" element={<PlaceholderPage title="Terms of Sale" message="Terms of sale coming soon." />} />
          <Route path="/terms-of-use" element={<PlaceholderPage title="Terms of Use" message="Terms of use coming soon." />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping" message="Shipping information coming soon." />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<IndvidualPageProduct products={config.productShowcase.products} />} />
          <Route path="/checkout" element={<HeroCheckout />} />
          <Route path="/mesobuzz" element={<StoriesP />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        </Routes>
        <Footer {...config.footer} />
        <CartToast />
        <MobileCartFab />
      </Router>
    </CartProvider>
  );
}











