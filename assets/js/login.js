import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

class LoginPage {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();
        this.isPasswordFocused = false;

        this.init();
    }

    init() {
        // Renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('three-container').appendChild(this.renderer.domElement);

        // Camera
        this.camera.position.z = 15;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        // Background Scene
        this.createBackgroundMountain();

        // Interactive Penguin
        this.createPenguinAvatar();
        this.setupInteractions();

        // Start animation loop
        this.animate();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    createBackgroundMountain() {
        // A single, large, slowly rotating mountain for the background
        const geometry = new THREE.ConeGeometry(10, 16, 12);
        const material = new THREE.MeshStandardMaterial({
            color: 0x304d5b,
            flatShading: true,
        });
        this.mountain = new THREE.Mesh(geometry, material);
        this.mountain.position.set(0, -5, -20);
        this.scene.add(this.mountain);
    }

    createPenguinAvatar() {
        this.penguinHead = new THREE.Group();
        const avatarContainer = document.querySelector('.penguin-avatar');

        // Head
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, flatShading: true });
        const headGeometry = new THREE.SphereGeometry(3, 12, 12);
        const head = new THREE.Mesh(headGeometry, headMaterial);
        this.penguinHead.add(head);

        // Eyes
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const eyeGeometry = new THREE.SphereGeometry(0.5, 8, 8);

        this.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.leftEye.position.set(-1, 0.5, 2.5);
        this.penguinHead.add(this.leftEye);

        this.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.rightEye.position.set(1, 0.5, 2.5);
        this.penguinHead.add(this.rightEye);

        // Beak
        const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, flatShading: true });
        const beakGeometry = new THREE.ConeGeometry(0.8, 1.5, 4);
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.position.set(0, 0, 3);
        beak.rotation.x = Math.PI / 2;
        this.penguinHead.add(beak);

        this.penguinHead.position.y = -2;

        // Create a separate scene and renderer for the avatar
        this.avatarScene = new THREE.Scene();
        this.avatarScene.add(this.penguinHead);

        this.avatarCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        this.avatarCamera.position.z = 10;

        this.avatarRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.avatarRenderer.setSize(100, 100);
        avatarContainer.appendChild(this.avatarRenderer.domElement);
    }

    setupInteractions() {
        const passwordInput = document.getElementById('password');
        passwordInput.addEventListener('focus', () => this.isPasswordFocused = true);
        passwordInput.addEventListener('blur', () => this.isPasswordFocused = false);
    }


    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Animate background mountain
        this.mountain.rotation.y += 0.001;

        // Animate penguin eyes
        if (this.isPasswordFocused) {
            // "Cover eyes" animation
            this.leftEye.scale.set(1, 0.1, 1);
            this.rightEye.scale.set(1, 0.1, 1);
        } else {
            // Normal eyes
            this.leftEye.scale.set(1, 1, 1);
            this.rightEye.scale.set(1, 1, 1);
        }

        this.avatarRenderer.render(this.avatarScene, this.avatarCamera);
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

new LoginPage();