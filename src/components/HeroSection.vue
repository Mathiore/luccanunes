<script setup>
import { onMounted, ref } from 'vue';

const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <section class="hero-container">
    <div class="text-layer">
      <h1 class="typing-container">
        <span class="typing-text">Fotografia Automotiva</span>
      </h1>
      
      <!-- Signature Animation -->
      <div class="signature-container" :class="{ 'start-sign': isLoaded }">
        <svg viewBox="0 0 400 60" class="signature-svg">
          <text x="50%" y="50%" text-anchor="middle" class="signature-text">
            <tspan class="normal-font">Por</tspan> 
            <tspan dx="10" class="cursive-font">Lucca Nunes</tspan>
          </text>
        </svg>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator fade-in" :class="{ visible: isLoaded }">
        <div class="mouse"></div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');

.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000006;
  overflow: hidden;
}

.text-layer {
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Typing Effect */
.typing-container {
  display: inline-block;
  margin-bottom: 1rem;
}

.typing-text {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: clamp(2.25rem, 5.6vw, 6rem);
  
  /* Text Background Image */
  background-image: url('../assets/mclaren.jpg');
  background-size: cover;
  background-position: center;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;

  text-transform: uppercase;
  letter-spacing: -1px;
  overflow: hidden;
  letter-spacing: -1px;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  animation: 
    typing 2.5s steps(30, end) forwards;
  max-width: 0; 
}

/* Signature Effect */
.signature-container {
  width: 400px; /* Increased for wider text */
  height: 100px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 1s ease 2.5s, transform 1s ease 2.5s; 
}

.signature-container.start-sign {
  opacity: 1;
  transform: translateY(0);
}

.signature-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.signature-text {
  fill: transparent;
  stroke: white;
  stroke-width: 0.8px;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: sign-anim 3s ease-in-out forwards;
  animation-delay: 2.8s;
}

.normal-font {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.cursive-font {
  font-family: 'Mrs Saint Delafield', cursive;
  font-size: 50px;
}

@keyframes sign-anim {
  0% {
    stroke-dashoffset: 400;
    fill: transparent;
  }
  70% {
    stroke-dashoffset: 0;
    fill: transparent;
  }
  100% {
    stroke-dashoffset: 0;
    fill: white; /* Fill in at the end */
  }
}

/* Keyframes */
@keyframes typing {
  from { width: 0; max-width: 0; }
  to { width: 100%; max-width: 100%; }
}
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transition: opacity 1s ease 3s; /* Delay appearance */
}

.scroll-indicator.visible {
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

/* Keyframes */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: white; }
}

@keyframes scroll {
    0% { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, 15px); opacity: 0; }
}

/* Responsive */
@media (max-width: 768px) {
    .typing-text {
        font-size: 3.2rem;
        white-space: normal;
        border-right: none;
        animation: fadeIn 2s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
}
</style>
