// assets/js/lobby.js - Premium Experience Logic

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.scroll-section');
    const cards = document.querySelectorAll('.project-card');

    // --- 1. Animação de Foco com Intersection Observer ---
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // Adiciona/remove a classe .is-active com base na visibilidade
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                } else {
                    entry.target.classList.remove('is-active');
                }
            });
        },
        {
            root: null, // Observa a viewport
            rootMargin: '0px',
            threshold: 0.6, // Considera "ativo" quando 60% do item está visível
        }
    );

    // Observa cada secção
    sections.forEach((section) => {
        observer.observe(section);
    });


    // --- 2. Micro-interação de Inclinação 3D nos Cartões ---
    cards.forEach((card) => {
        const rotationIntensity = 8; // Graus de inclinação

        card.addEventListener('mousemove', (event) => {
            const { clientX, clientY } = event;
            const { left, top, width, height } = card.getBoundingClientRect();

            // Calcula a posição do rato dentro do cartão (-0.5 a 0.5)
            const mouseX = (clientX - left) / width - 0.5;
            const mouseY = (clientY - top) / height - 0.5;

            // Calcula os ângulos de rotação
            const rotateX = -mouseY * rotationIntensity;
            const rotateY = mouseX * rotationIntensity;

            // Aplica a transformação 3D
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reseta a transformação quando o rato sai do cartão
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
});