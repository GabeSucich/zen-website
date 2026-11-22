interface ImportMetaEnv {
  readonly VITE_ZEN_ADMIN_API_URL?: string
  /** 'true' links booking to the patient portal; anything else (or unset) keeps Calendly. */
  readonly VITE_PATIENT_PORTAL_ENABLED?: string
  /** Patient portal origin, default https://app.zenforcewellness.com */
  readonly VITE_PATIENT_PORTAL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
