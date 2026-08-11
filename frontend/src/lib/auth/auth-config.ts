// SSO Configuration
// Sesuai CLAUDE.md bagian 8 & 10

export const SSO_CONFIG = {
  realm: 'ssojabar',
  authUrl: import.meta.env.VITE_SSO_LOGIN_URL || 'https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/auth',
  logoutUrl: 'https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/logout',
  clientId: import.meta.env.VITE_SSO_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_SSO_REDIRECT_URI || 'http://localhost:8000/api/auth/sso/callback',
} as const

/**
 * Membangun URL untuk redirect ke halaman login Keycloak SSO.
 * Sesuai alur di CLAUDE.md bagian 8, langkah 1.
 */
export function buildSSOLoginURL(): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SSO_CONFIG.clientId,
    redirect_uri: SSO_CONFIG.redirectUri,
  })
  return `${SSO_CONFIG.authUrl}?${params.toString()}`
}

/**
 * Membangun URL untuk single logout dari Keycloak SSO.
 * Buka URL ini untuk mengakhiri sesi SSO (berguna saat testing).
 */
export function buildSSOLogoutURL(redirectUri?: string): string {
  const params = new URLSearchParams()
  if (redirectUri) {
    params.set('redirect_uri', redirectUri)
  }
  return `${SSO_CONFIG.logoutUrl}?${params.toString()}`
}
