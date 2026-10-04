const API_URL: string | undefined = import.meta.env.VITE_ZEN_ADMIN_API_URL
const STORAGE_KEY = 'refCode'

export class ReferralSignupError extends Error {
  status: number

  constructor(status: number) {
    super(`Referral signup failed (${status})`)
    this.status = status
  }
}

function readStoredCode(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeCode(code: string | null) {
  try {
    if (code) sessionStorage.setItem(STORAGE_KEY, code)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage blocked (private mode etc.) -- the referral just won't be tracked
  }
}

/**
 * Capture `?ref=<code>` from the landing URL so it survives navigation through the booking steps.
 * Unknown or deactivated codes are dropped silently; booking works the same either way.
 */
export function captureReferralCode() {
  const code = new URLSearchParams(window.location.search).get('ref')?.trim()
  if (!code || !API_URL) return

  storeCode(code)
  fetch(`${API_URL}/public/referrers/validate?code=${encodeURIComponent(code)}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((body: { valid: boolean } | null) => {
      if (body && !body.valid && readStoredCode() === code) storeCode(null)
    })
    .catch(() => {
      // Backend unreachable: keep the code, the webhook ignores invalid ones anyway
    })
}

export function getReferralCode(): string | null {
  return readStoredCode()
}

export async function createReferralLink(data: {
  first_name: string
  last_name: string
  email: string
  website: string
}): Promise<string> {
  if (!API_URL) throw new ReferralSignupError(0)
  const res = await fetch(`${API_URL}/public/referrers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new ReferralSignupError(res.status)
  const body: { link: string } = await res.json()
  return body.link
}
