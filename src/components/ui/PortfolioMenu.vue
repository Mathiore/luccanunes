<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['select-folder']);

const folders = [
  { id: 'albums', label: 'Álbum de Fotos' },
  { id: 'about', label: 'Sobre mim' },
  { id: 'contact', label: 'Contato' },
  { id: 'license', label: 'License' }
];

const selectFolder = (id) => {
  emit('select-folder', id);
};
</script>

<template>
  <div class="portfolio-menu">
    <div class="folders-container">
      <div 
        v-for="folder in folders" 
        :key="folder.id" 
        class="folder-item"
        @click="selectFolder(folder.id)"
      >
        <div class="folder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
          </svg>
        </div>
        <span class="folder-label">{{ folder.label }}</span>
      </div>
    </div>

    <div class="profile-container">
      <img src="/models/lucca.png" alt="Lucca" class="profile-image" />
    </div>
  </div>
</template>

<style scoped>
.portfolio-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40; /* Above overlay */
  display: flex;
  pointer-events: none; /* Let clicks pass to folders but not container if needed, but we need clicks on folders */
  padding: 2rem;
  box-sizing: border-box;
}

/* Allow pointer events for children */
.folders-container, .profile-container {
  pointer-events: auto;
}

/* Base Styles (Mobile Default) */
.portfolio-menu {
  flex-direction: column;
  justify-content: space-between;
}

.folders-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 15vh; /* Push down a bit */
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease, opacity 0.2s;
  opacity: 0.8;
}

.folder-item:hover {
  opacity: 1;
  transform: translateX(10px);
}

.folder-icon {
  width: 32px;
  height: 32px;
  color: #D4AF37; /* Gold accent */
}

.folder-label {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.profile-container {
  align-self: center;
  margin-bottom: 2rem;
}

.profile-image {
  max-width: 250px;
  height: auto;
  filter: grayscale(100%) invert(100%); /* Invert colors: Black->White */
  opacity: 0.9;
  object-fit: contain;
}

/* Desktop Styles */
@media (min-width: 768px) {
  .portfolio-menu {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 15vw;
  }

  .folders-container {
    margin-top: 0;
    gap: 2rem;
  }

  .folder-label {
    font-size: 1.5rem;
  }

  .folder-icon {
    width: 40px;
    height: 40px;
  }

  .profile-container {
    align-self: center;
    margin-bottom: 0;
  }
  
  .profile-image {
    max-width: 350px;
  }
}
</style>
