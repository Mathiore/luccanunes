<script setup>
import { computed } from 'vue';

const props = defineProps({
  scrollProgress: {
    type: Number,
    required: true,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const backgroundStyle = computed(() => {
  const val = Math.floor(255 * (1 - props.scrollProgress));
  return {
    backgroundColor: `rgb(${val}, ${val}, ${val})`
  };
});

const textStyle = computed(() => {
  let opacity = 0.8;
  if (props.scrollProgress > 0.7) {
      const fadeOp = Math.max(0, 1 - ((props.scrollProgress - 0.7) / 0.25));
      opacity = fadeOp * 0.8;
  }
  return { opacity };
});
</script>

<template>
  <div class="background-layer" :style="backgroundStyle">
    <div class="text-wrapper" :style="textStyle">
        <h1 class="masked-title">LUCCA NUNES</h1>    
    </div>
    <img src="/models/lucca.png" class="profile-bg" :style="textStyle" alt="" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

.profile-bg {
    position: absolute;
    bottom: -30vh; /* Reverted to align face with camera */
    left: 50%;
    transform: translateX(-50%);
    height: 90vh; 
    max-width: 90vw;
    object-fit: contain;
    pointer-events: none;
    z-index: 2; /* On top of text */
}

.background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 5vh;
    z-index: 0; /* Behind canvas */
    background-color: white; /* Start White */
}

.text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition: opacity 0.1s linear;
    width: 100%;
    height: 100%;
    z-index: 1; /* Behind profile */
    position: absolute;
    top: 0;
    left: 0;
}

.masked-title {
    font-family: 'Anton', sans-serif;
    font-size: 20vw; /* Massive responsive font */
    margin: 0;
    pointer-events: none;
    text-align: center;
    line-height: 0.8;
    text-transform: uppercase;
    
    /* Photo Mask Logic */
    color: transparent;
    background-color: black;
    background-image: url('/models/Lambo/IMG_0043.jpg'); /* Fallback */
    background-size: cover;
    background-position: center;
    background-clip: text;
    -webkit-background-clip: text;
    
    animation: bg-cycle 0.5s infinite steps(1);
}

@keyframes bg-cycle {
    0% { background-image: url('/models/Ferrari/IMG_2223.jpg'); }
    20% { background-image: url('/models/Lambo/IMG_0043.jpg'); }
    40% { background-image: url('/models/Mustang blue/DSC01243.jpg'); }
    60% { background-image: url('/models/Gallardo/IMG_6760.jpg'); }
    80% { background-image: url('/models/Jetta/IMG_0211.jpg'); }
    100% { background-image: url('/models/Ferrari/IMG_2223.jpg'); } 
}

@media (max-width: 768px) {
    .masked-title {
        font-size: 39vw;
    }
    .profile-bg {
        bottom: -23vh; /* Lower position for mobile as requested */
        height: 85vh;
    }
    .text-wrapper {
        justify-content: flex-start; /* Move text to top area */
        padding-top: 9vh;
    }
}
</style>
