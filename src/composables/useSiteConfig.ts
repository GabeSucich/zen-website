import type { SiteConfig } from '@/types/siteConfig'

/** Consult pricing is currently identical across sites; spread in so one edit updates both. */
const CONSULT_PRICING = {
  consultPrice30: 125,
  consultPrice45: 190,
}

const ZEN_CONFIG: SiteConfig = {
  isSoulspace: false,
  siteName: 'Zen Aesthetics and Wellness',
  membershipName: 'Zen Membership',
  email: 'drbex@zenforcewellness.com',
  state: 'Colorado',
  ...CONSULT_PRICING,
}

const SOULSPACE_CONFIG: SiteConfig = {
  isSoulspace: true,
  siteName: 'Soul Space Chicago',
  membershipName: 'Soul Space Membership',
  email: 'drbex@soulspacechicago.com',
  state: 'Illinois',
  ...CONSULT_PRICING,
}

export function useSiteConfig(): SiteConfig {
  const params = new URLSearchParams(window.location.search)
  const override = params.get('is_soulspace')
  const isSoulspace = override !== null
    ? override.toLowerCase() === 'true'
    : window.location.hostname.includes('soulspace')
  return isSoulspace ? SOULSPACE_CONFIG : ZEN_CONFIG
}
