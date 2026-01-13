import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./components/CartContext.jsx";
import CartToast from "./components/CartToast.jsx";
import MobileCartFab from "./components/MobileCartFab.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import HeroCheckout from "./Pages/CheckOutPage.jsx";
import CheckoutCancel from "./Pages/CheckOutCancel.jsx";
import CheckoutSuccess from "./Pages/CheckOutSucess.jsx";
import PlaceholderPage from "./Pages/PlaceholderPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import IndvidualPageProduct from "./Pages/Products/IndvidualPageProduct.jsx";
import LegalPage from "./Pages/LegalPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";

import fetchWebSiteConfigFile from "./services/fetchWebSiteConfig.mjs";
import fetchStock from "./services/fetchStock.js";
import { ErrorProvider, ErrorContext } from "./components/ErrorContext.jsx";
import ErrorToast from "./components/ErrorsToast.jsx";
import InquiryOrderSucess from "./Pages/InquiryOrderSucess.jsx";
import FounderLetterPage from "./Pages/FounderLetterPage.jsx";
import MesoBuzzPage from "./Pages/MesoBuzz/MesoBuzzPage.jsx";
import localWebsiteConfig from "./websiteConfig.json";
import BlogPost from "./Pages/Blogs/IndvidualPost/BlogPost.jsx";
import BlogGrid from "./Pages/Blogs/GRID/BlogGrid.jsx";
import GlobalSchema from "./Pages/SEO/GlobalSchema.JSX";
import DownloadPage from "./Pages/Downloads/DownloadPage.jsx";
import RouteTracker from "./components/routeTracker/RouteTracker.jsx";
import IndividualPostView from "./Pages/Blogs/IndividualBlogView.jsx";
import BlogSeriesView from "./Pages/Blogs/BlogSeriesView.jsx";
import FaqsPage from "./Pages/FaqsPage.jsx";
import DocsGridPage from "./Pages/GridDocsPage/DocsGridPage.jsx";
import UnsubscribePage from "./Pages/Unsubscrive/UnsubscribePage.jsx";
import fetchYouTubeChannelVideos from "./services/fetchYouTubeChannelVideos.mjs";
const mossBuzzLocalConfig = localWebsiteConfig?.mossBuzz ?? {};

export default function App() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [config, setConfig] = React.useState({});
  const [mossBuzzYouTubeItems, setMossBuzzYouTubeItems] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        const data = await fetchStock();
        const configData = await fetchWebSiteConfigFile();

        console.log("?? CONFIG DATA:", configData);
        console.log("?? STOCK DATA:", data);

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

  const mossBuzzChannelId =
    config.mossBuzz?.channelId ??
    mossBuzzLocalConfig.channelId ??
    "UCvntZ2fY8snkqklhok84Sbg";
  const mossBuzzPlaylistId =
    config.mossBuzz?.playlistId ?? mossBuzzLocalConfig.playlistId;

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled([
        mossBuzzChannelId
          ? fetchYouTubeChannelVideos(mossBuzzChannelId)
          : Promise.resolve([]),
        mossBuzzPlaylistId
          ? fetchYouTubeChannelVideos(null, { playlistId: mossBuzzPlaylistId })
          : Promise.resolve([]),
      ]);
      if (cancelled) return;
      const merged = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          merged.push(...result.value);
        } else {
          console.warn("Failed to load MossBuzz YouTube videos", result.reason);
        }
      });
      setMossBuzzYouTubeItems(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, [mossBuzzChannelId, mossBuzzPlaylistId]);

  const mossBuzzHero = {
    ...(mossBuzzLocalConfig.hero || {}),
    ...(config.heroMossBuzz || {}),
  };

  if (mossBuzzLocalConfig.hero?.cta || config.heroMossBuzz?.cta) {
    mossBuzzHero.cta =
      config.heroMossBuzz?.cta ?? mossBuzzLocalConfig.hero?.cta;
  }

  const mossBuzzHowItWorksBase = {
    ...(mossBuzzLocalConfig.howItWorks || {}),
    ...(config.howItWorksMossBuzz || {}),
  };
  if (!mossBuzzHowItWorksBase.steps?.length) {
    mossBuzzHowItWorksBase.steps = mossBuzzLocalConfig.howItWorks?.steps || [];
  }

  const mossBuzzAnnouncement =
    config.mossBuzz?.announcement ??
    mossBuzzLocalConfig.announcement ??
    config.announcement;

  const mossBuzzShortsFallback =
    config.mossBuzz?.shorts ?? mossBuzzLocalConfig.shorts ?? [];
  const mossBuzzVideosFallback =
    config.mossBuzz?.videos ??
    mossBuzzLocalConfig.videos ??
    config.mossBuzzVideos ??
    [];

  const mossBuzzUploadCopy =
    config.mossBuzz?.upload ?? mossBuzzLocalConfig.upload ?? {};

  const mossBuzzYouTubeShorts = mossBuzzYouTubeItems.filter(
    (item) => item.isShort,
  );
  const mossBuzzYouTubeVideos = mossBuzzYouTubeItems.filter(
    (item) => !item.isShort,
  );
  const mossBuzzShorts =
    mossBuzzYouTubeShorts.length > 0
      ? mossBuzzYouTubeShorts
      : mossBuzzShortsFallback;
  const mossBuzzVideos =
    mossBuzzYouTubeVideos.length > 0
      ? mossBuzzYouTubeVideos
      : mossBuzzVideosFallback;

  return (
    <ErrorProvider>
      <CartProvider>
        <Router>
          <GlobalSchema />
          <ScrollToTop />
          <RouteTracker />
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
                  tlcBanner={config.tlcBanner}
                  trustpilotReviews={config.reviews}
                />
              }
            />
            <Route path="/mesoblog/:slug" element={<BlogPost />} />

            <Route path="/legal" element={<LegalPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/shop/:id"
              element={
                <IndvidualPageProduct
                  products={products}
                  page={config.individualProductPage}
                />
              }
            />
            <Route path="/products/:id" element={<ProductRedirectToShop />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/checkout" element={<HeroCheckout />} />
            <Route
              path="/mesobuzz"
              element={
                <MesoBuzzPage
                  hero={mossBuzzHero}
                  announcement={mossBuzzAnnouncement}
                  howItWorks={mossBuzzHowItWorksBase}
                  videos={mossBuzzVideos}
                  uploadCopy={mossBuzzUploadCopy}
                  shorts={mossBuzzShorts}
                />
              }
            />
            <Route
              path="/mesobuzz/upload"
              element={
                <MesoBuzzPage
                  hero={mossBuzzHero}
                  announcement={mossBuzzAnnouncement}
                  howItWorks={mossBuzzHowItWorksBase}
                  videos={mossBuzzVideos}
                  uploadCopy={mossBuzzUploadCopy}
                  shorts={mossBuzzShorts}
                  initialShowUpload
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
            <Route
              path="/mesostory"
              element={<FounderLetterPage letter={config.founderLetter} />}
            />
            <Route path="/mesoblog" element={<BlogGrid />} />
            <Route path="/mesoblog/:slug" element={<IndividualPostView />} />
            <Route path="/mesoblog/series/:slug" element={<BlogSeriesView />} />

            <Route path="*" element={<NotFoundPage />} />

            <Route path="/download" element={<DownloadPage />} />
            <Route path="/faqs" element={<FaqsPage faq={config.faq} />} />
            <Route path="/docs" element={<DocsGridPage docs={config.docs} />} />
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

function ProductRedirectToShop() {
  const { id } = useParams();
  const location = useLocation();
  const suffix = `${location.search || ""}${location.hash || ""}`;
  return <Navigate to={`/shop/${id}${suffix}`} replace />;
}
