<script setup>
defineProps({
    scrollProgress: {
        type: Number,
        default: 0
    }
});
</script>

<template>
    <div class="overlay-container">
        <!-- Title -->
        <div class="title-overlay" :style="{ opacity: scrollProgress > 0.4 ? (scrollProgress - 0.4) * 4 : 0 }">
            <h1>LUCCA NUNES</h1>
        </div>

        <!-- Scroll Indicator -->
        <div class="scroll-indicator" :style="{ opacity: 1 - scrollProgress * 5 }">
            <span>SCROLL DOWN</span>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.overlay-container {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 15;
    font-family: 'Inter', sans-serif;
}

.title-overlay {
    position: absolute;
    bottom: 10vh; left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

.title-overlay h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.02em;
    color: #000;
}

.scroll-indicator {
    position: absolute;
    bottom: 30px; left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    opacity: 0.5;
    z-index: 50;
    color: #000;
}

@media (max-width: 768px) {
    .title-overlay h1 {
        font-size: 2rem;
    }
}
</style>
