// src/components/HeroWithVideo.jsx
import React from "react";
import YouTubeWithThumbnail from "./YouTubeWithThumbnail.jsx";

export default function HeroWithVideo({
  video,            // { id?: string, url?: string, thumbnail?: string, title?: string }
  cta,              // { label: string, href: string }
  heading,          // string
  subheading,       // string
  benefits,         // [{ icon: string, alt: string, title: string, note: string }]
  disclaimer        // string
}) {
  const handleCtaClick = (e) => {
    const href = (typeof cta?.href === 'string') ? cta.href : '';
    if (!href) return;
    const isHash = href.startsWith('#') || href.startsWith('/#');
    if (isHash) {
      e.preventDefault();
      const id = href.replace('/#', '').replace('#', '');
      const el = document.getElementById(id);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = id;
      }
    }
  };
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
            <a
              href={cta?.href}
              onClick={handleCtaClick}
              className="block w-full rounded-full px-6 py-4 text-center text-lg font-semibold text-white shadow hover:opacity-90 sm:w-auto"
              style={{ background: "linear-gradient(to right, var(--brand-from), var(--brand-to))" }}
            >
              {cta?.label}
            </a>
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
                    <p className="font-semibold" style={{ color: "var(--brand)" }}>
                      {b.title}
                    </p>
                    <p className="text-gray-600 text-sm">{b.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            {disclaimer && (
              <div>
                <p className="text-gray-600 mt-7 text-sm">
                  {disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
