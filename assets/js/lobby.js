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

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        this.createStars();
        this.createSun();
        this.createPlanets();

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', () => this.onClick());

        this.animate();
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, blending: THREE.AdditiveBlending });
        this.scene.add(new THREE.Points(starGeometry, starMaterial));
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(7, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({ emissive: '#FFD700', emissiveIntensity: 2 });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        const pointLight = new THREE.PointLight(0xffffff, 3, 300);
        this.sun.add(pointLight);
        this.scene.add(this.sun);
    }

    createPlanets() {
        this.planets = [];
        const planetData = [
            { id: 'lobby', name: 'Lobby Interativo', orbitRadius: 20, speed: 0.5, color: '#B0E0E6', url: '#' },
            { id: 'construction', name: 'Página em Construção', orbitRadius: 35, speed: 0.3, color: '#FF7E5F', url: 'pages/construction/index.html' }
        ];

        planetData.forEach(data => {
            const planetGroup = new THREE.Group();
            const planetMaterial = new THREE.MeshStandardMaterial({ color: data.color, emissive: data.color, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.5 });
            const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), planetMaterial);
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

            this.sun.rotation.y += 0.001;
            this.sun.scale.setScalar(Math.sin(elapsedTime * 0.5) * 0.05 + 1);

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