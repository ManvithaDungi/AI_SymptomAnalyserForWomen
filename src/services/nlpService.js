import { getApiKey } from '../utils/apiConfig.js';
import { fetchWithTimeout } from '../utils/fetchWithTimeout.js';
import { logger } from '../utils/logger.js';
import { formatApiError, formatNetworkError } from '../utils/errorFormatter.js';
import { API_TIMEOUTS } from '../config/constants.js';

const API_BASE = 'https://language.googleapis.com/v1/documents';

// Common helper for API calls
const callNL = async (endpoint, content, type = 'PLAIN_TEXT') => {
  try {
    const API_KEY = getApiKey('CLOUD_NATURAL_LANGUAGE');
    const url = `${API_BASE}:${endpoint}?key=${API_KEY}`;

    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: {
            type,
            content,
          },
          encodingType: 'UTF8'
        })
      },
      API_TIMEOUTS.NLP,
      2 // maxRetries
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      logger.error(`Cloud NL ${endpoint} error`, err);
      throw new Error(`${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    const message = error.message || 'Unknown error';
    if (message.includes('timeout') || message.includes('AbortError')) {
      logger.error(`Cloud NL ${endpoint} timeout`, error);
      throw new Error(formatNetworkError(error));
    }
    logger.error(`Cloud NL ${endpoint} failed`, error);
    throw new Error(formatApiError('Cloud Natural Language', error));
  }
};

/**
 * 1. Moderation (Toxicity, Insult, etc.)
 * Replaces pure sentiment check for safety.
 */
export const moderateText = async (text) => {
  try {
    const data = await callNL('moderateText', text);
    const scores = {};
    (data.moderationCategories || []).forEach(cat => {
      scores[cat.name] = cat.confidence;
    });
    logger.log('Text moderation completed', { categoriesCount: Object.keys(scores).length });
    return scores;
  } catch (error) {
    logger.error('Moderation failed', error);
    return {};
  }
};

/**
 * 2. Entity Extraction (Symptoms)
 * Extracts key terms like "tired", "pain" from text.
 */
export const extractEntities = async (text) => {
  try {
    const data = await callNL('analyzeEntities', text);
    const entities = (data.entities || []).map(e => ({
      name: e.name,
      type: e.type,
      salience: e.salience
    }));
    logger.log('Entities extracted', { count: entities.length });
    return entities;
  } catch (error) {
    logger.error('Entity extraction failed', error);
    return [];
  }
};

/**
 * 3. Content Classification (Auto-Tagging)
 * Suggests categories like /Health/Reproductive Health
 */
export const classifyContent = async (text) => {
  if (text.split(' ').length < 20) return [];

  try {
    const data = await callNL('classifyText', text);
    const categories = (data.categories || []).map(c => c.name);
    logger.log('Content classified', { count: categories.length });
    return categories;
  } catch (error) {
    logger.warn('Classification skipped', error.message);
    return [];
  }
};

/**
 * 4. Sentiment Analysis (Granular)
 * Returns { score: -1 to 1, magnitude: 0 to +inf }
 */
export const analyzeSentiment = async (text) => {
  try {
    const data = await callNL('analyzeSentiment', text);
    const sentiment = data.documentSentiment || { score: 0, magnitude: 0 };
    logger.log('Sentiment analyzed', sentiment);
    return sentiment;
  } catch (error) {
    logger.error('Sentiment analysis failed', error);
    return { score: 0, magnitude: 0 };
  }
};
