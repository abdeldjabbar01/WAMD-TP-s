const domain = (import.meta.env.VITE_AUTH0_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || ''

export const auth0Enabled = Boolean(domain && clientId && audience)

function base64UrlEncode(bytes) {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value)
  return crypto.subtle.digest('SHA-256', bytes)
}

export async function startAuth0Login() {
  if (!auth0Enabled) throw new Error('Auth0 is not configured. Add the VITE_AUTH0_* variables to the frontend .env file.')

  const random = new Uint8Array(48)
  crypto.getRandomValues(random)
  const verifier = base64UrlEncode(random)
  const challenge = base64UrlEncode(new Uint8Array(await sha256(verifier)))
  const stateBytes = new Uint8Array(24)
  crypto.getRandomValues(stateBytes)
  const state = base64UrlEncode(stateBytes)
  const redirectUri = window.location.origin

  sessionStorage.setItem('parfumi_auth0_transaction', JSON.stringify({ verifier, state, redirectUri }))

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    audience,
    connection: 'google-oauth2',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  window.location.assign(`https://${domain}/authorize?${params.toString()}`)
}

async function completeAuth0LoginOnce() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (params.get('error')) {
    const message = params.get('error_description') || params.get('error')
    window.history.replaceState({}, document.title, window.location.pathname)
    sessionStorage.removeItem('parfumi_auth0_transaction')
    throw new Error(message)
  }
  if (!code) return null

  const saved = sessionStorage.getItem('parfumi_auth0_transaction')
  sessionStorage.removeItem('parfumi_auth0_transaction')
  if (!saved) throw new Error('Auth0 login session was not found. Please try again.')
  const transaction = JSON.parse(saved)
  if (!transaction.state || params.get('state') !== transaction.state) {
    window.history.replaceState({}, document.title, window.location.pathname)
    throw new Error('Auth0 state validation failed. Please try again.')
  }
  // Remove the short-lived authorization code from the address bar before exchanging it.
  window.history.replaceState({}, document.title, window.location.pathname)

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: transaction.redirectUri,
      code_verifier: transaction.verifier,
    }),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error_description || result.error || 'Auth0 token exchange failed')
  if (!result.access_token) throw new Error('Auth0 did not return an API access token.')

  let profile = { name: 'Auth0 user', email: '', picture: '' }
  if (result.id_token) {
    try {
      const payload = result.id_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const decoded = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')))
      profile = { name: decoded.name || decoded.nickname || 'Google user', email: decoded.email || '', picture: decoded.picture || '' }
    } catch { /* Profile display is optional; the API access token is what matters. */ }
  }

  let role = 'customer'
  try {
    const payload = result.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')))
    const roles = claims['https://parfumi-store/roles'] || claims.roles || []
    if (Array.isArray(roles) && roles.includes('admin')) role = 'admin'
  } catch { /* Role is enforced by the API; default UI role is customer. */ }
  return { token: result.access_token, user: profile, provider: 'auth0', role }
}

export function logoutFromAuth0() {
  if (!auth0Enabled) return
  const returnTo = encodeURIComponent(window.location.origin)
  window.location.assign(`https://${domain}/v2/logout?client_id=${encodeURIComponent(clientId)}&returnTo=${returnTo}`)
}

let auth0CallbackPromise
export function completeAuth0Login() {
  // React StrictMode may run mount effects twice in development; share one PKCE exchange.
  if (!auth0CallbackPromise) auth0CallbackPromise = completeAuth0LoginOnce()
  return auth0CallbackPromise
}
