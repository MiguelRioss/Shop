import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { goToProducts } from "./ProductsCarrousell/utils/ScrollToCarroussel";
import Button from "./UtilsComponent/Button";
import CartButton from "./UtilsComponent/CartButton.jsx";

export default function Navbar({
  logoSrc = "/logo.png",
  homeHref,
  logoAlt = "Home",
  links = [],
  cta = { label: "Shop now" },
  announcement,
  containerClass = "mx-auto px-4",
  navBg = "#ffffff",
  gradientFrom = "#000000",
  gradientTo = "#333333",
  logoClass,
  logoOffsetClass,
}) {
  const [open, setOpen] = React.useState(false);

  // desktop dropdown
  const [desktopDropdown, setDesktopDropdown] = React.useState(null); // label string or null
  const dropdownRef = React.useRef(null);

  // close-hover timer (fix hover gap)
  const closeTimerRef = React.useRef(null);

  // mobile dropdowns (accordion)
  const [mobileDropdowns, setMobileDropdowns] = React.useState({}); // { [label]: boolean }

  const location = useLocation();
  const navigate = useNavigate();

  const grad = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;

  // helper: open/close with delay
  const openDesktop = (label) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setDesktopDropdown(label);
  };

  const closeDesktopSoon = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setDesktopDropdown(null), 180);
  };

  const keepDesktopOpen = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  // close dropdown on route change
  React.useEffect(() => {
    setDesktopDropdown(null);
    setOpen(false);
  }, [location.pathname]);

  // close desktop dropdown on outside click
  React.useEffect(() => {
    function onDocMouseDown(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setDesktopDropdown(null);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const toggleMobileGroup = (label) => {
    setMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main nav */}
      <div
        className="w-full border-b border-black/5"
        style={{ background: navBg }}
      >
        <div className={`${containerClass}`}>
          {/* 3-col grid keeps center area centered regardless of logo width */}
          <nav className="grid grid-cols-[auto_1fr_auto] items-center h-28 md:h-32">
            {/* LEFT: LOGO */}
            <div
              className={`${
                logoOffsetClass ?? ""
              } relative h-full shrink-0 overflow-hidden flex items-center justify-self-start
              -ml-4 sm:-ml-6 md:ml-0
              w-[min(260px,88vw)] sm:w-[min(340px,72vw)] md:w-[clamp(300px,28vw,520px)]`}
            >
              <img
                src={logoSrc}
                alt={logoAlt}
                className={`block h-full w-auto select-none pointer-events-none origin-left ${
                  logoClass ?? ""
                }
                [transform:translateX(-30%)_scale(2.2)]                    /* mobile */
                sm:[transform:translateX(-16%)_scale(2.5)]
                md:[transform:translateX(-40%)_scale(2.55)]
                lg:[transform:translateX(-65%)_translateY(-1%)_scale(2.7)]
                xl:[transform:translateX(-15%)_translateY(-2%)_scale(2.85)] `}
                draggable="false"
                decoding="async"
              />

              <Link
                to={homeHref ?? "./"}
                onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
                aria-label="Home"
                title="Home"
                className="absolute inset-0"
              />
            </div>

            {/* CENTER: LINKS (desktop) */}
            <ul
              className="hidden md:flex justify-end items-center mr-6 gap-9 text-sm"
              ref={dropdownRef}
            >
              {links.map((l) => {
                const isDropdown =
                  Array.isArray(l.children) && l.children.length > 0;

                if (!isDropdown) {
                  return (
                    <li key={l.href}>
                      <Link
                        to={l.href}
                        onClick={() =>
                          window.scroll({ top: 0, behavior: "smooth" })
                        }
                        className="text-black/80 hover:text-black transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                }

                const isOpen = desktopDropdown === l.label;

                return (
                  <li
                    key={l.label}
                    className="relative"
                    onMouseEnter={() => openDesktop(l.label)}
                    onMouseLeave={closeDesktopSoon}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-black/80 hover:text-black transition-colors"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      onClick={() => setDesktopDropdown(isOpen ? null : l.label)}
                      onMouseEnter={keepDesktopOpen}
                    >
                      {l.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden"
                        role="menu"
                        onMouseEnter={keepDesktopOpen}
                        onMouseLeave={closeDesktopSoon}
                      >
                        {l.children.map((c) => (
                          <Link
                            key={c.href}
                            to={c.href}
                            role="menuitem"
                            className="block px-4 py-3 text-sm text-black/80 hover:bg-black/5"
                            onClick={() => setDesktopDropdown(null)}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* RIGHT: CART + CTA (desktop) */}
            <div className="hidden md:flex items-center  mr-6 justify-end gap-3">
              <CartButton
                className="h-9 w-9"
                style={{ background: grad }}
                size={18}
              />
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
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-black/80 hover:bg-black/5 justify-self-end"
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
            className="md:hidden border-top border-black/10"
            style={{ background: navBg }}
          >
            <div className={`${containerClass} px-4 py-4 space-y-4`}>
              <ul className="flex flex-col gap-2">
                {links.map((l) => {
                  const isDropdown =
                    Array.isArray(l.children) && l.children.length > 0;

                  if (!isDropdown) {
                    return (
                      <li key={l.href}>
                        <Link
                          to={l.href}
                          className="block rounded-lg px-2 py-2 text-black/80 hover:bg-black/5"
                          onClick={() => {
                            window.scroll({ top: 0, behavior: "smooth" });
                            setOpen(false);
                          }}
                        >
                          {l.label}
                        </Link>
                      </li>
                    );
                  }

                  const isOpenGroup = !!mobileDropdowns[l.label];

                  return (
                    <li key={l.label} className="rounded-lg">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between rounded-lg px-2 py-2 text-black/80 hover:bg-black/5"
                        onClick={() => toggleMobileGroup(l.label)}
                        aria-expanded={isOpenGroup}
                      >
                        <span>{l.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isOpenGroup ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpenGroup && (
                        <div className="mt-1 ml-2 border-l border-black/10 pl-3">
                          {l.children.map((c) => (
                            <Link
                              key={c.href}
                              to={c.href}
                              className="block rounded-lg px-2 py-2 text-sm text-black/70 hover:bg-black/5"
                              onClick={() => {
                                window.scroll({ top: 0, behavior: "smooth" });
                                setOpen(false);
                              }}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-3 pt-2">
                <CartButton
                  className="h-9 w-9"
                  style={{ background: grad }}
                  size={18}
                />
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
