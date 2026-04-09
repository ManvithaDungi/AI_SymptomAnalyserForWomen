/**
 * Error Formatting Utilities
 * Standardizes error messages across all services
 */

/**
 * Format API errors with consistent messaging
 * @param {string} service - Service name (e.g., 'Gemini', 'Google Maps')
 * @param {Error|string} originalError - Original error object or message
 * @returns {string} Formatted error message
 */
export const formatApiError = (service, originalError) => {
  const baseMsg = `${service} failed`;
  let details = 'Unknown error';

  if (typeof originalError === 'string') {
    details = originalError;
  } else if (originalError instanceof Error) {
    details = originalError.message || 'Unknown error';
  } else if (typeof originalError === 'object' && originalError.message) {
    details = originalError.message;
  }

  // Don't repeat service name if already in details
  if (details.toLowerCase().includes(service.toLowerCase())) {
    return `${details}. Please try again.`;
  }

  return `${baseMsg}: ${details}. Please try again.`;
};

/**
 * Format network/timeout errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const formatNetworkError = (error) => {
  if (!error) return 'Network error. Please try again.';

  const message = error.message || '';

  if (message.includes('timeout')) {
    return 'Request timed out. Check your connection and try again.';
  }

  if (message.includes('Failed to fetch') || message.includes('ERR_INTERNET_DISCONNECTED')) {
    return 'No internet connection. Please check your network.';
  }

  if (message.includes('AbortError')) {
    return 'Request was cancelled. Please try again.';
  }

  return 'Network error. Please try again.';
};

/**
 * Format validation errors
 * @param {array|string} errors - Array of error messages or single error
 * @returns {string} Formatted error message
 */
export const formatValidationError = (errors) => {
  if (Array.isArray(errors) && errors.length > 0) {
    if (errors.length === 1) {
      return errors[0];
    }
    return errors.join('\n');
  }

  return String(errors || 'Validation failed');
};

/**
 * Format HTTP status errors
 * @param {number} status - HTTP status code
 * @returns {string} User-friendly message
 */
export const formatHttpError = (status) => {
  const statusMessages = {
    400: 'Invalid request',
    401: 'Authentication required',
    403: 'Access denied',
    404: 'Resource not found',
    429: 'Too many requests. Please wait.',
    500: 'Server error. Please try again.',
    502: 'Service temporarily unavailable',
    503: 'Service maintenance. Please try again later.',
    504: 'Gateway timeout',
  };

  return statusMessages[status] || `Error ${status}. Please try again.`;
};

/**
 * Create safe error message for user display
 * Hides sensitive info from production errors
 * @param {Error|string} error - Error to format
 * @param {boolean} isDev - Whether in development mode
 * @returns {string} Safe error message
 */
export const formatErrorForDisplay = (error, isDev = false) => {
  const message = typeof error === 'string' ? error : error?.message || 'Unknown error';

  if (isDev) {
    return message; // Show full error in dev
  }

  // Hide sensitive details in production
  if (message.includes('API key')) {
    return 'Configuration error. Administrator has been notified.';
  }

  if (message.includes('firebase') || message.includes('database')) {
    return 'Service temporarily unavailable. Please try again.';
  }

  if (message.includes('XSS') || message.includes('injection')) {
    return 'Invalid input detected. Please check your entry.';
  }

  return 'Something went wrong. Please try again.';
};
