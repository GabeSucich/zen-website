<template>
  <ParallaxSection :src="mountainsBg">
    <section class="appointments">
      <!-- Initial selection -->
      <div v-show="!selected" class="initial-selection">
        <button class="selection-card" @click="select('new')">
          I am a new patient
        </button>
        <button class="selection-card" @click="select('existing')">
          I am a returning patient
        </button>
      </div>

      <!-- Selected view -->
      <div v-if="selected" class="selected-view">
        <div class="info-row">
          <div class="info-left">
            <h2 class="info-title">{{ selected === 'new' ? 'New Patients' : 'Existing Patients' }}</h2>
            <a class="switch-link" @click="select(selected === 'new' ? 'existing' : 'new')">
              {{ selected === 'new' ? "I'm an existing patient" : "I'm a new patient" }}
            </a>
          </div>

          <div class="info-divider" />

          <div class="info-right">
            <p v-if="selected === 'new'" class="info-desc">
              Book a free 45 minute consultation with Dr. Bex, or an appointment for any other available service.
            </p>

            <Accordion v-else>
              <AccordionPanel value="prices">
                <AccordionHeader>Consultation prices</AccordionHeader>
                <AccordionContent>
                  <p>For patients not enrolled in the Zen Membership program, consults are $80 for 30 minutes and $120 for 45 minutes. For more information on membership structure and consult pricing, see <router-link to="/services" class="accordion-link">Services & Pricing</router-link>.</p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>
        </div>
      </div>

      <!-- Calendly widgets — always in DOM for preloading -->
      <div v-show="selected" class="widget-wrapper">
        <div
          v-for="type in (['new', 'existing'] as const)"
          :key="type"
          :ref="(el) => (widgetRefs[type] = el as HTMLElement)"
          class="form-container"
          :class="{ visible: selected === type && ready[type] }"
        />
      </div>
    </section>
  </ParallaxSection>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import ParallaxSection from '@/components/ParallaxSection.vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import mountainsBg from '@/assets/mountains.jpg'

const URLS: Record<string, string> = {
  new: 'https://calendly.com/d/cydc-x9r-v8j?primary_color=0D1E2B',
  existing: 'https://calendly.com/d/cxpk-zy7-bg8?primary_color=0D1E2B',
}

type PatientType = 'new' | 'existing'

const selected = ref<PatientType | null>(null)
const ready = reactive({ new: false, existing: false })
const widgetRefs: Record<string, HTMLElement | null> = { new: null, existing: null }
const observers: MutationObserver[] = []

function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Calendly) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

function initWidget(type: PatientType) {
  const el = widgetRefs[type]
  if (!el) return

  const observer = new MutationObserver(() => {
    const iframe = el.querySelector('iframe')
    if (iframe) {
      observer.disconnect()
      iframe.addEventListener('load', () => {
        ready[type] = true
      })
    }
  })
  observer.observe(el, { childList: true, subtree: true })
  observers.push(observer)

  ;(window as any).Calendly.initInlineWidget({
    url: URLS[type],
    parentElement: el,
  })
}

function select(type: PatientType) {
  selected.value = type
}

onMounted(async () => {
  await loadCalendlyScript()
  initWidget('new')
  initWidget('existing')
})

onUnmounted(() => {
  observers.forEach((o) => o.disconnect())
})
</script>

<style scoped>
.appointments {
  padding: 24px 32px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  min-height: 100vh;
}

/* Initial selection */
.initial-selection {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
}

.selection-card {
  padding: 2.5rem 3rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.selection-card:hover {
  background: var(--p-surface-50);
  color: var(--p-primary-color);
  border-color: var(--p-surface-50);
}

/* Info row */
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 8px 0;
  position: relative;
  z-index: 1;
}

.info-left {
  flex-shrink: 0;
}

.info-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.switch-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.85rem;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.switch-link:hover {
  opacity: 1;
}

.info-divider {
  width: 1px;
  align-self: stretch;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.info-right {
  flex: 1;
  min-width: 0;
  padding-top: 6px;
}

.info-desc {
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.85;
  margin: 0;
}

/* Accordion overrides for dark background */
.info-right :deep(.p-accordion) {
  width: 100%;
}

.info-right :deep(.p-accordionheader) {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.info-right :deep(.p-accordionheader:hover) {
  background: rgba(255, 255, 255, 0.05);
}

.info-right :deep(.p-accordioncontent-content) {
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.2);
}

.accordion-link {
  color: #fff;
  text-decoration: underline;
}

.accordion-link:hover {
  opacity: 0.8;
}

/* Widget */
.widget-wrapper {
  position: relative;
  margin-top: 0;
  min-height: 700px;
}

.form-container {
  position: absolute;
  inset: 0;
  visibility: hidden;
  display: flex;
  justify-content: center;
}

.form-container.visible {
  position: relative;
  visibility: visible;
}

.form-container :deep(.calendly-inline-widget) {
  width: 100%;
  max-width: 700px;
}

.form-container :deep(iframe) {
  min-width: 320px;
  width: 100%;
  height: 700px;
}

@media (max-width: 768px) {
  .appointments {
    padding: 24px 16px;
  }

  .initial-selection {
    flex-direction: column;
    gap: 1rem;
  }

  .info-row {
    flex-direction: column;
    gap: 1rem;
  }

  .info-divider {
    width: 100%;
    height: 1px;
  }

  .info-right {
    width: 100%;
  }

}
</style>
