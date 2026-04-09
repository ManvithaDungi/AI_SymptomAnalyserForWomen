/**
 * Secure Anonymous ID Generation
 * Prevents spoofing and impersonation of anonymous users
 */

/**
 * Generate a secure, unique anonymous ID based on browser fingerprint
 * Uses sessionStorage to ensure same ID per session
 * @returns {Promise<string>} Unique anonymous ID
 */
export const getSecureAnonId = async () => {
  // Check if already generated in this session
  let storedId = sessionStorage.getItem('__anonId');
  if (storedId) return storedId;

  // Create browser fingerprint from multiple factors
  const fingerprint = [
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    navigator.hardwareConcurrency || 'unknown',
    new Date().toISOString().split('T')[0], // Daily rotation
  ].join('|');

  // Simple hash function (for browsers without crypto API)
  const hash = simpleHash(fingerprint);

  // Generate ID: Anon#HASH_RANDOM
  const anonId = `Anon#${hash.substring(0, 6).toUpperCase()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  // Store in sessionStorage (cleared on browser close)
  sessionStorage.setItem('__anonId', anonId);

  return anonId;
};

/**
 * Validate anonymous ID to prevent spoofing
 * Ensures claimed ID matches stored ID
 * @param {string} claimedId - ID being claimed by user
 * @returns {boolean} True if valid
 */
export const validateAnonId = (claimedId) => {
  const actualId = sessionStorage.getItem('__anonId');
  return claimedId === actualId;
};

/**
 * Get stored anonymous ID without regenerating
 * @returns {string|null} Stored ID or null if none exists
 */
export const getStoredAnonId = () => {
  return sessionStorage.getItem('__anonId');
};

/**
 * Clear anonymous ID (useful for logout)
 */
export const clearAnonId = () => {
  sessionStorage.removeItem('__anonId');
};

/**
 * Simple hash function for browser fingerprinting
 * Not cryptographically secure - just for generating unique IDs
 * @param {string} str - String to hash
 * @returns {string} Hash
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}
