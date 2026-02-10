<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const emit = defineEmits(['back']);

// State
const containerRef = ref(null);
const canvasRef = ref(null);
const scrollProgress = ref(0);
const isLoaded = ref(false);

// Three.js Global Variables
let scene, camera, renderer, model;
let animationId = null;

const isMobile = window.innerWidth < 768;

// Camera Config
// Start: Very Close (Inside/Back)
const startPos = new THREE.Vector3(0, 0, 0.15); 
// End: Front perspective (Straight on).
// Y=0 to ensure we are looking straight at it, not from above.
// Z=2.5 to give enough distance to see the whole object but not too far.
const endPos = new THREE.Vector3(0, 0, 0.8); 

// Polaroids Configuration
const polaroids = ref([
    { id: 1, src: '/models/lucca1.jpg', rotation: -8, x: '30%', y: '40%', z: 2 },
    { id: 2, src: '/models/lucca2.jpg', rotation: 12, x: '60%', y: '35%', z: 1 },
    { id: 3, src: '/models/lucca3.jpg', rotation: -5, x: '40%', y: '65%', z: 3 },
    { id: 4, src: '/models/lucca4.jpg', rotation: 6, x: '65%', y: '60%', z: 2 },
]);

// Initialize Three.js Scene
const initThree = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background
    
    // Camera Setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.copy(startPos);
    camera.lookAt(0, 0, 0);

    // Renderer Setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        antialias: true, 
        alpha: false 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isMobile;

    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;

    // Lighting 
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Model Loading
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);

    loader.load('/models/Cannon.glb', (gltf) => {
        model = gltf.scene;

        // Center Model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Offset - kept from previous successful centering
        model.position.y += 0.06;

        // Scale Model
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 0.13;
        let scale = 0.4;
        if (maxDim > 0) scale = targetSize / maxDim;
        model.scale.set(scale, scale, scale);

        // Materials - Canonical Overrides
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    child.material.format = THREE.RGBAFormat;
                    child.material.depthWrite = true;
                    
                    // Specific Look
                    child.material.color.setHex(0x333333); 
                    child.material.roughness = 0.5;
                    child.material.metalness = 0.7;
                }
            }
        });

        // Initial Orientation: BACK FACING CAMERA (0)
        model.rotation.y = 0;

        scene.add(model);
        isLoaded.value = true;
        animate();
    });

    window.addEventListener('resize', onResize);
};

// Animation Loop
const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (!camera || !model) return;

    const p = scrollProgress.value;

    // Linear interpolation matching the "Home Page" scroll feel (but inverted)
    // Home: 0.8 -> 0.15
    // About: 0.15 -> 0.8 (Standard)
    
    // We use the full scroll range (0 to 1) for the movement to match the speed/weight
    camera.position.lerpVectors(startPos, endPos, p);
    camera.lookAt(0, 0, 0);

    // Rotate Model: 0 (Back) -> Math.PI (Front)
    // Also matched linearly to scroll
    model.rotation.y = p * Math.PI;

    // Fade Out
    // Start fading at 50%, fully gone by 90%
    let opacity = 1;
    if (p > 0.5) {
        opacity = 1 - ((p - 0.5) / 0.4);
        opacity = Math.max(0, Math.min(1, opacity));
    }
    
    if (canvasRef.value) {
        canvasRef.value.style.opacity = opacity;
    }
    
    renderer.render(scene, camera);
};

// Scroll Handler
const handleScroll = () => {
    if (!containerRef.value) return;
    const scrollTop = containerRef.value.scrollTop;
    const maxScroll = containerRef.value.scrollHeight - containerRef.value.clientHeight;
    
    if (maxScroll > 0) {
        scrollProgress.value = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    }
};

// Styles for Polaroids
const getPolaroidStyle = (card, index) => {
    const p = scrollProgress.value;
    const startFall = 0.25; // Start falling EARLY (25%)
    
    // Initial state: Hidden above screen
    if (p < startFall) {
        return {
            left: card.x,
            top: card.y,
            transform: `translate(-50%, -150vh) rotate(${card.rotation}deg)`,
            opacity: 0,
            zIndex: card.z
        };
    }

    // Fall Animation
    const scrollRange = 0.6; // Wider range so they don't fall instantly, but start early
    let localP = (p - startFall) / scrollRange;

    // Add Stagger
    const stagger = index * 0.1;
    let cardP = (localP - stagger) * 2.0; 
    cardP = Math.min(Math.max(cardP, 0), 1);
    
    // Easing
    const t = 1 - Math.pow(1 - cardP, 3);
    
    const startOffset = -1200;
    const currentOffset = startOffset * (1 - t);

    return {
        left: card.x,
        top: card.y,
        transform: `translate(-50%, -50%) translateY(${currentOffset}px) rotate(${card.rotation}deg)`,
        opacity: 1, 
        zIndex: card.z
    };
};

const onResize = () => {
    if (!camera || !renderer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
};

onMounted(() => {
    initThree();
    if (containerRef.value) {
        containerRef.value.addEventListener('wheel', handleScrollUp);
    }
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    
    if (containerRef.value) {
        containerRef.value.removeEventListener('wheel', handleScrollUp);
    }

    if (renderer) renderer.dispose();
});

const goBack = () => emit('back');

const handleScrollUp = (e) => {
    // If at top and scrolling UP (deltaY < 0), go back
    if (containerRef.value.scrollTop <= 0 && e.deltaY < 0) {
        goBack();
    }
};

</script>

<template>
    <div class="about-container">
        <!-- Scroll Track -->
        <div class="scroll-track" ref="containerRef" @scroll="handleScroll">
            <div class="scroll-spacer"></div>
        </div>

        <!-- Sticky Stage -->
        <div class="sticky-stage">
            

            <!-- 3D Canvas -->
            <canvas ref="canvasRef" class="webgl-canvas"></canvas>

            <!-- Polaroids Layer -->
            <div class="polaroids-layer">
                <div 
                    v-for="(card, index) in polaroids" 
                    :key="card.id" 
                    class="polaroid-wrapper"
                    :style="getPolaroidStyle(card, index)"
                >
                    <div class="polaroid">
                        <div class="polaroid-inner">
                            <img :src="card.src" alt="Lucca Photo" class="polaroid-img" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Optional Title that appears with Polaroids -->
            <div class="title-overlay" :style="{ opacity: scrollProgress > 0.4 ? (scrollProgress - 0.4) * 4 : 0 }">
                <h1>LUCCA NUNES</h1>
            </div>

            <!-- Scroll Indicator -->
            <div class="scroll-indicator" :style="{ opacity: 1 - scrollProgress * 5 }">
                <span>SCROLL DOWN</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.about-container {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background-color: #ffffff;
    z-index: 200;
    font-family: 'Inter', sans-serif;
    color: #000000;
}

.scroll-track {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    overflow-y: auto;
    z-index: 300;
    scrollbar-width: none; 
}

.scroll-track::-webkit-scrollbar {
    display: none;
}

.scroll-spacer {
    height: 200vh; /* Shorter scroll */
}

.sticky-stage {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; 
    overflow: hidden;
}

.back-btn {
    position: absolute;
    top: 3rem; left: 3rem;
    background: none;
    border: none;
    color: #000;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    z-index: 400;
    pointer-events: auto; 
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.1em;
    opacity: 0.8;
    transition: opacity 0.3s;
    text-transform: uppercase;
}
.back-btn:hover { opacity: 1; }

.webgl-canvas {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 10;
    transition: opacity 0.1s;
}

/* Polaroids */
.polaroids-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 20;
    pointer-events: none;
}

.polaroid-wrapper {
    position: absolute;
    width: 220px;
    will-change: transform, opacity;
}

.polaroid {
    background: #fff;
    padding: 12px 12px 40px 12px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2); 
    transform: rotate(0deg); 
    transition: transform 0.1s;
    border: 1px solid #ddd;
}

.polaroid-inner {
    width: 100%;
    background: #000;
    aspect-ratio: 1 / 1;
    overflow: hidden;
}

.polaroid-img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.3s;
}

/* Text */
.title-overlay {
    position: absolute;
    bottom: 10vh; left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 15;
}

.title-overlay h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.02em;
    color: #000;
}

.title-overlay p {
    font-size: 1rem;
    letter-spacing: 0.5em;
    color: #555;
    margin-top: 0.5rem;
}

.scroll-indicator {
    position: absolute;
    bottom: 30px; left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    opacity: 0.5;
    z-index: 50;
    color: #000;
}

/* Responsive */
@media (max-width: 768px) {
    .polaroid-wrapper {
        width: 160px;
    }
    .back-btn {
        top: 1.5rem; left: 1.5rem;
    }
    .title-overlay h1 {
        font-size: 2rem;
    }
}
</style>
