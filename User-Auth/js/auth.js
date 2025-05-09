const auth = firebase.auth();

document.getElementById("googleBtn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then(() => {
      window.location.href = "../pages/index.html";
    })
    .catch((error) => alert(error.message));
});
