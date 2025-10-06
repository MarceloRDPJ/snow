document.addEventListener("DOMContentLoaded", () => {
  const usernameRef = document.getElementById("username");
  const passwordRef = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const eyeL = document.querySelector(".eyeball-l");
  const eyeR = document.querySelector(".eyeball-r");
  const handL = document.querySelector(".hand-l");
  const handR = document.querySelector(".hand-r");

  const setEyePosition = (left, top) => {
    eyeL.style.left = left;
    eyeL.style.top = top;
    eyeR.style.left = left;
    eyeR.style.top = top;
  };

  const setHandsToNormal = () => {
    handL.classList.remove("hiding");
    handR.classList.remove("hiding", "peeking");
  };

  const setHandsToHiding = () => {
    handL.classList.add("hiding");
    handR.classList.remove("peeking");
    handR.classList.add("hiding");
  };

  const setHandToPeeking = () => {
    handL.classList.add("hiding");
    handR.classList.remove("hiding");
    handR.classList.add("peeking");
  };

  usernameRef.addEventListener("focus", () => {
    setEyePosition("0.75em", "0.8em");
    setHandsToNormal();
  });

  passwordRef.addEventListener("focus", () => {
    setEyePosition("0.5em", "0.5em");
    setHandsToHiding();
  });

  document.addEventListener("click", (e) => {
    if (e.target !== usernameRef && e.target !== passwordRef) {
      setEyePosition("0.5em", "0.5em");
      setHandsToNormal();
    }
  });

  togglePassword.addEventListener("click", (e) => {
    // FIX: Stop this click from bubbling up to the document listener
    e.stopPropagation();

    if (!handL.classList.contains("hiding")) return;

    if (passwordRef.type === "password") {
      passwordRef.type = "text";
      setHandToPeeking();
      togglePassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07L3 3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    } else {
      passwordRef.type = "password";
      setHandsToHiding();
      togglePassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
  });
});