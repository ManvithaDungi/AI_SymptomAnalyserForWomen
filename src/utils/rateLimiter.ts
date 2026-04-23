/**
 * RateLimiter - Token bucket implementation for Firestore query rate limiting
 * 
 * Prevents abuse by limiting reads to max 20 per minute per user.
 * Uses localStorage to track request timestamps per userId.
 * 
 * @example
 * const limiter = new RateLimiter({ maxRequests: 20, windowMs: 60000 });
 * try {
 *   limiter.checkLimit(userId);
 *   // Proceed with Firestore query
 * } catch (error) {
 *   console.error(error.message); // "Rate limit exceeded..."
 * }
 */
export class RateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number = 60) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface RateLimiterConfig {
  maxRequests?: number; // Max requests per window
  windowMs?: number; // Time window in milliseconds
  storageKey?: string; // localStorage key prefix
}

export class RateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private storageKeyPrefix: string;

  /**
   * Create a rate limiter instance
   * @param {RateLimiterConfig} config - Configuration options
   */
  constructor(config: RateLimiterConfig = {}) {
    this.maxRequests = config.maxRequests ?? 20; // 20 reads per window
    this.windowMs = config.windowMs ?? 60000; // 1 minute window
    this.storageKeyPrefix = config.storageKey ?? 'ratelimit:';
  }

  /**
   * Check if a request is allowed under rate limit
   * @param {string} userId - User ID to check limit for
   * @throws {RateLimitError} If rate limit exceeded
   */
  checkLimit(userId: string): void {
    if (!userId) {
      // Skip rate limiting for unauthenticated requests
      return;
    }

    const key = `${this.storageKeyPrefix}${userId}`;
    const now = Date.now();
    let requests: number[] = [];

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        requests = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error reading rate limit data from localStorage:', error);
      requests = [];
    }

    // Remove timestamps outside the window
    requests = requests.filter(timestamp => now - timestamp < this.windowMs);

    // Check if limit exceeded
    if (requests.length >= this.maxRequests) {
      const oldestRequest = requests[0];
      const resetTime = new Date(oldestRequest + this.windowMs);
      const retryAfterSeconds = Math.ceil((resetTime.getTime() - now) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded: ${this.maxRequests} requests per ${this.windowMs / 1000}s. Retry after ${retryAfterSeconds}s`,
        retryAfterSeconds
      );
    }

    // Add current request timestamp
    requests.push(now);
    try {
      localStorage.setItem(key, JSON.stringify(requests));
    } catch (error) {
      console.warn('Error writing rate limit data to localStorage:', error);
    }
  }

  /**
   * Reset rate limit for a user (useful for testing)
   * @param {string} userId - User ID to reset
   */
  reset(userId: string): void {
    const key = `${this.storageKeyPrefix}${userId}`;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error resetting rate limit:', error);
    }
  }

  /**
   * Get current request count for a user
   * @param {string} userId - User ID to check
   * @returns {number} Number of requests in current window
   */
  getRequestCount(userId: string): number {
    if (!userId) return 0;

    const key = `${this.storageKeyPrefix}${userId}`;
    const now = Date.now();

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return 0;

      const requests = JSON.parse(stored);
      const validRequests = requests.filter((timestamp: number) => now - timestamp < this.windowMs);
      return validRequests.length;
    } catch (error) {
      console.warn('Error reading request count:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();
