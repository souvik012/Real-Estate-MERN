// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8ab49.firebaseapp.com",
  projectId: "mern-estate-8ab49",
  storageBucket: "mern-estate-8ab49.firebasestorage.app",
  messagingSenderId: "1090989010788",
  appId: "1:1090989010788:web:25bef9b0a33c3d68d39471"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);