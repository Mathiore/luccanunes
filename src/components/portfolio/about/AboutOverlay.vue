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
            <h2>Transformando potência, design e exclusividade em arte visual.</h2>
            <p><a href="https://instagram.com/luccapture">instagram.com/luccapture</a></p>
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
    pointer-events: auto; /* Enable clicking */
    z-index: 600; /* Above scroll-track (z-index 300) */
}

.title-overlay h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
    color: #000;
}

.title-overlay p {
    margin: 0;
    font-size: 1rem;
    color: #000;
}

.title-overlay p a {
    color: inherit;
    text-decoration: none;
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
