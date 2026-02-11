<script setup>
defineProps({
    currentImages: {
        type: Array,
        required: true
    },
    currentImageIndex: {
        type: Number,
        required: true
    }
});

defineEmits(['select-image']);
</script>

<template>
    <aside class="thumbnails-sidebar">
        <div class="thumbs-scroll">
            <div 
                v-for="(img, idx) in currentImages" 
                :key="idx"
                class="thumb-item"
                :class="{ active: currentImageIndex === idx }"
                @click="$emit('select-image', idx)"
            >
                <img :src="img" loading="lazy" />
            </div>
        </div>
    </aside>
</template>

<style scoped>
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

@media (max-width: 768px) {
    .thumbnails-sidebar {
        grid-row: 2;
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
