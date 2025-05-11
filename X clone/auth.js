import { auth, db } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
  } else if (user && window.location.href.includes("login.html")) {
    window.location.href = "index.html";
  }
});

// Google Sign In
const googleLogin = document.getElementById("google-login");
if (googleLogin) {
  googleLogin.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in database
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(doc(db, "users", result.user.uid), {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL || "assets/default-avatar.svg",
          username: "@" + result.user.email.split("@")[0],
          bio: "",
          banner: "assets/default-banner.svg",
          socialLinks: {
            website: "",
            twitter: "",
            instagram: "",
            linkedin: "",
          },
          createdAt: new Date().toISOString(),
        });
      }

      window.location.href = "index.html";
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message);
    }
  });
}

// Logout functionality
const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error during logout:", error);
      alert(error.message);
    }
  });
}
