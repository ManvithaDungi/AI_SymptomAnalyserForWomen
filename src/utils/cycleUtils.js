/**
 * Cycle Utilities - Functions for cycle tracking and phase calculation
 * Used throughout the app for consistent cycle data handling
 */

/**
 * Calculate current cycle day from cycle start date and cycle length
 * @param {Date} cycleStartDate - First day of cycle
 * @param {number} cycleLength - Length of cycle (default 28)
 * @returns {number} Current day in cycle (1 to cycleLength)
 */
export function calculateCycleDay(cycleStartDate, cycleLength = 28) {
  if (!cycleStartDate) return 1;
  
  const today = new Date();
  const startDate = new Date(cycleStartDate);
  
  // Reset time for clean date comparison
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  
  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const cycleDay = (daysElapsed % cycleLength) + 1;
  
  return Math.max(1, Math.min(cycleDay, cycleLength));
}

/**
 * Get cycle phase info for a given day
 * @param {number} cycleDay - Day in cycle (1-cycleLength)
 * @param {number} cycleLength - Total cycle length (default 28)
 * @returns {Object|null} Phase object with name, range, color, description
 */
export function getPhaseInfo(cycleDay, cycleLength = 28) {
  const phases = [
    {
      name: 'Menstrual',
      range: [1, 5],
      color: '#c0506a', // rose
      rgbaFill: 'rgba(192, 80, 106, 0.35)',
      description: 'Your body is shedding the uterine lining. Prioritize rest and self-care.',
      mood: 'Reflective',
      energy: 'Low',
      icon: '🩸',
    },
    {
      name: 'Follicular',
      range: [6, 13],
      color: '#c59c79', // copper
      rgbaFill: 'rgba(197, 156, 121, 0.25)',
      description: 'Energy and confidence are rising. Great time for new projects and social activities.',
      mood: 'Optimistic',
      energy: 'Rising',
      icon: '🌱',
    },
    {
      name: 'Ovulatory',
      range: [14, 16],
      color: '#4a8a7f', // teal
      rgbaFill: 'rgba(74, 138, 127, 0.35)',
      description: 'Peak confidence and social energy. You feel magnetic and expressive.',
      mood: 'Magnetic',
      energy: 'Peak',
      icon: '✨',
    },
    {
      name: 'Luteal',
      range: [17, cycleLength],
      color: '#957083', // mauve
      rgbaFill: 'rgba(149, 112, 131, 0.3)',
      description: 'Introspection time. Honor your need for rest, boundaries, and deep work.',
      mood: 'Introspective',
      energy: 'Declining',
      icon: '🌙',
    },
  ];

  return phases.find(p => cycleDay >= p.range[0] && cycleDay <= p.range[1]) || null;
}

/**
 * Get all phases for a given cycle length
 * @param {number} cycleLength - Total cycle length (default 28)
 * @returns {Array} Array of all phase objects
 */
export function getAllPhases(cycleLength = 28) {
  return [
    {
      name: 'Menstrual',
      range: [1, 5],
      color: '#c0506a',
      rgbaFill: 'rgba(192, 80, 106, 0.35)',
      description: 'Your body is shedding the uterine lining.',
      mood: 'Reflective',
      energy: 'Low',
      icon: '🩸',
    },
    {
      name: 'Follicular',
      range: [6, 13],
      color: '#c59c79',
      rgbaFill: 'rgba(197, 156, 121, 0.25)',
      description: 'Energy and confidence are rising.',
      mood: 'Optimistic',
      energy: 'Rising',
      icon: '🌱',
    },
    {
      name: 'Ovulatory',
      range: [14, 16],
      color: '#4a8a7f',
      rgbaFill: 'rgba(74, 138, 127, 0.35)',
      description: 'Peak confidence and social energy.',
      mood: 'Magnetic',
      energy: 'Peak',
      icon: '✨',
    },
    {
      name: 'Luteal',
      range: [17, cycleLength],
      color: '#957083',
      rgbaFill: 'rgba(149, 112, 131, 0.3)',
      description: 'Introspection time. Honor your need for rest.',
      mood: 'Introspective',
      energy: 'Declining',
      icon: '🌙',
    },
  ];
}

/**
 * Format cycle day string, e.g. "Day 14 of 28"
 * @param {number} cycleDay - Current cycle day
 * @param {number} cycleLength - Total cycle length
 * @returns {string} Formatted string
 */
export function formatCycleDay(cycleDay, cycleLength = 28) {
  return `Day ${cycleDay} of ${cycleLength}`;
}

/**
 * Calculate next period start date
 * @param {Date} cycleStartDate - Current cycle start
 * @param {number} cycleLength - Cycle length in days
 * @returns {Date} Next cycle start date
 */
export function getNextPeriodDate(cycleStartDate, cycleLength = 28) {
  const nextPeriod = new Date(cycleStartDate);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  return nextPeriod;
}

/**
 * Days until next period
 * @param {Date} cycleStartDate - Current cycle start
 * @param {number} cycleLength - Cycle length in days
 * @returns {number} Days until next period starts
 */
export function daysUntilNextPeriod(cycleStartDate, cycleLength = 28) {
  const cycleDay = calculateCycleDay(cycleStartDate, cycleLength);
  return cycleLength - cycleDay + 1;
}

/**
 * Get cycle phase recommendations (for AI context)
 * @param {string} phaseName - Name of the cycle phase
 * @returns {Object} Recommendations object
 */
export function getPhaseRecommendations(phaseName) {
  const recommendations = {
    Menstrual: {
      exercise: 'Gentle: yoga, walking, stretching',
      nutrition: 'Iron-rich foods, magnesium, fluids',
      work: 'Focus on planning, reflection rather than high-intensity tasks',
      social: 'Small gatherings preferred over large events',
    },
    Follicular: {
      exercise: 'Increase intensity: running, HIIT, strength training',
      nutrition: 'Protein, complex carbs, fresh vegetables',
      work: 'Ideal for starting new projects, brainstorming',
      social: 'High social energy, great for networking',
    },
    Ovulatory: {
      exercise: 'Peak performance: intense workouts',
      nutrition: 'Balanced meals, light and fresh foods',
      work: 'Presentations, negotiations, important meetings',
      social: 'Maximum social confidence and charisma',
    },
    Luteal: {
      exercise: 'Moderate: strength training, yoga, cycling',
      nutrition: 'Complex carbs, protein, nuts, seeds',
      work: 'Deep work, analysis, administrative tasks',
      social: 'Smaller groups, one-on-one time preferred',
    },
  };

  return recommendations[phaseName] || {};
}

/**
 * Validate cycle data
 * @param {Object} cycleData - Cycle data object
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
export function validateCycleData(cycleData) {
  const errors = [];

  if (!cycleData.cycleStartDate) {
    errors.push('Cycle start date is required');
  } else if (!(cycleData.cycleStartDate instanceof Date)) {
    errors.push('Cycle start date must be a Date object');
  }

  if (!cycleData.cycleLength || cycleData.cycleLength < 21 || cycleData.cycleLength > 35) {
    errors.push('Cycle length must be between 21 and 35 days');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
