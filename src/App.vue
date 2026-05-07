<template>
  <Header />
  <router-view />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import Header from './components/Header.vue'
import { useSiteConfig } from './composables/useSiteConfig'
import { siteConfigKey } from './types/siteConfig'

const siteConfig = useSiteConfig()
provide(siteConfigKey, siteConfig)
document.title = siteConfig.siteName
</script>
