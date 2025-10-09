// assets/js/lobby.js - 3D Solar System Orchestrator
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#three-canvas'),
            antialias: true,
        });

        this.clock = new THREE.Clock();

        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.currentlyHovered = null;
        this.focusedPlanet = null;
        this.isAnimating = false;
        this.isPaused = false;

        // UI
        this.uiContainer = document.querySelector('.ui-container');
        this.previewTemplate = document.getElementById('preview-template');
        this.detailTemplate = document.getElementById('detail-template');
        this.activeDetailCard = null;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 50;
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Increased ambient light
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        this.createStars();
        this.createGrid();
        this.createCore();
        this.createPlanets();

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', () => this.onClick());

        this.animate();
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const starVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    createGrid() {
        const size = 200;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(size, divisions, '#ff00ff', '#404040');
        gridHelper.position.y = -15;
        this.scene.add(gridHelper);

        const gridHelper2 = new THREE.GridHelper(size, divisions, '#00ffff', '#404040');
        gridHelper2.position.y = -15;
        gridHelper2.rotation.y = Math.PI / 4;
        this.scene.add(gridHelper2);
    }

    createCore() {
        const coreGeometry = new THREE.IcosahedronGeometry(7, 1);
        const coreMaterial = new THREE.MeshStandardMaterial({
            emissive: '#ff00ff',
            emissiveIntensity: 3, // Increased intensity
            wireframe: true,
            color: '#ff00ff'
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        const pointLight = new THREE.PointLight('#ff00ff', 15, 250); // Increased intensity and range
        this.core.add(pointLight);
        this.scene.add(this.core);
    }

    createPlanets() {
        this.planets = [];
        const textureLoader = new THREE.TextureLoader();
        const planetData = [
            { id: 'login', name: 'Login Project', orbitRadius: 20, speed: 0.5, color: '#00ffff', url: 'pages/login/index.html' },
            { id: 'construction', name: 'Página em Construção', orbitRadius: 35, speed: 0.3, color: '#ff00ff', url: 'pages/construction/index.html' }
        ];

        planetData.forEach(data => {
            const planetGroup = new THREE.Group();
            const geometry = new THREE.SphereGeometry(3, 32, 32);
            let material;

            if (data.textureUrl) {
                const texture = textureLoader.load(data.textureUrl);
                material = new THREE.MeshBasicMaterial({ map: texture });
            } else {
                // Apply a cyberpunk wireframe material for planets without a texture
                material = new THREE.MeshStandardMaterial({
                    color: data.color,
                    emissive: data.color,
                    emissiveIntensity: 1.5,
                    wireframe: true
                });
            }

            const planetMesh = new THREE.Mesh(geometry, material);
            planetMesh.position.x = data.orbitRadius;

            planetGroup.add(planetMesh);
            this.scene.add(planetGroup);
            this.planets.push({ ...data, mesh: planetMesh, pivot: planetGroup });
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        if (this.focusedPlanet || this.isAnimating) return;
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onClick() {
        if (this.isAnimating) return;
        if (this.currentlyHovered && !this.focusedPlanet) {
            this.focusOnPlanet(this.currentlyHovered);
        }
    }

    focusOnPlanet(planet) {
        this.focusedPlanet = planet;
        this.isAnimating = true;
        this.previewTemplate.classList.remove('is-visible');

        const planetPosition = new THREE.Vector3();
        planet.mesh.getWorldPosition(planetPosition);

        const targetCameraPosition = new THREE.Vector3(planetPosition.x, planetPosition.y, planetPosition.z + 10);
        this.animateCamera(targetCameraPosition, planetPosition, 1.6, () => {
            this.isAnimating = false;
            this.showDetailCard(planet);
        });
    }

    unfocus() {
        if (this.isAnimating || !this.focusedPlanet) return;
        this.isAnimating = true;

        if (this.activeDetailCard) {
            this.activeDetailCard.classList.remove('is-visible');
            setTimeout(() => { if (this.activeDetailCard) this.activeDetailCard.remove(); this.activeDetailCard = null; }, 400);
        }

        const targetPosition = new THREE.Vector3(0, 0, 50);
        this.animateCamera(targetPosition, new THREE.Vector3(0, 0, 0), 1.6, () => {
            this.isAnimating = false;
            this.focusedPlanet = null;
        });
    }

    animateCamera(targetPosition, targetLookAt, duration, onComplete) {
        const startTime = this.clock.getElapsedTime();
        const startPosition = this.camera.position.clone();

        const startLookAt = new THREE.Vector3();
        this.camera.getWorldDirection(startLookAt).multiplyScalar(10).add(this.camera.position);

        const animate = () => {
            const now = this.clock.getElapsedTime();
            const alpha = Math.min((now - startTime) / duration, 1);
            const easedAlpha = 0.5 * (1 - Math.cos(Math.PI * alpha));

            this.camera.position.lerpVectors(startPosition, targetPosition, easedAlpha);

            const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, easedAlpha);
            this.camera.lookAt(currentLookAt);

            if (alpha < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) onComplete();
            }
        };
        animate();
    }

    showDetailCard(planet) {
        this.activeDetailCard = this.detailTemplate.cloneNode(true);
        this.activeDetailCard.id = `detail-${planet.id}`;
        this.activeDetailCard.querySelector('h2').textContent = planet.name;
        this.activeDetailCard.querySelector('a').href = planet.url;

        const closeButton = this.activeDetailCard.querySelector('.close-card');
        closeButton.addEventListener('click', (e) => { e.stopPropagation(); this.unfocus(); });

        this.uiContainer.appendChild(this.activeDetailCard);
        setTimeout(() => this.activeDetailCard.classList.add('is-visible'), 50);
    }

    checkIntersections() {
        if (this.focusedPlanet || this.isAnimating) {
            if (this.currentlyHovered) {
                this.currentlyHovered = null;
            }
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

        this.currentlyHovered = intersects.length > 0 ? this.planets.find(p => p.mesh === intersects[0].object) : null;
    }

    getScreenPosition(object3D) {
        const vector = new THREE.Vector3();
        object3D.getWorldPosition(vector);
        vector.project(this.camera);
        return {
            x: (vector.x * 0.5 + 0.5) * window.innerWidth,
            y: (vector.y * -0.5 + 0.5) * window.innerHeight,
        };
    }

    updateUI() {
        if (this.currentlyHovered && !this.focusedPlanet) {
            const { x, y } = this.getScreenPosition(this.currentlyHovered.mesh);
            const previewCard = this.previewTemplate;

            previewCard.style.left = `${x + 20}px`;
            previewCard.style.top = `${y - 20}px`;
            previewCard.querySelector('h3').textContent = this.currentlyHovered.name;
            previewCard.classList.add('is-visible');
        } else {
            this.previewTemplate.classList.remove('is-visible');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isPaused) {
            const elapsedTime = this.clock.getElapsedTime();

            if (this.stars) {
                this.stars.rotation.y += 0.0001;
            }

            if (this.core) {
                // Add a pulsing effect to the core's light and size
                const pulse = Math.sin(elapsedTime * 1.5) * 0.5 + 0.5;
                this.core.material.emissiveIntensity = 3 + pulse * 2; // Pulse intensity
                this.core.scale.setScalar(1 + pulse * 0.05); // Pulse size

                this.core.rotation.y += 0.001;
                this.core.rotation.x += 0.0005;
            }

            this.planets.forEach(planet => {
                planet.mesh.rotation.y += 0.002; // Self-rotation
                if (this.focusedPlanet !== planet) {
                    planet.pivot.rotation.y = elapsedTime * planet.speed; // Orbital rotation
                }
            });
        }

        if (!this.isAnimating) {
            this.checkIntersections();
        }
        this.updateUI();

        this.renderer.render(this.scene, this.camera);
    }
}

// Expõe a instância no window para que o teste possa controlá-la
window.solarSystem = new SolarSystem();