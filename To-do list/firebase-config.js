import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqsciuKGOcA6YgNqldYM5l5TQckfVzpqo",
  authDomain: "game-26cc5.firebaseapp.com",
  projectId: "game-26cc5",
  storageBucket: "game-26cc5.firebasestorage.app",
  messagingSenderId: "11984222266",
  appId: "1:11984222266:web:a2de06db3f4da5442c9d03",
  measurementId: "G-0XFF25675B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
