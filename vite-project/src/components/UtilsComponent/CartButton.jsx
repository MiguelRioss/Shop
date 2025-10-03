// src/components/CartButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext.jsx";
import config from "../../websiteConfig.json";

export default function CartButton({
  href: propHref,
  className = "",
  style = {},
}) {
  const { items } = useCart();

  // Compute item count
  const count = React.useMemo(
    () => items.reduce((sum, p) => sum + Math.max(1, Number(p?.qty) || 1), 0),
    [items]
  );

  // Default href from config
  const navCfg = config?.navbar || {};
  const href = propHref || navCfg?.cartHref || "/cart";

  const aria = `Open cart${
    count > 0 ? ` (${count} item${count === 1 ? "" : "s"})` : ""
  }`;

  return (
    <Link
      to={href}
      aria-label={aria}
      className={`relative inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg active:scale-95 transition-transform ${className}`}
      style={style}
    >
      {/* Cart icon */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
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

      {/* Badge */}
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] leading-5 text-center shadow-md"
          aria-label={`${count} item${count === 1 ? "" : "s"} in cart`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
