<template>
  <ParallaxSection :src="mountainsBg">
    <section class="refer">
      <div class="refer-card">
        <h1 class="refer-title">Refer a Friend</h1>

        <template v-if="!link">
          <p class="refer-desc">
            Know someone who would love {{ siteConfig.siteName }}? Enter your details to get your
            personal referral link.
          </p>

          <ul class="perks">
            <li>
              <i class="pi pi-heart" />
              <span><strong>Anyone you refer gets 20% off</strong> their first purchase with Dr. Bex.</span>
            </li>
            <li>
              <i class="pi pi-gift" />
              <span><strong>You get 20% off your next purchase</strong> for every referral who becomes a client.</span>
            </li>
          </ul>

          <form class="refer-form" novalidate @submit.prevent="submit">
            <div class="field-row">
              <label class="field">
                <span>Your first name</span>
                <input v-model="firstName" type="text" autocomplete="given-name" required maxlength="100" />
              </label>
              <label class="field">
                <span>Your last name</span>
                <input v-model="lastName" type="text" autocomplete="family-name" required maxlength="100" />
              </label>
            </div>
            <label class="field">
              <span>Your email</span>
              <input v-model="email" type="email" autocomplete="email" inputmode="email" required maxlength="254" />
            </label>

            <!-- Honeypot: hidden from people, bots fill it in -->
            <label class="honeypot" aria-hidden="true">
              Website
              <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" />
            </label>

            <p v-if="error" class="form-error" role="alert">{{ error }}</p>

            <button type="submit" class="primary-btn" :disabled="submitting">
              {{ submitting ? 'Creating your link…' : 'Get my referral link' }}
            </button>
          </form>
        </template>

        <template v-else>
          <p class="refer-desc">
            Thanks, {{ firstName.trim() }}! Here's your personal link. Share it with friends: you'll
            get 20% off your next purchase for every referral who becomes a client.
          </p>

          <div class="link-box">
            <input ref="linkInput" :value="link" readonly aria-label="Your referral link" @focus="selectLink" />
          </div>

          <div class="link-actions">
            <button v-if="canShare" type="button" class="primary-btn" @click="share">
              <i class="pi pi-share-alt" /> Share
            </button>
            <button type="button" :class="canShare ? 'secondary-btn' : 'primary-btn'" @click="copy">
              <i :class="copied ? 'pi pi-check' : 'pi pi-copy'" /> {{ copied ? 'Copied!' : 'Copy link' }}
            </button>
          </div>
        </template>
      </div>
    </section>
    <Footer />
  </ParallaxSection>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import ParallaxSection from '@/components/ParallaxSection.vue'
import Footer from '@/components/Footer.vue'
import mountainsBg from '@/assets/mountains.jpg'
import { siteConfigKey, type SiteConfig } from '@/types/siteConfig'
import { createReferralLink, ReferralSignupError } from '@/composables/useReferral'

const siteConfig: SiteConfig = inject(siteConfigKey)!

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const website = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const link = ref<string | null>(null)
const copied = ref(false)
const linkInput = ref<HTMLInputElement | null>(null)
const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

async function submit() {
  error.value = null
  if (!firstName.value.trim() || !lastName.value.trim()) {
    error.value = 'Please enter your first and last name.'
    return
  }
  if (!EMAIL_PATTERN.test(email.value.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }

  submitting.value = true
  try {
    link.value = await createReferralLink({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      website: website.value,
    })
    window.scrollTo({ top: 0 })
  } catch (e) {
    error.value = e instanceof ReferralSignupError && e.status === 429
      ? 'Too many attempts. Please wait a minute and try again.'
      : `Something went wrong creating your link. Please try again, or email us at ${siteConfig.email}.`
  } finally {
    submitting.value = false
  }
}

function selectLink() {
  linkInput.value?.select()
}

async function copy() {
  if (!link.value) return
  try {
    await navigator.clipboard.writeText(link.value)
  } catch {
    selectLink()
    document.execCommand('copy')
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function share() {
  if (!link.value) return
  try {
    await navigator.share({
      title: siteConfig.siteName,
      text: `I think you'd love ${siteConfig.siteName}. Book your first appointment here:`,
      url: link.value,
    })
  } catch {
    // Share sheet dismissed
  }
}
</script>

<style scoped>
.refer {
  padding: 48px 32px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.refer-card {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.refer-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
}

.refer-desc {
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.85;
  margin: 0;
}

.perks {
  list-style: none;
  margin: 0;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border-left: 3px solid #c9a84c;
  border-radius: 4px;
}

.perks li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.perks i {
  color: #c9a84c;
  flex-shrink: 0;
}

.refer-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-row {
  display: flex;
  gap: 1rem;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  opacity: 0.95;
}

.field input,
.link-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 0.9rem;
  font-family: inherit;
  font-size: 1rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus,
.link-box input:focus {
  border-color: #fff;
}

.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.form-error {
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.08);
  border-left: 3px solid #c9a84c;
  border-radius: 4px;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  color: var(--p-primary-color);
  background: var(--p-surface-50);
  border: 1.5px solid var(--p-surface-50);
}

.primary-btn:hover:not(:disabled) {
  background: #fff;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.secondary-btn {
  color: #fff;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.65);
}

.link-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.link-actions button {
  flex: 1;
}

@media (max-width: 768px) {
  .refer {
    padding: 32px 16px;
  }

  .field-row {
    flex-direction: column;
  }
}
</style>
