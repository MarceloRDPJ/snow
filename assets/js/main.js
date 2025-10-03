// ===== MAIN.JS - THREE.JS SCENE =====

// Ensure Three.js is loaded
if (typeof THREE === 'undefined') {
    console.error('Three.js has not been loaded. Check the script tag in your HTML.');
}

let scene, camera, renderer, stars;
let mouseX = 0;
let mouseY = 0;

function init() {
    // ===== Scene Setup =====
    scene = new THREE.Scene();

    // ===== Camera Setup =====
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1; // Start close to the center

    // ===== Renderer Setup =====
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true // Allows for a transparent background if needed
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('world').appendChild(renderer.domElement);

    // ===== Particle System =====
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;

    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
        // Distribute stars in a sphere-like shape
        positions[i] = (Math.random() - 0.5) * 100;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ===== Event Listeners =====
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // ===== Start Animation =====
    animate();
}

// ===== Animation Loop =====
function animate() {
    requestAnimationFrame(animate);

    // Subtle rotation based on mouse position
    stars.rotation.x = -mouseY * 0.05;
    stars.rotation.y = -mouseX * 0.05;

    renderer.render(scene, camera);
}

// ===== Event Handlers =====
function onMouseMove(event) {
    // Normalize mouse position (-1 to 1)
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===== Initialize =====
init();