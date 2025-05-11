import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// DOM Elements
const postContent = document.getElementById("post-content");
const postButton = document.getElementById("post-button");
const feed = document.getElementById("feed");
const userSearch = document.getElementById("user-search");
const searchResults = document.getElementById("search-results");
const userAvatar = document.getElementById("user-avatar");

// Initialize feed when page loads and user is authenticated
auth.onAuthStateChanged((user) => {
  if (user && feed) {
    loadFeed();
  }
});

// Set user avatar
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      userAvatar.src = userDoc.data().photoURL || "assets/default-avatar.svg";
    }
  }
});

// Create new post
if (postButton) {
  postButton.addEventListener("click", async () => {
    if (!postContent.value.trim()) return;

    try {
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      await addDoc(collection(db, "posts"), {
        content: postContent.value,
        userId: user.uid,
        username: userDoc.data().username,
        displayName: user.displayName,
        photoURL: userDoc.data().photoURL || "assets/default-avatar.svg",
        createdAt: new Date().toISOString(),
        likes: 0,
      });

      postContent.value = "";
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post: " + error.message);
    }
  });
}

// Load feed posts
const loadFeed = () => {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  onSnapshot(postsQuery, (snapshot) => {
    feed.innerHTML = "";
    snapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = createPostElement(post, doc.id);
      feed.appendChild(postElement);
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

// User search functionality
if (userSearch) {
  userSearch.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 2) {
      searchResults.innerHTML = "";
      return;
    }

    const usersQuery = query(
      collection(db, "users"),
      where("username", ">=", searchTerm),
      where("username", "<=", searchTerm + "\uf8ff"),
      limit(5)
    );

    const snapshot = await getDocs(usersQuery);
    searchResults.innerHTML = "";

    snapshot.forEach((doc) => {
      const user = doc.data();
      const div = document.createElement("div");
      div.className = "search-result-item";
      div.innerHTML = `
                <img src="${
                  user.photoURL || "assets/default-avatar.svg"
                }" alt="${user.displayName}">
                <div class="search-result-info">
                    <h4>${user.displayName}</h4>
                    <p>${user.username}</p>
                </div>
            `;
      div.addEventListener("click", () => {
        window.location.href = `profile.html?uid=${doc.id}`;
      });
      searchResults.appendChild(div);
    });
  });
}

// Initialize feed
loadFeed();
