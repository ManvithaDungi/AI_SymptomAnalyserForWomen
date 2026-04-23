import { getApiKey } from '../utils/apiConfig.js';
import { fetchWithTimeout } from '../utils/fetchWithTimeout.js';
import { logger } from '../utils/logger.js';
import { formatApiError, formatNetworkError } from '../utils/errorFormatter.js';
import { API_TIMEOUTS } from '../config/constants.js';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const callGemini = async (prompt) => {
  try {
    const API_KEY = getApiKey('GEMINI');
    const url = `${API_URL}?key=${API_KEY}`;

    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      },
      API_TIMEOUTS.GEMINI,
      2 // maxRetries
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('Gemini API Error Details', errorData);
      throw new Error(`${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('No response generated');

    // Clean up potential markdown code blocks if the model wraps JSON
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    const message = error.message || 'Unknown error';
    if (message.includes('timeout') || message.includes('AbortError')) {
      logger.error('Gemini request timeout', error);
      throw new Error(formatNetworkError(error));
    }
    logger.error('Gemini AI failed', error);
    throw new Error(formatApiError('Gemini', error));
  }
};

const callGeminiText = async (prompt) => {
  try {
    const API_KEY = getApiKey('GEMINI');
    const url = `${API_URL}?key=${API_KEY}`;

    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
      API_TIMEOUTS.GEMINI,
      2
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('Gemini API Error Details', errorData);
      throw new Error(`${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('No response generated');

    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (error) {
    const message = error.message || 'Unknown error';
    if (message.includes('timeout') || message.includes('AbortError')) {
      logger.error('Gemini request timeout', error);
      throw new Error(formatNetworkError(error));
    }
    logger.error('Gemini AI failed', error);
    throw new Error(formatApiError('Gemini', error));
  }
};

const getLanguageName = () => {
  const map = {
    en: 'English',
    ta: 'Tamil',
    hi: 'Hindi',
    ml: 'Malayalam',
    te: 'Telugu',
    kn: 'Kannada'
  };
  return map[localStorage.getItem('language')] || 'English';
};

export const analyzeSymptoms = async (symptoms, additionalNotes = "") => {
  const symptomList = Array.isArray(symptoms) ? symptoms.join(", ") : symptoms;
  const language = getLanguageName();

  const prompt = `
    You are a compassionate, expert women's health assistant for the Indian context.
    The user is experiencing these symptoms: ${symptomList}.
    Additional details: "${additionalNotes}".

    Analyze these symptoms carefully. Consider common conditions like PCOS, Anemia, Thyroid issues, PMS, Endometriosis, etc.
    Provide a JSON response with the following structure.
    Strictly output ONLY valid JSON.
    Respond entirely in ${language}. All text fields (name, description, tips, etc.) must be in ${language}.

    {
      "possible_conditions": [
        { "name": "Condition Name", "probability": "High/Medium/Low", "description": "Brief explanation in simple terms." }
      ],
      "see_doctor_urgency": "Immediately" | "Within a week" | "Monitor symptoms",
      "self_care_tips": ["Tip 1", "Tip 2", "Tip 3"],
      "local_foods": ["Food 1 (e.g. Ragi)", "Food 2 (e.g. Amla)"],
      "disclaimer": "Standard medical disclaimer."
    }
  `;
  return callGemini(prompt);
};

export const generateWeeklySummary = async (entries) => {
  if (!entries || entries.length === 0) return null;
  const language = getLanguageName();

  const entryText = entries.map(e =>
    `Date: ${e.date}, Mood: ${e.mood}, Period: ${e.period}, Symptoms: ${e.notes || 'None'}, Fatigue: ${e.fatigue}/5`
  ).join("\n");

  const prompt = `
    Analyze this user's weekly health log (journal entries):
    ${entryText}

    Identify patterns related to their menstrual cycle, mood, or energy.
    Provide a JSON response with the following structure.
    Strictly output ONLY valid JSON.
    Respond entirely in ${language}.

    {
      "summary": "2-3 sentence summary of their week.",
      "pattern": "Any noticeable pattern (e.g., 'Mood drops 2 days before period').",
      "suggestion": "One actionable wellness tip.",
      "anemia_risk": "Low" | "Moderate" | "High",
      "anemia_reason": "Why you think so (e.g., fatigue consistently high)."
    }
  `;
  return callGemini(prompt);
};

export const validateRemedy = async (remedyName) => {
  const language = getLanguageName();
  const prompt = `
    Evaluate the safety of this home remedy: "${remedyName}" for women's health.
    Context: Indian home remedies.
    Provide a JSON response with the following structure.
    Strictly output ONLY valid JSON.
    Respond entirely in ${language}.

    {
      "verdict": "Safe" | "Caution" | "Unsafe",
      "explanation": "Why?",
      "scientific_backing": "Supported" | "Mixed Evidence" | "Folklore",
      "tip": "How to use safely."
    }
  `;
  try {
    return await callGemini(prompt);
  } catch (error) {
    logger.error('Remedy validation failed', error);
    throw error;
  }
};

export const chatRemedyAssistant = async (message, context = {}) => {
  const languageMap = {
    en: 'English',
    ta: 'Tamil',
    hi: 'Hindi',
    ml: 'Malayalam',
    te: 'Telugu',
    kn: 'Kannada'
  };
  const language = languageMap[localStorage.getItem('language')] || 'English';

  const prompt = `
You are Sahachari, a warm evidence-based women's health assistant for India.
Answer in ${language}. If the user writes in Tamil, Hindi, Telugu, Kannada, or Malayalam, respond naturally in that language.

Focus on hormones, nutrition, mental health, menstrual health, and culturally familiar remedies.
Use local food names when helpful, explain if something is evidence-based, and gently flag unsafe advice.
Do not give a diagnosis. Encourage medical care for severe, persistent, or alarming symptoms.

Context:
- Current remedy category: ${context.category || 'general'}
- Local foods/remedies to mention if relevant: ragi, amla, jeera, ginger, turmeric, curry leaves, coconut water

User message:
${message}

Reply in a short, helpful chat style with 2-5 concise paragraphs or bullet points.
`;

  return callGeminiText(prompt);
};

export const detectPattern = async (logs) => {
  logger.log('Pattern detection called');
  // Placeholder for complex pattern detection
  return "Keep logging to unlock detailed patterns!";
};
