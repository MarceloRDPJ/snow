import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import ScrollAnimation from './scroll-animation.js';

class World {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this.init();
    }

    init() {
        // Renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('three-container').appendChild(this.renderer.domElement);

        // Camera
        this.camera.position.z = 15;
        this.camera.position.y = 2;

        // Fog
        this.scene.fog = new THREE.Fog(0x0d1a26, 10, 60);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xccddee, 0.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(10, 20, 15);
        this.scene.add(directionalLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -5;
        this.scene.add(ground);

        // Mountains
        this.createMountains();

        // Snow Particles
        this.createSnow();

        // Start animation loop
        this.animate();
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Initialize scroll-based camera animation
        this.scrollAnimation = new ScrollAnimation(this);
    }

    createMountain(size, x, z) {
        const geometry = new THREE.ConeGeometry(size, size * 1.6, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0x607d8b,
            flatShading: true,
        });
        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.set(x, size * 0.8 - 5, z); // Adjust y based on size
        this.scene.add(mountain);

        const snowCapSize = size * 0.4;
        const snowGeometry = new THREE.ConeGeometry(snowCapSize, snowCapSize * 1.5, 8);
        const snowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            flatShading: true,
        });
        const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
        snowCap.position.y = size * 0.8;
        mountain.add(snowCap);

        return mountain;
    }

    createMountains() {
        this.createMountain(8, -15, -20);
        this.createMountain(10, 5, -30);
        this.createMountain(6, 20, -15);
        this.createMountain(12, -25, -40);
        this.createMountain(9, 30, -35);
    }

    createSnow() {
        const particleCount = 10000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        this.snow = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.snow);
    }


    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Animate snow falling
        if (this.snow) {
            this.snow.rotation.y += 0.0005;
            const positions = this.snow.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= 0.02; // Move down
                if (positions[i] < -50) {
                    positions[i] = 50; // Reset to top
                }
            }
            this.snow.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.world = new World();