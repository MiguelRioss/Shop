// src/components/Navbar.jsx
import React from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";


export default function Navbar({
  logoSrc,
  homeHref,
  logoAlt,
  links,
  showCart,
  cartHref,
  cta,
  announcement,
  containerClass,
  navBg,
  border,
  sticky,
  gradientFrom,
  gradientTo,
  useLogoOverlay,
  logoClass,
  logoOffsetClass,
}) {
  const [open, setOpen] = React.useState(false);

  const grad = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
  const borderCls = border ? "border-b border-black/5" : "";
  const stickyCls = sticky ? "sticky top-0 z-50" : "";

  const isHashHref = (href) =>
    typeof href === "string" && (href.startsWith("#") || href.startsWith("/#"));

  const handleAnchorClick = (e, href) => {
    if (typeof href !== "string") return;
    const isHash = isHashHref(href);
    if (!isHash) return; // let router handle normal links
    e.preventDefault();
    const id = href.replace("/#", "").replace("#", "");
    const el = document.getElementById(id);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = id;
    }
  };

  return (
    <header className={stickyCls}>
      {/* Main nav */}
      <div className={`w-full ${borderCls}`} style={{ background: navBg }}>
        <div className={`${containerClass} py-6`}>
          <nav className="flex h-20 items-center justify-between">
            {/* Left: Logo */}
            {useLogoOverlay ? (
              <div className={logoOffsetClass}>
                <img
                    src={logoSrc}
                    alt={logoAlt}
                    className={logoClass}
                    draggable="false"
                    decoding="async"
                />
                {isHashHref(homeHref) ? (
                  <a
                    href={homeHref}
                    aria-label="Home"
                    title="Home"
                    className="
                      absolute block
                      top-[34%] left-[30%] w-[45%] h-[28%]
                      sm:top-[33%] sm:left-[30%] sm:w-[45%] sm:h-[28%]
                      md:top-[31%] md:left-[29%] md:w-[44%] md:h-[26%]
                      lg:top-[30%] lg:left-[28%] lg:w-[43%] lg:h-[24%]
                      cursor-pointer
                    "
                    style={{ background: "transparent" }}
                    onClick={(e) => handleAnchorClick(e, homeHref)}
                  />
                ) : (
                  <Link
                    to={homeHref}
                    aria-label="Home"
                    title="Home"
                    className="
                      absolute block
                      top-[34%] left-[30%] w-[45%] h-[28%]
                      sm:top-[33%] sm:left-[30%] sm:w-[45%] sm:h-[28%]
                      md:top-[31%] md:left-[29%] md:w-[44%] md:h-[26%]
                      lg:top-[30%] lg:left-[28%] lg:w-[43%] lg:h-[24%]
                      cursor-pointer
                    "
                    style={{ background: "transparent" }}
                  />
                )}
              </div>
            ) : (
              isHashHref(homeHref) ? (
                <a
                  href={homeHref}
                  className={logoOffsetClass}
                  aria-label="Home"
                  onClick={(e) => handleAnchorClick(e, homeHref)}
                >
                  <img
                    src={logoSrc}
                    alt={logoAlt}
                    className={logoClass}
                    draggable="false"
                    decoding="async"
                  />
                </a>
              ) : (
                <Link to={homeHref} className={logoOffsetClass} aria-label="Home">
                  <img
                    src={logoSrc}
                    alt={logoAlt}
                    className={logoClass}
                    draggable="false"
                    decoding="async"
                  />
                </Link>
              )
            )}

            {/* Center: Links (desktop) */}
            <ul className="hidden md:flex items-center gap-8 text-sm">
              {links.map((l) => {
                const hash = isHashHref(l.href);
                return (
                  <li key={l.href}>
                    {hash ? (
                      <a
                        href={l.href}
                        className="text-black/80 hover:text-black transition-colors"
                        onClick={(e) => handleAnchorClick(e, l.href)}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.href}
                        className="text-black/80 hover:text-black transition-colors"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Right: Cart + CTA (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {showCart && (
                isHashHref(cartHref) ? (
                  <a
                    href={cartHref}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:opacity-90 transition-opacity"
                    style={{ background: grad }}
                    aria-label="Cart"
                    onClick={(e) => handleAnchorClick(e, cartHref)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                  </a>
                ) : (
                  <Link
                    to={cartHref}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:opacity-90 transition-opacity"
                    style={{ background: grad }}
                    aria-label="Cart"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                )
              )}

              {cta?.show && (
                isHashHref(cta.href) ? (
                  <a
                    href={cta.href}
                    className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ background: grad }}
                    onClick={(e) => handleAnchorClick(e, cta.href)}
                  >
                    {cta.label}
                  </a>
                ) : (
                  <Link
                    to={cta.href}
                    className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ background: grad }}
                  >
                    {cta.label}
                  </Link>
                )
              )}
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
                  const hash = isHashHref(l.href);
                  return (
                    <li key={l.href}>
                      {hash ? (
                        <a
                          href={l.href}
                          className="block rounded-lg px-2 py-2 text-black/80 hover:bg-black/5"
                          onClick={(e) => {
                            handleAnchorClick(e, l.href);
                            setOpen(false);
                          }}
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.href}
                          className="block rounded-lg px-2 py-2 text-black/80 hover:bg-black/5"
                          onClick={() => setOpen(false)}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-3 pt-2">
                {showCart && (
                  isHashHref(cartHref) ? (
                    <a
                      href={cartHref}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{ background: grad }}
                      aria-label="Cart"
                      onClick={(e) => {
                        handleAnchorClick(e, cartHref);
                        setOpen(false);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                    </a>
                  ) : (
                    <Link
                      to={cartHref}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{ background: grad }}
                      aria-label="Cart"
                      onClick={() => setOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                  )
                )}

                <NavbarCTA grad={grad} cta={cta} setOpen={set}/>
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


function NavbarCTA({ grad, cta, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    setOpen?.(false);

    if (location.pathname === "/" || location.hash === "#/") {
      // already on Home (HashRouter uses "#/" for home)
      e.preventDefault();
      document.getElementById("get")?.scrollIntoView({ behavior: "smooth" });
      // Optional: reflect the anchor in the URL
      window.history.replaceState(null, "", "#/"); // clear route hash
      window.location.hash = "#get";               // add anchor hash separately
    } else {
      // Navigate to Home and ask it to scroll after mount
      e.preventDefault();
      navigate("/", { state: { scrollTo: "get" } });
    }
  };

  return (
    <Link
      to="/"   // IMPORTANT: go to Home, not "/#get"
      className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      style={{ background: grad }}
      onClick={handleClick}
    >
      {cta?.label ?? "Get"}
    </Link>
  );
}
