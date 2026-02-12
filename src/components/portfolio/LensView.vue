<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    isActive: Boolean,
    isMobile: Boolean,
    currentImage: String,
    isZooming: Boolean
});

const emit = defineEmits(['enter-gallery']);

// Lens Effect State - USING PIXELS NOW
const lensPos = ref({ x: 0, y: 0 });
const targetPos = ref({ x: 0, y: 0 });
let animationFrame = null;

const onMouseMove = (e) => {
    if (!props.isActive || props.isMobile) return;
    targetPos.value = { x: e.clientX, y: e.clientY };
};

const updateLens = () => {
    if (props.isActive) {
        if (props.isMobile) {
            // Automated wandering movement for mobile
            const time = Date.now() * 0.0008; // speed
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const radiusX = window.innerWidth * 0.3; 
            const radiusY = window.innerHeight * 0.2;
            
            // Lissajous-ish path
            const tx = cx + Math.sin(time) * radiusX;
            const ty = cy + Math.cos(time * 1.3) * radiusY;
            
            targetPos.value = { x: tx, y: ty };

            lensPos.value.x += (targetPos.value.x - lensPos.value.x) * 0.05;
            lensPos.value.y += (targetPos.value.y - lensPos.value.y) * 0.05;
        } else {
            // Mouse follower
            lensPos.value.x += (targetPos.value.x - lensPos.value.x) * 0.1;
            lensPos.value.y += (targetPos.value.y - lensPos.value.y) * 0.1;
        }
    }
    animationFrame = requestAnimationFrame(updateLens);
};

const totalTicks = computed(() => props.isMobile ? 31 : 61);
const tickIndices = computed(() => props.isMobile 
    ? { v01: 5, v02: 15, v03: 25 } 
    : { v01: 10, v02: 30, v03: 50 }
);

// Compute styles based on pixel position
const lensStyle = computed(() => {
    // Always return variables for dynamic positioning
    return {
        '--lens-x': `${lensPos.value.x}px`,
        '--lens-y': `${lensPos.value.y}px`
    };
});

const handleClick = () => {
    emit('enter-gallery');
};

onMounted(() => {
    // Initialize center strictly
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    lensPos.value = { x: cx, y: cy };
    targetPos.value = { x: cx, y: cy };
    
    updateLens();
});

onBeforeUnmount(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<template>
    <div 
        class="lens-view-layer" 
        :class="{ active: isActive }"
        @mousemove="onMouseMove" 
        @click="handleClick"
    >
        <!-- 1. Blurred Background Image -->
        <div class="bg-blurred" :style="{ backgroundImage: `url(${currentImage})` }"></div>
        
        <!-- Vignette & Darkening -->
        <div class="vignette-overlay"></div>
        
        <!-- 2. Sharp Foreground Image (Clipped) -->
        <!-- We use mask-position with calculated pixel offsets for perfect alignment -->
        <div 
            class="fg-sharp" 
            :class="{ 'zoom-transition': isZooming }"
            :style="{ ...lensStyle, backgroundImage: `url(${currentImage})` }"
        ></div>
        
        <!-- Lens UI Border/Reticle -->
        <div class="lens-reticle" :class="{ 'hiding': isZooming }" :style="lensStyle">
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>
        </div>

        <div class="prompt-text">
            <span>CLICK TO ENTER</span>
        </div>

        <!-- GRID OVERLAY -->
        <div class="grid-overlay">
            <!-- Corners -->
            <div class="corner-mark tl"></div>
            <div class="corner-mark tr"></div>
            <div class="corner-mark bl"></div>
            <div class="corner-mark br"></div>

            <!-- Grid Points -->
            <div class="grid-points">
                <div v-for="n in 16" :key="n" class="point"></div>
            </div>

            <!-- Bottom Numbering -->
            <div class="grid-numbers">
                <span class="num">02</span>
                <div class="sep"></div>
                <span class="num">03</span>
            </div>
        </div>

        <!-- ZOOM RULER (Decoration) -->
        <div class="zoom-ruler">
            <div class="ruler-track">
                <div v-for="n in totalTicks" :key="n" class="tick" :class="{ major: (n-1) % 10 === 0 }">
                    <span v-if="(n-1) === tickIndices.v01" class="tick-label">01</span>
                    <span v-if="(n-1) === tickIndices.v02" class="tick-label">02</span>
                    <span v-if="(n-1) === tickIndices.v03" class="tick-label">03</span>
                    
                    <!-- Red Dot indicator near 02 -->
                    <div v-if="(n-1) === tickIndices.v02" class="red-dot-indicator"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* LENS VIEW Styles extracted from PortfolioMenu.vue */
.lens-view-layer {
    position: absolute;
    width: 100%; height: 100%;
    z-index: 20;
    opacity: 0;
    pointer-events: none;
    transform: scale(1.1);
    transition: opacity 0.8s ease, transform 1s ease;
}

.lens-view-layer.active {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
    cursor: none;
}

.bg-blurred {
    position: absolute;
    top: -5%; left: -5%;
    width: 110%; height: 110%;
    background-size: cover;
    background-position: center;
    filter: blur(4px) brightness(0.4); 
    transition: background-image 0.5s ease;
}

.vignette-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: radial-gradient(circle, transparent 40%, #0a0a0a 100%);
    pointer-events: none;
}

.fg-sharp {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-size: cover;
    background-position: center;
    mask-image: linear-gradient(black, black);
    mask-size: 400px 400px;
    mask-repeat: no-repeat;
    mask-position: calc(var(--lens-x) - 200px) calc(var(--lens-y) - 200px);
    -webkit-mask-image: linear-gradient(black, black);
    -webkit-mask-size: 400px 400px;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: calc(var(--lens-x) - 200px) calc(var(--lens-y) - 200px);
    border: 1px solid rgba(255,255,255,0.05); 
    filter: contrast(1.1);
    transition: 
        transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), 
        opacity 0.5s ease,
        mask-position 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
        -webkit-mask-position 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
        mask-size 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
        -webkit-mask-size 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: mask-position, mask-size, transform;
    transform-origin: var(--lens-x) var(--lens-y);
}

.fg-sharp.zoom-transition {
    /* TRANSITION TO GALLERY SIZING */
    -webkit-mask-position: center center !important;
    mask-position: center center !important;
    
    -webkit-mask-size: 80% 80% !important;
    mask-size: 80% 80% !important;

    transform: scale(1);
    z-index: 25;
}

@media (max-width: 768px) {
    .fg-sharp {
        /* Mobile size 300px */
        mask-size: 300px 300px;
        -webkit-mask-size: 300px 300px;
        
        /* Dynamic position with smaller offset (150px) */
        mask-position: calc(var(--lens-x) - 150px) calc(var(--lens-y) - 150px);
        -webkit-mask-position: calc(var(--lens-x) - 150px) calc(var(--lens-y) - 150px);
    }
}

.lens-reticle {
    position: absolute;
    width: 400px; height: 400px;
    left: var(--lens-x);
    top: var(--lens-y);
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: opacity 0.3s ease, border-color 0.3s ease;
}

.lens-reticle.hiding {
    opacity: 0;
}

@media (max-width: 768px) {
    .lens-reticle {
        left: var(--lens-x); 
        top: var(--lens-y);
        width: 300px; height: 300px;
    }
}

.lens-reticle .corner {
    position: absolute;
    width: 8px; height: 8px;
    border-color: rgba(255,255,255,0.8);
    border-style: solid;
    border-width: 0;
}
.lens-reticle .tl { top: 0px; left: 0px; border-top-width: 1px; border-left-width: 1px; }
.lens-reticle .tr { top: 0px; right: 0px; border-top-width: 1px; border-right-width: 1px; }
.lens-reticle .bl { bottom: 0px; left: 0px; border-bottom-width: 1px; border-left-width: 1px; }
.lens-reticle .br { bottom: 0px; right: 0px; border-bottom-width: 1px; border-right-width: 1px; }

.prompt-text {
    position: absolute;
    bottom: 120px; 
    width: 100%;
    text-align: center;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    opacity: 0.5;
    text-transform: uppercase;
}

/* ZOOM RULER STYLE */
.zoom-ruler {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 800px;
    height: 50px;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.ruler-track {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

@media (max-width: 768px) {
    .ruler-track {
        gap: 8px;
    }
}

.tick {
    width: 1px;
    height: 8px;
    background: rgba(255,255,255,0.3);
    position: relative;
}

.tick.major {
    height: 16px;
    background: rgba(255,255,255,0.6);
}

.tick-label {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: rgba(255,255,255,0.9);
    font-weight: 600;
}

.red-dot-indicator {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background-color: #ff0000;
    border-radius: 50%;
    box-shadow: 0 0 5px #ff0000;
}

/* GRID OVERLAY STYLE */
.grid-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 15;
    padding: 30px;
    box-sizing: border-box;
}

.grid-points {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    width: 100%; height: 100%;
    place-items: center;
}

.point {
    width: 5px; height: 5px;
    opacity: 0.8;
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.33);
    border: 1px solid rgba(255, 255, 255, 1);
}

.corner-mark {
    position: absolute;
    width: 30px; height: 30px;
    border-color: rgba(255,255,255,0.8);
    border-style: solid;
    border-width: 0;
}
.corner-mark.tl { top: 30px; left: 30px; border-top-width: 2px; border-left-width: 2px; }
.corner-mark.tr { top: 30px; right: 30px; border-top-width: 2px; border-right-width: 2px; }
.corner-mark.bl { bottom: 30px; left: 30px; border-bottom-width: 2px; border-left-width: 2px; }
.corner-mark.br { bottom: 30px; right: 30px; border-bottom-width: 2px; border-right-width: 2px; }

.grid-numbers {
    position: absolute;
    bottom: 40px;
    left: 80px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.9);
    font-weight: 600;
    letter-spacing: 0.1em;
}
.grid-numbers .sep {
    width: 30px; height: 1px; background: rgba(255,255,255,0.4);
}
</style>
