// src/components/Arrow.jsx
import React from "react";
import Button from "./Button.jsx";

/**
 * Arrow - presentational arrow button built on shared <Button>.
 *
 * Props:
 *  - dir: "prev" | "next"
 *  - onClick: function
 *  - variant: "desktop" | "mobile"
 *  - posClass: string (positioning only)
 *  - className: string (extra classes)
 */
export default function Arrow({
  dir = "prev",
  onClick = () => {},
  variant = "desktop",
  posClass = "",
  className = "",
}) {
  const isPrev = dir === "prev";
  const glyph = isPrev ? "�" : "�";
  const aria = isPrev ? "Previous" : "Next";

  // visual baseline (use pc-arrow for global CSS hooks)
  const visual =
    variant === "desktop"
      ? "hidden sm:inline-flex h-10 w-10 p-0 items-center justify-center rounded-full pc-arrow border text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white shadow-md"
      : "inline-flex sm:hidden h-8 w-8 p-0 items-center justify-center rounded-full pc-arrow bg-[var(--brand)] text-white shadow-md";

  const finalClass = `${posClass} ${visual} ${className}`.trim();

  return (
    <Button
      type="button"
      justify="center"
      onClick={onClick}
      className={finalClass}
      aria-label={aria}
      style={{}}
    >
      <span aria-hidden style={{ lineHeight: 1, fontSize: variant === "desktop" ? 20 : 16 }}>
        {glyph}
      </span>
    </Button>
  );
}