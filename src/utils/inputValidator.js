/**
 * Input Validation Utilities
 * Prevents injection attacks and invalid data submission
 */

/**
 * Validate symptom input for length, special characters, and suspicious patterns
 * @param {array} symptoms - Selected symptoms
 * @param {string} notes - Additional description from user
 * @returns {array} Array of error messages (empty if valid)
 */
export const validateSymptomInput = (symptoms, notes) => {
  const MAX_SYMPTOMS = 50;
  const MAX_NOTE_LENGTH = 2000;
  const FORBIDDEN_PATTERNS =
    /<script|javascript:|onerror|onclick|<iframe|<img|<embed|eval\(|alert\(/gi;

  const errors = [];

  if (Array.isArray(symptoms) && symptoms.length > MAX_SYMPTOMS) {
    errors.push(`Maximum ${MAX_SYMPTOMS} symptoms allowed`);
  }

  if (notes && notes.length > MAX_NOTE_LENGTH) {
    errors.push(`Description maximum ${MAX_NOTE_LENGTH} characters`);
  }

  if (notes && FORBIDDEN_PATTERNS.test(notes)) {
    errors.push('Invalid characters in description');
  }

  // Check for SQL injection patterns
  if (notes) {
    const sqlPatterns =
      /drop table|delete from|insert into|update|truncate|union|select.*from/gi;
    if (sqlPatterns.test(notes)) {
      errors.push('Invalid input detected');
    }
  }

  return errors;
};

/**
 * Sanitize input for API transmission
 * Removes HTML tags, special characters, and enforces length limits
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum length (default: 2000)
 * @returns {string} Sanitized text
 */
export const sanitizeInput = (text, maxLength = 2000) => {
  if (!text) return '';

  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim()
    .substring(0, maxLength);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format and protocol
 * @param {string} url - URL to validate
 * @param {array} allowedProtocols - Allowed protocols (default: ['http:', 'https:'])
 * @returns {boolean}
 */
export const isValidUrl = (url, allowedProtocols = ['http:', 'https:', 'blob:']) => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return allowedProtocols.includes(urlObj.protocol);
  } catch (e) {
    return false;
  }
};

/**
 * Validate image URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) return false;

  try {
    const urlObj = new URL(url);
    const validImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = urlObj.pathname.toLowerCase();
    return validImageExts.some((ext) => pathname.endsWith(ext)) || url.includes('blob:');
  } catch (e) {
    return false;
  }
};
