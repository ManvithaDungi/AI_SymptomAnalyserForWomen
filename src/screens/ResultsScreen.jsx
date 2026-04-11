// src/screens/ResultsScreen.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { analyzeSymptoms } from '../services/geminiService';
import { saveSymptomLog, getUserId } from '../services/firebaseService';
import { logger } from '../utils/logger';

function ConditionCard({ condition }) {
  const probConfig = {
    High: { color: 'rose', bgColor: 'rose/10', borderColor: 'rose/30', width: 'w-4/5' },
    Medium: { color: 'copper', bgColor: 'copper/10', borderColor: 'copper/30', width: 'w-1/2' },
    Low: { color: 'teal', bgColor: 'teal/10', borderColor: 'teal/30', width: 'w-1/4' },
  };

  const config = probConfig[condition.probability] || probConfig.Low;

  return (
    <div className={`glass-card p-6 border border-${config.borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-serif italic text-ivory">{condition.name}</h3>
        <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded border border-${config.borderColor} text-${config.color}`}>
          {condition.probability}
        </span>
      </div>
      <div className="w-full bg-blackberry/40 rounded-full h-2 mb-4">
        <div className={`h-2 rounded-full transition-all duration-1000 bg-${config.color} ${config.width}`} />
      </div>
      <p className="text-ivory/70 text-sm leading-relaxed">{condition.description}</p>
    </div>
  );
}

export default function ResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { symptoms = [], additional = '' } = location.state || {};

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!symptoms.length && !additional.trim()) {
      navigate('/symptoms');
      return;
    }
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const analysisResult = await analyzeSymptoms(symptoms, additional);
      setResult(analysisResult);

      const userId = getUserId();
      if (userId) {
        await saveSymptomLog(userId, symptoms, analysisResult);
        setSaved(true);
      }
    } catch (err) {
      logger.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze symptoms. Please check your Gemini API key in .env');
    } finally {
      setLoading(false);
    }
  };

  const urgencyConfig = {
    'Immediately': {
      icon: AlertCircle,
      color: 'rose',
      title: 'Seek medical attention immediately',
      desc: 'Your symptoms may need urgent care. Please see a doctor today.',
    },
    'Within a week': {
      icon: Clock,
      color: 'copper',
      title: 'Consult a doctor within a week',
      desc: 'Your symptoms warrant a medical consultation soon.',
    },
    'Monitor symptoms': {
      icon: CheckCircle,
      color: 'teal',
      title: 'Monitor your symptoms',
      desc: 'Continue self-care and track any changes.',
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kurobeni">
        <div className="text-center px-6">
          <div className="w-16 h-16 border-4 border-copper/20 border-t-copper rounded-full animate-spin mx-auto mb-6" />
          <p className="text-ivory text-xl font-serif italic mb-2">Analyzing with AI...</p>
          <p className="text-ivory/70 text-sm">Gemini is processing your symptoms</p>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-copper rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-kurobeni">
        <div className="text-center max-w-md glass-card p-8">
          <AlertCircle className="w-12 h-12 text-rose mx-auto mb-4" />
          <h2 className="text-xl font-serif italic text-ivory mb-2">Analysis Failed</h2>
          <p className="text-ivory/70 text-sm mb-2">{error}</p>
          <p className="text-ivory/50 text-xs mb-6 bg-blackberry/40 p-3 rounded border border-copper/20 font-mono">
            Make sure VITE_GEMINI_API_KEY is set in your .env file
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchResults}
              className="px-6 py-2 btn-primary text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/symptoms')}
              className="px-6 py-2 btn-outline text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const urgency = result?.see_doctor_urgency;
  const uc = urgencyConfig[urgency] || urgencyConfig['Monitor symptoms'];
  const UrgencyIcon = uc.icon;

  return (
    <div className="min-h-screen pb-24 pt-8 bg-kurobeni">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-5xl font-serif italic text-ivory mb-2">Analysis Results</h1>
            <p className="text-ivory/70 text-sm">
              Based on: {symptoms.slice(0, 3).join(', ')}{symptoms.length > 3 ? ` +${symptoms.length - 3} more` : ''}
            </p>
          </div>
          {saved && (
            <span className="text-xs glass-card px-3 py-2 text-teal border border-teal/30">
              ✓ Saved
            </span>
          )}
        </div>

        {/* Urgency Banner */}
        {urgency && (
          <div className={`glass-card border border-${uc.color}/30 p-6 mb-8 flex items-start gap-4`}>
            <UrgencyIcon className={`w-6 h-6 text-${uc.color} flex-shrink-0 mt-1`} />
            <div>
              <h3 className={`font-serif italic text-lg mb-1 text-${uc.color}`}>{uc.title}</h3>
              <p className={`text-sm text-ivory/70`}>{uc.desc}</p>
            </div>
          </div>
        )}

        {/* Conditions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-ivory mb-4">Possible Conditions</h3>
          <div className="grid gap-4">
            {result?.possible_conditions?.map((condition, idx) => (
              <ConditionCard key={idx} condition={condition} />
            ))}
          </div>
        </div>

        {/* Self Care Tips */}
        {result?.self_care_tips?.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold text-ivory mb-4 flex items-center gap-2">
              <span>🧘‍♀️</span> Self-Care Tips
            </h3>
            <ul className="space-y-3">
              {result.self_care_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-text-secondary text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Local Foods */}
        {result?.local_foods?.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold text-ivory mb-4 flex items-center gap-2">
              <span>🥗</span> Helpful Local Foods
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.local_foods.map((food, idx) => (
                <span
                  key={idx}
                  className="bg-accent-teal/10 border border-accent-teal/20 text-accent-teal px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={() => navigate('/journal')}
            className="flex-1 btn btn-primary"
          >
            📔 Save to Journal
          </button>
          <button
            onClick={() => navigate('/symptoms')}
            className="flex-1 btn btn-secondary"
          >
            ← Analyze Again
          </button>
        </div>

        <DisclaimerBanner />
      </div>
    </div>
  );
}