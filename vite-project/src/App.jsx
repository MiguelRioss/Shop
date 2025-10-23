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
import NotFoundPage from "./Pages/NotFoundPage.jsx";

import fetchWebSiteConfigFile from "./services/fetchWebSiteConfig.mjs";
import fetchStock from "./services/fetchStock.js";
import { ErrorProvider, ErrorContext } from "./components/ErrorContext.jsx";
import ErrorToast from "./components/ErrorsToast.jsx";
import InquiryOrderSucess from "./Pages/InquiryOrderSucess.jsx";
import FounderLetterPage from "./Pages/FounderLetterPage.jsx";

export default function App() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [config, setConfig] = React.useState({});
  React.useEffect(() => {
    (async () => {
      try {
        const data = await fetchStock();
        const configData = await fetchWebSiteConfigFile();

        console.log("🧱 CONFIG DATA:", configData);
        console.log("📦 STOCK DATA:", data);

        setConfig(configData);
        const arr = Array.isArray(data) ? data : Object.values(data);
        setProducts(arr);
      } catch (err) {
        console.error("Error fetching stock or config", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ErrorProvider>
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
            <Route
              path="/research"
              element={
                <PlaceholderPage
                  title="Research"
                  message="Our research hub is under construction."
                />
              }
            />
            <Route
              path="/blog"
              element={
                <PlaceholderPage
                  title="Blog"
                  message="Our blog is under construction."
                />
              }
            />
            <Route
              path="/help"
              element={
                <PlaceholderPage
                  title="Help Center"
                  message="Our help center is under construction."
                />
              }
            />
            <Route
              path="/affiliate"
              element={
                <PlaceholderPage
                  title="Affiliate Program"
                  message="Our affiliate program page is under construction."
                />
              }
            />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/products/:id"
              element={
                <IndvidualPageProduct
                  products={products}
                  page={config.individualProductPage}
                />
              }
            />
            <Route path="/checkout" element={<HeroCheckout />} />
            <Route
              path="/mesobuzz"
              element={
                <PlaceholderPage
                  title="MesoBuzz"
                  message="Our MesoBuzz page is under construction."
                />
              }
            />
            <Route
              path="/checkout/success/:sessionID"
              element={<CheckoutSuccess />}
            />
            <Route
              path="/checkout/orderSuccess/:orderID"
              element={<InquiryOrderSucess />}
            />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route
              path="/mesocontact"
              element={<ContactPage contactUsInfo={config.contactPage} />}
            />
            <Route path="/mesoconnect" element={<ContactPage />} />
            <Route path="/mesostory" element={<FounderLetterPage />} />
            <Route
              path="/mesoblog"
              element={
                <PlaceholderPage
                  title="MesoBlog"
                  message="Our MesoBlog is under construction."
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer {...config.footer} />
          <CartToast />
          <MobileCartFab />
          <GlobalErrorToast />
        </Router>
      </CartProvider>
    </ErrorProvider>
  );
}

// small helper component inside App.jsx
function GlobalErrorToast() {
  const { error, clearError } = React.useContext(ErrorContext);
  return <ErrorToast error={error} onClose={clearError} />;
}
