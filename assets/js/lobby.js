// assets/js/lobby.js - Interactive Constellation Orchestrator

document.addEventListener('DOMContentLoaded', () => {
    const universe = document.getElementById('universe');
    const nodes = document.querySelectorAll('.project-node');

    nodes.forEach(node => {
        const closeButton = node.querySelector('.close-card');
        const externalLink = node.querySelector('a[target="_blank"]');

        const focusNode = (event) => {
            // Impede que o clique se propague para o universo (o que causaria um desfoco imediato)
            event.stopPropagation();

            // Não faz nada se outro nó já estiver focado
            if (universe.classList.contains('is-focused')) {
                return;
            }

            // Adiciona as classes que acionam as animações CSS
            universe.classList.add('is-focused');
            node.classList.add('is-focused');
        };

        const unfocusNode = (event) => {
            // Impede que o clique no botão se propague para o nó pai (o que causaria um foco)
            if (event) {
                event.stopPropagation();
            }

            universe.classList.remove('is-focused');
            node.classList.remove('is-focused');
        };

        // Adiciona o listener para focar no nó
        node.addEventListener('click', focusNode);

        // Adiciona o listener para desfocar através do botão "Fechar"
        if (closeButton) {
            closeButton.addEventListener('click', unfocusNode);
        }

        // Se houver um link externo, impede que o clique nele acione o foco
        if (externalLink) {
            externalLink.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
    });

    // Adiciona um listener ao universo para desfocar quando se clica no "fundo"
    universe.addEventListener('click', () => {
        const focusedNode = document.querySelector('.project-node.is-focused');
        if (focusedNode) {
            universe.classList.remove('is-focused');
            focusedNode.classList.remove('is-focused');
        }
    });
});