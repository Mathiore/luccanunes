<script setup>
defineProps({
    src: {
        type: String,
        default: null
    }
});

defineEmits(['close']);
</script>

<template>
    <transition name="fade">
        <div v-if="src" class="lightbox" @click="$emit('close')">
            <button class="close-lightbox">×</button>
            <img :src="src" alt="Full screen preview" @click.stop />
        </div>
    </transition>
</template>

<style scoped>
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    backdrop-filter: blur(5px);
}

.lightbox img {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
}

.close-lightbox {
    position: absolute;
    top: 30px;
    right: 30px;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    cursor: pointer;
    line-height: 1;
    z-index: 1001;
    transition: transform 0.2s;
}

.close-lightbox:hover {
    transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
