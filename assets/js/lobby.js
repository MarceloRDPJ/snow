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
        this.scene.background = new THREE.Color('#0a0a0a');
        this.camera.position.z = 50;
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Softer ambient light
        this.scene.add(ambientLight);

        this.createGrid(); // Replaces createStars
        this.createCore();   // Replaces createSun
        this.createPlanets();

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', () => this.onClick());

        this.animate();
    }

    createGrid() {
        const size = 200;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(size, divisions, '#ff00ff', '#404040');
        gridHelper.position.y = -15; // Position it below the main scene
        this.scene.add(gridHelper);

        // Add a second grid for a more complex look
        const gridHelper2 = new THREE.GridHelper(size, divisions, '#00ffff', '#404040');
        gridHelper2.position.y = -15;
        gridHelper2.rotation.y = Math.PI / 4;
        this.scene.add(gridHelper2);
    }

    createCore() {
        const coreGeometry = new THREE.IcosahedronGeometry(7, 1);
        const coreMaterial = new THREE.MeshStandardMaterial({
            emissive: '#ff00ff',
            emissiveIntensity: 2,
            wireframe: true,
            color: '#ff00ff'
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        const pointLight = new THREE.PointLight('#ff00ff', 5, 200);
        this.core.add(pointLight);
        this.scene.add(this.core);
    }

    createPlanets() {
        this.planets = [];
        const planetData = [
            { id: 'login', name: 'Login Project', orbitRadius: 20, speed: 0.5, color: '#00ffff', url: 'pages/login/index.html' },
            { id: 'construction', name: 'Página em Construção', orbitRadius: 35, speed: 0.3, color: '#ff00ff', url: 'pages/construction/index.html' }
        ];

        planetData.forEach(data => {
            const planetGroup = new THREE.Group();
            const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2
            });
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

        // Para um lookAt suave, precisamos de um objeto para o qual a câmara possa apontar.
        // Um objeto vazio (dummy) é perfeito para isso.
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
                this.currentlyHovered.mesh.material.emissiveIntensity = 0.3;
                this.currentlyHovered = null;
            }
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

        const hoveredPlanet = intersects.length > 0 ? this.planets.find(p => p.mesh === intersects[0].object) : null;

        if (this.currentlyHovered !== hoveredPlanet) {
            if (this.currentlyHovered) {
                this.currentlyHovered.mesh.material.emissiveIntensity = 0.3;
            }
            this.currentlyHovered = hoveredPlanet;
            if (this.currentlyHovered) {
                this.currentlyHovered.mesh.material.emissiveIntensity = 0.8;
            }
        }
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
            this.previewTemplate.style.left = `${x + 20}px`;
            this.previewTemplate.style.top = `${y - 20}px`;
            this.previewTemplate.querySelector('h3').textContent = this.currentlyHovered.name;
            this.previewTemplate.classList.add('is-visible');
        } else {
            this.previewTemplate.classList.remove('is-visible');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isPaused) {
            const elapsedTime = this.clock.getElapsedTime();

            if (this.core) {
                this.core.rotation.y += 0.001;
                this.core.rotation.x += 0.0005;
                this.core.scale.setScalar(Math.sin(elapsedTime * 0.5) * 0.05 + 1);
            }

            this.planets.forEach(planet => {
                if (this.focusedPlanet !== planet) {
                    planet.pivot.rotation.y = elapsedTime * planet.speed;
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