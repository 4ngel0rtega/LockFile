// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUb_5z7mPf-2J-cL0tTRj8MpjpP5qEPR4",
  authDomain: "lock-user.firebaseapp.com",
  projectId: "lock-user",
  storageBucket: "lock-user.firebasestorage.app",
  messagingSenderId: "607219314525",
  appId: "1:607219314525:web:1247e0d5cc37acc72dc2b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }