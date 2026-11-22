# Zen Aesthetics and Wellness website

Marketing site for Zen Aesthetics and Wellness and Soul Space Chicago (Vue 3 + TypeScript + Vite +
PrimeVue), hosted on Netlify. The variant is chosen by hostname (`soulspace` in the host = Soul Space);
`?is_soulspace=true|false` overrides it for testing.

```sh
npm install
npm run dev     # local dev server
npm run build   # type-check (vue-tsc) + production build into dist/
```

## Environment variables

All are read at **build time** by Vite, so changing one on Netlify needs a new deploy. See
`.env.example`; for local development put values in `.env.local` (git-ignored).

| Variable | Default | Purpose |
|---|---|---|
| `VITE_ZEN_ADMIN_API_URL` | unset | zen_admin backend for `?ref=` referral validation and the Refer a Friend sign-up. Also read at runtime by the `link-preview` edge function. |
| `VITE_PATIENT_PORTAL_ENABLED` | `false` | `true` switches booking from the embedded Calendly flow to links into the patient portal. Any value other than the exact string `true` means off. |
| `VITE_PATIENT_PORTAL_URL` | `https://app.zenforcewellness.com` | Patient portal origin (staging: `https://app-staging.zenforcewellness.com`). |

### Patient portal flag

With `VITE_PATIENT_PORTAL_ENABLED=true` (both Zen and Soul Space):

- The header shows **Book a visit** (`<portal>/book`) and **Sign in** (`<portal>/login`) instead of
  **Appointments**; the home page "Start Your Journey" button goes to `<portal>/book`.
- `/appointments` no longer loads Calendly; it explains portal booking and links to `/book`,
  `/signup` and `/login`.
- If a `?ref=` referral code was captured, portal links carry it as `?ref=<code>`.

With the flag off the site is unchanged (Calendly booking).

**Preview override:** add `?patient_portal=1` to any URL to turn the portal flow on just for that
browser tab (or `?patient_portal=0` to force it off). It is remembered in sessionStorage until the tab
is closed. This is not a security boundary: anyone can use it, it only changes which links are shown.
