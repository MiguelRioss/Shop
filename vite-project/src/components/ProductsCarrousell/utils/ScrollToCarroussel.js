export function headerOffset() {
  return (document.querySelector("header")?.offsetHeight || 0) + 12;
}

export function scrollToTarget(selectorOrEl, offset = headerOffset()) {
  const el = typeof selectorOrEl === "string"
    ? document.querySelector(selectorOrEl)
    : selectorOrEl;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}


export const goToProducts = (navigate, location, closeMenu) => {
  const destKey = '[data-scroll="products"]'; // or '#products' if you prefer IDs
  if (location.pathname === "/") {
    scrollToTarget(destKey, headerOffset());
  } else {
    // hop to Home and pass intent in state
    navigate("/", { state: { scrollTo: "products" } });
  }
  if (typeof closeMenu === "function") {
    closeMenu(false);
  }
};
