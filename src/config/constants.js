/**
 * Application Constants
 * Centralized configuration for magic numbers and constants
 */

// API Timeouts (milliseconds)
export const API_TIMEOUTS = {
  GEMINI: 30000, // 30 seconds for LLM analysis
  NLP: 15000, // 15 seconds for NLP
  PLACES: 10000, // 10 seconds for Google Places
  MAPS: 10000, // 10 seconds for Maps
  DEFAULT: 10000, // 10 seconds default
};

// Pagination Settings
export const PAGINATION = {
  FORUM_POSTS_PER_PAGE: 20,
  JOURNAL_ENTRIES_PER_PAGE: 15,
  COMMENTS_PER_PAGE: 10,
  NEARBY_RESULTS: 15,
  SEARCH_RESULTS: 20,
};

// Search and Location Settings
export const SEARCH = {
  NEARBY_RADIUS_M: 3000, // 3km default radius
  MAX_SYMPTOMS: 50,
  MAX_DESCRIPTION_LENGTH: 2000,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
};

// File Upload Limits (bytes)
export const FILE_LIMITS = {
  FORUM_IMAGE: 5 * 1024 * 1024, // 5MB
  JOURNAL_ATTACHMENT: 10 * 1024 * 1024, // 10MB
  USER_PROFILE_IMAGE: 3 * 1024 * 1024, // 3MB
};

// Colors
export const COLORS = {
  PRIMARY: '#6D5BD0',
  SECONDARY: '#9B8EC4',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  GRAY_LIGHT: '#F3F4F6',
  GRAY_DARK: '#1F2937',
};

// Languages Supported
export const LANGUAGES = {
  EN: { code: 'en', label: 'English' },
  TA: { code: 'ta', label: 'Tamil' },
  HI: { code: 'hi', label: 'Hindi' },
  ML: { code: 'ml', label: 'Malayalam' },
  TE: { code: 'te', label: 'Telugu' },
  KN: { code: 'kn', label: 'Kannada' },
};

// Forum Topics
export const FORUM_TOPICS = [
  { id: 'reproductive-health', label: 'Reproductive Health' },
  { id: 'menstrual-health', label: 'Menstrual Health' },
  { id: 'pregnancy', label: 'Pregnancy & Fertility' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'other', label: 'Other' },
];

// Symptom Severity Levels
export const SEVERITY_LEVELS = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
};

// Cache Durations (milliseconds)
export const CACHE_DURATIONS = {
  FORUM_POSTS: 5 * 60 * 1000, // 5 minutes
  JOURNAL_ENTRIES: 10 * 60 * 1000, // 10 minutes
  LOCATION_DATA: 30 * 60 * 1000, // 30 minutes
  USER_DATA: 60 * 60 * 1000, // 1 hour
};

// Retry Settings
export const RETRY_CONFIG = {
  MAX_RETRIES: 2,
  INITIAL_BACKOFF: 1000, // 1 second
  MAX_BACKOFF: 10000, // 10 seconds
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_LANGUAGE: 'sahachari_user_language',
  USER_PREFERENCES: 'sahachari_user_preferences',
  RECENT_SEARCHES: 'sahachari_recent_searches',
  THEME: 'sahachari_theme',
  ANONYMOUS_ID: '__anonId',
};
