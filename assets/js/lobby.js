document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.horizontal-scroll-container');

    if (container) {
        container.addEventListener('wheel', (event) => {
            // Previne o comportamento padrão de rolagem (vertical)
            event.preventDefault();

            // Adiciona o deltaY (rolagem vertical do mouse) ao scrollLeft (rolagem horizontal do container)
            // Isso efetivamente converte a rolagem vertical em horizontal
            container.scrollLeft += event.deltaY;
        }, { passive: false }); // 'passive: false' é necessário para que o preventDefault funcione
    }
});