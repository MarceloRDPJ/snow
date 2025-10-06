document.addEventListener('DOMContentLoaded', () => {
    // --- Parallax Effect ---
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    // Assign data-speed attributes dynamically if not set in HTML
    parallaxLayers.forEach(layer => {
        if (!layer.dataset.speed) {
            switch (layer.id) {
                case 'parallax-sky': layer.dataset.speed = 0.05; break;
                case 'parallax-stars': layer.dataset.speed = 0.1; break;
                case 'parallax-mountains-far': layer.dataset.speed = 0.2; break;
                case 'parallax-mountains-mid': layer.dataset.speed = 0.4; break;
                case 'parallax-mountains-close': layer.dataset.speed = 0.6; break;
                case 'parallax-ground': layer.dataset.speed = 0.8; break;
                default: layer.dataset.speed = 0.5;
            }
        }
    });

    const handleParallax = () => {
        const scrollY = window.scrollY;
        parallaxLayers.forEach(layer => {
            const speed = layer.dataset.speed;
            const yPos = scrollY * speed;
            layer.style.transform = `translateY(${yPos}px)`;
        });
    };

    // --- Snow Effect ---
    const snowContainer = document.getElementById('parallax-container');
    const createSnowflake = () => {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');

        const size = Math.random() * 3 + 1;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;

        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5 to 10 seconds
        snowflake.style.animationDelay = `${Math.random() * 5}s`;

        snowContainer.appendChild(snowflake);

        // Remove snowflake after it falls
        setTimeout(() => {
            snowflake.remove();
        }, 10000);
    };

    // Generate snowflakes periodically
    setInterval(createSnowflake, 200);

    // --- Content Section Visibility ---
    const sections = document.querySelectorAll('.content-section');
    const handleContentVisibility = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

        const sectionThresholds = [
            { id: 'intro', start: 0, end: 0.3 },
            { id: 'login-section', start: 0.4, end: 0.7 },
            { id: 'construction-section', start: 0.8, end: 1.0 }
        ];

        sections.forEach(section => section.classList.remove('visible'));

        const activeSection = sectionThresholds.find(s => scrollPercent >= s.start && scrollPercent < s.end);
        if (activeSection) {
            document.getElementById(activeSection.id).classList.add('visible');
        }
    };

    // --- Scroll Event Listener ---
    const handleScroll = () => {
        handleParallax();
        handleContentVisibility();
    };

    window.addEventListener('scroll', handleScroll);

    // Initial call to set positions
    handleScroll();
});