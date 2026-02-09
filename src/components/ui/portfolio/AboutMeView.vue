<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['back']);

// State
const scrollContainer = ref(null);
const scrollProgress = ref(0);

// Scroll Handling
const handleScroll = (e) => {
    if (!scrollContainer.value) return;
    const scrollTop = scrollContainer.value.scrollTop;
    const maxScroll = scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight;
    
    // Normalize scroll 0 to 1
    scrollProgress.value = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
};

// Computed Animations

// Image stays centered
const imageStyle = computed(() => {
    return {
        // Simple scale effect on image too? User didn't ask, but it looks better. Keep it static for now as requested.
        transform: 'translate(-50%, -50%)', 
    };
});

// Text moves UP and SCALES UP CONTINUOUSLY
// Text moves UP and SCALES UP CONTINUOUSLY
const textGroupStyle = computed(() => {
    const p = scrollProgress.value;
    
    // Movement: Starts at center (0px), moves UP continuously.
    // "Bottom to Top" means negative Y.
    // Start slightly below center (20%) and move WAY up (-150% or more) to exit screen eventually
    const startY = 30; // 30% down
    const endY = -250;  // Move far up
    const translateY = startY + (p * (endY - startY)); // Use + because endY is negative
    
    // Scale: Starts normal, ends slightly larger (reduced from 5.0)
    const startScale = 0.8;
    const endScale = 1.6; // Reduced scale as requested
    const scale = startScale + (p * (endScale - startScale));
    
    // Opacity: Fade in quickly, then fade out at the end
    let opacity = 1;
    if (p < 0.1) {
        opacity = p * 10;
    } else if (p > 0.8) {
        opacity = 1 - ((p - 0.8) * 5); // Fade out from 0.8 to 1.0
    }
    
    return {
        transform: `translate(-50%, ${translateY}%) scale(${scale})`,
        opacity: Math.max(0, opacity)
    };
});

const instaCardStyle = computed(() => {
    const p = scrollProgress.value;
    
    // Appears at the very end when text is fading/gone (0.8 to 1.0)
    let opacity = 0;
    let translateY = 50; // Coming from bottom
    
    if (p > 0.75) {
        // Fade in from 0.75 to 0.95
        opacity = (p - 0.75) * 5; 
        opacity = Math.min(Math.max(opacity, 0), 1);
        
        // Slide up
        translateY = 50 - ((p - 0.75) * 200); // Move up slightly
        // Clamp translateY to 0 at peak? 
        // Let's just have it settle at center.
        translateY = Math.max(0, 50 - ((p - 0.75) * 250));
    }
    
    return {
        opacity: opacity,
        transform: `translate(-50%, calc(-50% + ${translateY}px))`,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none'
    };
});

const licenseStyle = computed(() => {
    const p = scrollProgress.value;
    let opacity = 0;
    let translateY = 20;
    
    // Reveal at very end (0.88 to 1.0)
    if (p > 0.88) {
        opacity = (p - 0.88) * 10;
        translateY = 20 - ((p - 0.88) * 200);
    }
    
    return {
        opacity: Math.min(Math.max(opacity, 0), 1),
        transform: `translateX(-50%) translateY(${Math.max(0, translateY)}px)`,
        pointerEvents: opacity > 0.1 ? 'auto' : 'none'
    };
});

const goBack = () => {
    emit('back');
};


</script>

<template>
    <div class="about-view-layer">
        
        <!-- Back Button -->
        <button class="back-btn" @click="goBack">
            <span class="arrow">←</span> VOLTAR
        </button>

        <!-- Animation Stage -->
        <div class="stage">
            
            <!-- Central Image (Fixed Background Anchor) -->
            <div class="image-wrapper">
                <img 
                    src="/models/facelucca.png" 
                    alt="Lucca Face" 
                    class="center-face"
                    :style="imageStyle"
                />
            </div>

            <!-- Floating Text Group -->
            <div class="text-group" :style="textGroupStyle">
                <h1 class="main-title">LUCCA NUNES</h1>
                <h2 class="subtitle">FOTOGRAFIA AUTOMOTIVA</h2>
                
                <!-- Mission Statement (Portuguese) -->
                <p class="mission-text">
                    CAPTURANDO A ESSÊNCIA DA VELOCIDADE E DO DESIGN ATRAVÉS DAS LENTES.<br>
                    CADA CARRO TEM UMA ALMA, E MINHA MISSÃO É REVELÁ-LA.
                </p>

                <!-- Instagram Handle at the end -->
                <div class="instagram-box">
                    <span class="handle">@LUCCAPTURE</span>
                </div>
            </div>

            <!-- Instagram Preview Card (Appears at end) -->
            <!-- Instagram Preview Card (Appears at end) -->
            <div class="insta-preview-card" :style="instaCardStyle">
                <div class="insta-header">
                    <span class="insta-brand">INSTAGRAM</span>
                    <div class="dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="insta-body">
                    <div class="insta-pic-wrapper">
                        <img src="/models/instaprofile.jpg" class="insta-pic" />
                    </div>
                    <div class="insta-info">
                        <span class="insta-name">LUCCA NUNES</span>
                        <span class="insta-handle">@luccapture</span>
                        <span class="insta-bio">Fotografia Automotiva</span>
                    </div>
                </div>
                <div class="insta-footer">
                     <a href="https://www.instagram.com/luccapture" target="_blank" class="follow-btn">FOLLOW</a>
                </div>
            </div>

            <!-- License Section -->
            <div class="license-section" :style="licenseStyle">
                <h3>IMAGE LICENSE – ALL RIGHTS RESERVED</h3>
                <p>
                    All photographs contained in this repository are protected by copyright law and are the exclusive property of Lucca Nunes de Souza.
                </p>
                <div class="license-divider"></div>
                <p>
                    No image may be copied, reproduced, modified, distributed, published, transmitted, transmitted, sold, licensed, or reused in any form, whether commercial or non-commercial, without prior written permission from the author.
                </p>
                <ul class="license-list">
                    <li>Websites, social media, or portfolios</li>
                    <li>Commercial use or resale</li>
                    <li>Derivative works</li>
                    <li>AI training or dataset usage</li>
                </ul>
                <p class="license-footer">
                    Viewing the images is permitted solely for portfolio evaluation purposes.<br>
                    <strong>Any unauthorized use may result in legal action.</strong>
                </p>
            </div>

        </div>

        <!-- Scroll Track (Invisible Scroller) -->
        <div class="scroll-track" ref="scrollContainer" @scroll="handleScroll">
            <div class="scroll-spacer"></div>
        </div>
        
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.about-view-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #000000;
    z-index: 50;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
}

.back-btn {
    position: absolute;
    top: 3rem; left: 3rem;
    background: none;
    border: none;
    color: #ffffffff;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.1em;
    opacity: 0.8;
    transition: opacity 0.3s;
    text-transform: uppercase;
}
.back-btn:hover {
    opacity: 1;
}

.stage {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    overflow: hidden;
    /* Removed flex centering here as children use absolute centering */
}

.image-wrapper {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center-face {
    position: absolute;
    top: 50%; left: 50%;
    max-height: 70vh;
    max-width: 80vw;
    object-fit: contain;
}

/* TEXT STYLES */
.text-group {
    position: absolute;
    top: 50%; left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 10;
    width: 100%;
    will-change: transform;
}

.main-title {
    font-size: 5vw; /* Responsive huge sizing */
    font-weight: 900;
    color: #ff0000;
    margin: 0;
    line-height: 0.9;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-shadow: 0 0 30px rgba(255, 0, 0, 0.2);
}

.subtitle {
    font-size: 1.5vw;
    font-weight: 700;
    color: #ff0000;
    margin: 1rem 0 3rem 0; /* Space before instagram */
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.9;
}

.mission-text {
    font-size: 1.2vw;
    font-weight: 700;
    color: #ff0000;
    max-width: 60%;
    margin: 2rem 0;
    line-height: 1.6;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.9;
}

.instagram-box {
    margin-top: 5rem;
    padding-top: 2rem;
    border-top: 2px solid #ff0000;
}

.handle {
    font-size: 2.5vw;
    font-weight: 900;
    color: #ff0000;
    display: block;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

/* INSTAGRAM PREVIEW CARD */
.insta-preview-card {
    position: absolute;
    top: 50%; left: 50%;
    width: 300px;
    height: 400px;
    background: rgba(10, 10, 10, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
    z-index: 70; /* Above scroll track */
    text-decoration: none;
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.1);
    transform-origin: center center;
    transition: border-color 0.3s, transform 0.3s;
}

.insta-preview-card:hover {
    border-color: rgba(255, 255, 255, 0.8);
    transform: translate(-50%, -50%) scale(1.02) !important; /* Override inline style briefly on hover if needed, or refine interaction */
}

.insta-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 10px;
}

.insta-brand {
    color: #fff;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
}

.dots span {
    display: inline-block;
    width: 4px; height: 4px;
    background: #555;
    border-radius: 50%;
    margin-left: 3px;
}

.insta-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.insta-pic-wrapper {
    width: 80px; height: 80px;
    border-radius: 50%;
    padding: 3px;
    border: 2px solid #dfdfdfff; 
    overflow: hidden;
}

.insta-pic {
    width: 100%; height: 100%;
    object-fit: cover;
    border-radius: 50%;
    filter: grayscale(100%);
}

.insta-info {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.insta-name {
    color: #fff;
    font-weight: 700;
    font-size: 1.1rem;
}

.insta-handle {
    color: #b8b8b8ff;
    font-size: 0.9rem;
    font-weight: 600;
}

.insta-bio {
    color: #888;
    font-size: 0.8rem;
    margin-top: 5px;
}

.insta-footer {
    margin-top: auto;
}

.follow-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background: #042bd4ff;
    border: none;
    color: #ffffffff;
    font-weight: 800;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    transition: background 0.3s;
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
}

.follow-btn:hover {
    background: #000000ff;
}

/* SCROLL TRACK */
.scroll-track {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    overflow-y: scroll;
    z-index: 60;
    scrollbar-width: none;
}
.scroll-track::-webkit-scrollbar {
    display: none;
}

.scroll-spacer {
    height: 400vh; /* Determines scroll length */
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .center-face {
        max-height: 50vh;
    }
    .main-title {
        font-size: 3rem;
    }
    .subtitle {
        font-size: 0.8rem;
    }
    .mission-text {
        font-size: 0.8rem;
        max-width: 80%;
    }
    .handle {
        font-size: 1.5rem;
    }
    .back-btn {
        top: 1.5rem; left: 1.5rem;
    }
    .insta-preview-card {
        width: 260px;
        height: 350px;
    }
}

/* LICENSE SECTION */
.license-section {
    position: absolute;
    top: 72%; /* Moved up from 80% */
    left: 50%;
    /* transform managed by JS (includes translateX(-50%)) */
    width: 90%;
    max-width: 600px;
    text-align: center;
    color: #666;
    z-index: 70;
    padding-bottom: 4rem;
    font-size: 0.6rem;
    line-height: 1.5;
    letter-spacing: 0.05em;
    pointer-events: none; /* JS enables it */
    mix-blend-mode: screen;
}

.license-section h3 {
    color: #aa2222; /* Slight red tint */
    margin-bottom: 1rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.2em;
}

.license-section p {
    margin-bottom: 0.8rem;
    color: #888;
}

.license-divider {
    width: 40px; height: 1px; background: #333; margin: 1rem auto;
}

.license-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.license-list li {
    background: rgba(255,255,255,0.05);
    padding: 4px 8px;
    border-radius: 4px;
    color: #aaa;
    font-size: 0.55rem;
}

.license-footer {
    border-top: 1px solid #222;
    padding-top: 1rem;
    margin-top: 1rem;
}
</style>
