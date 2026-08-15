/**
 * SMART JABAR — Application Configuration Module
 * 
 * Provides type-safe and validated access to runtime environment variables.
 */

export interface AppConfig {
  env: 'development' | 'staging' | 'production' | 'test'
  isProduction: boolean
  isDevelopment: boolean
  apiBaseUrl: string
  ssoLoginUrl: string
  enableMockAuth: boolean
}

const envMode = (import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development') as AppConfig['env']
const isProd = import.meta.env.PROD || envMode === 'production'

export const config: AppConfig = {
  env: envMode,
  isProduction: isProd,
  isDevelopment: !isProd,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || (isProd ? 'https://smart.jabarprov.go.id/api' : 'http://localhost:8000/api'),
  ssoLoginUrl: import.meta.env.VITE_SSO_LOGIN_URL || 'https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/auth',
  // Always force disable mock switcher in production builds, even if env var was erroneously set
  enableMockAuth: !isProd && import.meta.env.VITE_ENABLE_MOCK_AUTH !== 'false',
}
