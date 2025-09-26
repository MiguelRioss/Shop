// src/components/Navbar.jsx
import React from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({
  logoSrc,
  homeHref,
  logoAlt,
  links,
  cartHref,
  cta,
  announcement,
  containerClass,
  navBg,
  border,
  sticky,
  gradientFrom,
  gradientTo,
  logoClass,
  logoOffsetClass,
}) {
  const [open, setOpen] = React.useState(false);

  const grad = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
  const borderCls = border ? "border-b border-black/5" : "";
  const stickyCls = sticky ? "sticky top-0 z-50" : "";


  return (
    <header className={stickyCls}>
      {/* Main nav */}
      <div className={`w-full ${borderCls}`} style={{ background: navBg }}>
        <div className={`${containerClass} py-6`}>
          <nav className="flex h-20 items-center justify-between">
            {/* Left: Logo */}
            {/* Left: Logo */}
            <div className={`${logoOffsetClass} inline-block`}>
              <Link
                to={homeHref}
                aria-label="Home"
                title="Home"
                className="inline-block cursor-pointer"
              >
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className={logoClass}
                  draggable="false"
                  decoding="async"
                />
              </Link>
            </div>

            {/* Center: Links (desktop) */}
            <ul className="hidden md:flex items-center gap-8 text-sm">
              {links.map((l) => {
                return (
                  <li key={l.href}>
                      <Link
                        to={l.href}
                        className="text-black/80 hover:text-black transition-colors"
                      >
                        {l.label}
                      </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right: Cart + CTA (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={cartHref}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:opacity-90 transition-opacity"
                style={{ background: grad }}
                aria-label="Cart"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="17" cy="20" r="1.5" fill="currentColor" />
                </svg>
              </Link>
              <Link
                to={cta.href}
                className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ background: grad }}
              >
                {cta.label}
              </Link>
            </div>

            {/* Mobile: menu toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-black/80 hover:bg-black/5"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile panel */}
        {open && (
          <div
            className="md:hidden border-t border-black/10"
            style={{ background: navBg }}
          >
            <div className={`${containerClass} px-4 py-4 space-y-4`}>
              <ul className="flex flex-col gap-2">
                {links.map((l) => {
                  return (
                    <li key={l.href}>
                        <Link
                          to={l.href}
                          className="block rounded-lg px-2 py-2 text-black/80 hover:bg-black/5"
                          onClick={() => setOpen(false)}
                        >
                          {l.label}
                        </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={cartHref}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{ background: grad }}
                      aria-label="Cart"
                      onClick={() => setOpen(false)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                        <circle cx="17" cy="20" r="1.5" fill="currentColor" />
                      </svg>
                    </Link>
                <NavbarCTA grad={grad} cta={cta} setOpen={open} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Announcement bar */}
      {announcement?.show && (
        <div className="w-full text-white text-sm" style={{ background: grad }}>
          <div className={`${containerClass} px-4 py-3 text-center`}>
            {announcement.text}
          </div>
        </div>
      )}
    </header>
  );
}

