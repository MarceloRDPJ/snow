document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.animation-wrapper');

    if (wrapper) {
        document.addEventListener('mousemove', (event) => {
            // Obtém as dimensões da janela
            const { innerWidth, innerHeight } = window;

            // Calcula a posição do rato a partir do centro da tela (-0.5 a 0.5)
            const mouseX = (event.clientX / innerWidth) - 0.5;
            const mouseY = (event.clientY / innerHeight) - 0.5;

            // Define a intensidade do efeito de rotação
            const rotationIntensity = 15; // em graus

            // Calcula os ângulos de rotação
            const rotateX = -mouseY * rotationIntensity; // Invertido para um mapeamento natural
            const rotateY = mouseX * rotationIntensity;

            // Aplica a transformação com uma transição suave já definida no CSS
            wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });

        // Adiciona um evento para quando o rato sai da janela, para resetar a animação
        document.addEventListener('mouseleave', () => {
            wrapper.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }
});