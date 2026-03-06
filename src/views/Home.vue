<template>
  <ParallaxSection :src="mountainsBg">
    <section class="hero">
      <div class="hero-text">
        <h1>A proactive approach to wellness</h1>
        <p>
          Experience a holistic approach to health that blends cutting-edge
          science with personalized care.
        </p>
        <p>
          Whether you're chasing peak performance, deeper vitality, or simply
          feeling like yourself again — your journey starts here.
        </p>
      </div>
      <div class="hero-divider" />
      <div
        class="hero-testimonials"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <p class="testimonials-eyebrow">Patient Stories</p>
        <div class="testimonial-tabs">
          <button
            v-for="(t, i) in testimonials"
            :key="t.author"
            class="testimonial-tab"
            :class="{ active: activeIndex === i }"
            @click="goTo(i)"
          >
            {{ t.author }}
          </button>
        </div>
        <div class="testimonial-stage">
          <Transition name="slide" mode="out-in">
            <div class="testimonial-card" :key="activeIndex">
              <p class="quote-text">{{ testimonials[activeIndex]!.text }}</p>
              <span class="quote-signature">— {{ testimonials[activeIndex]!.author }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <section class="approach">
      <div class="approach-carousel">
        <WellnessCarousel />
      </div>
      <div class="approach-text">
        <h2>Your Body, Your Blueprint</h2>
        <p>
          No two people are the same — and neither are their paths to feeling their best.
          With the explosion of progress in regenerative medicine, peptide therapies, and
          precision diagnostics, it's never been easier to listen to what your body is
          telling you and take meaningful action.
        </p>
        <p>
          Browse just a few of the ways that Zen can help you become
          the best version of yourself.
        </p>
      </div>
    </section>

    <section class="about">
      <div class="about-text">
        <h2>About Dr. Bex</h2>
        <p>
          Dr. Bex earned her MD from the University of Pennsylvania and has spent 20 years
          practicing emergency medicine — work that gave her a deep respect for modern
          medicine, and a clear view of where it falls short.
        </p>
        <p>
          What she noticed over time was that many patients were experiencing illness that
          could have been prevented with simple lifestyle changes. With further credentialing
          and research, this became a passion.
        </p>
        <p>
          She found a new sense of fulfillment in caring for clients where allopathic medicine falls
          short — listening and working with each individual with the purpose of prevention,
          not treatment.
        </p>
      </div>
      <div class="about-image">
        <img :src="officeBg" alt="Zen Aesthetics and Wellness office" />
      </div>
    </section>

    <Footer />
  </ParallaxSection>

  <router-link to="/appointments" class="fab">
    <span class="fab-text">Start Your Journey</span>
    <svg class="fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  </router-link>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ParallaxSection from '@/components/ParallaxSection.vue'
import WellnessCarousel from '@/components/WellnessCarousel.vue'
import Footer from '@/components/Footer.vue'
import mountainsBg from '@/assets/mountains.jpg'
import officeBg from '@/assets/office.png'

const testimonials = [
  {
    text: "I'm really enjoying working with Dr. Bex on my women's health issues. The hormone replacement therapy has helped me so much! The biggest benefit I've noticed is that I have way more energy than I've ever had — and at 60, it feels great. She is always available and I never feel alone in this journey.",
    author: 'Kelly V.',
  },
  {
    text: "I've been going to Dr. Bex for over 10 years. Her expertise, consistency, and attention to detail are unmatched. Every visit feels thoughtful and personalized, and the results are always natural and exactly what I'm looking for. After a decade, I can confidently say I'm a lifelong client and recommend her without hesitation.",
    author: 'Lyndsie K.',
  },
  {
    text: "Being a man in my late 50s, I started to feel like there was nothing I could do to fight against my biological clock. That all changed with Dr. Bex. We've been working together on diet, supplements, and HRT — and the labs don't lie. I'm feeling stronger and more vigorous than I have in 20 years.",
    author: 'John M.',
  },
]

const activeIndex = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval>

function goTo(i: number) {
  activeIndex.value = i
}

onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value) {
      activeIndex.value = (activeIndex.value + 1) % testimonials.length
    }
  }, 10000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.hero {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  padding: 32px 48px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
}

.hero-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-text h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.4px;
}

.hero-text p {
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.85;
}

.hero-divider {
  width: 1px;
  align-self: stretch;
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

/* Testimonials in hero */
.hero-testimonials {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  margin-top: 36px;
}

.testimonials-eyebrow {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c9a84c;
  margin-bottom: 14px;
}

.testimonial-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.testimonial-tab {
  flex: 1;
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  padding: 14px 16px;
  cursor: pointer;
  transition: color 0.25s ease, border-color 0.25s ease;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.testimonial-tab:focus {
  outline: none;
}

.testimonial-tab:hover {
  color: rgba(255, 255, 255, 0.7);
}

.testimonial-tab.active {
  color: #fff;
  border-bottom-color: rgba(255, 255, 255, 0.6);
}

.testimonial-stage {
  padding: 28px 0 0;
  overflow: hidden;
  min-height: 320px;
}

.testimonial-card {
  padding: 0;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.quote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
  line-height: 1.75;
  margin: 0;
}

.quote-signature {
  display: block;
  text-align: right;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-style: italic;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 16px;
}


.approach {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  padding: 32px 48px;
  background: var(--p-surface-50);
}

.approach-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.approach-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: var(--p-primary-color);
}

.approach-text p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--p-text-muted-color);
}

.approach-carousel {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.about {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  padding: 32px 48px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
}

.about-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
}

.about-text p {
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.85;
}

.about-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-self: center;
  min-width: 0;
}

.about-image img {
  width: 100%;
  max-width: 480px;
  border-radius: 6px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 32px 16px;
    gap: 32px;
  }

  .hero-divider {
    display: none;
  }

  .approach {
    flex-direction: column-reverse;
    align-items: center;
    padding: 32px 16px;
    gap: 32px;
  }

  .about {
    flex-direction: column;
    padding: 32px 16px;
    gap: 32px;
  }
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 34px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--p-primary-color);
  background: #c9a84c;
  border: none;
  border-radius: 32px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: background 0.25s, color 0.25s, box-shadow 0.25s;
  z-index: 10;
}

.fab:hover {
  background: #b8963e;
  color: var(--p-primary-color);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.3);
}

.fab-icon {
  display: none;
  width: 26px;
  height: 26px;
}

@media (max-width: 768px) {
  .fab {
    padding: 16px;
  }

  .fab-text {
    display: none;
  }

  .fab-icon {
    display: block;
  }
}
</style>
