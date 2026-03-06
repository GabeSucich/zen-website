<template>
  <section class="parallax-section">
    <div class="parallax-gutter">
      <img :src="src" alt="" class="parallax-img" :style="{ transform: `translateY(${offset}px)` }" />
    </div>
    <div ref="containerRef" class="container" @scroll="onScroll">
      <slot />
    </div>
    <div class="parallax-gutter">
      <img :src="src" alt="" class="parallax-img" :style="{ transform: `translateY(${offset}px)` }" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  speed?: number
}>(), {
  speed: 0.15,
})

const containerRef = ref<HTMLElement | null>(null)
const initialOffset = -200
const offset = ref(initialOffset)

function onScroll() {
  if (!containerRef.value) return
  offset.value = initialOffset - containerRef.value.scrollTop * props.speed
}
</script>

<style scoped>
.parallax-section {
  display: flex;
  height: calc(100vh - 57px);
  overflow: hidden;
}

.parallax-gutter {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.parallax-img {
  width: 100%;
  height: 200%;
  object-fit: cover;
  will-change: transform;
}

.container {
  width: 75%;
  flex-shrink: 0;
  overflow-y: auto;
  overscroll-behavior-y: none;
  background: var(--p-content-background, #ffffff);
}

@media (max-width: 1024px) {
  .container {
    width: 100%;
  }
}
</style>
