import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { goToProducts } from "./ProductsCarrousell/utils/ScrollToCarroussel";
import Button from "./UtilsComponent/Button";



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
  useLogoOverlay,
  logoOverlayClass,
}) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const grad = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
  const borderCls = border ? "border-b border-black/5" : "";
  const stickyCls = sticky ? "sticky top-0 z-50" : "";
  return (
    <header className={stickyCls}>
      {/* Main nav */}
      <div className={`w-full ${borderCls}`} style={{ background: navBg }}>
        <div className={`${containerClass} py-6`}>
          <nav className="flex h-15 items-center justify-between">
            {/* Left: Logo */}
            {/* Left: Logo */}
            <div className={`${logoOffsetClass} relative inline-block z-[200]`}>
              {/* Visible logo (won’t steal clicks) */}
              <img
                src={logoSrc}
                alt={logoAlt}
                className={`${logoClass} pointer-events-none select-none`}
                draggable="false"
                decoding="async"
              />

              {/* Small clickable hotspot centered on the logo */}
              <Link
                to={homeHref ?? "./"}
                onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
                aria-label="Home"
                title="Home"
                className={`
    absolute
    left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    w-32 h-12                /* base size */
    sm:w-40 sm:h-14          /* slightly bigger on small+ */
    md:w-48 md:h-16          /* bigger on desktop */
    z-[9999]
    rounded-md
    pointer-events-auto
    
  `}
              />
            </div>

            {/* Center: Links (desktop) */}
            <ul className="hidden md:flex items-center gap-8 text-sm">
              {links.map((l) => {
                return (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      onClick={() =>
                        window.scroll({
                          top: 0,
                          behavior: "smooth",
                        })
                      }
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
                onClick={() =>
                  window.scroll({
                    top: 0,
                    behavior: "smooth",
                  })
                }
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
              <Button
                style={{ background: grad }}
                onClick={() => {
                  goToProducts(navigate, location, setOpen);
                }}
              >
                {cta.label}
              </Button>
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
                        onClick={() => {
                          window.scroll({
                            top: 0,
                            behavior: "smooth",
                          });
                          setOpen(false);
                        }}
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
                  onClick={() => {
                    window.scroll({
                      top: 0,
                      behavior: "smooth",
                    });
                    setOpen(false);
                  }}
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
                <Button
                  className="flex-1"
                  style={{ background: grad }}
                  onClick={() => {
                    goToProducts(navigate, location, setOpen);
                    setOpen(false);
                  }}
                >
                  {cta.label}
                </Button>
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
