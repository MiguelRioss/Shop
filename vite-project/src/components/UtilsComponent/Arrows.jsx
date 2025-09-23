// src/components/Arrow.jsx
import React from "react";

/**
 * Arrow - presentational arrow button with built-in size / styling.
 *
 * Props:
 *  - dir: "prev" | "next"         (glyph + aria)
 *  - onClick: function
 *  - variant: "desktop" | "mobile"  (controls built-in size / colors)
 *  - posClass: string              (ONLY positioning classes from the caller, e.g. "absolute left-2 top-1/2 -translate-y-1/2")
 *  - className: string             (extra classes that will be appended)
 *
 * Note: keep positioning out of built-in styles — pass it via posClass so caller controls placement.
 */
export default function Arrow({
  dir = "prev",
  onClick = () => {},
  variant = "desktop",
  posClass = "",     // only positioning (left/right/top/translate)
  className = "",    // optional extra classes
}) {
  const isPrev = dir === "prev";
  const glyph = isPrev ? "‹" : "›";
  const aria = isPrev ? "Previous" : "Next";

  // Built-in visual classes (size, border, color, hover). Caller must supply positioning via posClass.
  const builtin =
    variant === "desktop"
      ? // desktop: hidden on xs, visible sm+ (keeps previous desktop appearance)
        "hidden sm:inline-flex h-10 w-10 text-[var(--brand)] items-center justify-center rounded-full border border-[var(--brand)] shadow-md hover:bg-[var(--brand)] hover:text-white"
      : // mobile: visible on xs only (sm:hidden), smaller size, solid brand background
        "inline-flex sm:hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-md";

  // final class: positioning (posClass) + builtin visual + any extra
  const finalClass = `${posClass} ${builtin} ${className}`.trim();

  return (
    <button
      type="button"
      aria-label={aria}
      onClick={onClick}
      className={finalClass}
    >
      <span aria-hidden style={{ lineHeight: 1, fontSize: variant === "desktop" ? 20 : 16 }}>
        {glyph}
      </span>
    </button>
  );
}
