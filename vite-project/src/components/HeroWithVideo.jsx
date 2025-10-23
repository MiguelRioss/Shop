// src/components/HeroWithVideo.jsx
import { useLocation, useNavigate } from "react-router-dom";
import YouTubeWithThumbnail from "./YouTubeWithThumbnail.jsx";
import Button from "./UtilsComponent/Button.jsx";
import { goToProducts } from "./ProductsCarrousell/utils/ScrollToCarroussel.js";

const defaultVideo = {};
const defaultCta = { label: "Learn more", href: "" };

export default function HeroWithVideo({
  video = defaultVideo, // { id?: string, url?: string, thumbnail?: string, title?: string }
  cta = defaultCta, // { label: string, href: string }
  heading = "", // string
  subheading = "", // string
  benefits = [], // [{ icon: string, alt: string, title: string, note: string }]
  disclaimer = "", // string
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: video + button */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl shadow-lg">
              {/* Pass the video props down (component should handle id/url/thumbnail) */}
              <YouTubeWithThumbnail {...video} />
            </div>
            <Button
            className="w-full"
              onClick={() => {
                goToProducts(navigate, location);
              }}
            >
              {cta.label}
            </Button>
          </div>

          {/* Right: text */}
          <div className="lg:pl-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
              {heading}
            </h2>
            <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>

            <ul className="mt-8 space-y-4 list-none pl-0">
              {benefits?.map((b, i) => (
                <li key={i} className="flex items-center">
                  {/* keep your exact icon sizing classes */}
                  <img
                    src={b.icon}
                    alt={b.alt}
                    className="w-15 h-15 mr-3"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: "var(--brand)" }}
                    >
                      {b.title}
                    </p>
                    <p className="text-gray-600 text-sm">{b.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            {disclaimer && (
              <div>
                <p className="text-gray-600 mt-7 text-sm">{disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
