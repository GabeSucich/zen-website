import type { InjectionKey } from 'vue'

export interface SiteConfig {
  isSoulspace: boolean
  siteName: string
  membershipName: string
  email: string
  state: string
}

export const siteConfigKey = Symbol('siteConfig') as InjectionKey<SiteConfig>
