<script setup>
defineProps({
    menuItems: {
        type: Array,
        required: true
    },
    currentAlbumIndex: {
        type: Number,
        required: true
    },
    isMenuOpen: {
        type: Boolean,
        default: false
    }
});

defineEmits(['select-album', 'select-about', 'close-menu']);
</script>

<template>
    <nav class="brand-menu" :class="{ 'mobile-open': isMenuOpen }">
        <!-- Mobile Close Button -->
        <button class="close-menu-btn" @click="$emit('close-menu')">×</button>

        <div class="brand-list">
            <div 
                v-for="(item, idx) in menuItems" 
                :key="item.id"
                class="brand-item"
                :class="{ active: currentAlbumIndex === idx }"
                @click="$emit('select-album', idx)"
            >
                <span class="brand-name">{{ item.title }}</span>
                <span class="brand-count">{{ item.count }}</span>
            </div>

            <!-- About Me Item -->
             <div class="brand-item" @click="$emit('select-about')">
                <span class="brand-name">About Me</span>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* Brand Menu Styles from GalleryView.vue */
.brand-menu {
    padding: 3rem 0 3rem 3rem; 
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.brand-list {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.brand-item {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: #444; 
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    position: relative;
    width: fit-content;
}

.brand-name {
    position: relative;
    z-index: 1;
}

.brand-count {
    font-size: 0.7rem;
    padding: 2px 5px;
    background: #1a1a1a;
    border-radius: 4px;
    color: #444;
    transition: all 0.3s ease;
    font-weight: 400;
}

.brand-item:hover {
    color: #888;
}
.brand-item:hover .brand-count {
    color: #888;
    background: #2a2a2a;
}

.brand-item.active {
    color: #fff; 
    font-weight: 700;
    transform: translateX(5px);
}
.brand-item.active .brand-count {
    color: #000;
    background: #fff;
    font-weight: 700;
}

.close-menu-btn {
    display: none;
}

@media (max-width: 768px) {
    /* SIDEBAR MENU MOBILE */
    .brand-menu {
        position: fixed;
        top: 0; left: 0;
        width: 280px;
        height: 100%; /* Full viewport height */
        background: #0a0a0a;
        border-right: 1px solid #222;
        z-index: 200; /* Above everything */
        padding: 4rem 2rem;
        transform: translateX(-105%);
        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .brand-menu.mobile-open {
        transform: translateX(0);
        box-shadow: 20px 0 50px rgba(0, 0, 0, 0.29);
    }

    .close-menu-btn {
        display: block;
        position: absolute;
        top: 15px; right: 15px;
        background: none;
        border: none;
        color: #666;
        font-size: 2rem;
        cursor: pointer;
    }

    .brand-list {
        flex-direction: column;
        padding: 0;
        width: 100%;
        gap: 1.5rem;
    }

    .brand-item {
        font-size: 1.2rem;
        transform: none !important; 
    }
}
</style>
