import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

class ConstructionWorld {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        // Renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('three-container').appendChild(this.renderer.domElement);

        // Camera
        this.camera.position.set(0, 5, 20);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 15, 10);
        this.scene.add(directionalLight);

        // Scene content
        this.createConstructionSite();
        this.createPenguins();

        // Scroll animation logic
        this.setupScrollAnimation();

        // Start animation loop
        this.animate();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    createConstructionSite() {
        // A simple ice block being constructed
        const iceGeometry = new THREE.BoxGeometry(5, 5, 5);
        const iceMaterial = new THREE.MeshStandardMaterial({
            color: 0x82cff5,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.2
        });
        this.iceBlock = new THREE.Mesh(iceGeometry, iceMaterial);
        this.iceBlock.position.y = 2.5;
        this.scene.add(this.iceBlock);

        // Ground
        const groundGeometry = new THREE.CircleGeometry(20, 32);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);
    }

    createPenguin(x, z, rotation) {
        const penguinGroup = new THREE.Group();
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, flatShading: true });

        // Body using a cylinder and two spheres to approximate a capsule
        const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 8);
        const bodyCylinder = new THREE.Mesh(cylinderGeometry, bodyMaterial);
        bodyCylinder.position.y = 1.75;
        penguinGroup.add(bodyCylinder);

        const topSphereGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const topSphere = new THREE.Mesh(topSphereGeometry, bodyMaterial);
        topSphere.position.y = 2.5;
        penguinGroup.add(topSphere);

        // Tummy
        const tummyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
        const tummyGeometry = new THREE.SphereGeometry(0.7, 8, 8);
        const tummy = new THREE.Mesh(tummyGeometry, tummyMaterial);
        tummy.position.set(0, 1.75, 0.4);
        penguinGroup.add(tummy);

        // Helmet
        const helmetMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, flatShading: true });
        const helmetGeometry = new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 3.3;
        penguinGroup.add(helmet);

        penguinGroup.position.set(x, 0, z);
        penguinGroup.rotation.y = rotation;
        this.scene.add(penguinGroup);
        return penguinGroup;
    }

    createPenguins() {
        this.penguins = [];
        this.penguins.push(this.createPenguin(5, 5, -Math.PI / 4));
        this.penguins.push(this.createPenguin(-5, 3, Math.PI / 2));
        this.penguins.push(this.createPenguin(0, 7, 0));
    }

    setupScrollAnimation() {
        this.contentSections = document.querySelectorAll('.content-section');
        window.addEventListener('scroll', this.onScroll.bind(this));
        this.onScroll(); // Initial call
    }

    onScroll() {
        const scrollY = window.scrollY;
        // Use document.documentElement.scrollHeight for a more reliable calculation
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

        // Animate camera
        this.camera.position.y = 5 - scrollPercent * 5;
        this.camera.position.z = 20 - scrollPercent * 15;
        this.camera.lookAt(0, 2.5, 0);

        // Fade in content
        if (scrollPercent < 0.3) {
            document.getElementById('intro-construction').classList.add('visible');
        } else {
            document.getElementById('intro-construction').classList.remove('visible');
        }

        if (scrollPercent > 0.35 && scrollPercent < 0.7) {
            document.getElementById('tech-explanation').classList.add('visible');
        } else {
            document.getElementById('tech-explanation').classList.remove('visible');
        }

        if (scrollPercent > 0.75) {
            document.getElementById('threejs-explanation').classList.add('visible');
        } else {
            document.getElementById('threejs-explanation').classList.remove('visible');
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const elapsedTime = this.clock.getElapsedTime();

        // Animate penguins
        this.penguins.forEach((penguin, index) => {
            penguin.rotation.y += 0.005; // Gentle rotation
            penguin.position.y = Math.sin(elapsedTime * 2 + index) * 0.1; // Gentle bobbing
        });

        // Animate ice block
        this.iceBlock.rotation.y += 0.005;

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

new ConstructionWorld();