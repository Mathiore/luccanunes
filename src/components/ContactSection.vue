<script setup>
</script>

<template>
    <section id="contact" class="contact-section">
        <div class="content-container">
            <h2 class="section-title">Entre em <span class="highlight">Contato</span></h2>
            <p class="subtitle">Acompanhe meu trabalho no Instagram</p>
            
            <div class="social-links">
                <a href="https://www.instagram.com/luccanunes_/" target="_blank" class="instagram-link">
                    @luccanunes_
                </a>
            </div>
        </div>
    </section>
</template>

<style scoped>
.contact-section {
    width: 100%;
    min-height: 50vh; /* Reduced height since content is less */
    background-color: #00000006;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4rem 2rem;
}

.content-container {
    max-width: 600px;
    width: 100%;
    text-align: center;
}

.section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.1;
    text-transform: uppercase;
}

.highlight {
    color: transparent;
    -webkit-text-stroke: 1px #fff;
}

.subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 3rem;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.social-links {
    display: flex;
    justify-content: center;
}

.instagram-link {
    font-family: 'Outfit', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    position: relative;
    padding: 1rem 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    text-transform: lowercase;
}

.instagram-link:hover {
    background: #fff;
    color: #000;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .section-title {
        font-size: 2.5rem;
    }
    
    .instagram-link {
        font-size: 1.5rem;
    }
}
</style>
