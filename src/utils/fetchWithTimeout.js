/**
 * Fetch with Timeout and Retry Logic
 * Prevents hanging requests and handles network failures gracefully
 */

/**
 * Performs a fetch request with timeout and automatic retry
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options (headers, method, body, etc)
 * @param {number} timeoutMs - Timeout in milliseconds (default: 10000)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 2)
 * @returns {Promise<Response>}
 * @throws {Error} On timeout or all retries exhausted
 */
export const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = 10000,
  maxRetries = 2
) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Retry on 5xx errors (server errors)
      if (response.status >= 500 && attempt < maxRetries - 1) {
        lastError = new Error(`Server error: ${response.status}`);
        // Exponential backoff: 1s, 2s, etc.
        await new Promise((r) =>
          setTimeout(r, (attempt + 1) * 1000)
        );
        continue;
      }

      // Success or non-retryable error
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      if (error.name === 'AbortError') {
        lastError = new Error(`Request timeout after ${timeoutMs}ms`);
      }

      // Don't retry on client errors (400-499)
      if (
        error.message?.includes('400') ||
        error.message?.includes('401') ||
        error.message?.includes('403') ||
        error.message?.includes('404')
      ) {
        throw error;
      }

      // On last attempt, throw
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      // Wait before retry with exponential backoff
      await new Promise((r) => setTimeout(r, (attempt + 1) * 1000));
    }
  }

  throw lastError || new Error('Request failed after all retries');
};
