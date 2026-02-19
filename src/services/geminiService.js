// TODO: Replace mock data with real Gemini API calls when ready
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeSymptoms = async (symptoms) => {
  // TODO: Implement real Gemini API call here
  // const response = await fetch(...);

  // Mock response for now
  return {
    possible_conditions: [
      {
        name: "PCOS",
        probability: "High",
        description: "Polycystic Ovary Syndrome is a hormonal disorder common among women of reproductive age. It may cause irregular periods, weight gain, and hormonal imbalances."
      },
      {
        name: "Anemia",
        probability: "Medium",
        description: "A condition where you lack enough healthy red blood cells to carry adequate oxygen to body tissues, often causing fatigue and dizziness."
      }
    ],
    self_care_tips: [
      "Sleep 8 hours daily",
      "Eat iron-rich foods",
      "Regular light exercise",
      "Stay hydrated"
    ],
    local_foods: [
      "Ragi",
      "Drumstick leaves",
      "Kollu"
    ],
    see_doctor_urgency: "Within a week",
    disclaimer: "This is not a medical diagnosis. Please consult a healthcare professional."
  };
};

export const validateRemedy = async (remedy) => {
  // TODO: Implement real Gemini API call here
  // const response = await fetch(...);

  // Mock response for now
  return {
    verdict: "Partially Safe",
    explanation: "Jeera water may help with digestion and bloating, which can be beneficial during menstrual discomfort. However, it should not replace prescribed medication.",
    scientific_backing: "Partially Supported",
    tip: "Safe to try but don't replace prescribed medication. Consult your doctor if symptoms persist."
  };
};

export const detectPattern = async (logs) => {
  // TODO: Implement real Gemini API call here
  // const response = await fetch(...);

  // Mock response for now
  return "Based on your logs, you may want to track your symptoms more regularly with a calendar to identify patterns.";
};
