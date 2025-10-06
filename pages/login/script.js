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

  // State Machine Core: Manages the bear's state transitions
  const setState = (newState) => {
    // Don't re-trigger the same state
    if (currentState === newState) return;

    currentState = newState;

    // Reset all classes before applying the new state
    handL.classList.remove("hiding");
    handR.classList.remove("hiding", "peeking");
    eyeL.style.transform = "translate(0, 0)";
    eyeR.style.transform = "translate(0, 0)";

    // Apply styles for the new state
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
        handL.classList.add("hiding"); // Left hand stays hiding
        handR.classList.add("peeking"); // Right hand moves to peek
        break;
      case "normal":
      default:
        // Styles are already reset, so no action needed
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

  // When clicking away, reset to normal state
  document.addEventListener("click", (e) => {
    if (e.target !== usernameRef && e.target !== passwordRef && !e.target.closest("#toggle-password")) {
      setState("normal");
    }
  });

  // Handle the peeking logic
  togglePassword.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents the document click listener from resetting the state

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

  // Initialize
  setState("normal");
});