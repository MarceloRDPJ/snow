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

        this.clock = new THREE.Clock(); // Initialize the clock
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

        // Aurora
        this.createAurora();

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
        this.snowLayers = [];
        const layerData = [
            { count: 2000, size: 0.15, speed: 0.04, yRange: 100 }, // Foreground
            { count: 5000, size: 0.1, speed: 0.02, yRange: 120 },  // Midground
            { count: 8000, size: 0.05, speed: 0.01, yRange: 150 }   // Background
        ];

        layerData.forEach(data => {
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(data.count * 3);

            for (let i = 0; i < data.count * 3; i++) {
                positions[i] = (Math.random() - 0.5) * data.yRange;
            }
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const particleMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: data.size,
                transparent: true,
                opacity: 0.8,
                depthWrite: false // Helps with transparency issues
            });

            const snowLayer = new THREE.Points(particles, particleMaterial);
            snowLayer.userData.speed = data.speed; // Store speed for animation
            snowLayer.userData.yRange = data.yRange;
            this.scene.add(snowLayer);
            this.snowLayers.push(snowLayer);
        });
    }

    createAurora() {
        const vertexShader = `
            uniform float uTime;
            varying float vNoise;
            void main() {
                vec3 pos = position;
                // A simple sine wave for a wavy effect, made more complex by combining functions
                float wave = sin(pos.x * 0.1 + uTime * 0.3) * cos(pos.y * 0.2 + uTime * 0.2);
                pos.z += wave * 3.0; // Make the curtain wave
                vNoise = (sin(pos.x * 0.05 + uTime * 0.5) + 1.0) / 2.0; // Noise for color and transparency
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        const fragmentShader = `
            varying float vNoise;
            void main() {
                // Mix between green and a touch of cyan based on noise
                vec3 color = vec3(0.0, 1.0, 0.5) * vNoise;
                // Fade out at the edges
                float alpha = vNoise * 0.5;
                gl_FragColor = vec4(color, alpha);
            }
        `;

        this.auroraMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0.0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const auroraGeometry = new THREE.PlaneGeometry(100, 20, 100, 20); // More segments for smoother waves
        const aurora = new THREE.Mesh(auroraGeometry, this.auroraMaterial);
        aurora.position.set(0, 20, -50); // Position it high and far back
        this.scene.add(aurora);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const elapsedTime = this.clock.getElapsedTime();

        // Animate multi-layered snow falling with drift
        this.snowLayers.forEach(layer => {
            const positions = layer.geometry.attributes.position.array;
            const speed = layer.userData.speed;
            const range = layer.userData.yRange / 2;

            for (let i = 0; i < positions.length; i += 3) {
                // Y-axis (falling)
                positions[i + 1] -= speed;

                // X-axis (drifting) - use sine wave for gentle sway
                // The drift is tied to elapsed time and the particle's y-position for variety
                positions[i] += Math.sin(elapsedTime * 0.5 + positions[i+1] * 0.3) * speed * 0.1;

                // If particle is out of bounds, reset it to the top with a new random X position
                if (positions[i + 1] < -range) {
                    positions[i + 1] = range;
                    positions[i] = (Math.random() - 0.5) * layer.userData.yRange;
                }
            }
            layer.geometry.attributes.position.needsUpdate = true;
        });

        // Update aurora shader time uniform
        if (this.auroraMaterial) {
            this.auroraMaterial.uniforms.uTime.value = elapsedTime;
        }

        // Update the scroll-based animation
        if (this.scrollAnimation) {
            this.scrollAnimation.update();
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