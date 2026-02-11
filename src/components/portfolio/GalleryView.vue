<script setup>
import { computed, ref, watch } from 'vue';
import GallerySidebar from './gallery/GallerySidebar.vue';
import GalleryMain from './gallery/GalleryMain.vue';
import GalleryThumbnails from './gallery/GalleryThumbnails.vue';

const props = defineProps({
    isActive: Boolean,
    albums: Array,
    currentAlbumIndex: Number,
    currentImageIndex: Number,
    currentImage: String,
    currentImages: Array
});

const emit = defineEmits(['select-album', 'select-image', 'select-album-end', 'select-about', 'select-lens']);

// Navigation State
const transitionName = ref('fade-slide');

// Formatting Albums for Menu
const menuItems = computed(() => props.albums.map((album, index) => ({
    id: album.id,
    title: album.title, 
    count: album.images ? album.images.length : 0,
    index
})));

// Watch for index changes to determine transition direction
watch(() => props.currentImageIndex, (newVal, oldVal) => {
    transitionName.value = newVal > oldVal ? 'slide-left' : 'slide-right';
});

// Mobile Menu
const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const handleSelectAlbum = (index) => {
    emit('select-album', index);
    isMenuOpen.value = false;
};

const handleSelectImage = (index) => {
    emit('select-image', index);
};

// Helpers
const nextImage = () => {
    if (props.currentImageIndex < props.currentImages.length - 1) {
        // Next image in current album
        handleSelectImage(props.currentImageIndex + 1);
    } else {
        // End of album -> Go to next album's first image
        const nextAlbumIdx = (props.currentAlbumIndex + 1) % props.albums.length;
        handleSelectAlbum(nextAlbumIdx);
    }
};

const prevImage = () => {
    if (props.currentImageIndex > 0) {
        // Prev image in current album
        handleSelectImage(props.currentImageIndex - 1);
    } else {
        // Start of album -> Go to prev album's last image
        let prevAlbumIdx = props.currentAlbumIndex - 1;
        if (prevAlbumIdx < 0) prevAlbumIdx = props.albums.length - 1;
        
        emit('select-album-end', prevAlbumIdx);
    }
};
</script>

<template>
    <div class="gallery-view-layer" :class="{ active: isActive }">
        
        <!-- Mobile Hamburger Button -->
        <button class="hamburger-btn" @click="toggleMenu" aria-label="Menu">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </button>

        <!-- Col 1: Sidebar -->
        <GallerySidebar 
            :menu-items="menuItems"
            :current-album-index="currentAlbumIndex"
            :is-menu-open="isMenuOpen"
            @select-album="handleSelectAlbum"
            @select-about="$emit('select-about')"
            @close-menu="isMenuOpen = false"
        />

        <!-- Col 2: Main Image (Interactive) -->
        <GalleryMain 
            :current-image="currentImage"
            :transition-name="transitionName"
            @next="nextImage"
            @prev="prevImage"
            @close="$emit('select-lens')"
        />

        <!-- Col 3: Thumbnails -->
        <GalleryThumbnails 
            :current-images="currentImages"
            :current-image-index="currentImageIndex"
            @select-image="handleSelectImage"
        />

    </div>
</template>

<style scoped>
/* GALLERY VIEW LAYER Styles extracted from PortfolioMenu.vue */
.gallery-view-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #0a0a0a;
    z-index: 10;
    display: grid;
    grid-template-columns: 260px 1fr 180px;
    opacity: 0;
    transform: scale(0.98);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;
}

.gallery-view-layer.active {
    opacity: 1;
    transform: scale(1);
    z-index: 30;
    pointer-events: auto;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
    .gallery-view-layer {
        grid-template-columns: 200px 1fr 140px;
    }
}

/* HAMBURGER BUTTON (Default hidden) */
.hamburger-btn {
    display: none;
}

@media (max-width: 768px) {
    .gallery-view-layer {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto; /* Content + Thumbs */
    }

    /* HAMBURGER */
    .hamburger-btn {
        display: flex;
        flex-direction: column;
        gap: 5px;
        position: absolute; /* Fixed relative to container or absolute */
        top: 20px; left: 20px;
        z-index: 100;
        background: rgba(0, 0, 0, 0.28);
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    .hamburger-btn .line {
        width: 24px; height: 2px; background: #fff;
    }
}
</style>
