let usernameRef = document.getElementById("username");
let passwordRef = document.getElementById("password");
let eyeL = document.querySelector(".eyeball-l");
let eyeR = document.querySelector(".eyeball-r");
let handL = document.querySelector(".hand-l");
let handR = document.querySelector(".hand-r");

// Function to reset eyes to default position
let normalEyeStyle = () => {
  eyeL.style.cssText = `
    left: 0.5em;
    top: 0.5em;
  `;
  eyeR.style.cssText = `
    left: 0.5em;
    top: 0.5em;
  `;
};

// Function to reset hands to default position
let normalHandStyle = () => {
  handL.style.cssText = `
    height: 3em;
    top: 8.4em;
    left: 7.5em;
    transform: rotate(0deg);
  `;
  handR.style.cssText = `
    height: 3em;
    top: 8.4em;
    right: 7.5em;
    transform: rotate(0deg);
  `;
};

// Event listener for username input focus
usernameRef.addEventListener("focus", () => {
  eyeL.style.cssText = `
    left: 0.75em;
    top: 0.8em;
  `;
  eyeR.style.cssText = `
    left: 0.75em;
    top: 0.8em;
  `;
  normalHandStyle();
});

// Event listener for password input focus
passwordRef.addEventListener("focus", () => {
  handL.style.cssText = `
    height: 6em;
    top: 3.5em;
    left: 9.5em;
    transform: rotate(-150deg);
  `;
  handR.style.cssText = `
    height: 6em;
    top: 3.5em;
    right: 9.5em;
    transform: rotate(150deg);
  `;
  normalEyeStyle();
});

// Event listener for clicks outside the inputs
document.addEventListener("click", (e) => {
  let clickedElem = e.target;
  if (clickedElem !== usernameRef && clickedElem !== passwordRef) {
    normalEyeStyle();
    normalHandStyle();
  }
});