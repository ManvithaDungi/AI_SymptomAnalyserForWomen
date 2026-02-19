import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function SymptomScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [additional, setAdditional] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  const symptoms = [
    'Fatigue',
    'Irregular Periods',
    'Hair Loss',
    'Weight Gain',
    'Bloating',
    'Headache',
    'Mood Swings',
    'Cramps',
    'Nausea',
    'Acne',
    'Back Pain',
    'Dizziness'
  ];

  const toggleSymptom = (symptom) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'te-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      setAdditional(prev => prev + ' ' + transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Error in speech recognition');
    };

    recognition.start();
  };

  const handleAnalyze = () => {
    if (selected.length === 0 && additional.trim() === '') {
      alert('Please select symptoms or describe your condition');
      return;
    }

    navigate('/results', {
      state: { symptoms: selected, additional }
    });
  };

  return (
    <div className="min-h-full pb-20 pt-8 animate-fade-in">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-text-primary mb-2 tracking-tight">How are you feeling?</h2>
        <p className="text-text-secondary mb-8 text-lg">Select symptoms you're experiencing today.</p>

        <DisclaimerBanner />

        {/* Symptom Chips */}
        <div className="glass-card p-8 mb-8 mt-8">
          <div className="flex flex-wrap gap-3">
            {symptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${selected.includes(symptom)
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-white text-text-secondary border-primary/20 hover:border-primary hover:text-primary'
                  }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="glass-card p-6 mb-8">
          <label className="block text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
            Additional Details (Optional)
          </label>
          <textarea
            ref={textareaRef}
            value={additional}
            onChange={(e) => setAdditional(e.target.value)}
            placeholder="Describe anything else you're experiencing..."
            className="w-full px-4 py-3 bg-white/50 border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:bg-white/80 transition-all resize-none text-text-primary placeholder:text-text-secondary/50"
            rows="4"
          />
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-6">
          {/* Voice Input Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                ? 'bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.2)] animate-pulse'
                : 'bg-primary text-white hover:bg-[#5A4AB8] shadow-lg shadow-primary/30 hover:scale-105'
                }`}
            >
              <span className="text-2xl">{isListening ? '🎙️' : '🎤'}</span>
            </button>
            <span className="text-xs font-medium text-text-secondary mt-2">
              {isListening ? 'Listening...' : 'Telugu Voice'}
            </span>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="flex-1 py-4 bg-primary text-white font-bold rounded-full text-lg shadow-lg shadow-primary/25 hover:bg-[#5A4AB8] hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.98] transition-all"
          >
            Analyze Symptoms
          </button>
        </div>
      </div>
    </div>
  );
}
