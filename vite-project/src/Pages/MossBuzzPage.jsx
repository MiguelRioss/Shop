// Update your MossBuzzPage component
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import BubblesHeroSection from "../components/BubblesHeroSection";
import { AnnouncementHero } from "../components/AnnoncementHero.jsx";
import MossBuzzVideoSwitcher from "../components/MossBuzzVideoSwitcher.jsx";
import MossBuzzUploadModal from "../components/MossBuzzUploadModal.jsx";
import MossBuzzThankYouModal from "../components/MossBuzzThankYouModal.jsx"; // Import the new modal

export default function MossBuzzPage({
  hero = {},
  announcement = {},
  howItWorks = {},
  videos = [],
  shorts = [],
  uploadCopy = {},
  initialShowUpload = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = React.useState(
    Boolean(initialShowUpload),
  );
  const [showThankYouModal, setShowThankYouModal] = React.useState(false); // New state for thank you modal

  React.useEffect(() => {
    setShowUploadModal(Boolean(initialShowUpload));
  }, [initialShowUpload]);

  const heroData =
    hero && Object.keys(hero).length > 0
      ? { ...hero, productImage: hero.productImage || "/beeTincture.png" }
      : null;

  const hasHowItWorksHeading = Boolean(
    howItWorks?.heading || howItWorks?.subheading,
  );
  const hasHowItWorksSteps = Array.isArray(howItWorks?.steps)
    ? howItWorks.steps.length > 0
    : false;
  const shouldRenderHowItWorks = hasHowItWorksHeading || hasHowItWorksSteps;

  const closeUploadModal = () => {
    setShowUploadModal(false);
    if (location.pathname.endsWith("/upload")) {
      navigate("/mesobuzz", { replace: true });
    }
  };

  const closeThankYouModal = () => {
    setShowThankYouModal(false);
  };

  // New function to handle successful upload
  const handleUploadSuccess = () => {
    setShowUploadModal(false); // Close upload modal
    setShowThankYouModal(true); // Open thank you modal
  };

  return (
    <>
      <div>
        {announcement && Object.keys(announcement).length > 0 && (
          <AnnouncementHero announcement={announcement} />
        )}

        {heroData && <Hero {...heroData} />}

        {shouldRenderHowItWorks && <BubblesHeroSection {...howItWorks} />}

        <MossBuzzVideoSwitcher videos={videos} shorts={shorts} />
      </div>

      <MossBuzzUploadModal
        open={showUploadModal}
        onClose={closeUploadModal}
        onSuccess={handleUploadSuccess} // Pass the success handler
        copy={uploadCopy}
      />

      <MossBuzzThankYouModal
        open={showThankYouModal}
        onClose={closeThankYouModal}
        copy={uploadCopy.thankYou || {}} // You can add thankYou copy to your uploadCopy prop
      />
    </>
  );
}