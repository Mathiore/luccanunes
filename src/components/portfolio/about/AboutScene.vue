<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const props = defineProps({
    scrollProgress: {
        type: Number,
        default: 0
    }
});

const canvasRef = ref(null);
const isLoaded = ref(false);

// Three.js Global Variables
let scene, camera, renderer, model;
let animationId = null;

const isMobile = window.innerWidth < 768;

// Camera Config
const startPos = new THREE.Vector3(0, 0, 0.15); 
const endPos = new THREE.Vector3(0, 0, 0.8); 

const initThree = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
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

    loader.load(`${import.meta.env.BASE_URL}models/Cannon.glb`, (gltf) => {
        model = gltf.scene;

        // Center Model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Offset
        model.position.y += 0.06;

        // Scale Model
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 0.13;
        let scale = 0.4;
        if (maxDim > 0) scale = targetSize / maxDim;
        model.scale.set(scale, scale, scale);

        // Materials
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    child.material.format = THREE.RGBAFormat;
                    child.material.depthWrite = true;
                    
                    child.material.color.setHex(0x333333); 
                    child.material.roughness = 0.5;
                    child.material.metalness = 0.7;
                }
            }
        });

        // Initial Orientation
        model.rotation.y = 0;

        scene.add(model);
        isLoaded.value = true;
        animate();
    });

    window.addEventListener('resize', onResize);
};

const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (!camera || !model) return;

    const p = props.scrollProgress;

    // Camera Move (0.15 -> 0.8)
    camera.position.lerpVectors(startPos, endPos, p);
    camera.lookAt(0, 0, 0);

    // Rotate Model
    model.rotation.y = p * Math.PI;

    // Fade Out
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
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    if (renderer) renderer.dispose();
});
</script>

<template>
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>
</template>

<style scoped>
.webgl-canvas {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 10;
    transition: opacity 0.1s;
}
</style>
