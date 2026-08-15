import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    logger.error('Uncaught React Rendering Error in ErrorBoundary', error, {
      componentStack: errorInfo.componentStack,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    this.props.onReset?.()
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isDev = import.meta.env.DEV

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[50vh] flex items-center justify-center p-6 bg-background text-foreground"
        >
          <div className="w-full max-w-lg rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 shadow-xl text-center space-y-5 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <AlertTriangle className="h-8 w-8" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Terjadi Kendala Sistem
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mohon maaf, terjadi kesalahan saat memuat tampilan ini. Anda dapat mencoba memuat ulang halaman atau kembali ke beranda portal SMART JABAR.
              </p>
            </div>

            {/* Technical details — DEV mode only */}
            {isDev && this.state.error && (
              <div className="text-left rounded-lg bg-slate-900 text-slate-200 p-3.5 text-xs font-mono overflow-auto max-h-40 border border-slate-800">
                <p className="text-red-400 font-semibold mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-slate-400 whitespace-pre-wrap text-[11px]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={this.handleReload}
                className="w-full sm:w-auto gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Muat Ulang
              </Button>
              <Button
                variant="default"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
