<script setup>
import { ref } from 'vue';

const props = defineProps({
    scrollProgress: {
        type: Number,
        default: 0
    }
});

const polaroids = ref([
    { id: 1, src: '/models/lucca1.jpg', rotation: -8, x: '30%', y: '40%', z: 2 },
    { id: 2, src: '/models/lucca2.jpg', rotation: 12, x: '60%', y: '35%', z: 1 },
    { id: 3, src: '/models/lucca3.jpg', rotation: -5, x: '40%', y: '65%', z: 3 },
    { id: 4, src: '/models/lucca4.jpg', rotation: 6, x: '65%', y: '60%', z: 2 },
]);

const getPolaroidStyle = (card, index) => {
    const p = props.scrollProgress;
    const startFall = 0.25; 
    
    // Initial state
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
    const scrollRange = 0.6; 
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
</script>

<template>
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
</template>

<style scoped>
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

@media (max-width: 768px) {
    .polaroid-wrapper {
        width: 160px;
    }
}
</style>
