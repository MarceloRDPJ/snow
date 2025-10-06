document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const usernameRef = document.getElementById("username");
  const passwordRef = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const eyeL = document.querySelector(".eyeball-l");
  const eyeR = document.querySelector(".eyeball-r");
  const handL = document.querySelector(".hand-l");
  const handR = document.querySelector(".hand-r");

  let currentState = "normal";

  // State Machine Core
  const setState = (newState) => {
    currentState = newState;

    // Reset all classes and styles before applying new ones
    handL.classList.remove("hiding");
    handR.classList.remove("hiding", "peeking");
    eyeL.style.transform = "translate(0, 0)";
    eyeR.style.transform = "translate(0, 0)";

    switch (newState) {
      case "watching":
        eyeL.style.transform = "translate(5px, 8px)";
        eyeR.style.transform = "translate(5px, 8px)";
        break;
      case "hiding":
        handL.classList.add("hiding");
        handR.classList.add("hiding");
        break;
      case "peeking":
        handL.classList.add("hiding");
        handR.classList.add("peeking");
        break;
      case "normal":
      default:
        // Already reset, so no extra action needed
        break;
    }
  };

  // Event Listeners
  usernameRef.addEventListener("focus", () => {
    setState("watching");
  });

  passwordRef.addEventListener("focus", () => {
    setState("hiding");
  });

  document.addEventListener("click", (e) => {
    if (e.target !== usernameRef && e.target !== passwordRef && !e.target.closest("#toggle-password")) {
      setState("normal");
    }
  });

  togglePassword.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent document click listener from firing

    if (currentState === "hiding") {
      passwordRef.type = "text";
      setState("peeking");
      togglePassword.innerHTML = '<i data-feather="eye-off"></i>';
      feather.replace();
    } else if (currentState === "peeking") {
      passwordRef.type = "password";
      setState("hiding");
      togglePassword.innerHTML = '<i data-feather="eye"></i>';
      feather.replace();
    }
  });

  // Initialize with a normal state
  setState("normal");
});