import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCo6WJfv5oKTz3I46djiSAu8a3HsE28ycE",
    authDomain: "bingo-bbfe9.firebaseapp.com",
    projectId: "bingo-bbfe9",
    storageBucket: "bingo-bbfe9.firebasestorage.app",
    messagingSenderId: "717657138370",
    appId: "1:717657138370:web:e0a4594c96e69b69f4075b",
    measurementId: "G-SHBGB3GDL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
