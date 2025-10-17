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

export const goToContactForm = (navigate, location, closeMenu, anchor, subject) => {
  const path = "/mesocontact";
  const url = subject
    ? `${path}?subject=${encodeURIComponent(subject)}`
    : path;

  if (location.pathname === path) {
    if (anchor) {
      const key = anchor.startsWith("#") ? anchor : `#${anchor}`;
      scrollToTarget(key, headerOffset());
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    navigate(url); // 👈 now includes ?subject=...
  }

  if (typeof closeMenu === "function") closeMenu(false);
};

export const goToLegalSection = (
  navigate,
  location,
  closeMenu,
  anchorId
) => {
  const path = "/legal";
  const targetId = (anchorId ?? "").replace(/^#/, "");
  const href = targetId ? `${path}#${targetId}` : path;

  const close = () => {
    if (typeof closeMenu === "function") closeMenu(false);
  };

  if (location.pathname === path) {
    if (targetId) {
      if (window.location.hash !== `#${targetId}`) {
        navigate(href, { replace: true });
      }
      requestAnimationFrame(() => {
        scrollToTarget(`#${targetId}`, headerOffset());
      });
    } else {
      if (window.location.hash) navigate(path, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    close();
    return;
  }

  const options = targetId ? { state: { scrollTo: targetId } } : undefined;
  navigate(href, options);
  close();
};
