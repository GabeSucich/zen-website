import { getReferralCode } from '@/composables/useReferral'

const DEFAULT_PORTAL_URL = 'https://app.zenforcewellness.com'
const OVERRIDE_PARAM = 'patient_portal'
const OVERRIDE_STORAGE_KEY = 'patientPortalOverride'

export type PortalPath = '/book' | '/login' | '/signup'

/** Only the exact string 'true' turns the build-time flag on; missing or anything else is off. */
function envEnabled(): boolean {
  return import.meta.env.VITE_PATIENT_PORTAL_ENABLED === 'true'
}

function parseOverride(value: string | null): boolean | null {
  if (value === null) return null
  const v = value.trim().toLowerCase()
  if (v === '1' || v === 'true') return true
  if (v === '0' || v === 'false') return false
  return null
}

/**
 * `?patient_portal=1` / `?patient_portal=0` overrides the build flag for this browser tab, so the
 * portal flow can be previewed on production before it is switched on for everyone. The choice is
 * kept in sessionStorage so it survives navigation and reloads; closing the tab clears it.
 */
function readOverride(): boolean | null {
  const fromUrl = parseOverride(new URLSearchParams(window.location.search).get(OVERRIDE_PARAM))
  try {
    if (fromUrl !== null) {
      sessionStorage.setItem(OVERRIDE_STORAGE_KEY, fromUrl ? '1' : '0')
      return fromUrl
    }
    return parseOverride(sessionStorage.getItem(OVERRIDE_STORAGE_KEY))
  } catch {
    return fromUrl
  }
}

function portalBaseUrl(): string {
  const raw = import.meta.env.VITE_PATIENT_PORTAL_URL?.trim()
  if (raw) {
    try {
      const url = new URL(raw)
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.href.replace(/\/+$/, '')
    } catch {
      // Malformed value: fall back to the production portal
    }
  }
  return DEFAULT_PORTAL_URL
}

// Decided once when the app loads, like the site variant in useSiteConfig
const enabled = readOverride() ?? envEnabled()
const baseUrl = portalBaseUrl()

/** Portal link for `path`, carrying the captured marketing referral code (if any) as `?ref=`. */
export function portalUrl(path: PortalPath): string {
  const url = new URL(baseUrl + path)
  const ref = getReferralCode()
  if (ref) url.searchParams.set('ref', ref)
  return url.href
}

export function usePatientPortal() {
  return { enabled, portalUrl }
}
