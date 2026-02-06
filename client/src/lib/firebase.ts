import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzbjiOTV1vFCXiGhgCD_drkT3XRbEmbSc",
  authDomain: "srikanakadurga-nursery.firebaseapp.com",
  projectId: "srikanakadurga-nursery",
  storageBucket: "srikanakadurga-nursery.firebasestorage.app",
  messagingSenderId: "996192039580",
  appId: "1:996192039580:web:7b8df51d4c7ee9ca607359",
  measurementId: "G-0VTSSC4CMC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
