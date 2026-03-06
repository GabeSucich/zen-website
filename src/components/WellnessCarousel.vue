<template>
  <div class="wc">
    <div class="wc-row">
      <button class="wc-btn" aria-label="Previous" @click="prev">
        <svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        class="wc-stage"
        @mouseenter="stopTimer"
        @mouseleave="startTimer"
      >
        <div
          v-for="(slot, i) in slots"
          :key="i"
          class="wc-slot"
          :class="{ flipped: slot.flipped }"
          :style="slot.style"
          @mouseenter="slot.flipped = true"
          @mouseleave="slot.flipped = false"
        >
          <div class="wc-shell">
            <div class="wc-flipper">
              <div class="wc-face wc-front">
                <div class="wc-icon" v-html="slot.data!.icon" />
                <div class="wc-rule" />
                <h3 class="wc-card-title">{{ slot.data!.title }}</h3>
                <span class="wc-hint">Read More</span>
              </div>
              <div class="wc-face wc-back">
                <h4 class="wc-back-title">{{ slot.data!.title }}</h4>
                <div class="wc-back-rule" />
                <p class="wc-back-desc">{{ slot.data!.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="wc-btn" aria-label="Next" @click="next">
        <svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <div class="wc-footer">
      <div class="wc-dots">
        <div
          v-for="(_, i) in cards"
          :key="i"
          class="wc-dot"
          :class="{ on: i === current }"
          @click="goTo(i, i > current ? 'next' : 'prev')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface Card {
  title: string
  icon: string
  desc: string
}

const cards: Card[] = [
  {
    title: 'Body Composition',
    icon: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>',
    desc: 'The number one predictor of dementia is loss of muscle mass. Increasing muscle mass improves not only your aesthetic and metabolism, but your health span and quality of life. Through tailored nutritional and lifestyle coaching, along with a personalized regimen of peptides and supplements, we help you build and maintain the body you need to thrive.',
  },
  {
    title: 'Improve Longevity',
    icon: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    desc: "True longevity isn't just about living longer — it's about feeling vital at every age. Advanced peptide therapies, hormone replacement therapy, supplements, and maximizing nutrition slow the biological clock and protect the systems that matter most.",
  },
  {
    title: 'Heal Your Gut',
    icon: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    desc: 'Your gut is the foundation of nearly every system in your body — from immunity, to mental health, to metabolic and cardiovascular health. Comprehensive assessments and customized supplementation protocols restore balance, reduce inflammation, and get you feeling like yourself again.',
  },
  {
    title: 'Improve Sexual Health',
    icon: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    desc: 'Hormonal imbalances, stress, aging, and poor gut and metabolic health can erode your confidence and comfort with intimacy — from vaginal dryness and erectile dysfunction to diminished sex drive. Hormone replacement and peptide therapies restore function and vitality, so you show up fully in every area of your life.',
  },
  {
    title: 'Boost Immunity',
    icon: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    desc: "A resilient immune system doesn't happen by accident — it's built through consistent, proactive care. Targeted supplementation and evidence-backed wellness protocols give your body the micronutrients it needs to defend, recover, and thrive.",
  },
  {
    title: 'Maximize Athleticism',
    icon: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11M6.5 17.5h11M12 2v20M4 10l2 2-2 2M20 10l-2 2 2 2"/></svg>',
    desc: 'Combine precision hormone optimization, peptide therapy, personalized supplementation, and evidence-based coaching to build the body you were meant to have. Whether your goal is peak athletic performance or a leaner, stronger physique, protocols tailored to your biology — not a generic plan — make all the difference.',
  },
]

const DELAY = 5000
const TIMING = 'transform .55s cubic-bezier(.65,0,.35,1)'

const current = ref(0)
let animating = false
let activeSlot = 0
let ticker: ReturnType<typeof setInterval> | null = null

const slots = reactive([
  { data: cards[0], flipped: false, style: { transition: 'none', transform: 'translateX(0)', zIndex: '1' } },
  { data: cards[0], flipped: false, style: { transition: 'none', transform: 'translateX(100%)', zIndex: '0' } },
])

function goTo(next: number, dir: 'next' | 'prev') {
  if (animating || next === current.value) return
  animating = true

  const outIdx = activeSlot
  const inIdx = 1 - activeSlot
  const inX = dir === 'next' ? '100%' : '-100%'
  const outX = dir === 'next' ? '-100%' : '100%'

  // Fill incoming slot
  slots[inIdx]!.data = cards[next]
  slots[inIdx]!.flipped = false
  slots[inIdx]!.style = { transition: 'none', transform: `translateX(${inX})`, zIndex: '1' }
  slots[outIdx]!.style.zIndex = '0'

  // Force reflow then animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      slots[outIdx]!.style = { transition: TIMING, transform: `translateX(${outX})`, zIndex: '0' }
      slots[inIdx]!.style = { transition: TIMING, transform: 'translateX(0)', zIndex: '1' }

      setTimeout(() => {
        current.value = next
        activeSlot = inIdx
        animating = false
      }, 560)
    })
  })
}

function next() {
  if (!animating) goTo((current.value + 1) % cards.length, 'next')
}

function prev() {
  if (!animating) goTo((current.value - 1 + cards.length) % cards.length, 'prev')
}

function startTimer() {
  stopTimer()
  ticker = setInterval(() => next(), DELAY)
}

function stopTimer() {
  if (ticker) {
    clearInterval(ticker)
    ticker = null
  }
}

onMounted(() => startTimer())
onUnmounted(() => stopTimer())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');

.wc {
  --gold: #c9a84c;
  --gold-light: #a07828;
  --text: #f0ede8;
  --muted: rgba(255, 255, 255, 0.5);
  --border: rgba(255, 255, 255, 0.15);
  --card-bg: #0D1E2B;
  --card-back: #142836;
  --W: 300px;
  --H: 400px;

  position: relative;
  width: 100%;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  font-family: 'Montserrat', sans-serif;
}

.wc * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Row */
.wc-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Arrow buttons */
.wc-btn {
  flex-shrink: 0;
  width: 28px;
  height: 46px;
  border-radius: 4px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.25s;
}

.wc-btn:hover {
  opacity: 0.6;
}

.wc-btn svg {
  width: 16px;
  height: 16px;
  pointer-events: none;
  display: block;
  stroke: #0D1E2B;
  fill: none;
}

/* Stage */
.wc-stage {
  position: relative;
  width: var(--W);
  height: var(--H);
  overflow: hidden;
}

/* Slot */
.wc-slot {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--W);
  height: var(--H);
}

/* Shell */
.wc-shell {
  width: 100%;
  height: 100%;
  perspective: 1100px;
  perspective-origin: 50% 50%;
  overflow: hidden;
}

/* Flipper */
.wc-flipper {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.wc-slot.flipped .wc-flipper {
  transform: rotateY(180deg);
}

/* Faces */
.wc-face {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  border: 1px solid var(--border);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 32px;
  gap: 22px;
}

/* Front */
.wc-front {
  background: var(--card-bg);
}

.wc-front::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, transparent 55%);
  pointer-events: none;
}

/* Icon circle */
.wc-icon {
  width: 52px;
  height: 52px;
  border: 1px solid rgba(201, 168, 76, 0.28);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wc-icon :deep(svg) {
  width: 22px;
  height: 22px;
  display: block;
  stroke: var(--gold);
  fill: none;
}

/* Divider */
.wc-rule {
  width: 36px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  flex-shrink: 0;
}

/* Card title */
.wc-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  text-align: center;
  line-height: 1.4;
  letter-spacing: 0.4px;
}

/* Hint */
.wc-hint {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted);
}

/* Back */
.wc-back {
  background: var(--card-back);
  transform: rotateY(180deg);
}

.wc-back::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.07) 0%, transparent 55%);
  pointer-events: none;
}

.wc-back-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--gold);
  text-align: center;
  letter-spacing: 0.4px;
}

.wc-back-rule {
  width: 28px;
  height: 1px;
  background: #c9a84c;
  opacity: 0.6;
  flex-shrink: 0;
  display: block;
}

.wc-back-desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  letter-spacing: 0.2px;
}

/* Dots */
.wc-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.wc-dots {
  display: flex;
  gap: 7px;
  align-items: center;
}

.wc-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(13, 30, 43, 0.25);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  display: block;
}

.wc-dot.on {
  background: #0D1E2B;
  transform: scale(1.4);
}
</style>
