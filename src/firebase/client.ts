// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv0ttbQifF6HcEH0XN_f2xyRvbzgjf2GI",
  authDomain: "interview-assist-b0332.firebaseapp.com",
  projectId: "interview-assist-b0332",
  storageBucket: "interview-assist-b0332.firebasestorage.app",
  messagingSenderId: "210677046979",
  appId: "1:210677046979:web:865f8433ac975345354c76",
  measurementId: "G-M85QL4C7BD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);