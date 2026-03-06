<template>
  <ParallaxSection :src="mountainsBg">
    <PricingSection />
    <Footer />
  </ParallaxSection>
</template>

<script setup lang="ts">
import ParallaxSection from '@/components/ParallaxSection.vue'
import PricingSection from '@/components/PricingSection.vue'
import Footer from '@/components/Footer.vue'
import mountainsBg from '@/assets/mountains.jpg'
</script>
