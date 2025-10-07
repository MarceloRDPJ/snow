document.addEventListener('DOMContentLoaded', () => {
    // Para garantir compatibilidade entre navegadores, usamos document.scrollingElement,
    // que retorna o elemento que de fato rola (seja <body> ou <html>).
    const scrollContainer = document.scrollingElement || document.documentElement;

    window.addEventListener('wheel', (event) => {
        // Previne o scroll vertical padrão para que possamos controlá-lo.
        event.preventDefault();
        // Adiciona o movimento da roda do rato (deltaY) à posição de scroll horizontal.
        scrollContainer.scrollLeft += event.deltaY;
    }, { passive: false });
});