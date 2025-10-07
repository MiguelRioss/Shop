import { goToProducts, goToMesoStories } from "./ScrollToCarroussel.js";

const ACTIONS = {
  goToProducts: (navigate, location, closeMenu) =>
    goToProducts(navigate, location, closeMenu),

  goToMesoStories: (navigate, location, closeMenu, payload) =>
    goToMesoStories(navigate, location, closeMenu, payload?.anchor),
};

export default function runCta(e, item, navigate, location, closeMenu) {
  e?.preventDefault?.(); // make sure Button never triggers a page load
  const fn = ACTIONS[item?.action];
  if (typeof fn === "function") fn(navigate, location, closeMenu, item?.payload);
  if (typeof closeMenu === "function") closeMenu(false);
}
