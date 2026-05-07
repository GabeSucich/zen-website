import type { SiteConfig } from '@/types/siteConfig'

const ZEN_CONFIG: SiteConfig = {
  isSoulspace: false,
  siteName: 'Zen Aesthetics and Wellness',
  membershipName: 'Zen Membership',
  email: 'drbex@zenforcewellness.com',
}

const SOULSPACE_CONFIG: SiteConfig = {
  isSoulspace: true,
  siteName: 'Soul Space Chicago',
  membershipName: 'Soul Space Membership',
  email: 'drbex@soulspacechicago.com',
}

export function useSiteConfig(): SiteConfig {
  const params = new URLSearchParams(window.location.search)
  const override = params.get('is_soulspace')
  const isSoulspace = override !== null
    ? override.toLowerCase() === 'true'
    : window.location.hostname.includes('soulspace')
  return isSoulspace ? SOULSPACE_CONFIG : ZEN_CONFIG
}
