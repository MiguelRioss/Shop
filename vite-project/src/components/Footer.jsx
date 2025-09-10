// src/components/Footer.jsx
import React from "react";

export default function Footer({
  logoSrc,
  brandHref,
  brandText,              // optional wordmark text next to the floating logo
  community: { heading: commHeading, body: commBody, socialsBlurb },
  disclaimer: { heading: discHeading, body: discBody },
  topLinks,               // [{ label, href }]
  bottomLinks,            // [{ label, href }]
  copyrightName           // e.g., "z
}) {
  return (
    <footer className="bg-[#1f1f1f] text-white/90">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Left: Logo + community blurb + socials */}
          <div className="md:col-span-8">
            {/* Floating logo + wordmark */}
            <div
              className="
                relative inline-block
                [--logo:372px] sm:[--logo:306px] md:[--logo:304px] lg:[--logo:448px]
              "
            >
              {/* Floating image */}
              <img
                src={logoSrc}
                alt=""
                aria-hidden="true"
                className="
                  pointer-events-none select-none
                  absolute left-0 top-1/2 -translate-y-1/2
                  lg:-translate-x-33
                  sm:-translate-x-33
                  md:-translate-x-33
                  -translate-x-27
                  -ml-2 md:-ml-3
                "
              />

              {/* Clickable brand link (kept empty in your original; optional text supported) */}
              <a
                href={brandHref}
                className="relative inline-flex items-center pl-[calc(var(--logo)+14px)]"
                aria-label={brandText || "Home"}
              >
                {brandText ? (
                  <span className="sr-only">{brandText}</span>
                ) : null}
              </a>
            </div>

            {/* Community */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-white">{commHeading}</h3>
              <p className="mt-3 max-w-2xl text-white/80">{commBody}</p>

              <div className="mt-3 flex items-center gap-5">
                {socialsBlurb}
              </div>

              {/* Disclaimer */}
              <h3 className="text-xl font-semibold mt-5 text-white">{discHeading}</h3>
              <p className="mt-1 max-w-2xl text-white/80">{discBody}</p>
            </div>
          </div>

          {/* Right: simple top links */}
          <nav className="md:col-span-4 md:justify-self-end">
            <ul className="flex gap-8 md:gap-10 text-sm font-semibold text-white/90">
              {topLinks?.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 h-px w-full bg-white/10" />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {bottomLinks?.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-white underline underline-offset-4">
                {l.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-white/70">
            © Copyright {new Date().getFullYear()} {copyrightName}
          </p>
        </div>
      </div>
    </footer>
  );
}
