import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './auth-context'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext & AuthProvider', () => {
  it('initializes with default mock admin user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).not.toBeNull()
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.user?.role).toBe('admin')
    expect(result.current.user?.nip).toBeDefined()
  })

  it('can toggle mock role between admin and asn', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAdmin).toBe(true)

    // Toggle to ASN
    act(() => {
      result.current.toggleMockRole()
    })

    expect(result.current.isAdmin).toBe(false)
    expect(result.current.user?.role).toBe('asn')

    // Toggle back to Admin
    act(() => {
      result.current.toggleMockRole()
    })

    expect(result.current.isAdmin).toBe(true)
    expect(result.current.user?.role).toBe('admin')
  })

  it('can perform logout and clear user state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isAdmin).toBe(false)
  })
})
