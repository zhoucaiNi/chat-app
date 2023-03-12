import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "chat-b7698.firebaseapp.com",
  projectId: "chat-b7698",
  storageBucket: "chat-b7698.appspot.com",
  messagingSenderId: "210988438718",
  appId: "1:210988438718:web:c5bf8a03b8d24287017aef",
  measurementId: "G-XPZMF3MD93"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();