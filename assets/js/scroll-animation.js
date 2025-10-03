import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export default class ScrollAnimation {
    constructor(world) {
        this.world = world;
        this.camera = world.camera;

        // 1. Define the path for the camera
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 2, 15),    // Start position
            new THREE.Vector3(5, 4, 5),     // Mid-point 1
            new THREE.Vector3(-10, 6, -10), // Mid-point 2
            new THREE.Vector3(15, 8, -25),  // Near the login section
            new THREE.Vector3(0, 10, -40)   // End position
        ]);

        // For debugging: visualize the curve
        // const points = this.curve.getPoints(50);
        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // const curveObject = new THREE.Line(geometry, material);
        // this.world.scene.add(curveObject);

        // Get references to the content sections
        this.loginSection = document.getElementById('login-section');
        this.constructionSection = document.getElementById('construction-section');

        // 2. Listen to the scroll event
        window.addEventListener('scroll', this.onScroll.bind(this));
        this.onScroll(); // Call once on init to set initial state
    }

    onScroll() {
        // Calculate scroll percentage
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;

        // 3. Update camera position based on scroll
        const point = this.curve.getPointAt(scrollPercent);
        this.camera.position.copy(point);

        // Always make the camera look at a point in the distance
        this.camera.lookAt(0, 0, -20);

        // 4. Update content visibility based on scroll
        if (scrollPercent > 0.4 && scrollPercent < 0.7) {
            this.loginSection.classList.add('visible');
        } else {
            this.loginSection.classList.remove('visible');
        }

        if (scrollPercent > 0.8) {
            this.constructionSection.classList.add('visible');
        } else {
            this.constructionSection.classList.remove('visible');
        }
    }
}