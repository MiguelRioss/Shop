import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import BubblesHeroSection from "../components/BubblesHeroSection";
import { AnnouncementHero } from "../components/AnnoncementHero.jsx";
import MossBuzzVideoSwitcher from "../components/MossBuzzVideoSwitcher.jsx";
import MossBuzzUploadModal from "../components/MossBuzzUploadModal.jsx";
import MossBuzzShortsGallery from "../components/MossBuzzShortsGallery.jsx";

export default function MossBuzzPage({
  hero = {},
  announcement = {},
  howItWorks = {},
  videos = [],
  uploadCopy = {},
  shorts = [],
  initialShowUpload = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUploadModal, setShowUploadModal] = React.useState(
    Boolean(initialShowUpload),
  );

  React.useEffect(() => {
    setShowUploadModal(Boolean(initialShowUpload));
  }, [initialShowUpload]);

  const heroData =
    hero && Object.keys(hero).length > 0
      ? {
          ...hero,
          productImage: hero.productImage || "/beeTincture.png",
        }
      : null;

  const hasHowItWorksHeading = Boolean(
    howItWorks?.heading || howItWorks?.subheading,
  );
  const hasHowItWorksSteps = Array.isArray(howItWorks?.steps)
    ? howItWorks.steps.length > 0
    : false;
  const shouldRenderHowItWorks = hasHowItWorksHeading || hasHowItWorksSteps;

  const closeModal = () => {
    setShowUploadModal(false);
    if (location.pathname.endsWith("/upload")) {
      navigate("/mesobuzz", { replace: true });
    }
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
        <MossBuzzShortsGallery shorts={shorts} />
      </div>
      <MossBuzzUploadModal
        open={showUploadModal}
        onClose={closeModal}
        copy={uploadCopy}
      />
    </>
  );
}
