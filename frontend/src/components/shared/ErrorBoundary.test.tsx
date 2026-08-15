import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

// Component that throws error for testing
function ProblemChild({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Simulated Rendering Crash')
  }
  return <div>Konten Berhasil Dimuat</div>
}

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error in test output for intentional errors
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children correctly when there are no errors', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Konten Berhasil Dimuat')).toBeInTheDocument()
  })

  it('catches render errors and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Terjadi Kendala Sistem')).toBeInTheDocument()
    expect(screen.getByText(/Mohon maaf, terjadi kesalahan saat memuat tampilan ini/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Muat Ulang/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Kembali ke Beranda/i })).toBeInTheDocument()
  })

  it('renders custom fallback if provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error View</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.getByText('Custom Error View')).toBeInTheDocument()
  })
})
