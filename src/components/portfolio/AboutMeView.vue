<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AboutScene from './about/AboutScene.vue';
import AboutPolaroids from './about/AboutPolaroids.vue';
import AboutOverlay from './about/AboutOverlay.vue';

const emit = defineEmits(['back']);

// State
const containerRef = ref(null);
const scrollProgress = ref(0);
const isAutoScrolling = ref(false);

// Scroll Handler
const handleScroll = () => {
    if (!containerRef.value) return;
    const scrollTop = containerRef.value.scrollTop;
    const maxScroll = containerRef.value.scrollHeight - containerRef.value.clientHeight;
    
    if (maxScroll > 0) {
        scrollProgress.value = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    }
};

const goBack = () => emit('back');

const handleScrollUp = (e) => {
    // If at top and scrolling UP (deltaY < 0), go back
    if (containerRef.value.scrollTop <= 0 && e.deltaY < 0) {
        goBack();
    }
};

// Automatic Animation Logic
const startAutoScroll = () => {
    if (!containerRef.value) return;

    // Wait slightly for transition to settle
    setTimeout(() => {
        if (!containerRef.value) return;
        
        const start = containerRef.value.scrollTop;
        const maxScroll = containerRef.value.scrollHeight - containerRef.value.clientHeight;
        const target = maxScroll; // Scroll to end to show full distancing
        const startTime = performance.now();
        const duration = 2500; // 2.5s for a smooth cinematic feel

        isAutoScrolling.value = true;

        const step = (currentTime) => {
            if (!isAutoScrolling.value) return;

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease Out Cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            
            if (containerRef.value) {
                containerRef.value.scrollTop = start + (target - start) * ease;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                isAutoScrolling.value = false;
            }
        };

        requestAnimationFrame(step);
    }, 500);
};

const stopAutoScroll = () => {
    if (isAutoScrolling.value) {
        isAutoScrolling.value = false;
    }
};

onMounted(() => {
    if (containerRef.value) {
        containerRef.value.addEventListener('wheel', handleScrollUp);
        
        // Auto Scroll Interruption Listeners
        containerRef.value.addEventListener('wheel', stopAutoScroll, { passive: true });
        containerRef.value.addEventListener('touchstart', stopAutoScroll, { passive: true });
        containerRef.value.addEventListener('mousedown', stopAutoScroll, { passive: true });
    
        // Start Auto Scroll
        startAutoScroll();
    }
});

onBeforeUnmount(() => {
    if (containerRef.value) {
        containerRef.value.removeEventListener('wheel', handleScrollUp);
        containerRef.value.removeEventListener('wheel', stopAutoScroll);
        containerRef.value.removeEventListener('touchstart', stopAutoScroll);
        containerRef.value.removeEventListener('mousedown', stopAutoScroll);
    }
    isAutoScrolling.value = false;
});
</script>

<template>
    <div class="about-container">
        <!-- Scroll Track -->
        <div class="scroll-track" ref="containerRef" @scroll="handleScroll">
            <div class="scroll-spacer"></div>
        </div>

        <!-- Sticky Stage -->
        <div class="sticky-stage">
            <AboutScene :scroll-progress="scrollProgress" />
            <AboutPolaroids :scroll-progress="scrollProgress" />
            <AboutOverlay :scroll-progress="scrollProgress" />
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.about-container {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background-color: #ffffff;
    z-index: 200;
    font-family: 'Inter', sans-serif;
    color: #000000;
}

.scroll-track {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    overflow-y: auto;
    z-index: 300;
    scrollbar-width: none; 
}

.scroll-track::-webkit-scrollbar {
    display: none;
}

.scroll-spacer {
    height: 200vh; /* Shorter scroll */
}

.sticky-stage {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; 
    overflow: hidden;
}
</style>
