<script setup>
</script>

<template>
    <section id="about" class="about-section">
        <div class="content-container">
            <div class="text-content">
                <h2 class="section-title">Sobre <span class="highlight">Mim</span></h2>
                <div class="bio">
                    <p>
                        Olá, me chamo <strong>Lucca Nunes</strong>. Sou um fotógrafo apaixonado pelo mundo automotivo, 
                        buscando sempre capturar a essência e a velocidade em cada clique.
                    </p>
                    <p>
                        Com um olhar atento aos detalhes e uma paixão por carros que vem de berço, 
                        transformo máquinas em obras de arte através da minha lente.
                    </p>
                </div>
                <div class="stats">
                    <div class="stat-item">
                        <span class="number">5+</span>
                        <span class="label">Anos de Experiência</span>
                    </div>
                    <div class="stat-item">
                        <span class="number">100+</span>
                        <span class="label">Projetos Realizados</span>
                    </div>
                </div>
            </div>
            
            <div class="image-content">
                <!-- Placeholder for profile image -->
                <div class="profile-frame">
                    <div class="placeholder-img"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.about-section {
    width: 100%;
    min-height: 100vh;
    background-color: #00000006;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    position: relative;
}

.content-container {
    max-width: 1200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 2rem;
    line-height: 1.1;
    text-transform: uppercase;
}

.highlight {
    color: transparent;
    -webkit-text-stroke: 1px #fff;
}

.bio p {
    font-family: 'Outfit', sans-serif;
    font-size: 1.1rem;
    font-weight: 300;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
}

.bio strong {
    color: #fff;
    font-weight: 600;
}

.stats {
    display: flex;
    gap: 3rem;
    margin-top: 3rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
}

.number {
    font-family: 'Outfit', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    color: #fff;
}

.label {
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.profile-frame {
    width: 100%;
    aspect-ratio: 3/4;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    position: relative;
}

.profile-frame::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    width: 100px;
    height: 100px;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
}

.profile-frame::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: -10px;
    width: 100px;
    height: 100px;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
}

.placeholder-img {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    background-image: linear-gradient(45deg, #1a1a1a 25%, #222 25%, #222 50%, #1a1a1a 50%, #1a1a1a 75%, #222 75%, #222 100%);
    background-size: 40px 40px;
}

@media (max-width: 768px) {
    .content-container {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .section-title {
        font-size: 3rem;
    }
    
    .profile-frame {
        width: 80%;
        margin: 0 auto;
    }
}
</style>
