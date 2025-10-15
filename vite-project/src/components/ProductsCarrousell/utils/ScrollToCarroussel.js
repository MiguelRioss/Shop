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


// ScrollToCarroussel.mjs
export const goToProducts = (navigate, location, closeMenu) => {
  const destKey = '[data-scroll="products"]';
  if (location.pathname === "/") {
    scrollToTarget(destKey, headerOffset());
  } else {
    navigate("/", { state: { scrollTo: "products" } });
  }
  if (typeof closeMenu === "function") closeMenu(false);
};

export const goToMesoStories = (navigate, location, closeMenu, anchor) => {
  const path = "/mesostory";
  if (location.pathname === path) {
    if (anchor) {
      const key = anchor.startsWith("#") ? anchor : `#${anchor}`;
      scrollToTarget(key, headerOffset());
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    const state = anchor ? { scrollTo: anchor.replace(/^#/, "") } : undefined;
    navigate(path, state ? { state } : undefined);
  }
  if (typeof closeMenu === "function") closeMenu(false);
};

// utils/ScrollToCarroussel.js
export const goToContactForm = (
  navigate,
  location,
  closeMenu,
  anchor,
  subject
) => {
  const path = "/mesocontact";

  // When already on the contact page
  if (location.pathname === path) {
    if (anchor) {
      const key = anchor.startsWith("#") ? anchor : `#${anchor}`;
      scrollToTarget(key, headerOffset());
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    // Pass both scroll target and subject via state
    const state = {
      ...(anchor ? { scrollTo: anchor.replace(/^#/, "") } : {}),
      ...(subject ? { subject } : {}),
    };
    navigate(path, { state });
  }

  if (typeof closeMenu === "function") closeMenu(false);
};
