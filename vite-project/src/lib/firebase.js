// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // 👈 add this
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBz1yK3-aPZKp1AH_WUSW7VLE59Xl4iGx8",
  authDomain: "storageproducts-bbe30.firebaseapp.com",
  databaseURL: "https://storageproducts-bbe30-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "storageproducts-bbe30",
  storageBucket: "storageproducts-bbe30.firebasestorage.app", // ← exact value from console
  messagingSenderId: "878194109069",
  appId: "1:878194109069:web:56ff48f9c87e6ddca950c4",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
console.log("storageBucket from config:", app.options?.storageBucket);