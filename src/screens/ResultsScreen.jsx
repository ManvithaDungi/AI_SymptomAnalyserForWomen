import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SymptomCard from '../components/SymptomCard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { analyzeSymptoms } from '../services/geminiService';
import { saveSymptomLog, getUserId } from '../services/firebaseService';

export default function ResultsScreen() {
  const location = useLocation();
  const { symptoms, additional } = location.state || { symptoms: [], additional: '' };
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const analysisResult = await analyzeSymptoms([...symptoms, additional]);
        setResult(analysisResult);
        setLoading(false);

        const userId = getUserId();
        if (userId) {
          await saveSymptomLog(userId, symptoms, analysisResult);
        }
      } catch (error) {
        console.error('Error analyzing symptoms:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getUrgencyColor = (urgency) => {
    if (urgency === 'Immediately') return 'bg-danger/10 border-danger/30 text-danger';
    if (urgency === 'Within a week') return 'bg-warning/10 border-warning/30 text-warning';
    return 'bg-[#B8D4BE]/20 border-[#B8D4BE]/40 text-[#4A7C59]';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-text-secondary text-lg font-medium animate-pulse">Analyzing symptoms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 pt-8 animate-fade-in">
      <div className="max-w-3xl mx-auto px-6">
        {/* Urgency Banner */}
        {result && result.see_doctor_urgency && (
          <div className={`border rounded-xl p-6 mb-8 flex items-start gap-4 ${getUrgencyColor(result.see_doctor_urgency)}`}>
            <span className="text-2xl mt-0.5">
              {result.see_doctor_urgency === 'Immediately' ? '🚨' : result.see_doctor_urgency === 'Within a week' ? '⚠️' : '✅'}
            </span>
            <div>
              <h3 className="font-bold text-lg mb-1">
                {result.see_doctor_urgency === 'Immediately'
                  ? 'Seek medical attention immediately'
                  : result.see_doctor_urgency === 'Within a week'
                    ? 'Consult a doctor within a week'
                    : 'Monitor your symptoms'}
              </h3>
              <p className="text-sm opacity-90">Based on your symptoms, we recommend this course of action.</p>
            </div>
          </div>
        )}

        {/* Possible Conditions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Possible Conditions</h2>
          <div className="grid gap-4">
            {result?.possible_conditions?.map((condition, idx) => (
              <SymptomCard key={idx} condition={condition} />
            ))}
          </div>
        </div>

        {/* Self Care Tips */}
        <div className="glass-card p-8 mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <span className="text-2xl">🧘‍♀️</span> Self Care Tips
          </h3>
          <ul className="space-y-4">
            {result?.self_care_tips?.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                <span className="text-accent bg-accent/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">✓</span>
                <span className="text-text-primary leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Local Foods */}
        <div className="glass-card p-8 mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <span className="text-2xl">🥗</span> Local Foods That May Help
          </h3>
          <div className="flex flex-wrap gap-3">
            {result?.local_foods?.map((food, idx) => (
              <span key={idx} className="bg-white border border-primary/10 text-text-primary px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {food}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="flex-1 bg-primary text-white py-4 rounded-full font-bold shadow-lg shadow-primary/25 hover:bg-[#5A4AB8] hover:translate-y-[-2px] transition-all">
            💾 Save to Journal
          </button>
          <button className="flex-1 bg-transparent border-2 border-primary text-primary py-4 rounded-full font-bold hover:bg-primary/5 transition-all">
            Find Nearby Doctors
          </button>
        </div>

        <DisclaimerBanner />
      </div>
    </div>
  );
}
