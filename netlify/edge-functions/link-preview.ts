// Link previews (iMessage, Facebook, etc.) read the raw HTML and don't run the Vue app, so the
// per-site title and preview tags have to be in the HTML itself. This edge function injects them,
// using the referral invite card (and the referrer's name) when the link carries a ?ref= code.

declare const Netlify: { env: { get(name: string): string | undefined } } | undefined

const REFERRER_LOOKUP_TIMEOUT_MS = 1500

type Site = { key: string; name: string; description: string }

const ZEN: Site = {
  key: 'zen',
  name: 'Zen Aesthetics and Wellness',
  description: 'A proactive approach to wellness with Dr. Bex. Book your free consultation.',
}

const SOULSPACE: Site = {
  key: 'soulspace',
  name: 'Soul Space Chicago',
  description: 'A proactive approach to wellness with Dr. Bex. Book your free consultation.',
}

// Mirrors useSiteConfig: ?is_soulspace= overrides, otherwise decided by hostname
function siteFor(url: URL): Site {
  const override = url.searchParams.get('is_soulspace')
  const isSoulspace = override !== null
    ? override.toLowerCase() === 'true'
    : url.hostname.includes('soulspace')
  return isSoulspace ? SOULSPACE : ZEN
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** "First Last" for an active referral code, or null if invalid / the backend is unreachable. */
async function referrerName(code: string): Promise<string | null> {
  const apiUrl = typeof Netlify !== 'undefined' ? Netlify.env.get('VITE_ZEN_ADMIN_API_URL') : undefined
  if (!apiUrl) return null
  try {
    const res = await fetch(`${apiUrl}/public/referrers/validate?code=${encodeURIComponent(code)}`, {
      signal: AbortSignal.timeout(REFERRER_LOOKUP_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const body: { valid: boolean; referrer_first_name?: string | null; referrer_last_name?: string | null } = await res.json()
    if (!body.valid) return null
    return [body.referrer_first_name, body.referrer_last_name].filter(Boolean).join(' ') || null
  } catch {
    return null
  }
}

export function previewTags(url: URL, referrer: string | null = null): string {
  const site = siteFor(url)
  const isReferral = !!url.searchParams.get('ref')

  const title = isReferral
    ? referrer ? `${referrer} has invited you to ${site.name}` : `You're invited to ${site.name}`
    : site.name
  const description = isReferral
    ? `Use my link to book a free consultation and get 20% off your first purchase with ${site.name}.`
    : site.description

  const tags: [string, string, string][] = [
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', site.name],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url.href],
    ['name', 'description', description],
  ]
  if (isReferral) {
    const image = `${url.origin}/og/referral-${site.key}.png`
    tags.push(
      ['property', 'og:image', image],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['property', 'og:image:alt', `Book a free consultation and get 20% off your first purchase with ${site.name}. Book now.`],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:image', image],
    )
  }

  return [
    `<title>${escapeHtml(title)}</title>`,
    ...tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`),
  ].join('\n    ')
}

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const response = await context.next()
  if (!response.headers.get('content-type')?.includes('text/html')) return response

  const url = new URL(request.url)
  const code = url.searchParams.get('ref')
  const [html, referrer] = await Promise.all([response.text(), code ? referrerName(code) : null])
  const withTags = html.replace(/<title>[^<]*<\/title>/, previewTags(url, referrer))

  const headers = new Headers(response.headers)
  headers.delete('content-length')
  return new Response(withTags, { status: response.status, headers })
}

export const config = {
  path: '/*',
  excludedPath: ['/assets/*', '/og/*', '/favicon.png'],
}
