document.addEventListener("DOMContentLoaded", () => {
    // Slider functionality
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton) {
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });
    }

    if (signInButton) {
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    }

    // --- Panda Animation Logic ---
    const usernameRef = document.querySelector('input[type="email"]');
    const passwordRef = document.querySelector('input[type="password"]');
    const eyeballs = document.querySelectorAll(".eyeball-l, .eyeball-r");
    const handL = document.querySelector(".hand-l");
    const handR = document.querySelector(".hand-r");

    const moveEyes = (event) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        const normalizedX = (clientX / innerWidth) * 2 - 1;
        const normalizedY = (clientY / innerHeight) * 2 - 1;
        const maxMove = 4;
        const moveX = normalizedX * maxMove;
        const moveY = normalizedY * maxMove;

        eyeballs.forEach((eyeball) => {
            eyeball.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
        });
    };

    const onFocus = (event) => {
        document.removeEventListener("mousemove", moveEyes);
        if (event.target === passwordRef) {
            handL.classList.add("hiding");
            handR.classList.add("hiding");
        } else {
            eyeballs.forEach(eyeball => {
                eyeball.style.transform = 'translate(-50%, -50%) translate(0px, 5px)';
            });
        }
    };

    const onBlur = () => {
        handL.classList.remove("hiding", "peeking");
        handR.classList.remove("hiding", "peeking");
        document.addEventListener("mousemove", onMouseMove);
    };

    document.addEventListener("mousemove", onMouseMove);

    // We need to select the inputs more carefully as there are multiple
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener("focus", onFocus);
        input.addEventListener("blur", onBlur);
    });

    // Note: The peeking logic for the password is not in the new HTML.
    // This logic can be re-added if a toggle button is present.
});