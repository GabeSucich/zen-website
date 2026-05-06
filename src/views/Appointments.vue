<template>
  <ParallaxSection :src="mountainsBg">
    <section class="appointments">
      <!-- Step 1: Patient type -->
      <div v-if="!patientType" class="initial-selection">
        <button class="selection-card" @click="selectPatientType('new')">
          I am a new patient
        </button>
        <button class="selection-card" @click="selectPatientType('existing')">
          I am a returning patient
        </button>
      </div>

      <div v-else class="flow">

        <!-- Info row (always visible) -->
        <div class="info-row">
          <div class="info-left">
            <h2 class="info-title">{{ patientType === 'new' ? 'New Patients' : 'Existing Patients' }}</h2>
            <a class="switch-link" @click="selectPatientType(patientType === 'new' ? 'existing' : 'new')">
              {{ patientType === 'new' ? "I'm an existing patient" : "I'm a new patient" }}
            </a>
          </div>

          <div class="info-divider" />

          <div class="info-right">
            <p v-if="patientType === 'new'" class="info-desc">
              Book a free 45 minute consultation with Dr. Bex, or an appointment for any other available service.
            </p>
            <Accordion v-else>
              <AccordionPanel value="prices">
                <AccordionHeader>Consultation prices</AccordionHeader>
                <AccordionContent>
                  <p>For patients not enrolled in the Zen Membership program, consults are $100 for 30 minutes and $150 for 45 minutes. For more information on membership structure and consult pricing, see <router-link to="/services" class="accordion-link">Services & Pricing</router-link>.</p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>
        </div>

        <!-- Widget view -->
        <div v-if="calendlyUrl" class="widget-view">
          <a class="modify-link" @click="appointmentType = null">← Modify my booking</a>

          <div v-if="patientType === 'new'" class="new-patient-banner">
            <p>
              <b>New patients, please read:</b> Prior to your consultation, you'll receive an email
              from Charm EHR with a link to register. To get the most out of your time with Dr. Bex,
              please complete this registration before your meeting time!
            </p>
          </div>

          <div class="widget-wrapper">
            <div ref="widgetRef" class="form-container" :class="{ visible: widgetReady }" />
          </div>
        </div>

        <!-- Questions UI -->
        <template v-else>
          <!-- Step 2: Modality -->
          <div class="step">
            <p class="step-question">Would you like to book a remote or in-person appointment?</p>
            <div class="step-options">
              <button class="option-btn" :class="{ active: modality === 'remote' }" @click="selectModality('remote')">
                Remote
              </button>
              <button class="option-btn" :class="{ active: modality === 'in-person' }" @click="selectModality('in-person')">
                In-Person
              </button>
            </div>
          </div>

          <!-- Step 3: Location (in-person only) -->
          <div v-if="modality === 'in-person'" class="step">
            <p class="step-question">At which location would you like to book?</p>
            <div class="step-options">
              <button
                v-for="loc in LOCATIONS"
                :key="loc.value"
                class="option-btn"
                :class="{ active: location === loc.value }"
                @click="selectLocation(loc.value)"
              >
                {{ loc.label }}
              </button>
            </div>
          </div>

          <!-- Step 4: Appointment type -->
          <div v-if="showAppointmentStep" class="step">
            <p class="step-question">What type of appointment are you interested in?</p>
            <div class="step-options">
              <button
                v-for="appt in availableAppointmentTypes"
                :key="appt.value"
                class="option-btn"
                :class="{ active: appointmentType === appt.value }"
                @click="selectAppointmentType(appt.value)"
              >
                {{ appt.label }}
              </button>
            </div>
          </div>
        </template>

      </div>
    </section>
    <Footer />
  </ParallaxSection>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import ParallaxSection from '@/components/ParallaxSection.vue'
import Footer from '@/components/Footer.vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import mountainsBg from '@/assets/mountains.jpg'

type PatientType = 'new' | 'existing'
type Modality = 'remote' | 'in-person'
type Location = 'chicago' | 'evergreen' | 'centennial'
type AppointmentType = 'free-consultation' | 'follow-up' | 'pellet' | 'botox' | 'iv-therapy'

const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'evergreen', label: 'Evergreen' },
  { value: 'centennial', label: 'Centennial' },
  { value: 'chicago', label: 'Chicago' },
]

const APPOINTMENT_LABELS: Record<AppointmentType, string> = {
  'free-consultation': 'Free Initial Consultation',
  'follow-up': 'Follow-Up Consultation',
  'pellet': 'Pellet Insertion',
  'botox': 'Botox / Filler',
  'iv-therapy': 'IV Therapy',
}

const AVAILABLE_APPOINTMENTS: Record<string, AppointmentType[]> = {
  'new-remote':     ['free-consultation'],
  'new-chicago':    ['free-consultation', 'botox'],
  'new-evergreen':  ['free-consultation', 'iv-therapy', 'botox', 'pellet'],
  'new-centennial': ['free-consultation'],
  'existing-remote':     ['follow-up'],
  'existing-chicago':    ['follow-up', 'botox', 'pellet'],
  'existing-evergreen':  ['follow-up', 'iv-therapy', 'botox', 'pellet'],
  'existing-centennial': ['follow-up', 'pellet'],
}

const CALENDLY_URLS: Record<string, string> = {
  'new-remote-free-consultation':      'https://calendly.com/drbex-zenforcewellness/free-consultation-video-call',
  'new-chicago-free-consultation':     'https://calendly.com/drbex-zenforcewellness/free-consultation-in-person-chicago',
  'new-chicago-botox':                 'https://calendly.com/drbex-zenforcewellness/botox-filler-chicago',
  'new-evergreen-free-consultation':   'https://calendly.com/drbex-zenforcewellness/free-consultation-in-person-colorado',
  'new-evergreen-iv-therapy':          'https://calendly.com/drbex-zenforcewellness/iv-therapy-evergreen',
  'new-evergreen-botox':               'https://calendly.com/drbex-zenforcewellness/botox-filler-evergreen',
  'new-evergreen-pellet':              'https://calendly.com/drbex-zenforcewellness/pellet-insertion-evergreen',
  'new-centennial-free-consultation':  'https://calendly.com/drbex-zenforcewellness/free-initial-consultation-in-person-centennial',
  'existing-remote-follow-up':         'https://calendly.com/drbex-zenforcewellness/follow-up-video-phone-call',
  'existing-chicago-follow-up':        'https://calendly.com/drbex-zenforcewellness/follow-up-consultation-in-person-chicago',
  'existing-chicago-botox':            'https://calendly.com/drbex-zenforcewellness/botox-filler-chicago',
  'existing-chicago-pellet':           'https://calendly.com/drbex-zenforcewellness/pellet-insertion-chicago',
  'existing-evergreen-follow-up':      'https://calendly.com/drbex-zenforcewellness/follow-up-consultation-in-person-evergreen',
  'existing-evergreen-iv-therapy':     'https://calendly.com/drbex-zenforcewellness/iv-therapy-evergreen',
  'existing-evergreen-botox':          'https://calendly.com/drbex-zenforcewellness/botox-filler-evergreen',
  'existing-evergreen-pellet':         'https://calendly.com/drbex-zenforcewellness/pellet-insertion-evergreen',
  'existing-centennial-follow-up':     'https://calendly.com/drbex-zenforcewellness/follow-up-consultation-in-person-centennial',
  'existing-centennial-pellet':        'https://calendly.com/drbex-zenforcewellness/pellet-insertion-centennial',
}

const patientType = ref<PatientType | null>(null)
const modality = ref<Modality | null>(null)
const location = ref<Location | null>(null)
const appointmentType = ref<AppointmentType | null>(null)
const widgetRef = ref<HTMLElement | null>(null)
const widgetReady = ref(false)
let currentObserver: MutationObserver | null = null

const contextKey = computed<string | null>(() => {
  if (!patientType.value || !modality.value) return null
  if (modality.value === 'in-person' && !location.value) return null
  const loc = modality.value === 'remote' ? 'remote' : location.value
  return `${patientType.value}-${loc}`
})

const showAppointmentStep = computed(() => contextKey.value !== null)

const availableAppointmentTypes = computed(() =>
  (contextKey.value ? AVAILABLE_APPOINTMENTS[contextKey.value] ?? [] : []).map((v) => ({
    value: v,
    label: APPOINTMENT_LABELS[v],
  }))
)

const calendlyUrl = computed<string | null>(() => {
  if (!contextKey.value || !appointmentType.value) return null
  return CALENDLY_URLS[`${contextKey.value}-${appointmentType.value}`] ?? null
})

function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Calendly) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

function clearWidget() {
  currentObserver?.disconnect()
  currentObserver = null
  if (widgetRef.value) widgetRef.value.innerHTML = ''
  widgetReady.value = false
}

async function initWidget(url: string) {
  await loadCalendlyScript()
  await nextTick()
  if (!widgetRef.value) return

  clearWidget()

  currentObserver = new MutationObserver(() => {
    const iframe = widgetRef.value?.querySelector('iframe')
    if (iframe) {
      currentObserver?.disconnect()
      currentObserver = null
      iframe.addEventListener('load', () => { widgetReady.value = true })
    }
  })
  currentObserver.observe(widgetRef.value, { childList: true, subtree: true })

  ;(window as any).Calendly.initInlineWidget({ url, parentElement: widgetRef.value })
}

watch(calendlyUrl, (url) => {
  if (url) initWidget(url)
  else clearWidget()
})

function selectPatientType(type: PatientType) {
  patientType.value = type
  modality.value = null
  location.value = null
  appointmentType.value = null
}

function selectModality(m: Modality) {
  modality.value = m
  location.value = null
  appointmentType.value = null
}

function selectLocation(loc: Location) {
  location.value = loc
  appointmentType.value = null
}

function selectAppointmentType(appt: AppointmentType) {
  appointmentType.value = appt
}

onUnmounted(() => { currentObserver?.disconnect() })
</script>

<style scoped>
.appointments {
  padding: 24px 32px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  min-height: 100vh;
}

/* Step 1: initial patient-type selection */
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

/* Flow (steps 2–4 + widget) */
.flow {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Widget view */
.widget-view {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 0.25rem;
}

/* Modify booking link */
.modify-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.modify-link:hover {
  opacity: 1;
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

/* Individual step */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.step-question {
  margin: 0.5rem 0 0;
  font-size: 1.15rem;
  color: #fff;
}

.step-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.option-btn {
  padding: 0.75rem 1.75rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: #fff;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.65);
}

.option-btn.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
}

.accordion-link {
  color: #fff;
  text-decoration: underline;
}

.accordion-link:hover {
  opacity: 0.8;
}

/* New patient banner */
.new-patient-banner {
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border-left: 3px solid #c9a84c;
  border-radius: 4px;
}

.new-patient-banner p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

/* Widget */
.widget-wrapper {
  position: relative;
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
