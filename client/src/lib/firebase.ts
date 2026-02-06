import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables for security
// In production (Vercel), these are set in the Vercel dashboard
// For local development, create a .env file with these values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDzbjiOTV1vFCXiGhgCD_drkT3XRbEmbSc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "srikanakadurga-nursery.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "srikanakadurga-nursery",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "srikanakadurga-nursery.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "996192039580",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:996192039580:web:7b8df51d4c7ee9ca607359",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0VTSSC4CMC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
