// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

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
export const storage = getStorage(app);
