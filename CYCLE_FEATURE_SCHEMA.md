# Cycle Phase Feature - Firestore Schema

This document outlines the Firestore schema additions for the Cycle Phase Wheel and cycle-aware AI features.

## Users Collection

### cycleData Subcollection

Store one document per user containing their cycle configuration:

```
users/{uid}/profile/cycleData
{
  cycleStartDate: timestamp,      // First day of most recent cycle
  cycleLength: number,            // 21-35, typically 28
  lastPeriodDate: timestamp | null,
  isTracking: boolean,            // User has opted into cycle tracking
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Symptoms Collection (Update)

When a user logs symptoms, attach cycle context:

```
users/{uid}/symptoms/{symptomId}
{
  // Existing fields
  timestamp: timestamp,
  symptoms: [string],           // ["cramps", "headache", ...]
  severity: number,              // 1-5 scale for each
  notes: string,
  
  // NEW: Cycle context (calculated on submission)
  cycleDay: number,              // 1-28 (or cycleLength)
  phaseName: string,             // "Menstrual" | "Follicular" | "Ovulatory" | "Luteal"
  phaseRange: {
    start: number,
    end: number
  }
}
```

### Cycle Day Calculation Function

Add to `src/utils/cycleUtils.js`:

```javascript
/**
 * Calculate current cycle day from cycle start date and cycle length
 * @param {Date} cycleStartDate - First day of cycle
 * @param {number} cycleLength - Length of cycle (default 28)
 * @returns {number} Current day in cycle (1-28)
 */
export function calculateCycleDay(cycleStartDate, cycleLength = 28) {
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
 * @param {number} cycleDay - Day in cycle (1-28)
 * @param {number} cycleLength - Total cycle length
 * @returns {Object} Phase name, range, and color
 */
export function getPhaseInfo(cycleDay, cycleLength = 28) {
  const phases = [
    {
      name: 'Menstrual',
      range: [1, 5],
      color: '#c0506a',
      description: 'Your body is shedding the uterine lining.',
    },
    {
      name: 'Follicular',
      range: [6, 13],
      color: '#c59c79',
      description: 'Energy and confidence are rising.',
    },
    {
      name: 'Ovulatory',
      range: [14, 16],
      color: '#4a8a7f',
      description: 'Peak confidence and social energy.',
    },
    {
      name: 'Luteal',
      range: [17, cycleLength],
      color: '#957083',
      description: 'Introspection time. Honor your need for rest.',
    },
  ];
  
  return phases.find(p => cycleDay >= p.range[0] && cycleDay <= p.range[1]);
}
```

## Patterns Subcollection (New)

Store monthly pattern insights (generated from aggregated symptom data):

```
users/{uid}/patterns/{monthYear}
{
  // e.g., monthYear = "2024-04"
  month: string,
  year: number,
  cycleLength: number,
  
  insights: [
    {
      type: "mood" | "energy" | "symptom",
      description: string,      // "Anxious on days 18-22"
      days: [number],           // [18, 19, 20, 21, 22]
      frequency: number,        // 0-1 (how often recurring)
      severity: number,         // avg severity when it occurs
      icon: string             // 🌙, ✨, 🩸
    }
  ],
  
  generatedAt: timestamp,
  generatedBy: string          // "aggregation" | "gemini-ai"
}
```

## Updated Symbol Submission Flow

When user logs symptoms (in SymptomScreen or gemini service):

1. **Calculate cycle context**:
   ```javascript
   import { calculateCycleDay, getPhaseInfo } from '../utils/cycleUtils';
   
   const cycleDay = calculateCycleDay(userCycleData.cycleStartDate);
   const phase = getPhaseInfo(cycleDay, userCycleData.cycleLength);
   ```

2. **Attach to symptom entry**:
   ```javascript
   const symptomEntry = {
     // ... existing fields
     cycleDay,
     phaseName: phase.name,
     phaseRange: {
       start: phase.range[0],
       end: phase.range[1]
     }
   };
   ```

3. **Pass to Gemini for AI analysis**:
   Include phase context in prompt, e.g.:
   ```
   "The user is in the LUTEAL phase (days 17-28) when they typically experience introspection.
    Their reported symptoms: [headache, mood swings, fatigue].
    Provide recommendations tailored to this cycle phase."
   ```

## Firestore Rules Updates

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      match /profile/cycleData {
        allow read, write: if request.auth.uid == uid;
      }
      
      match /symptoms/{symptomId} {
        allow read, write: if request.auth.uid == uid;
        // Validate cycleDay is present (auto-calculated)
      }
      
      match /patterns/{month} {
        allow read: if request.auth.uid == uid;
        allow write: if request.auth.uid == uid || 
                       request.auth.token.admin == true;
      }
    }
  }
}
```

## Migration Notes

For existing users migrating to cycle-aware tracking:

1. Prompt on first login: "When did your last period start?" (optional onboarding step)
2. Assume standard 28-day cycle if not provided
3. Allow retroactive cycle date updates in Settings
4. Recalculate historical symptoms' `cycleDay` if cycle data changes

## Testing Checklist

- [ ] Calculate correct cycle day for today
- [ ] Calculate correct phase for each day (1-28)
- [ ] SVG wheel renders all 4 phase arcs
- [ ] Mini calendar highlights current/past days
- [ ] Phase info card updates on day selection
- [ ] Symptoms include cycleDay and phaseName on submit
- [ ] Gemini prompt receives cycle context
- [ ] Pattern aggregation query groups by cycleDay
- [ ] Pattern insights generate monthly
