<script setup>
import { computed } from 'vue';

const props = defineProps({
    isActive: Boolean,
    albums: Array,
    currentAlbumIndex: Number,
    currentImageIndex: Number,
    currentImage: String,
    currentImages: Array
});

const emit = defineEmits(['select-album', 'select-image']);

// Formatting Albums for Menu
const menuItems = computed(() => props.albums.map((album, index) => ({
    id: album.id,
    title: album.title, 
    count: album.images ? album.images.length : 0,
    index
})));

const selectAlbum = (index) => {
    emit('select-album', index);
};

const selectImage = (index) => {
    emit('select-image', index);
};
</script>

<template>
    <div class="gallery-view-layer" :class="{ active: isActive }">
        
        <!-- Col 1: Clean Brand Menu -->
        <nav class="brand-menu">
            <div class="brand-list">
                <div 
                    v-for="(item, idx) in menuItems" 
                    :key="item.id"
                    class="brand-item"
                    :class="{ active: currentAlbumIndex === idx }"
                    @click="selectAlbum(idx)"
                >
                    <span class="brand-name">{{ item.title }}</span>
                    <span class="brand-count">{{ item.count }}</span>
                </div>
            </div>
        </nav>

        <!-- Col 2: Main Image -->
        <main class="main-display">
            <transition name="fade-fast" mode="out-in">
                <div :key="currentImage" class="main-image-wrapper">
                    <img :src="currentImage" alt="Gallery Selection" class="main-img" />
                </div>
            </transition>
        </main>

        <!-- Col 3: Thumbnails -->
        <aside class="thumbnails-sidebar">
            <div class="thumbs-scroll">
                <div 
                    v-for="(img, idx) in currentImages" 
                    :key="idx"
                    class="thumb-item"
                    :class="{ active: currentImageIndex === idx }"
                    @click="selectImage(idx)"
                >
                    <img :src="img" loading="lazy" />
                </div>
            </div>
        </aside>

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

/* Brand Menu */
.brand-menu {
    padding: 3rem 0 3rem 3rem; 
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.brand-list {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.brand-item {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: #444; 
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    position: relative;
    width: fit-content;
}

.brand-name {
    position: relative;
    z-index: 1;
}

.brand-count {
    font-size: 0.7rem;
    padding: 2px 5px;
    background: #1a1a1a;
    border-radius: 4px;
    color: #444;
    transition: all 0.3s ease;
    font-weight: 400;
}

.brand-item:hover {
    color: #888;
}
.brand-item:hover .brand-count {
    color: #888;
    background: #2a2a2a;
}

.brand-item.active {
    color: #fff; 
    font-weight: 700;
    transform: translateX(5px);
}
.brand-item.active .brand-count {
    color: #000;
    background: #fff;
    font-weight: 700;
}

/* Main Display */
.main-display {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.main-image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
}

/* Sidebar Thumbs */
.thumbnails-sidebar {
    padding: 2rem 1rem 2rem 0;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    justify-content: center; 
}

.thumbs-scroll {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.thumb-item {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 2px;
    overflow: hidden;
    opacity: 0.3;
    filter: grayscale(100%);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid transparent;
}

.thumb-item img {
    width: 100%; height: 100%; object-fit: cover;
}

.thumb-item:hover {
    opacity: 0.6;
}

.thumb-item.active {
    opacity: 1;
    filter: grayscale(0%);
    border-color: rgba(255,255,255,0.4);
}

/* TRANSITIONS */
.fade-fast-enter-active,
.fade-fast-leave-active {
    transition: opacity 0.3s ease;
}
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }

/* RESPONSIVE */
@media (max-width: 1024px) {
    .gallery-view-layer {
        grid-template-columns: 200px 1fr 140px;
    }
}

@media (max-width: 768px) {
    .gallery-view-layer {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
    }

    .brand-menu {
        padding: 1rem 0;
        grid-row: 1;
        background: #0a0a0a;
        border-bottom: 1px solid #1a1a1a;
        width: 100%;
        overflow-x: auto;
    }

    .brand-list {
        flex-direction: row;
        padding: 0 1.5rem;
        width: max-content;
        gap: 2rem;
    }

    .brand-item {
        font-size: 0.9rem;
        transform: none !important; 
    }

    .thumbnails-sidebar {
        grid-row: 3;
        padding: 1rem 0;
        width: 100%;
        border-top: 1px solid #1a1a1a;
        justify-content: flex-start;
    }

    .thumbs-scroll {
        flex-direction: row;
        padding: 0 1rem;
        overflow-x: auto;
        width: 100%;
        border: none;
    }

    .thumb-item {
        width: 80px;
        height: 50px;
        flex-shrink: 0;
    }
}
</style>
