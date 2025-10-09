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
    const pandaFace = document.querySelector(".panda-face");
    const eyeballs = document.querySelectorAll(".eyeball-l, .eyeball-r");

    // --- Core Animation Functions ---
    const moveEyes = (event) => {
        // Don't move eyes if they are in a specific state
        if (pandaFace.classList.contains('eyes-closed') || pandaFace.classList.contains('eyes-looking-down') || pandaFace.classList.contains('eye-peeking')) {
            return;
        }
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

    const onFocus = (event) => {
        // First, remove all state classes to ensure a clean slate
        pandaFace.classList.remove('eyes-closed', 'eyes-looking-down', 'eye-peeking');

        if (event.target.type === 'password') {
            pandaFace.classList.add('eyes-closed');
        } else {
            pandaFace.classList.add('eyes-looking-down');
        }
    };

    const onBlur = () => {
        pandaFace.classList.remove('eyes-closed', 'eyes-looking-down', 'eye-peeking');
        // Reset eye position
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
        // Use mousedown to prevent the input from losing focus
        icon.addEventListener("mousedown", (e) => {
            e.preventDefault(); // Prevent input blur
            const passwordInput = icon.previousElementSibling;

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
                pandaFace.classList.remove('eyes-closed');
                pandaFace.classList.add('eye-peeking');
            } else {
                passwordInput.type = "password";
                icon.innerHTML = '<i class="fas fa-eye"></i>';
                pandaFace.classList.remove('eye-peeking');
                pandaFace.classList.add('eyes-closed');
            }
        });
    });
});