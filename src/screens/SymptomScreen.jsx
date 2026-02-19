// src/screens/SymptomScreen.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DisclaimerBanner from '../components/DisclaimerBanner';

const SYMPTOMS = [
  'Fatigue', 'Irregular Periods', 'Hair Loss', 'Weight Gain',
  'Bloating', 'Headache', 'Mood Swings', 'Cramps',
  'Nausea', 'Acne', 'Back Pain', 'Dizziness',
  'Heavy Bleeding', 'Breast Tenderness', 'Insomnia', 'Anxiety',
];

export default function SymptomScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [additional, setAdditional] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [langMode, setLangMode] = useState('en-IN'); // 'en-IN' or 'te-IN' or 'ta-IN'
  const recognitionRef = useRef(null);

  const toggleSymptom = (symptom) => {
    setSelected(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMode;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setAdditional(prev => (prev + ' ' + finalTranscript).trim());
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== 'aborted') alert(`Voice error: ${e.error}. Please try again.`);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAnalyze = () => {
    if (selected.length === 0 && additional.trim() === '') {
      alert('Please select at least one symptom or describe your condition.');
      return;
    }
    navigate('/results', { state: { symptoms: selected, additional } });
  };

  return (
    <div className="min-h-full pb-24 pt-8 animate-fade-in">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-text-primary mb-1 tracking-tight">
          How are you feeling?
        </h2>
        <p className="text-text-secondary mb-6 text-lg">
          Select symptoms you're experiencing today.
        </p>

        <DisclaimerBanner />

        {/* Symptom Chips */}
        <div className="glass-card p-6 mb-6 mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">
            Common Symptoms — tap to select
          </p>
          <div className="flex flex-wrap gap-3">
            {SYMPTOMS.map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selected.includes(symptom)
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.04]'
                  : 'bg-white text-text-secondary border-primary/20 hover:border-primary hover:text-primary'
                  }`}
              >
                {symptom}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <p className="text-xs text-primary font-semibold mt-4">
              ✓ {selected.length} symptom{selected.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Voice Input Language Toggle */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-text-primary uppercase tracking-wide">
              Describe in your words
            </label>
            <div className="flex gap-1 bg-primary/10 rounded-full p-1">
              {[
                { code: 'en-IN', label: 'EN' },
                { code: 'te-IN', label: 'TE' },
                { code: 'ta-IN', label: 'TA' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setLangMode(l.code)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${langMode === l.code
                    ? 'bg-primary text-white shadow'
                    : 'text-text-secondary hover:text-primary'
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={additional}
            onChange={e => setAdditional(e.target.value)}
            placeholder="Describe anything else you're experiencing... (voice input appends here)"
            className="w-full px-4 py-3 bg-white/60 border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:bg-white/90 transition-all resize-none text-text-primary placeholder:text-text-secondary/50 text-sm"
            rows="3"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Voice Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={startVoiceInput}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                ? 'bg-red-500 shadow-[0_0_0_10px_rgba(239,68,68,0.15)] animate-pulse'
                : 'bg-primary text-white hover:bg-primary/80 shadow-lg shadow-primary/30 hover:scale-105'
                }`}
            >
              <span className="text-xl">{isListening ? '⏹' : '🎤'}</span>
            </button>
            <span className="text-[10px] font-semibold text-text-secondary text-center leading-tight">
              {isListening ? 'Tap to stop' : `Voice (${langMode.split('-')[0].toUpperCase()})`}
            </span>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="flex-1 py-4 bg-primary text-white font-bold rounded-full text-lg shadow-lg shadow-primary/25 hover:bg-primary/80 hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.98] transition-all"
          >
            Analyze Symptoms →
          </button>
        </div>
      </div>
    </div>
  );
}