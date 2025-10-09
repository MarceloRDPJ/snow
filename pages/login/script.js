document.addEventListener("DOMContentLoaded", () => {
    // --- Slider Elements and Logic ---
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton) {
        signUpButton.addEventListener('click', () => container.classList.add("right-panel-active"));
    }
    if (signInButton) {
        signInButton.addEventListener('click', () => container.classList.remove("right-panel-active"));
    }

    // --- Panda Animation Elements ---
    const allInputs = document.querySelectorAll('input');
    const eyeballs = document.querySelectorAll(".eyeball-l, .eyeball-r");
    const eyeL = document.querySelector(".eyeball-l");
    const eyeR = document.querySelector(".eyeball-r");

    let isInputFocused = false;

    // --- Core Animation Functions ---
    const moveEyes = (event) => {
        if (isInputFocused) return;
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        const normalizedX = (clientX / innerWidth) * 2 - 1;
        const normalizedY = (clientY / innerHeight) * 2 - 1;
        const maxMove = 4;
        const moveX = normalizedX * maxMove;
        const moveY = normalizedY * maxMove;
        eyeballs.forEach(eyeball => {
            eyeball.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
        });
    };

    const closeEyes = () => {
        eyeballs.forEach(eyeball => {
            eyeball.style.height = '0.1em';
            eyeball.style.top = '1em';
        });
    };

    const openEyes = () => {
         eyeballs.forEach(eyeball => {
            eyeball.style.height = '0.6em';
            eyeball.style.top = '50%';
        });
    };

    const onFocus = (event) => {
        isInputFocused = true;
        if (event.target.type === 'password') {
            closeEyes();
        } else {
            eyeballs.forEach(eyeball => {
                eyeball.style.transform = 'translate(-50%, -50%) translate(0px, 5px)';
            });
        }
    };

    const onBlur = () => {
        isInputFocused = false;
        openEyes();
        eyeballs.forEach((eyeball) => {
            eyeball.style.transform = `translate(-50%, -50%)`;
        });
    };

    // --- Attach Event Listeners ---
    document.addEventListener("mousemove", moveEyes);
    allInputs.forEach(input => {
        input.addEventListener("focus", onFocus);
        input.addEventListener("blur", onBlur);
    });

    const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.stopPropagation();
            const passwordInput = icon.previousElementSibling;
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
                // Peek with the right eye
                if(eyeR) {
                    eyeR.style.height = '0.6em';
                    eyeR.style.top = '50%';
                }
            } else {
                passwordInput.type = "password";
                icon.innerHTML = '<i class="fas fa-eye"></i>';
                // Close the right eye again
                if(eyeR) {
                    eyeR.style.height = '0.1em';
                    eyeR.style.top = '1em';
                }
            }
        });
    });
});