<script setup>
defineProps({
    isLoading: Boolean,
    progress: Number
});
</script>

<template>
    <div v-if="isLoading" class="loading-overlay">
        <div class="loader-content">
            <div class="speedometer">
                <div class="gauge-center"></div>
                <div class="needle" :style="{ transform: `rotate(${ -120 + ((progress / 100) * 240) }deg)` }"></div>
                <!-- Scale marks (simplified for CSS) -->
                <svg class="dial-svg" viewBox="0 0 200 100">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#333" stroke-width="2" />
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#D4AF37" stroke-width="4" 
                          :stroke-dasharray="251" :stroke-dashoffset="251 - ((progress/100) * 251)" stroke-linecap="round" />
                </svg>
                <div class="kmh-text">{{ progress }} <span class="unit">Loading</span></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Loading Screen Styles */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.loader-content {
    text-align: center;
    width: 300px;
}

/* Speedometer CSS */
.speedometer {
    position: relative;
    width: 200px;
    height: 100px; /* Semicircle */
    overflow: hidden;
    margin: 0 auto;
}

.dial-svg {
    width: 100%;
    height: 100%;
}

.needle {
    position: absolute;
    bottom: 0;
    left: 100px;
    width: 80px;
    height: 2px;
    background-color: red;
    transform-origin: 0% 50%; /* Pivot at center */
    transform: rotate(-120deg); /* Start pos */
    transition: transform 0.1s linear;
    z-index: 2;
    box-shadow: 0 0 5px red;
}

.gauge-center {
    position: absolute;
    bottom: -5px;
    left: 95px;
    width: 10px;
    height: 10px;
    background-color: #333;
    border-radius: 50%;
    z-index: 3;
}

.kmh-text {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    color: white;
    font-family: 'Impact', sans-serif;
    font-size: 1.5rem;
    line-height: 1;
}

.unit {
    font-size: 0.8rem;
    font-family: 'Arial', sans-serif;
    color: #666;
    display: block;
    margin-top: 5px;
}
</style>
