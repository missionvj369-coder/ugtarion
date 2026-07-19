import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showStackTrace?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // Example: Send to error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
    };

    // In production, uncomment this:
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport),
    // }).catch(() => {});

    if (import.meta.env.DEV) {
      console.log('Error report:', errorReport);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  handleReportIssue = (): void => {
    const { error, errorId } = this.state;
    const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Unknown error'}`);
    const body = encodeURIComponent(
      `Error ID: ${errorId}\n\n` +
      `URL: ${window.location.href}\n` +
      `Error: ${error?.message || 'Unknown error'}\n` +
      `Stack: ${error?.stack || 'No stack trace'}\n\n` +
      `Steps to reproduce:\n1. \n2. \n3. `
    );
    window.open(`mailto:support@ugtglobal.space?subject=${subject}&body=${body}`);
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, errorId } = this.state;
    const { children, fallback, showStackTrace = import.meta.env.DEV } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            {/* Error Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>

              {/* Description */}
              <p className="text-zinc-400 mb-6">
                We encountered an unexpected error. This has been logged and we'll look into it.
              </p>

              {/* Error ID */}
              <div className="bg-zinc-950 rounded-lg p-3 mb-6">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Error Reference</p>
                <p className="text-sm font-mono text-zinc-300">{errorId}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              {/* Report Issue */}
              <button
                onClick={this.handleReportIssue}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <Mail className="w-4 h-4" />
                Report this issue
              </button>
            </div>

            {/* Stack Trace (Development Only) */}
            {showStackTrace && error && (
              <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left">
                <h2 className="text-sm font-semibold text-zinc-300 mb-3">Error Details</h2>
                <pre className="text-xs text-red-400 overflow-x-auto whitespace-pre-wrap font-mono">
                  {error.toString()}
                  {'\n\n'}
                  {errorInfo?.componentStack}
                </pre>
              </div>
            )}

            {/* Technical Support Info */}
            <p className="mt-6 text-center text-xs text-zinc-600">
              If this problem persists, please contact support at support@ugtglobal.space
            </p>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

// ============================================
// Async Error Handler Hook
// ============================================

export function withAsyncErrorHandler<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorMessage = 'An error occurred'
) {
  return function WithAsyncErrorHandler(props: P) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// ============================================
// Retry Logic with Exponential Backoff
// ============================================

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  onRetry: () => {},
  shouldRetry: () => true,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === opts.maxRetries) {
        break;
      }

      if (!opts.shouldRetry(lastError)) {
        throw lastError;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        opts.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        opts.maxDelay
      );

      opts.onRetry(attempt + 1, lastError);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// ============================================
// Circuit Breaker Pattern
// ============================================

type CircuitState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  monitorInterval?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly monitorInterval: number;
  private monitorTimer: NodeJS.Timeout | null = null;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeout = options.resetTimeout ?? 60000; // 1 minute
    this.monitorInterval = options.monitorInterval ?? 10000; // 10 seconds
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.successCount++;

    if (this.state === 'half-open') {
      if (this.successCount >= 2) {
        this.state = 'closed';
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'half-open' || this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  getState(): CircuitState {
    return this.state;
  }

  isOpen(): boolean {
    return this.state === 'open';
  }

  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
  }

  startMonitoring(onStateChange: (state: CircuitState) => void): void {
    this.monitorTimer = setInterval(() => {
      if (this.state === 'open' && this.shouldAttemptReset()) {
        this.state = 'half-open';
        onStateChange(this.state);
      }
    }, this.monitorInterval);
  }

  stopMonitoring(): void {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
      this.monitorTimer = null;
    }
  }
}

// ============================================
// Global Error Handler Setup
// ============================================

export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // You could send this to an error tracking service
    // event.preventDefault(); // Prevent default logging
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    
    // You could send this to an error tracking service
    // event.preventDefault(); // Prevent default logging
  });
}