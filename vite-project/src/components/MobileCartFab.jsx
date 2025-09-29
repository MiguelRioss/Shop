import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import config from "../websiteConfig.json";

export default function MobileCartFab() {
  const { items } = useCart();
  const location = useLocation();
  const count = React.useMemo(
    () => items.reduce((sum, p) => sum + Math.max(1, Number(p?.qty) || 1), 0),
    [items]
  );

  // Respect config flag if present
  const navCfg = config?.navbar || {};
  if (navCfg?.showCart === false) return null;

  const href = navCfg?.cartHref || "/cart";

  // Use safe-area aware bottom offset for iOS
  const bottomStyle = {
    bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
    background: "var(--brand-gradient)",
  };

  const aria = `Open cart${count > 0 ? ` (${count} item${count === 1 ? "" : "s"})` : ""}`;

  // Hide FAB on specific routes and when footer is visible to avoid overlap
  const [footerVisible, setFooterVisible] = React.useState(false);
  React.useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setFooterVisible(!!e?.isIntersecting);
      },
      { root: null, threshold: 0.01 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const onCartOrCheckout = /^(\/cart|\/checkout)/.test(location.pathname);
  if (onCartOrCheckout || footerVisible) return null;

  return (
    <div className="sm:hidden" aria-hidden={false}>
      <Link
        to={href}
        aria-label={aria}
        className="fixed left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg active:scale-95 transition-transform"
        style={bottomStyle}
      >
        {/* Cart icon (same style as Navbar) */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.6" fill="currentColor" />
          <circle cx="17" cy="20" r="1.6" fill="currentColor" />
        </svg>

        {/* Quantity badge */}
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] leading-5 text-center shadow-md"
            aria-label={`${count} item${count === 1 ? "" : "s"} in cart`}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </div>
  );
}
