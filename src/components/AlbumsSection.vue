<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Import newly created UI components
import Lightbox from './ui/Lightbox.vue';
import GalleryOverlay from './ui/GalleryOverlay.vue';
import GalleryModal from './ui/GalleryModal.vue';

const canvasRef = ref(null);
const containerRef = ref(null);
const isGalleryOpen = ref(false);
const loading = ref(true);

const albums = [
  { 
    id: 'lambo', 
    title: 'Lamborghini Revuelto', 
    modelPath: '/models/lambo.glb',
    cover: '/models/Lambo/IMG_0043.jpg', 
    images: [
      '/models/Lambo/IMG_0043.jpg',
      '/models/Lambo/IMG_0054.jpg',
      '/models/Lambo/IMG_0068.jpg',
      '/models/Lambo/IMG_0085.jpg',
      '/models/Lambo/IMG_0120.jpg',
      '/models/Lambo/IMG_0135.jpg',
      '/models/Lambo/IMG_0157.jpg',
      '/models/Lambo/IMG_0161.jpg'
    ]
  },
  { 
    id: 'gallardo', 
    title: 'Lamborghini Gallardo', 
    modelPath: '/models/gallardo.glb',
    cover: '/models/Gallardo/IMG_6760.jpg', 
    images: [
      '/models/Gallardo/IMG_6760.jpg',
      '/models/Gallardo/Sem-Título-1_01.jpg',
      '/models/Gallardo/Sem-Título-1_02.jpg',
      '/models/Gallardo/Sem-Título-1_03.jpg',
      '/models/Gallardo/Sem-Título-1_04.jpg',
      '/models/Gallardo/Sem-Título-1_05.jpg',
      '/models/Gallardo/Sem-Título-1_06.jpg'
    ]
  },
  { 
    id: 'auditt', 
    title: 'Audi TT', 
    modelPath: '/models/auditt.glb',
    cover: '/models/Audi TT/IMG_8885.jpg', 
    images: [
      '/models/Audi TT/IMG_8885.jpg',
      '/models/Audi TT/IMG_8938.jpg',
      '/models/Audi TT/IMG_8947.jpg',
      '/models/Audi TT/adui11_01.jpg',
      '/models/Audi TT/adui11_02.jpg',
      '/models/Audi TT/adui11_03.jpg',
      '/models/Audi TT/adui11_04.jpg',
      '/models/Audi TT/adui11_05.jpg',
      '/models/Audi TT/adui11_06.jpg'
    ]
  },
  { 
    id: 'mclaren', 
    title: 'McLaren', 
    modelPath: '/models/mclaren.glb',
    cover: '/models/Mc laren/IMG_6788.jpg', 
    images: [
      '/models/Mc laren/IMG_6779.jpg',
      '/models/Mc laren/IMG_6788.jpg',
      '/models/Mc laren/IMG_6799.jpg',
      '/models/Mc laren/IMG_6818.jpg',
      '/models/Mc laren/post-6x6_01.jpg',
      '/models/Mc laren/post-6x6_02.jpg'
    ]
  },
  { 
    id: 'masserati', 
    title: 'Maserati', 
    modelPath: '/models/masserati.glb',
    cover: '/models/Masserati/IMG_6825.png', 
    images: [
      '/models/Masserati/IMG_6825.png',
      '/models/Masserati/MASERATII_01.png',
      '/models/Masserati/MASERATII_02.png',
      '/models/Masserati/MASERATII_03.png'
    ]
  },
  { 
    id: 'mustang', 
    title: 'Mustang Blue', 
    cover: '/models/Mustang blue/DSC01243.jpg', 
    images: [
      '/models/Mustang blue/DSC01238.jpg',
      '/models/Mustang blue/DSC01243-2.jpg',
      '/models/Mustang blue/DSC01243.jpg'
    ]
  },
  { 
    id: 'jetta', 
    title: 'Jetta', 
    cover: '/models/Jetta/IMG_0211.jpg', 
    images: [
      '/models/Jetta/IMG_0211.jpg',
      '/models/Jetta/IMG_0254.jpg',
      '/models/Jetta/IMG_0571.jpg',
      '/models/Jetta/IMG_0580.jpg',
      '/models/Jetta/IMG_0583.jpg',
      '/models/Jetta/IMG_0598.jpg'
    ]
  },
  { 
    id: 'opala', 
    title: 'Opala', 
    cover: '/models/Opala/IMG_0382.jpg', 
    images: [
      '/models/Opala/IMG_0382.jpg',
      '/models/Opala/IMG_0459.jpg',
      '/models/Opala/IMG_0501.jpg',
      '/models/Opala/IMG_0515.jpg',
      '/models/Opala/IMG_0663.jpg'
    ]
  },

];

const selectedAlbum = ref(null);
const selectedPhoto = ref(null);

const openPhoto = (photo) => {
    selectedPhoto.value = photo;
};

const handleCarClick = () => {
    isGalleryOpen.value = true;
    selectedAlbum.value = null; // Reset selection
};

const selectAlbum = (album) => {
    selectedAlbum.value = album;
};

let scene, camera, renderer, controls, carModel;
let animationId;

// Materials & Loader
let bodyMaterial, whiteBodyMaterial, detailsMaterial, glassMaterial, loader;

const loadCarModel = (path) => {
    if (!loader || !scene) return;

    // Remove existing car
    if (carModel) {
        scene.remove(carModel);
    }

    loading.value = true;
    loader.load(path, function (gltf) {
        carModel = gltf.scene;

        // Apply materials to Ferrari (Red) and Gallardo (White)
        if (path.includes('ferrari') || path.includes('gallardo')) {
            carModel.traverse((child) => {
                if (child.isMesh) {
                    const name = child.name.toLowerCase();
                    const matName = child.material && child.material.name ? child.material.name.toLowerCase() : '';

                    const isInterior = name.includes('interior') || name.includes('seat') || name.includes('dashboard') || name.includes('steering') || name.includes('console') || name.includes('leather') || name.includes('plastic') || name.includes('carpet') ||
                                       matName.includes('interior') || matName.includes('seat') || matName.includes('dashboard') || matName.includes('leather') || matName.includes('plastic');
                    
                    // Enhanced body check: Check both Node Name AND Material Name
                    // 'giallo' is yellow in Italian (common in Lambo models)
                    const isBody = (name.includes('body') || name.includes('paint') || name.includes('chassis') || name.includes('exterior') || name.includes('yellow') || name.includes('red') ||
                                    matName.includes('body') || matName.includes('paint') || matName.includes('yellow') || matName.includes('red') || matName.includes('giallo')) && 
                                   !name.includes('wheel') && !matName.includes('wheel') &&
                                   !name.includes('tire') && !matName.includes('tire') &&
                                   !name.includes('brake') && !matName.includes('brake') &&
                                   !name.includes('glass') && !matName.includes('glass') &&
                                   !name.includes('window') && !matName.includes('window') &&
                                   !isInterior;

                    if (isBody) {
                        child.material = path.includes('gallardo') ? whiteBodyMaterial : bodyMaterial;
                    } 
                    else if (name.includes('glass') || name.includes('window') || matName.includes('glass')) {
                        child.material = glassMaterial;
                    }
                    else if (name.includes('rim') || name.includes('trim') || name.includes('grill') || matName.includes('rim') || matName.includes('chrome')) {
                        child.material = detailsMaterial;
                    }
                    
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        } else {
            // Ensure shadows for other models without changing materials
            carModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }

        // Specific Adjustments per Model
        if (path.includes('gallardo') || path.includes('masserati') || path.includes('ferrari')) {
            carModel.scale.set(100, 100, 100); // Scale up for models in cm
        } else {
            carModel.scale.set(1, 1, 1); // Default scale
        }

        carModel.position.y = 0;
        scene.add(carModel);
        loading.value = false;
    }, undefined, function(error) {
        console.error('Error loading model:', error);
        loading.value = false;
    });
};

watch(selectedAlbum, (newVal) => {
    if (newVal && newVal.modelPath) {
        loadCarModel(newVal.modelPath);
    } else {
        // Revert to default Ferrari when deselecting or if no specific model
        loadCarModel('/models/ferrari.glb');
    }
});

const initThree = () => {
    // Scene (Transparent Background)
    scene = new THREE.Scene();
    // scene.background = null; // Default is null, allowing alpha: true to work

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 2, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.value, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.maxDistance = 10;
    controls.minDistance = 3;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xff0040, 10);
    spotLight.position.set(-5, 5, 0);
    spotLight.lookAt(0, 0, 0);
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0x0040ff, 10);
    spotLight2.position.set(5, 5, 0);
    spotLight2.lookAt(0, 0, 0);
    spotLight2.penumbra = 0.5;
    scene.add(spotLight2);

    // Shadow Floor (Transparent but receives shadow)
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.ShadowMaterial({ 
        opacity: 0.5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Loading Manager
    const manager = new THREE.LoadingManager();
    
    // Environment
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    // Initialize Materials
    bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x990000,
        metalness: 1.0, 
        roughness: 0.5, 
        clearcoat: 1.0, 
        clearcoatRoughness: 0.03,
        sheen: 0.5
    });

    whiteBodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0, 
        roughness: 0.5, 
        clearcoat: 1.0, 
        clearcoatRoughness: 0.03,
        sheen: 0.5
    });

    detailsMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc, 
        metalness: 1.0, 
        roughness: 0.2
    });

    glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, 
        metalness: 0.25, 
        roughness: 0, 
        transmission: 1.0
    });

    // Initialize Loader
    loader = new GLTFLoader(manager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/' );
    loader.setDRACOLoader( dracoLoader );
    
    // Initial Load
    loadCarModel('/models/ferrari.glb');

    animate();
};

const animate = () => {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(() => {
    initThree();
    window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    if(renderer) renderer.dispose();
});
</script>

<template>
    <section id="albums" class="albums-section" ref="containerRef">
        <canvas ref="canvasRef"></canvas>
        
        <div v-if="loading" class="loading-overlay">
            <span>Carregando Modelo 3D...</span>
        </div>

        <GalleryOverlay 
            :visible="!isGalleryOpen" 
            @open="handleCarClick" 
        />

        <Lightbox 
            :src="selectedPhoto" 
            @close="selectedPhoto = null" 
        />

        <GalleryModal 
            :is-open="isGalleryOpen"
            :albums="albums"
            :selected-album="selectedAlbum"
            @close="isGalleryOpen = false"
            @select-album="selectAlbum"
            @clear-selection="selectedAlbum = null"
            @view-photo="openPhoto"
        />
    </section>
</template>

<style scoped>
.albums-section {
    position: relative;
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

canvas {
    display: block;
    outline: none;
}

.loading-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 20;
}
</style>
