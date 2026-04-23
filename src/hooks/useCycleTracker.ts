import { useState, useCallback, useMemo } from 'react';
import { getCyclePhase } from '../utils/cycleUtils';

interface CycleData {
  cycleStartDate: Date;
  cycleLength: number;
}

/**
 * useCycleTracker - Manages menstrual cycle data and predictions
 * 
 * Handles cycle date, cycle length, and provides phase predictions.
 * 
 * @param {CycleData | null} initialData - Initial cycle data from Firestore
 * @returns {Object} - {
 *   cycleData: CycleData | null,
 *   setCycleData: (data: CycleData) => void,
 *   predictedNextDate: Date | null,
 *   cyclePhase: string,
 *   cycleDay: number
 * }
 * 
 * @example
 * const { cycleData, setCycleData, cyclePhase } = useCycleTracker(initialData);
 */
export const useCycleTracker = (initialData: CycleData | null = null) => {
  const [cycleData, setCycleData] = useState<CycleData | null>(initialData);

  const cycleDay = useMemo(() => {
    if (!cycleData) return 0;
    const now = new Date();
    const diffMs = now.getTime() - cycleData.cycleStartDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return (diffDays % cycleData.cycleLength) + 1;
  }, [cycleData]);

  const cyclePhase = useMemo(() => {
    if (!cycleData) return 'unknown';
    return getCyclePhase(cycleDay, cycleData.cycleLength);
  }, [cycleDay, cycleData]);

  const predictedNextDate = useMemo(() => {
    if (!cycleData) return null;
    const nextDate = new Date(cycleData.cycleStartDate);
    nextDate.setDate(nextDate.getDate() + cycleData.cycleLength);
    return nextDate;
  }, [cycleData]);

  const updateCycleData = useCallback((data: CycleData) => {
    setCycleData(data);
  }, []);

  return {
    cycleData,
    setCycleData: updateCycleData,
    predictedNextDate,
    cyclePhase,
    cycleDay,
  };
};
