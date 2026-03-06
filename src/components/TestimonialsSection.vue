<template>
  <section class="testimonials-section">
    <div class="testimonials-inner">

      <p class="testimonials-eyebrow">Patient Stories</p>
      <Divider />
      <h2 class="testimonials-title">Heard from those<br>who've been here</h2>

      <div class="testimonials-grid">

        <div class="testimonial-card">
          <span class="quote-mark">"</span>
          <p class="quote-text">I'm really enjoying working with Dr. Bex on my women's health issues. The hormone replacement therapy has helped me so much! The biggest benefit I've noticed is that I have way more energy than I've ever had — and at 60, it feels great. She is always available and I never feel alone in this journey.</p>
          <div class="quote-divider" />
          <span class="quote-author">Kelly V.</span>
        </div>

        <div class="testimonial-card">
          <span class="quote-mark">"</span>
          <p class="quote-text">I've been going to Dr. Bex for over 10 years. Her expertise, consistency, and attention to detail are unmatched. Every visit feels thoughtful and personalized, and the results are always natural and exactly what I'm looking for. After a decade, I can confidently say I'm a lifelong client and recommend her without hesitation.</p>
          <div class="quote-divider" />
          <span class="quote-author">Lyndsie K.</span>
        </div>

        <div class="testimonial-card">
          <span class="quote-mark">"</span>
          <p class="quote-text">Being a man in my late 50s, I started to feel like there was nothing I could do to fight against my biological clock. That all changed with Dr. Bex. We've been working together on diet, supplements, and HRT — and the labs don't lie. I'm feeling stronger and more vigorous than I have in 20 years.</p>
          <div class="quote-divider" />
          <span class="quote-author">John M.</span>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider'
</script>

<style scoped>
.testimonials-section {
  background: var(--p-surface-50);
  padding: 48px 24px 100px;
  font-family: 'DM Sans', sans-serif;
  color: var(--p-primary-color);
}

.testimonials-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.testimonials-eyebrow {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--p-primary-color);
  margin-bottom: 14px;
}

.testimonials-section :deep(.p-divider) {
  width: 30%;
  margin: 8px 0;
}

.testimonials-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.2vw, 2.24rem);
  font-weight: 300;
  line-height: 1.2;
  color: var(--p-primary-color);
  margin-bottom: 56px;
}

/* Staggered grid */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}

.testimonial-card:nth-child(2) {
  margin-top: 48px;
}

.testimonial-card:nth-child(3) {
  margin-top: 24px;
}

/* Card */
.testimonial-card {
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 4px;
  padding: 36px 32px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: default;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(13, 30, 43, 0.1);
  border-color: var(--p-surface-300);
}

/* Quote mark */
.quote-mark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 5rem;
  line-height: 0.6;
  color: var(--p-primary-color);
  opacity: 0.25;
  margin-bottom: 16px;
  display: block;
}

/* Quote text */
.quote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--p-surface-600);
  line-height: 1.75;
  margin-bottom: 28px;
}

/* Divider */
.quote-divider {
  width: 32px;
  height: 1px;
  background: var(--p-primary-color);
  opacity: 0.3;
  margin-bottom: 20px;
  transition: width 0.3s ease;
}

.testimonial-card:hover .quote-divider {
  width: 56px;
  opacity: 0.6;
}

/* Attribution */
.quote-author {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--p-primary-color);
}

@media (max-width: 720px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-card:nth-child(2),
  .testimonial-card:nth-child(3) {
    margin-top: 0;
  }
}
</style>
