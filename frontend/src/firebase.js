// frontend/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3s4Ubvsbmw9EPKodKGJE3HRKIM3j36aI",
  authDomain: "aram-seivom.firebaseapp.com",
  projectId: "aram-seivom",
  storageBucket: "aram-seivom.firebasestorage.app",
  messagingSenderId: "947316494805",
  appId: "1:947316494805:web:2a4321e174463175d2ad5c",
  measurementId: "G-4SG2KG8ERR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Default Export
export default app;