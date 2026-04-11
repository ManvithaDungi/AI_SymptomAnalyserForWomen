/**
 * Cycle-aware AI prompt builder
 * Enhances Gemini prompts with cycle phase context for personalized analysis
 */

import { getPhaseInfo, getPhaseRecommendations } from './cycleUtils';

/**
 * Build a cycle-aware health analysis prompt for Gemini
 * @param {Array<string>} symptoms - Reported symptoms
 * @param {number} cycleDay - Current day in cycle
 * @param {number} cycleLength - Total cycle length
 * @param {Object} context - Additional context (mood, notes, etc.)
 * @returns {string} Enhanced prompt for Gemini
 */
export function buildCycleAwarePrompt(symptoms, cycleDay, cycleLength = 28, context = {}) {
  const phase = getPhaseInfo(cycleDay, cycleLength);
  const recommendations = getPhaseRecommendations(phase?.name);

  const symptomList = symptoms.join(', ');

  const prompt = `
**CYCLE CONTEXT**
The user is in the ${phase?.name} phase (Days ${phase?.range[0]}-${phase?.range[1]} of ${cycleLength}-day cycle).
Phase characteristics: ${phase?.description}
Expected mood shifts: ${recommendations.work}
Typical activities: ${recommendations.exercise}

**REPORTED SYMPTOMS**
${symptomList}

**YOUR TASK**
Provide personalized wellness recommendations that:
1. Acknowledge the current cycle phase and its natural symptoms
2. Distinguish between phase-typical symptoms and concerning ones
3. Suggest remedies/activities aligned with this phase's energy levels
4. Explain why these recommendations fit this cycle stage
5. Note any symptoms that warrant professional medical attention

**TONE**
- Empathetic and validating
- Evidence-based and practical
- Avoid clinical jargon; use accessible language
- Celebrate the wisdom of the body's natural rhythms

${context.notes ? `**ADDITIONAL NOTES**: ${context.notes}` : ''}
`;

  return prompt.trim();
}

/**
 * Attach cycle metadata to a symptom entry before saving
 * @param {Object} symptomData - Base symptom data
 * @param {number} cycleDay - Current cycle day
 * @param {number} cycleLength - Total cycle length
 * @returns {Object} Symptom data with cycle metadata
 */
export function enrichSymptomWithCycleData(symptomData, cycleDay, cycleLength = 28) {
  const phase = getPhaseInfo(cycleDay, cycleLength);

  return {
    ...symptomData,
    cycleDay,
    phaseName: phase?.name,
    phaseRange: phase?.range,
    cycleLength,
    cycleContext: {
      energy: phase?.energy,
      mood: phase?.mood,
    },
  };
}

/**
 * Generate cycle-aware analysis prompt for historical pattern detection
 * @param {Array<Object>} symptomHistory - Array of past symptom entries
 * @param {number} cycleLength - Total cycle length
 * @returns {string} Prompt for Gemini to identify patterns
 */
export function buildPatternAnalysisPrompt(symptomHistory, cycleLength = 28) {
  // Group symptoms by cycle day
  const cycleMap = {};
  for (let i = 1; i <= cycleLength; i++) {
    cycleMap[i] = [];
  }

  symptomHistory.forEach(entry => {
    if (entry.cycleDay && cycleMap[entry.cycleDay]) {
      cycleMap[entry.cycleDay].push({
        symptoms: entry.symptoms,
        severity: entry.severity,
        mood: entry.cycleContext?.mood || 'unknown',
      });
    }
  });

  const prompt = `
Analyze this user's cycle symptom patterns and identify recurring themes:

${Object.entries(cycleMap)
  .filter(([_, data]) => data.length > 0)
  .map(
    ([day, entries]) => `
Day ${day}: 
  - Symptoms logged: ${entries.map(e => e.symptoms.join(', ')).join(' | ')}
  - Severity: ${entries.map(e => e.severity).join(', ')}
  - Reported mood: ${entries.map(e => e.mood).join(', ')}
  - Frequency: ${entries.length} time(s) this month
`
  )
  .join('\n')}

For each clear pattern, provide:
1. Days when it occurs
2. Why this makes sense for that cycle phase
3. Practical strategies to manage it
4. When to seek professional help

Format as bullet points for easy scanning.
`;

  return prompt.trim();
}

/**
 * Generate a friendly cycle summary for display
 * @param {number} cycleDay - Current cycle day
 * @param {number} cycleLength - Total cycle length
 * @param {number} daysToNextPeriod - Days until next period
 * @returns {string} Human-readable cycle summary
 */
export function generateCycleSummary(cycleDay, cycleLength = 28, daysToNextPeriod) {
  const phase = getPhaseInfo(cycleDay, cycleLength);
  const percentThroughCycle = Math.round((cycleDay / cycleLength) * 100);

  return `
You're ${percentThroughCycle}% through your ${cycleLength}-day cycle.
Currently in the ${phase?.name} phase (${phase?.range[0]}-${phase?.range[1]}).
${daysToNextPeriod} days until your next period.
  `.trim();
}
