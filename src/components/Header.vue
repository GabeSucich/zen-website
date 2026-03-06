<template>
  <div class="header-wrapper">
    <Menubar>
      <template #start>
        <router-link to="/" class="brand">
          <img src="@/assets/logo.png" alt="Zen Aesthetics and Wellness" class="brand-logo" />
          <span class="brand-name">Zen Aesthetics and Wellness</span>
        </router-link>
      </template>
      <template #end>
        <button class="burger" aria-label="Menu" @click="mobileOpen = !mobileOpen">
          <i :class="mobileOpen ? 'pi pi-times' : 'pi pi-bars'" />
        </button>
        <nav class="nav-links" :class="{ open: mobileOpen }">
          <router-link to="/services" class="nav-link" @click="mobileOpen = false">Services &amp; Pricing</router-link>
          <router-link to="/appointments" class="nav-link" @click="mobileOpen = false">Appointments</router-link>
        </nav>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Menubar from 'primevue/menubar'

const mobileOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<style scoped>
.header-wrapper {
  background: var(--p-surface-50);
}

.header-wrapper :deep(.p-menubar) {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
}

.header-wrapper :deep(.p-menubar-end) {
  position: relative;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
}

.brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 1.35rem;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.burger {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: inherit;
  cursor: pointer;
  padding: 4px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.03em;
}

@media (max-width: 768px) {
  .burger {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--p-surface-50);
    padding: 1rem 1.5rem;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 8px 8px;
    z-index: 100;
  }

  .nav-links.open {
    display: flex;
  }
}
</style>
