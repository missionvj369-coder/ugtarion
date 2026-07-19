import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/browser';

// Sentry configuration
// Get your DSN from https://sentry.io
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || 'https://c15fd9275d186c763a27fb4501726159@o4511760514220032.ingest.de.sentry.io/4511760539058256';
const SENTRY_ENVIRONMENT = import.meta.env.MODE || 'development';

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Set VITE_SENTRY_DSN in your environment.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [
      new BrowserTracing({
        // Track performance for React components
        tracePropagationTargets: ['localhost', /^\//],
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions in production
    
    // Error sampling
    sampleRate: 1.0,
    
    // Enable debug mode in development
    debug: import.meta.env.DEV,
    
    // Replay settings for better debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Ignore common errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
    
    // Deny URLs from error reporting
    denyUrls: [
      /extensions\/chrome/i,
      /extensions\/firefox/i,
      /localhost/,
    ],
  });

  console.log('Sentry initialized successfully');
}

// Error boundary with Sentry integration
export const SentryErrorBoundary = Sentry.withErrorBoundary(Sentry.withProfiler);

// Helper to capture custom errors
export function captureError(error: Error, context?: Record<string, any>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error:', error, context);
  }
}

// Helper to capture messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level}] ${message}`);
  }
}

// Performance monitoring helpers
export function startTransaction(name: string, op: string = 'custom') {
  return Sentry.startTransaction({ name, op });
}

// Set user context for error tracking
export function setUserContext(user: { id?: string; email?: string; username?: string } | null) {
  Sentry.setUser(user);
}

// Add breadcrumb for debugging
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    data,
    timestamp: Date.now(),
  });
}

// Initialize Sentry on module load
initSentry();

export default Sentry;