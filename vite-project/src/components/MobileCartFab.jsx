import CartButton from "../components/UtilsComponent/CartButton.jsx";

export default function MobileCartFab() {
  return (
    <div className="sm:hidden fixed left-4 bottom-4 z-[9999]">
      <CartButton
        style={{ background: "var(--brand-gradient)" }}
      />
    </div>
  );
}
