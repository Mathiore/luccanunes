<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { albums } from '../config/albums.js';
import { CarShowroom } from '../core/CarShowroom.js';

// Import UI components
import Lightbox from './ui/Lightbox.vue';
import GalleryOverlay from './ui/GalleryOverlay.vue';
import GalleryModal from './ui/GalleryModal.vue';

const canvasRef = ref(null);
const containerRef = ref(null);
const isGalleryOpen = ref(false);
const loading = ref(true);

const selectedAlbum = ref(null);
const selectedPhoto = ref(null);
let showroom = null;

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

watch(selectedAlbum, (newVal) => {
    if (showroom) {
        if (newVal && newVal.modelPath) {
            showroom.loadCar(newVal.modelPath);
        } else {
            // Revert to default Ferrari when deselecting or if no specific model
            showroom.loadCar('/models/ferrari.glb');
        }
    }
});

const onResize = () => {
    if (showroom) showroom.onResize();
};

onMounted(() => {
    if (canvasRef.value) {
        showroom = new CarShowroom(canvasRef.value, (isLoading) => {
            loading.value = isLoading;
        });
        showroom.init();
        showroom.loadCar('/models/ferrari.glb');
    }
    
    window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    if (showroom) showroom.dispose();
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
