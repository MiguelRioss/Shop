import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ContactPage from "./Pages/ContactPage.jsx";
import IndvidualPageProduct from "./Pages/IndvidualPageProduct.jsx";
import LegalPage from "./Pages/LegalPage.jsx";
import config from "./websiteConfig.json";
import FounderLetterPage from "./Pages/FounderLetterPage.jsx";

import fetchStock from "./services/fetchStock.js";

export default function App() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await fetchStock();
        console.log("Fetched stock data:", data);
        // make array from {id: {...}, id: {...}}
        const arr = Array.isArray(data) ? data : Object.values(data);
        setProducts(arr);
      } catch (err) {
        console.error("Error fetching stock", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
                loading={loading}
                products={products}
                announcement={config.announcement}
                hero={config.hero}
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
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<IndvidualPageProduct products={products} page={config.individualProductPage} />} />
          <Route path="/checkout" element={<HeroCheckout />} />
          <Route path="/mesobuzz" element={<StoriesP />} />
          <Route path="/checkout/success/:sessionID" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/mesocontact" element={<ContactPage contactUsInfo={config.contactPage}/>} />
          <Route path="/mesoconnect" element={<ContactPage />} />
          <Route path="/mesostory" element={<FounderLetterPage letter={config.founderLetter} />} />
        </Routes>
        <Footer {...config.footer} />
        <CartToast />
        <MobileCartFab />
      </Router>
    </CartProvider>
  );
}
