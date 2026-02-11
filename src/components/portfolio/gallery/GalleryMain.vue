<script setup>
import { ref } from 'vue';

const props = defineProps({
    currentImage: {
        type: String,
        required: true
    },
    transitionName: {
        type: String,
        default: 'fade-slide'
    }
});

const emit = defineEmits(['next', 'prev', 'close']);

// Touch State
const touchStart = ref({ x: 0, y: 0 });
const touchEnd = ref({ x: 0, y: 0 });
// Transition Lock
const isTransitioning = ref(false);

const handleWheel = (e) => {
    if (isTransitioning.value) return;
    
    // Throttle slightly
    isTransitioning.value = true;
    setTimeout(() => isTransitioning.value = false, 400); // 400ms lockout

    if (e.deltaY > 0) {
        emit('next');
    } else {
        emit('prev');
    }
};

const handleTouchStart = (e) => {
    touchStart.value.x = e.changedTouches[0].screenX;
    touchStart.value.y = e.changedTouches[0].screenY;
};

const handleTouchEnd = (e) => {
    touchEnd.value.x = e.changedTouches[0].screenX;
    touchEnd.value.y = e.changedTouches[0].screenY;
    
    handleGesture();
};

const handleGesture = () => {
    const dx = touchEnd.value.x - touchStart.value.x;
    const dy = touchEnd.value.y - touchStart.value.y;
    
    // Check if horizontal swipe dominant and long enough
    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 50) {
            if (dx < 0) {
                emit('next');
            } else {
                emit('prev');
            }
        }
    } else {
        // Vertical Swipe dominant
        if (Math.abs(dy) > 50) {
            if (dy > 0) {
                // Swipe Down (finger moves down) -> "Scroll Up" direction visually
                emit('close');
            }
        }
    }
};
</script>

<template>
    <main 
        class="main-display"
        @wheel.prevent="handleWheel"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
    >
        <transition :name="transitionName">
            <div :key="currentImage" class="main-image-wrapper">
                <img :src="currentImage" alt="Gallery Selection" class="main-img" />
            </div>
        </transition>
    </main>
</template>

<style scoped>
.main-display {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    /* ensure proper touch handling */
    touch-action: none; 
}

.main-image-wrapper {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem; /* Match parent padding or handle sizing */
    will-change: transform, opacity;
}

.main-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    backface-visibility: hidden; /* Hardware accel hint */
}

/* TRANSITIONS */
/* Slide Left (Next) */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    position: absolute; /* Ensure they don't fight for layout */
    width: 100%;
    height: 100%;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
}
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-40px) scale(0.95);
}

/* Slide Right (Prev) */
.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-40px) scale(0.95);
}
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
}

/* Fallback / Initial */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; }

@media (max-width: 768px) {
    .main-img {
        /* Reduce shadow cost on mobile */
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
}
</style>
