// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkvFUQUey_12adzDZzycndAUJSURW03Is",
  authDomain: "log-site-2a0a8.firebaseapp.com",
  projectId: "log-site-2a0a8",
  storageBucket: "log-site-2a0a8.appspot.com", // <-- fix typo (.app → .appspot.com)
  messagingSenderId: "1022103121544",
  appId: "1:1022103121544:web:fb1aca908a46aae2a4393d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
