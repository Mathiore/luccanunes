<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    albums: {
        type: Array,
        required: true
    },
    selectedAlbum: {
        type: Object,
        default: null
    }
});

defineEmits(['close', 'select-album', 'clear-selection', 'view-photo']);
</script>

<template>
    <div class="gallery-modal" :class="{ 'open': isOpen }">
        <button class="close-btn" @click="$emit('close')">×</button>
        
        <div class="gallery-content">
            <!-- Album List View -->
            <div v-if="!selectedAlbum" class="albums-list">
                <h3>Álbuns Recentes</h3>
                <div class="grid">
                    <div 
                        class="album-card" 
                        v-for="album in albums" 
                        :key="album.id"
                        @click="$emit('select-album', album)"
                    >
                        <img :src="album.cover" :alt="album.title" loading="lazy" />
                        <div class="album-info">
                            <h4>{{ album.title }}</h4>
                            <span>{{ album.images.length }} photos</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Single Album View -->
            <div v-else class="album-view">
                <button class="back-btn" @click="$emit('clear-selection')">← Voltar</button>
                <h3>{{ selectedAlbum.title }}</h3>
                <div class="grid photos-grid">
                    <div 
                        class="photo-card" 
                        v-for="(img, index) in selectedAlbum.images" 
                        :key="index"
                        @click="$emit('view-photo', img)"
                    >
                        <img :src="img" loading="lazy" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.gallery-modal {
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    background: rgba(10, 10, 10, 0.95);
    border-left: 1px solid rgba(255,255,255,0.1);
    transform: translateX(100%);
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 50;
    padding: 2rem;
    backdrop-filter: blur(20px);
    overflow-y: auto;
}

/* Scrollbar Styling */
.gallery-modal::-webkit-scrollbar {
    width: 6px;
}

.gallery-modal::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.gallery-modal::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.gallery-modal::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
}

.gallery-modal.open {
    transform: translateX(0);
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
}

.gallery-content h3 {
    color: white;
    font-family: 'Outfit', sans-serif;
    margin-bottom: 2rem;
    font-size: 2rem;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding-bottom: 2rem;
}

.album-card {
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255,255,255,0.05);
}

.album-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
    border-color: rgba(255,255,255,0.2);
}

.album-card img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
}

.album-info {
    padding: 1rem;
}

.album-info h4 {
    color: white;
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
    font-family: 'Outfit', sans-serif;
}

.album-info span {
    color: rgba(255,255,255,0.5);
    font-size: 0.8rem;
    text-transform: uppercase;
}

.back-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 0.5rem 1rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    text-transform: uppercase;
    font-size: 0.8rem;
    border-radius: 4px;
    transition: all 0.2s;
}

.back-btn:hover {
    background: white;
    color: black;
}

.photo-card {
    border-radius: 4px;
    overflow: hidden;
    background: #111;
}

.photo-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
}

.photo-card:hover img {
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .gallery-modal {
        width: 100%;
        bottom: 0;
        height: 80%;
        top: auto;
        transform: translateY(100%);
        border-right: none;
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .gallery-modal.open {
        transform: translateY(0);
    }

    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
