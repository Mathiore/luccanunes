<script setup>
defineProps({
    visible: {
        type: Boolean,
        default: true
    }
});

defineEmits(['open']);
</script>

<template>
    <div class="ui-overlay" :class="{ 'hidden': !visible }">
        <h2>Explore os <span class="highlight">Álbuns</span></h2>
        <button class="explore-btn" @click="$emit('open')">VER ÁLBUNS</button>
    </div>
</template>

<style scoped>
.ui-overlay {
    position: absolute;
    bottom: 10%;
    left: 5%;
    pointer-events: none;
    transition: opacity 0.5s;
    z-index: 10;
}

.ui-overlay.hidden {
    opacity: 0;
}

h2 {
    font-family: 'Outfit', sans-serif;
    color: white;
    font-size: 3rem;
    text-transform: uppercase;
    font-weight: 700;
}

.highlight {
    color: transparent;
    -webkit-text-stroke: 1px white;
}

.explore-btn {
    margin-top: 1.5rem;
    background: transparent;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    padding: 1rem 2rem;
    border: 1px solid white;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    pointer-events: auto;
    position: relative;
    z-index: 20;
}

.explore-btn:hover {
    background: white;
    color: black;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255,255,255,0.1);
}
</style>
