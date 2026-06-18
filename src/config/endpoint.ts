const STORAGE_KEY = 'quereek:endpoint'

export interface ServerEndpoint {
  /** The GraphQL HTTP endpoint, as entered by the user (may be relative). */
  http: string
  /** The matching WebSocket endpoint, derived from the HTTP one. */
  ws: string
}

/**
 * Resolve the configured GraphQL endpoint string, in priority order:
 * 1. `?api=<url>` query parameter (shareable links; empty value forces demo)
 * 2. `localStorage` (the user's saved choice; empty string forces demo)
 * 3. `VITE_GRAPHQL_URL` build-time default
 * 4. Same-origin `/graphql` in dev (Vite proxy); demo mode in production builds
 *
 * Returns `null` when no server is configured, meaning the app should run the
 * GraphQL schema in the browser (demo mode).
 */
export function getEndpointSetting(): string | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  if (params.has('api')) {
    const value = params.get('api')?.trim() ?? ''
    return value === '' ? null : value
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored !== null) return stored === '' ? null : stored

  const fallback = import.meta.env.VITE_GRAPHQL_URL?.trim()
  if (fallback) return fallback

  return import.meta.env.DEV ? '/graphql' : null
}

/** Persist an explicit endpoint, or `null` to force demo mode. */
export function setEndpointSetting(value: string | null): void {
  window.localStorage.setItem(
    STORAGE_KEY,
    value && value.trim() ? value.trim() : '',
  )
}

/** Forget the saved choice and fall back to the built-in default. */
export function clearEndpointSetting(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}

/** Resolve the active endpoint to concrete HTTP + WS URLs, or `null` for demo. */
export function resolveEndpoint(): ServerEndpoint | null {
  const raw = getEndpointSetting()
  if (!raw) return null

  const httpUrl = new URL(raw, window.location.origin)
  const wsUrl = new URL(httpUrl.toString())
  wsUrl.protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:'

  return { http: raw, ws: wsUrl.toString() }
}

/** True when no server is configured and the schema runs in the browser. */
export function isDemoMode(): boolean {
  return resolveEndpoint() === null
}
