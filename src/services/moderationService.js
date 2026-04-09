import { getApiKey } from '../utils/apiConfig.js';
import { fetchWithTimeout } from '../utils/fetchWithTimeout.js';
import { logger } from '../utils/logger.js';
import { formatApiError, formatNetworkError } from '../utils/errorFormatter.js';
import { API_TIMEOUTS } from '../config/constants.js';
import { moderateText } from './nlpService';

const parseGeminiJson = (rawText) => {
   const start = rawText.indexOf('{');
   const end = rawText.lastIndexOf('}');
   if (start === -1 || end === -1) return null;
   const jsonString = rawText.slice(start, end + 1);
   try {
      return JSON.parse(jsonString);
   } catch (e) {
      return null;
   }
};

const geminiSafetyCheck = async (text) => {
   try {
      const API_KEY = getApiKey('GEMINI');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      const prompt = `
Review this post from a women's health support community:
"${text}"

Respond ONLY in this JSON format:
{
  "approved": true or false,
  "safetyScore": number between 0-100,
  "flags": ["flag1", "flag2"],
  "reason": "one sentence",
  "suggestedEdit": null or "cleaner version of the post"
}

APPROVE if: sharing personal experience, asking health questions, offering emotional support, discussing symptoms, cultural remedies.
REJECT if: dangerous medical advice, self-harm content, body shaming, misinformation about medications, spam.
Be culturally sensitive to Indian women's health discussions.
Menstrual health, PCOS, anemia discussions are always appropriate.
`;
      const response = await fetchWithTimeout(
         url,
         {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               contents: [{ parts: [{ text: prompt }] }]
            })
         },
         API_TIMEOUTS.GEMINI,
         2 // maxRetries
      );
      
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini');

      const parsed = parseGeminiJson(rawText);
      if (!parsed) {
         logger.error('Failed to parse Gemini response');
         return { approved: false, safetyScore: 0, flags: ['error'], reason: 'AI parsing failed' };
      }
      logger.log('Safety check completed', { approved: parsed.approved });
      return parsed;

   } catch (error) {
      logger.error('Gemini Safety Check Failed', error);
      // Fail open if AI fails, but flag it
      return { approved: true, safetyScore: 50, flags: ['ai_error'], reason: 'AI Check Failed', suggestedEdit: null };
   }
};

const geminiFactCheck = async (remedyText) => {
   try {
      const API_KEY = getApiKey('GEMINI');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      const prompt = `
Fact-check the following home remedy mentioned in a women's health forum. Respond ONLY in this JSON format:
{
  "verdict": "supported" | "not_supported" | "uncertain",
  "evidence": "short summary of scientific evidence or lack thereof",
  "advice": "one gentle, culturally sensitive sentence for the user"
}
Remedy: "${remedyText}"
If there is no strong evidence, say so. If it is generally safe but unproven, say so. If it is risky, warn gently. Do not give medical advice.
`;
      const response = await fetchWithTimeout(
         url,
         {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               contents: [{ parts: [{ text: prompt }] }]
            })
         },
         API_TIMEOUTS.GEMINI,
         2 // maxRetries
      );
      
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
         logger.warn('Empty response from fact-check');
         return null;
      }
      const result = parseGeminiJson(rawText);
      if (result) {
         logger.log('Fact check completed', { verdict: result.verdict });
      }
      return result;
   } catch (error) {
      logger.error('Fact-Check Failed', error);
      return null;
   }
};

// Main Moderation Function
// type: 'text' | 'image' | 'question' | 'comment', topic: string
export const moderateContent = async (text, type = 'text', topic = '') => {
   if (!text || text.length < 5) {
      logger.warn('Content too short for moderation', { length: text?.length });
      return {
         approved: false,
         sentiment: 'neutral',
         safetyScore: 0,
         flags: ['too_short'],
         reason: 'Too short',
         geminiCheck: false,
         moderatedAt: new Date()
      };
   }

   // LAYER 1: Cloud Natural Language (Toxicity)
   const nlScores = await moderateText(text);

   // Check for high toxicity/severe flags
   const TOXICITY_THRESHOLD = 0.6;
   const flags = [];
   let maxScore = 0;

   // Map NL scores to flags
   for (const [category, score] of Object.entries(nlScores)) {
      if (score > maxScore) maxScore = score;
      if (score > TOXICITY_THRESHOLD) {
         flags.push(category);
      }
   }

   // If highly toxic, reject immediately
   if (flags.length > 0) {
      logger.log('Content rejected on toxicity check', { flags });
      return {
         approved: false,
         sentiment: 'negative',
         safetyScore: Math.round((1 - maxScore) * 100),
         flags,
         reason: `Content flagged as ${flags.join(', ')}`,
         geminiCheck: false,
         moderatedAt: new Date()
      };
   }

   // Fact-check Home Remedies
   let factCheckResult = null;
   if (topic === 'Home Remedies' && type !== 'comment') {
      factCheckResult = await geminiFactCheck(text);
   }

   // LAYER 2: Gemini Safety Check
   const geminiResult = await geminiSafetyCheck(text);
   logger.log('Content moderation completed', { approved: geminiResult.approved, type, topic });

   return {
      approved: geminiResult.approved,
      sentiment: 'neutral',
      safetyScore: geminiResult.safetyScore,
      flags: geminiResult.flags || [],
      reason: geminiResult.reason,
      suggestedEdit: geminiResult.suggestedEdit,
      geminiCheck: true,
      moderatedAt: new Date(),
      factCheck: factCheckResult
   };
};
