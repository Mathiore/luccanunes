<script setup>
import { onMounted, ref } from 'vue';

const isLoaded = ref(false);

onMounted(() => {
  // Trigger animations after mount
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <section class="hero-container">
    <!-- Background Layer -->
    <div class="background-layer">
      <picture>
        <source media="(max-width: 768px)" srcset="../assets/carFundoMobile.png" />
        <img src="../assets/carrofundo.png" alt="Garage Background" class="bg-img" />
      </picture>
      <!-- Overlay removed for original brightness -->
    </div>

    <!-- Text Layer (Middle) -->
    <div class="text-layer" :class="{ 'animate-text': isLoaded }">
      <h1 class="main-title">
        <span class="block">FOTOGRAFIA</span>
        <span class="block highlight">PROFISSIONAL</span>
      </h1>
      <p class="subtitle">LUCCA NUNES</p>
    </div>

    <!-- Foreground Layer (Car) -->
    <div class="car-layer">
      <picture>
        <source media="(max-width: 768px)" srcset="../assets/carFrenteMobile.png" />
        <img src="../assets/carroFrente.png" alt="Car Front" class="car-img" :class="{ 'animate-car': isLoaded }" />
      </picture>
    </div>
    
    <!-- Scroll indicator -->
    <div class="scroll-indicator">
        <div class="mouse"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

/* Background */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4; /* Moved to front as requested */
  pointer-events: none; /* Ensure clicks pass through if it's an overlay */
}

.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
}

/* Text Layer - Behind the car */
.text-layer {
  position: absolute;
  z-index: 5; /* Middle layer */
  text-align: center;
  top: 30%; /* Initial position moved up */
  left: 50%;
  transform: translate(-50%, 20%); /* Start slightly lower */
  opacity: 0;
  transition: all 1.5s cubic-bezier(0.22, 1, 0.36, 1);
  width: 100%;
}

.animate-text {
  opacity: 1;
  transform: translate(-50%, -40%); /* Moved up further from -30% */
}

.main-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 8vw, 8rem);
  line-height: 0.9;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: -2px;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.highlight {
  color: #fff; /* Changed from transparent to match FOTOGRAFIA */
  display: block;
}

.subtitle {
  margin-top: 1rem;
  font-size: 1.2rem;
  letter-spacing: 4px;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}

/* Car Layer - Front */
.car-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* Moved to front */
  pointer-events: none;
  overflow: hidden;
}

.car-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  
  /* Initial state */
  transform: translateY(100px) scale(1.05); /* Start slightly zoomed and lower */
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
}

.car-img.animate-car {
  transform: translateY(0) scale(1); /* Return to natural scale to match background */
  opacity: 1;
}

/* Scroll Indicator */
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.7;
}

.mouse {
    width: 26px;
    height: 42px;
    border: 2px solid #fff;
    border-radius: 20px;
    position: relative;
}

.mouse::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    animation: scroll 2s infinite;
}

@keyframes scroll {
    0% { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, 15px); opacity: 0; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .main-title {
        font-size: 3.5rem;
    }
    .car-img {
        max-width: 120%; /* Bleed out on mobile */
    }
}
</style>
