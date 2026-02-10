<script setup>
import { ref, computed, onMounted } from 'vue';
import { albums } from '../../config/albums.js';
import LensView from './LensView.vue';
import GalleryView from './GalleryView.vue';
import AboutMeView from './AboutMeView.vue';

// State
const viewState = ref('lens'); // 'lens' | 'gallery' | 'about'
const isMobile = ref(false);
const isZooming = ref(false);

const currentAlbumIndex = ref(0);
const currentImageIndex = ref(0);

// Computed State
const currentAlbum = computed(() => albums[currentAlbumIndex.value] || albums[0]);
const currentImages = computed(() => currentAlbum.value.images || []);

const currentImage = computed(() => {
    // In lens mode, always show cover. In gallery, show selected image.
    if (viewState.value === 'lens') return currentAlbum.value.cover;
    return currentImages.value[currentImageIndex.value] || currentAlbum.value.cover;
});

// Navigation / Actions
const enterGallery = () => {
    if (isZooming.value) return;
    isZooming.value = true;
    
    // Animate "shrink/fit" to gallery position
    setTimeout(() => {
        viewState.value = 'gallery';
        
        setTimeout(() => {
            isZooming.value = false;
        }, 100); 
    }, 800); // 800ms matches CSS transition in LensView
};

const enterAbout = () => {
    viewState.value = 'about';
};

const exitAbout = () => {
    viewState.value = 'lens';
};

const selectAlbum = (index) => {
    currentAlbumIndex.value = index;
    currentImageIndex.value = 0;
};

const selectAlbumEnd = (index) => {
    currentAlbumIndex.value = index;
    // Set to last image of new album
    const album = albums[index];
    if (album && album.images) {
        currentImageIndex.value = album.images.length - 1;
    } else {
        currentImageIndex.value = 0;
    }
};

const selectImage = (index) => {
    currentImageIndex.value = index;
};

// Lifecycle
onMounted(() => {
    isMobile.value = window.innerWidth < 768;
    
    // Set initial album to Gallardo as requested
    const gallardoIndex = albums.findIndex(a => a.id === 'gallardo');
    if (gallardoIndex !== -1) {
        currentAlbumIndex.value = gallardoIndex;
    }

    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768;
    });
});
</script>

<template>
    <div class="portfolio-mega-container" :class="{ 'gallery-mode': viewState === 'gallery' }">
        
        <LensView 
            :is-active="viewState === 'lens'"
            :is-mobile="isMobile"
            :current-image="currentImage"
            :is-zooming="isZooming"
            @enter-gallery="enterGallery"
        />

        <GalleryView 
            :is-active="viewState === 'gallery'"
            :albums="albums"
            :current-album-index="currentAlbumIndex"
            :current-image-index="currentImageIndex"
            :current-image="currentImage"
            :current-images="currentImages"
            @select-album="selectAlbum"
            @select-image="selectImage"
            @select-album-end="selectAlbumEnd"
            @select-about="enterAbout"
        />

        <transition name="fade-scale">
            <AboutMeView 
                v-if="viewState === 'about'"
                @back="exitAbout"
            />
        </transition>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* GLOBAL CONTAINER */
.portfolio-mega-container {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100vh;
    background: #0a0a0a;
    color: #e0e0e0;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
    z-index: 100;
}

/* FADE SCALE TRANSITION */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
