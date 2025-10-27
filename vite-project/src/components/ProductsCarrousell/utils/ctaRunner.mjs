import {
  goToProducts,
  goToMesoStories,
  goToContactForm as goToContactFormAction,
} from "./ScrollToCarroussel.js";

const ACTIONS = {
  goToProducts: (navigate, location, closeMenu) =>
    goToProducts(navigate, location, closeMenu),

  goToMesoStories: (navigate, location, closeMenu, payload) =>
    goToMesoStories(navigate, location, closeMenu, payload?.anchor),

  goToContactForm: (navigate, location, closeMenu, payload) => {
    const anchor =
      typeof payload === "object" && payload !== null ? payload.anchor : undefined;
    const subject =
      typeof payload === "object" && payload !== null ? payload.subject : undefined;
    goToContactFormAction(navigate, location, closeMenu, anchor, subject);
  },

  goToMosBuzzUpload: (navigate, location, closeMenu) => {
    if (typeof closeMenu === "function") closeMenu(false);
    navigate("/mesobuzz/upload");
  },
};

export default function runCta(e, item, navigate, location, closeMenu) {
  e?.preventDefault?.(); // make sure Button never triggers a page load
  const fn = ACTIONS[item?.action];
  if (typeof fn === "function") fn(navigate, location, closeMenu, item?.payload);
  if (typeof closeMenu === "function") closeMenu(false);
}
