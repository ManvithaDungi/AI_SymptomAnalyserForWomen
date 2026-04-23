import { useState, useCallback } from 'react';

interface SymptomSelection {
  [key: string]: number; // severity 0-4
}

/**
 * useSymptomSelection - Manages symptom selection state
 * 
 * Handles selecting, deselecting, and tracking symptoms with severity levels.
 * 
 * @returns {Object} - {
 *   selectedSymptoms: SymptomSelection,
 *   handleSymptomChange: (name: string, severity: number) => void,
 *   clearSymptoms: () => void,
 *   symptomCount: number,
 *   hasSymptom: (name: string) => boolean
 * }
 * 
 * @example
 * const { selectedSymptoms, handleSymptomChange, symptomCount } = useSymptomSelection();
 * symptoms.forEach(s => (
 *   <button onClick={() => handleSymptomChange(s.name, 2)}>
 *     {s.name} {selectedSymptoms[s.name] ? '✓' : ''}
 *   </button>
 * ));
 */
export const useSymptomSelection = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomSelection>({});

  const handleSymptomChange = useCallback((symptomName: string, severity: number) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [symptomName]: prev[symptomName] === severity ? 0 : severity
    }));
  }, []);

  const clearSymptoms = useCallback(() => {
    setSelectedSymptoms({});
  }, []);

  const symptomCount = Object.values(selectedSymptoms).filter(s => s > 0).length;

  const hasSymptom = useCallback((name: string) => {
    return selectedSymptoms[name] > 0;
  }, [selectedSymptoms]);

  return {
    selectedSymptoms,
    handleSymptomChange,
    clearSymptoms,
    symptomCount,
    hasSymptom,
  };
};
