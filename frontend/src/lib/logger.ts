/**
 * SMART JABAR — Centralized Application Logger
 * 
 * Manages client-side logging, filtering debug logs in production,
 * and providing a single integration point for remote error tracking services
 * (e.g., Sentry, LogRocket, OpenTelemetry).
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface ErrorReportPayload {
  message: string
  stack?: string
  context?: Record<string, unknown>
  timestamp: string
  url: string
  userAgent: string
}

class Logger {
  private isProduction = import.meta.env.PROD

  private log(level: LogLevel, message: string, ...args: unknown[]) {
    // Suppress debug and info logs in production to prevent console clutter and data exposure
    if (this.isProduction && (level === 'debug' || level === 'info')) {
      return
    }

    const timestamp = new Date().toISOString()
    const prefix = `[SMART-JABAR] [${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args)
        break
      case 'info':
        console.info(prefix, message, ...args)
        break
      case 'warn':
        console.warn(prefix, message, ...args)
        break
      case 'error':
        console.error(prefix, message, ...args)
        break
    }
  }

  debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args)
  }

  info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args)
  }

  warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args)
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    this.log('error', message, error, context)

    // Remote error tracking integration hook
    if (this.isProduction) {
      this.sendErrorReport({
        message: error instanceof Error ? error.message : String(message),
        stack: error instanceof Error ? error.stack : undefined,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
    }
  }

  /**
   * Hook for remote logging / APM (Sentry, LogRocket, backend error logging API)
   */
  private sendErrorReport(payload: ErrorReportPayload) {
    // When Sentry or external APM is installed, forward here:
    // Sentry.captureException(payload)
    if (typeof window !== 'undefined' && (window as unknown as { __SMARTJABAR_ERROR_HANDLER__?: (p: ErrorReportPayload) => void }).__SMARTJABAR_ERROR_HANDLER__) {
      try {
        (window as unknown as { __SMARTJABAR_ERROR_HANDLER__: (p: ErrorReportPayload) => void }).__SMARTJABAR_ERROR_HANDLER__(payload)
      } catch {
        // Silently catch logging failures
      }
    }
  }
}

export const logger = new Logger()
