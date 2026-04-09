/**
 * API Configuration Utilities
 * Validates and retrieves API keys with helpful error messages
 */

/**
 * Get and validate an API key from environment variables
 * @param {string} keyName - Name of the API (e.g., 'GEMINI', 'GOOGLE_MAPS')
 * @returns {string} The API key
 * @throws {Error} If key is missing or contains placeholder values
 */
export const getApiKey = (keyName) => {
  const envKey = `VITE_${keyName}_KEY`;
  const key = import.meta.env[envKey];

  if (!key) {
    throw new Error(
      `Missing ${keyName} API key. Add it to your .env file as ${envKey}`
    );
  }

  if (
    key.includes('placeholder') ||
    key.includes('your_') ||
    key.includes('YOUR_')
  ) {
    throw new Error(
      `Invalid ${keyName} API key. Replace placeholder in .env file with real key.`
    );
  }

  return key;
};

/**
 * Create a full API URL with key parameter
 * @param {string} baseUrl - Base URL without key parameter
 * @param {string} keyName - Name of the API key
 * @returns {string} Complete URL with API key
 */
export const createApiUrl = (baseUrl, keyName) => {
  const key = getApiKey(keyName);
  return `${baseUrl}?key=${key}`;
};

/**
 * Validate Google Maps API key specifically
 * @returns {string} The validated Google Maps API key
 */
export const validateGoogleMapsKey = () => {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  if (!key) {
    throw new Error(
      'Google Maps API key not configured. Add VITE_GOOGLE_MAPS_KEY to your .env file.'
    );
  }

  if (key.includes('placeholder') || key.includes('your_')) {
    throw new Error(
      'Invalid Google Maps API key. Replace placeholder in .env file with real key.'
    );
  }

  return key;
};
