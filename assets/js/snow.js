// assets/js/snow.js

class SnowEffect {
    constructor(container = document.body) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 150; // Número de partículas de neve

        this.init();
    }

    init() {
        // Estiliza o canvas para ficar no fundo, sem interferir com o conteúdo
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none'; // Impede que o canvas intercepte cliques
        this.canvas.style.zIndex = '-1'; // Coloca o canvas atrás de todo o conteúdo

        this.container.appendChild(this.canvas);
        this.onResize();

        window.addEventListener('resize', () => this.onResize());

        this.createParticles();
        this.animate();
    }

    onResize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1, // Raio entre 1 e 3
                density: Math.random() * this.particleCount,
                speedY: Math.random() * 1 + 0.5, // Velocidade de queda
                speedX: Math.random() * 1 - 0.5  // Movimento lateral
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(248, 249, 250, 0.8)'; // Cor da neve (#F8F9FA)
        this.ctx.beginPath();
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.moveTo(p.x, p.y);
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
        }
        this.ctx.fill();
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Atualiza a posição
            p.y += p.speedY;
            p.x += p.speedX;

            // Se a partícula sair da tela, reposiciona-a no topo com uma nova posição X
            if (p.y > this.canvas.height) {
                p.y = -10;
                p.x = Math.random() * this.canvas.width;
            }
            if (p.x > this.canvas.width) {
                p.x = 0;
            } else if (p.x < 0) {
                p.x = this.canvas.width;
            }
        }
    }

    animate() {
        this.draw();
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializa o efeito de neve assim que o script for carregado
new SnowEffect();