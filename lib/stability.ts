/**
 * Stability utilities: retry logic, circuit breaker, caching, and error handling
 */

// ============================================
// RETRY LOGIC
// ============================================

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: ((error: any) => boolean);
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: (error: any) => {
    // Retry on network errors and 5xx server errors
    if (error.name === 'AbortError' || error.name === 'TypeError') return true;
    if (error.status >= 500) return true;
    return false;
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;
  let delay = opts.initialDelayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if this is the last attempt
      if (attempt === opts.maxAttempts) break;
      
      // Don't retry if error is not retryable
      if (!opts.retryableErrors(error)) throw error;
      
      // Wait before retrying with exponential backoff
      await sleep(delay);
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
    }
  }
  
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CIRCUIT BREAKER
// ============================================

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  halfOpenAttempts?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenSuccesses = 0;
  
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly halfOpenAttempts: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 60000;
    this.halfOpenAttempts = options.halfOpenAttempts ?? 3;
  }

  getState(): CircuitState {
    if (this.state === 'OPEN') {
      // Check if we should transition to half-open
      if (Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.halfOpenSuccesses = 0;
      }
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const state = this.getState();
    
    if (state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN. Request blocked.');
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
    if (this.state === 'HALF_OPEN') {
      this.halfOpenSuccesses++;
      if (this.halfOpenSuccesses >= this.halfOpenAttempts) {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.halfOpenSuccesses = 0;
  }
}

// Create circuit breakers for different services
export const supabaseCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeoutMs: 30000,
});

export const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeoutMs: 60000,
});

// ============================================
// CACHING
// ============================================

export interface CacheOptions {
  ttlMs?: number;
  maxSize?: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();
  private accessOrder: string[] = [];
  private readonly maxSize: number;
  private readonly ttlMs: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 100;
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000; // 5 minutes default
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      return null;
    }
    
    // Update access order (LRU)
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
    
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    // Evict oldest if at capacity
    while (this.cache.size >= this.maxSize && this.accessOrder.length > 0) {
      const oldest = this.accessOrder.shift()!;
      this.cache.delete(oldest);
    }
    
    const expiresAt = Date.now() + (ttlMs ?? this.ttlMs);
    this.cache.set(key, { value, expiresAt });
    
    // Update access order
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        this.accessOrder = this.accessOrder.filter(k => k !== key);
      }
    }
  }
}

// Create caches for different data types
export const profileCache = new MemoryCache<any>({ ttlMs: 5 * 60 * 1000, maxSize: 50 });
export const countCache = new MemoryCache<number>({ ttlMs: 30 * 1000, maxSize: 10 });

// Start periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(() => {
    profileCache.cleanup();
    countCache.cleanup();
  }, 60000);
}

// ============================================
// API RESPONSE CACHING WRAPPER
// ============================================

export async function cachedApiCall<T>(
  cache: MemoryCache<T>,
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  const cached = cache.get(key);
  if (cached !== null) return cached;
  
  const result = await fetchFn();
  cache.set(key, result, ttlMs);
  return result;
}

// ============================================
// ERROR HANDLING
// ============================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  CIRCUIT_OPEN: 'CIRCUIT_OPEN',
} as const;

export function handleApiError(error: any): AppError {
  // Network errors
  if (error.name === 'AbortError' || error.name === 'TypeError') {
    return new AppError(
      'Network error. Please check your connection.',
      ErrorCodes.NETWORK_ERROR,
      0,
      true
    );
  }

  // HTTP errors
  if (error.status) {
    switch (error.status) {
      case 401:
        return new AppError(
          'Authentication required.',
          ErrorCodes.AUTH_REQUIRED,
          401
        );
      case 403:
        return new AppError(
          'Access denied.',
          ErrorCodes.AUTH_REQUIRED,
          403
        );
      case 404:
        return new AppError(
          'Resource not found.',
          ErrorCodes.NOT_FOUND,
          404
        );
      case 429:
        return new AppError(
          'Too many requests. Please try again later.',
          ErrorCodes.RATE_LIMITED,
          429
        );
      default:
        if (error.status >= 500) {
          return new AppError(
            'Server error. Please try again later.',
            ErrorCodes.SERVER_ERROR,
            error.status
          );
        }
    }
  }

  // Circuit breaker
  if (error.message?.includes('Circuit breaker')) {
    return new AppError(
      'Service temporarily unavailable. Please try again later.',
      ErrorCodes.CIRCUIT_OPEN,
      503
    );
  }

  // Default
  return new AppError(
    error.message || 'An unexpected error occurred.',
    ErrorCodes.SERVER_ERROR,
    500
  );
}

// ============================================
// FALLBACK UI STATE
// ============================================

export interface FallbackState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

export function createFallbackState<T>(
  fetchFn: () => Promise<T>,
  initialData: T | null = null
): FallbackState<T> {
  let state: FallbackState<T> = {
    data: initialData,
    loading: false,
    error: null,
    refetch: async () => {},
  };

  const refetch = async () => {
    state.loading = true;
    state.error = null;
    
    try {
      state.data = await withRetry(fetchFn);
    } catch (error) {
      state.error = handleApiError(error);
    } finally {
      state.loading = false;
    }
  };

  state.refetch = refetch;
  return state;
}

// ============================================
// HEALTH CHECK IMPROVEMENTS
// ============================================

export interface HealthStatus {
  healthy: boolean;
  services: {
    supabase: ServiceHealth;
    api: ServiceHealth;
    email: ServiceHealth;
  };
  timestamp: number;
}

export interface ServiceHealth {
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

export async function checkServiceHealth(
  name: string,
  checkFn: () => Promise<void>,
  timeoutMs: number = 5000
): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    await Promise.race([
      checkFn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      ),
    ]);
    
    return {
      healthy: true,
      latencyMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      error: error.message,
    };
  }
}

export async function performHealthCheck(): Promise<HealthStatus> {
  const supabaseCheck = checkServiceHealth('supabase', async () => {
    const { supabase } = await import('./supabaseClient');
    await supabase.from('profiles').select('id').limit(1);
  });

  const apiCheck = checkServiceHealth('api', async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/health`);
    if (!response.ok) throw new Error('API unhealthy');
  });

  const [supabase, api] = await Promise.all([supabaseCheck, apiCheck]);

  return {
    healthy: supabase.healthy && api.healthy,
    services: {
      supabase,
      api,
      email: { healthy: true }, // Email service health is hard to check client-side
    },
    timestamp: Date.now(),
  };
}