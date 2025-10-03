// src/initAuth.js (or inside App startup)
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";

export function initAnonymousAuth() {
  signInAnonymously(auth)
    .then(() => console.log("Signed in anonymously"))
    .catch((err) => console.error("Anon sign-in failed:", err));
  // optionally watch
  onAuthStateChanged(auth, (user) => {
    console.log("Auth state:", user ? user.uid : "signed out");
  });
}
