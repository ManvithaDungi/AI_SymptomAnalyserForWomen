/**
 * Logger Utility
 * Centralized logging with environment-aware output
 * Only logs in development mode
 */

const isDev = import.meta.env.DEV;
const LOG_PREFIX = '[Sahachari]';

/**
 * Centralized logger object
 * Only outputs in development mode
 */
export const logger = {
  /**
   * Log general information
   * @param {string} message - Log message
   * @param {*} data - Optional data to log
   */
  log: (message, data) => {
    if (isDev) {
      console.log(`${LOG_PREFIX} ${message}`, data ?? '');
    }
  },

  /**
   * Log errors
   * @param {string} message - Error message
   * @param {Error|*} error - Error object or data
   */
  error: (message, error) => {
    if (isDev) {
      console.error(`${LOG_PREFIX} [ERROR] ${message}`, error ?? '');
    }
  },

  /**
   * Log warnings
   * @param {string} message - Warning message
   * @param {*} data - Optional data
   */
  warn: (message, data) => {
    if (isDev) {
      console.warn(`${LOG_PREFIX} ⚠️ ${message}`, data ?? '');
    }
  },

  /**
   * Log debug information (verbose)
   * @param {string} message - Debug message
   * @param {*} data - Optional data
   */
  debug: (message, data) => {
    if (isDev) {
      console.debug(`${LOG_PREFIX} [DEBUG] ${message}`, data ?? '');
    }
  },

  /**
   * Log performance metrics
   * @param {string} label - Metric label
   * @param {number} duration - Duration in milliseconds
   */
  perf: (label, duration) => {
    if (isDev) {
      console.info(`${LOG_PREFIX} ⏱️ ${label}: ${duration}ms`);
    }
  },

  /**
   * Group logs for better organization
   * @param {string} groupName - Group label
   * @param {Function} callback - Callback containing logs
   */
  group: (groupName, callback) => {
    if (isDev) {
      console.group(`${LOG_PREFIX} ${groupName}`);
      callback();
      console.groupEnd();
    }
  },
};

/**
 * Performance measurement helper
 * @param {string} label - Label for this measurement
 * @param {Function} fn - Async or sync function to measure
 * @returns {*} Return value of fn
 */
export const measurePerformance = async (label, fn) => {
  const startTime = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    logger.perf(`${label}`, Math.round(duration * 100) / 100);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error(`${label} (failed in ${Math.round(duration)}ms)`, error);
    throw error;
  }
};

export default logger;
