import { auth, db, storage } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

// DOM Elements
const profileImg = document.getElementById("profile-img");
const bannerImg = document.getElementById("banner-img");
const displayName = document.getElementById("display-name");
const username = document.getElementById("username");
const bioText = document.getElementById("bio-text");
const socialLinks = document.getElementById("social-links");
const editProfileBtn = document.getElementById("edit-profile");
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-profile-form");
const closeModal = document.querySelector(".close");
const userPosts = document.getElementById("user-posts");

let currentUser = null;
let profileUser = null;

// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// Initialize profile
const initializeProfile = async () => {
  currentUser = auth.currentUser;
  const userDocRef = doc(db, "users", uid || currentUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    profileUser = { id: userDoc.id, ...userDoc.data() };
    updateProfileUI(profileUser);
    loadUserPosts(profileUser.id);

    // Show/hide edit button
    if (currentUser.uid === profileUser.id) {
      editProfileBtn.style.display = "block";
    } else {
      editProfileBtn.style.display = "none";
    }
  }
};

// Update profile UI
const updateProfileUI = (user) => {
  profileImg.src = user.photoURL || "assets/default-avatar.svg";
  bannerImg.src = user.banner || "assets/default-banner.svg";
  displayName.textContent = user.displayName;
  username.textContent = user.username;
  bioText.textContent = user.bio || "No bio yet";

  // Update social links
  socialLinks.innerHTML = "";
  const links = user.socialLinks || {};
  Object.entries(links).forEach(([platform, url]) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.innerHTML = `<i class="fab fa-${platform}"></i>`;
      socialLinks.appendChild(link);
    }
  });
};

// Load user posts
const loadUserPosts = (userId) => {
  const postsQuery = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  onSnapshot(postsQuery, (snapshot) => {
    userPosts.innerHTML = "";
    snapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = createPostElement(post, doc.id);
      userPosts.appendChild(postElement);
    });
  });
};

// Create post element
const createPostElement = (post, postId) => {
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `
        <div class="post-header">
            <img src="${post.photoURL || "assets/default-avatar.svg"}" alt="${
    post.displayName
  }">
            <div class="post-header-info">
                <h3>${post.displayName} <span>${post.username}</span></h3>
                <span>${new Date(post.createdAt).toLocaleString()}</span>
            </div>
        </div>
        <div class="post-content">
            ${post.content}
        </div>
    `;
  return div;
};

// Handle profile picture upload
document
  .getElementById("avatar-upload")
  .addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExtension = file.name.split(".").pop();
      const storageRef = ref(
        storage,
        `avatars/${currentUser.uid}.${fileExtension}`
      );
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", currentUser.uid), { photoURL });
      profileImg.src = photoURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert(error.message);
    }
  });

// Handle banner upload
document
  .getElementById("banner-upload")
  .addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExtension = file.name.split(".").pop();
      const storageRef = ref(
        storage,
        `banners/${currentUser.uid}.${fileExtension}`
      );
      await uploadBytes(storageRef, file);
      const bannerURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", currentUser.uid), { banner: bannerURL });
      bannerImg.src = bannerURL;
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert(error.message);
    }
  });

// Modal handlers
editProfileBtn.addEventListener("click", () => {
  const user = profileUser;
  document.getElementById("edit-display-name").value = user.displayName;
  document.getElementById("edit-bio").value = user.bio || "";
  document.getElementById("edit-website").value =
    user.socialLinks?.website || "";
  document.getElementById("edit-twitter").value =
    user.socialLinks?.twitter || "";
  document.getElementById("edit-instagram").value =
    user.socialLinks?.instagram || "";
  document.getElementById("edit-linkedin").value =
    user.socialLinks?.linkedin || "";
  editModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

// Handle profile updates
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updates = {
    displayName: document.getElementById("edit-display-name").value,
    bio: document.getElementById("edit-bio").value,
    socialLinks: {
      website: document.getElementById("edit-website").value,
      twitter: document.getElementById("edit-twitter").value,
      instagram: document.getElementById("edit-instagram").value,
      linkedin: document.getElementById("edit-linkedin").value,
    },
  };

  try {
    await updateDoc(doc(db, "users", currentUser.uid), updates);
    editModal.style.display = "none";
    Object.assign(profileUser, updates);
    updateProfileUI(profileUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(error.message);
  }
});

// Initialize profile when auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    initializeProfile();
  }
});
