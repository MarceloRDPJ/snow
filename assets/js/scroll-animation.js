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

        // Define the scroll thresholds for each section
        this.sections = [
            { id: 'intro', start: 0, end: 0.3 },
            { id: 'login-section', start: 0.4, end: 0.7 },
            { id: 'construction-section', start: 0.8, end: 1.0 }
        ];
        this.sectionElements = this.sections.map(s => document.getElementById(s.id));

        // For smooth camera movement (lerp)
        this.cameraTarget = new THREE.Vector3();
        this.lookAtTarget = new THREE.Vector3(0, 0, -20);

        // 2. Listen to the scroll event
        window.addEventListener('scroll', this.onScroll.bind(this));
        this.onScroll(); // Call once on init to set initial state
    }

    onScroll() {
        // Calculate scroll percentage
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;

        // 3. Set the TARGET camera position based on scroll
        const point = this.curve.getPointAt(scrollPercent);
        this.cameraTarget.copy(point);

        // 4. Update content visibility based on scroll (robust approach)

        // First, hide all sections
        this.sectionElements.forEach(element => {
            element.classList.remove('visible');
        });

        // Then, find the one active section and show it
        const activeSection = this.sections.find(section => {
            return scrollPercent >= section.start && scrollPercent < section.end;
        });

        if (activeSection) {
            document.getElementById(activeSection.id).classList.add('visible');
        }
    }

    update() {
        // Move camera smoothly towards the target position
        this.camera.position.lerp(this.cameraTarget, 0.05);

        // This can be used if you want the lookAt point to also move smoothly
        // this.camera.lookAt(this.lookAtTarget);
    }
}