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
    }, 100);
};

const stopAutoScroll = () => {
    if (isAutoScrolling.value) {
        isAutoScrolling.value = false;
    }
};

const handleReturn = () => {
    // Stop any existing auto scroll (forward or whatever)
    isAutoScrolling.value = false;
    
    if (!containerRef.value) return;

    const start = containerRef.value.scrollTop;
    const target = 0;
    const startTime = performance.now();
    const duration = 1500; // Returns faster than it enters

    // We set this true so interaction listeners can cancel it if user manually intervenes
    isAutoScrolling.value = true;

    const step = (currentTime) => {
        if (!isAutoScrolling.value) return;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth Ease In Out
        const ease = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        if (containerRef.value) {
            containerRef.value.scrollTop = start + (target - start) * ease;
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            isAutoScrolling.value = false;
            goBack();
        }
    };

    requestAnimationFrame(step);
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

        <!-- Back Button -->
        <button class="back-btn" @click="handleReturn">
            VOLTAR
        </button>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.about-container {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100dvh;
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
    z-index: 400;
}

.back-btn {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 30px;
    background: rgba(0, 0, 0, 0.03); 
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 50px;
    
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #444;
    text-transform: uppercase;
    
    cursor: pointer;
    z-index: 500;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(0, 0, 0, 0.08);
    color: #000;
    transform: translateX(-50%) scale(1.05);
}
</style>
