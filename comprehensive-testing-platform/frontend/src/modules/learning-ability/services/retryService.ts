/**
 * Learning Ability Retry Service
 * Handles retry logic for failed API calls
 */

export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number; // Base delay in milliseconds
  maxDelay: number; // Maximum delay in milliseconds
  backoffMultiplier: number; // Exponential backoff multiplier
}

export class RetryService {
  private options: RetryOptions;

  constructor(options: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  }) {
    this.options = options;
  }

  /**
   * Execute function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    options?: Partial<RetryOptions>
  ): Promise<T> {
    const retryOptions = { ...this.options, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on last attempt
        if (attempt === retryOptions.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          retryOptions.baseDelay * Math.pow(retryOptions.backoffMultiplier, attempt - 1),
          retryOptions.maxDelay
        );

        await this.delay(delay);
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Execute function with retry logic and custom error handling
   */
  async executeWithCustomError<T>(
    fn: () => Promise<T>,
    errorHandler: (error: Error, attempt: number) => boolean, // Return true to retry, false to stop
    options?: Partial<RetryOptions>
  ): Promise<T> {
    const retryOptions = { ...this.options, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Check if we should retry based on custom error handler
        const shouldRetry = errorHandler(lastError, attempt);
        
        if (!shouldRetry || attempt === retryOptions.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          retryOptions.baseDelay * Math.pow(retryOptions.backoffMultiplier, attempt - 1),
          retryOptions.maxDelay
        );

        await this.delay(delay);
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Delay execution for specified milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error: Error): boolean {
    // Network errors are retryable
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return true;
    }

    // Timeout errors are retryable
    if (error.message.includes('timeout')) {
      return true;
    }

    // 5xx server errors are retryable
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return true;
    }

    // 4xx client errors are generally not retryable
    if (error.message.includes('400') || error.message.includes('401') || error.message.includes('403')) {
      return false;
    }

    // Default to retryable for unknown errors
    return true;
  }

  /**
   * Create retry wrapper for specific function
   */
  createRetryWrapper<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options?: Partial<RetryOptions>
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      return this.execute(() => fn(...args), options);
    };
  }
}

// Export singleton instance
export const retryService = new RetryService();
