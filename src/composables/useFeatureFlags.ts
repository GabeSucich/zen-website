const REFERRALS_STORAGE_KEY = 'ff_referrals'

/**
 * Referral sign-up (/refer + nav link) is hidden unless VITE_REFERRALS_ENABLED=true,
 * or this browser opted in by visiting any page with `?referrals=on` (`?referrals=off` opts out).
 */
function computeReferralsEnabled(): boolean {
  if (import.meta.env.VITE_REFERRALS_ENABLED === 'true') return true

  const override = new URLSearchParams(window.location.search).get('referrals')
  try {
    if (override === 'on') localStorage.setItem(REFERRALS_STORAGE_KEY, 'true')
    if (override === 'off') localStorage.removeItem(REFERRALS_STORAGE_KEY)
    return localStorage.getItem(REFERRALS_STORAGE_KEY) === 'true'
  } catch {
    return override === 'on'
  }
}

export const referralsEnabled = computeReferralsEnabled()
