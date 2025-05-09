import { auth, db } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Logout functionality
document.getElementById("logout").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "./login.html";
  } catch (error) {
    console.error("Error signing out:", error);
  }
});

// Add task functionality
document.getElementById("add-task").addEventListener("click", async () => {
  const taskInput = document.getElementById("task-input");
  const task = taskInput.value;

  console.log("Add task clicked:", task);
  console.log("Current user:", auth.currentUser);

  if (!task) {
    console.log("No task entered");
    return;
  }

  if (!auth.currentUser) {
    console.log("No user logged in");
    window.location.href = "./login.html";
    return;
  }

  try {
    const tasksRef = collection(db, "tasks");
    console.log("Adding task to Firestore...");
    const docRef = await addDoc(tasksRef, {
      task,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
    });
    console.log("Task added with ID:", docRef.id);
    taskInput.value = "";
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Failed to add task: " + error.message);
  }
});

// Display tasks
onAuthStateChanged(auth, (user) => {
  if (user) {
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = "";
      snapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc.data().task;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
          try {
            await deleteDoc(doc.ref);
          } catch (error) {
            console.error("Error deleting task:", error);
          }
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    });
  } else {
    window.location.href = "./login.html";
  }
});
