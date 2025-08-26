/**
 * Network Retry Service
 * Handles network exceptions and automatic retries to improve user experience
 */

export interface RetryOptions {
  maxRetries?: number; // Maximum retry attempts
  retryDelay?: number; // Retry delay (milliseconds)
  backoffMultiplier?: number; // Backoff multiplier
  timeout?: number; // Request timeout (milliseconds)
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  retryCount: number;
  totalTime: number;
}

export class RetryService {
  private defaultOptions: Required<RetryOptions>;

  constructor(options: RetryOptions = {}) {
    this.defaultOptions = {
      maxRetries: options.maxRetries ?? 3,
      retryDelay: options.retryDelay ?? 1000,
      backoffMultiplier: options.backoffMultiplier ?? 2,
      timeout: options.timeout ?? 10000
    };
  }

  /**
   * Execute asynchronous operation with retry
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<RetryResult<T>> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: Error | null = null;
    const startTime = Date.now();

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        // Create timeout Promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), config.timeout);
        });

        // Execute operation with timeout control
        const result = await Promise.race([operation(), timeoutPromise]);
        
        return {
          success: true,
          data: result,
          retryCount: attempt,
          totalTime: Date.now() - startTime
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // If last attempt, return error
        if (attempt === config.maxRetries) {
          return {
            success: false,
            error: lastError.message,
            retryCount: attempt,
            totalTime: Date.now() - startTime
          };
        }

        // Calculate retry delay (exponential backoff)
        const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
        
        // Retry failed, wait and retry
        
        // Wait for retry
        await this.delay(delay);
      }
    }

    // Should not reach here, but for type safety
    return {
      success: false,
      error: lastError?.message || 'Unknown error',
      retryCount: config.maxRetries,
      totalTime: Date.now() - startTime
    };
  }

  /**
   * Delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Determine if error should be retried
   */
  shouldRetry(error: Error): boolean {
    // Network errors, timeouts, 5xx server errors should be retried
    const retryableErrors = [
      'Network Error',
      'Request timeout',
      'Failed to fetch',
      'Network request failed'
    ];
    
    const retryableStatusCodes = [500, 502, 503, 504];
    
    // Check if it's a network error
    if (retryableErrors.some(msg => error.message.includes(msg))) {
      return true;
    }
    
    // Check HTTP status code
    if (error.message.includes('HTTP')) {
      const statusMatch = error.message.match(/HTTP (\d+)/);
      if (statusMatch) {
        const statusCode = parseInt(statusMatch[1] || '0');
        return retryableStatusCodes.includes(statusCode);
      }
    }
    
    return false;
  }

  /**
   * Create exponential backoff retry strategy
   */
  createExponentialBackoff(
    baseDelay: number = 1000,
    maxDelay: number = 30000,
    multiplier: number = 2
  ) {
    return (attempt: number): number => {
      const delay = baseDelay * Math.pow(multiplier, attempt);
      return Math.min(delay, maxDelay);
    };
  }

  /**
   * Create fixed delay retry strategy
   */
  createFixedDelay(delay: number = 1000) {
    return (): number => delay;
  }

  /**
   * Create random delay retry strategy (avoid retry storms)
   */
  createRandomDelay(
    minDelay: number = 1000,
    maxDelay: number = 5000
  ) {
    return (): number => {
      return Math.random() * (maxDelay - minDelay) + minDelay;
    };
  }
}

// Create default instance
export const retryService = new RetryService();
