// JoinTheWaitingListAction.jsx
import Button from "../UtilsComponent/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { goToContactForm } from "./utils/ScrollToCarroussel";

export default function JoinTheWaitingListAction({ soldOut, onBuy, closeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleJoinWaitlist = () => {
    // change "waitlist" to the ID you want to scroll to on /contact
    goToContactForm(navigate, location, closeMenu, "waitlist");
  };

  if (soldOut) {
    return (
      <Button
        type="button"
        onClick={handleJoinWaitlist}
        className="w-full h-10 md:h-11 inline-flex items-center justify-center rounded-full text-sm md:text-base font-semibold active:scale-95"
      >
        Join the Waiting List
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={onBuy}
      className="w-full h-10 md:h-11 inline-flex items-center justify-center rounded-full text-sm md:text-base font-semibold active:scale-95"
    >
      Buy Now
    </Button>
  );
}
