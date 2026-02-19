const HF_API_URL = "https://router.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest";

const normalizeLabel = (label) => {
   if (!label) return 'NEUTRAL';
   return String(label).toUpperCase();
};

const getBestPrediction = (result) => {
   if (Array.isArray(result) && Array.isArray(result[0])) {
      const sorted = [...result[0]].sort((a, b) => b.score - a.score);
      return sorted[0];
   }
   if (Array.isArray(result) && result[0]?.label) {
      const sorted = [...result].sort((a, b) => b.score - a.score);
      return sorted[0];
   }
   return { label: 'NEUTRAL', score: 0.5 };
};

const huggingFaceCheck = async (text) => {
   try {
      const token = import.meta.env.VITE_HF_TOKEN;
      // Graceful fallback if no token
      if (!token) {
         console.warn('Moderation: No HF Token found. Skipping Layer 1.');
         return { label: 'NEUTRAL', score: 0.5 };
      }

      const response = await fetch(HF_API_URL, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ inputs: text })
      });

      if (!response.ok) {
         // Log but don't crash
         console.warn(`HF API Warning: ${response.statusText}`);
         return { label: 'NEUTRAL', score: 0.5 };
      }

      const result = await response.json();
      return getBestPrediction(result);
   } catch (error) {
      console.error('Moderation Layer 1 Failed (Non-blocking):', error);
      return { label: 'NEUTRAL', score: 0.5 };
   }
};

const parseGeminiJson = (rawText) => {
   const start = rawText.indexOf('{');
   const end = rawText.lastIndexOf('}');
   if (start === -1 || end === -1) return null;
   const jsonString = rawText.slice(start, end + 1);
   return JSON.parse(jsonString);
};

const geminiSafetyCheck = async (text) => {
   // Gemini Fact-Check for Home Remedies
   const geminiFactCheck = async (remedyText) => {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!API_KEY) {
         return {
            verdict: 'uncertain',
            evidence: 'No API key for fact-checking.',
            advice: 'Always consult a healthcare professional before trying new remedies.'
         };
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
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
      try {
         const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               contents: [{ parts: [{ text: prompt }] }]
            })
         });
         const data = await response.json();
         const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
         if (!rawText) throw new Error('Empty response from Gemini Fact-Check');
         const parsed = parseGeminiJson(rawText);
         if (!parsed) throw new Error('Invalid JSON from Gemini Fact-Check');
         return parsed;
      } catch (error) {
         console.error('Fact-Check Failed:', error);
         return {
            verdict: 'uncertain',
            evidence: 'Fact-checking unavailable.',
            advice: 'Always consult a healthcare professional before trying new remedies.'
         };
      }
   };
   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
   if (!API_KEY) {
      return { approved: true, safetyScore: 50, flags: ['gemini_unavailable'], reason: 'No API Key', suggestedEdit: null };
   }
   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
   const prompt = `
Review this post from a women's health support community:
"${text}"

Respond ONLY in this JSON format:
{
  "approved": true or false,
  "safetyScore": number between 0-100,
  "flags": [],
  "reason": "one sentence",
  "suggestedEdit": null or "cleaner version of the post"
}

APPROVE if: sharing personal experience, asking health questions, offering emotional support, discussing symptoms, cultural remedies.
REJECT if: dangerous medical advice, self-harm content, body shaming, misinformation about medications, spam.
Be culturally sensitive to Indian women's health discussions.
Menstrual health, PCOS, anemia discussions are always appropriate.
`;
   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
         })
      });
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini');
      const parsed = parseGeminiJson(rawText);
      if (!parsed) throw new Error('Invalid JSON');
      return parsed;
   } catch (error) {
      console.error('Moderation Layer 2 Failed:', error);
      return { approved: true, safetyScore: 50, flags: ['gemini_error'], reason: 'AI Check Failed', suggestedEdit: null };
   }
};

// type: 'text' | 'image' | 'question' | 'comment', topic: string
export const moderateContent = async (text, type = 'text', topic = '') => {
   if (!text || text.length < 5) {
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

   const hfResult = await huggingFaceCheck(text);
   const label = normalizeLabel(hfResult.label);
   const score = hfResult.score;

   // Fact-check Home Remedies posts (not comments)
   let factCheck = null;
   if (topic === 'Home Remedies' && type !== 'comment') {
      factCheck = await geminiFactCheck(text);
   }

   if (label === 'NEGATIVE' && score > 0.7) {
      return {
         approved: false,
         sentiment: 'negative',
         safetyScore: 20,
         flags: ['flagged_by_ai'],
         reason: 'Content may not be appropriate for this community',
         geminiCheck: false,
         moderatedAt: new Date(),
         factCheck
      };
   }

   if (label === 'POSITIVE' && score > 0.6) {
      return {
         approved: true,
         sentiment: 'positive',
         safetyScore: 92,
         flags: ['safe'],
         reason: 'Auto-approved by sentiment analysis',
         geminiCheck: false,
         moderatedAt: new Date(),
         factCheck
      };
   }

   if (label === 'NEUTRAL' && score > 0.6) {
      return {
         approved: true,
         sentiment: 'neutral',
         safetyScore: 75,
         flags: ['safe'],
         reason: 'Auto-approved by sentiment analysis',
         geminiCheck: false,
         moderatedAt: new Date(),
         factCheck
      };
   }

   if (label === 'NEGATIVE' && score > 0.4) {
      const geminiResult = await geminiSafetyCheck(text);
      return {
         approved: geminiResult.approved,
         sentiment: 'negative',
         safetyScore: geminiResult.safetyScore,
         flags: geminiResult.flags || [],
         reason: geminiResult.reason,
         suggestedEdit: geminiResult.suggestedEdit ?? null,
         geminiCheck: true,
         moderatedAt: new Date(),
         factCheck
      };
   }

   return {
      approved: true,
      sentiment: label.toLowerCase(),
      safetyScore: 70,
      flags: ['safe'],
      reason: 'Auto-approved by sentiment analysis',
      geminiCheck: false,
      moderatedAt: new Date(),
      factCheck
   };
};
