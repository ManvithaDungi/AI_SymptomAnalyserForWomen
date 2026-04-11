import { useState, useEffect } from 'react';
import { Activity, Droplets, Heart, Moon, Plus, Calendar, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../services/firebaseService';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import CyclePhaseWheel from '../components/CyclePhaseWheel';
import { calculateCycleDay } from '../utils/cycleUtils';

export default function SymptomScreen() {
  const { t } = useTranslation();
  const [cycleData, setCycleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [tempCycleData, setTempCycleData] = useState({ cycleStartDate: '', cycleLength: 28 });
  const [selectedSymptoms, setSelectedSymptoms] = useState({});

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    try {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().cycleData) {
        const data = userDoc.data().cycleData;
        setCycleData({
          cycleStartDate: new Date(data.cycleStartDate),
          cycleLength: data.cycleLength || 28,
        });
      } else {
        // Initialize default cycle data
        const defaultDate = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
        await setDoc(userRef, {
          cycleData: {
            cycleStartDate: defaultDate.toISOString(),
            cycleLength: 28,
          }
        }, { merge: true });
        setCycleData({
          cycleStartDate: defaultDate,
          cycleLength: 28,
        });
      }
    } catch (error) {
      console.error('Error loading cycle data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCycleData = async () => {
    try {
      if (!auth.currentUser || !tempCycleData.cycleStartDate) return;
      
      const startDate = new Date(tempCycleData.cycleStartDate);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      await updateDoc(userRef, {
        cycleData: {
          cycleStartDate: startDate.toISOString(),
          cycleLength: parseInt(tempCycleData.cycleLength),
        }
      });
      
      setCycleData({
        cycleStartDate: startDate,
        cycleLength: parseInt(tempCycleData.cycleLength),
      });
      setShowCycleModal(false);
    } catch (error) {
      console.error('Error saving cycle data:', error);
    }
  };

  const handleSymptomChange = (symptomName, severity) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [symptomName]: prev[symptomName] === severity ? 0 : severity
    }));
  };

  const handleSaveSymptoms = async () => {
    try {
      if (!auth.currentUser || !cycleData) return;
      
      const currentDay = calculateCycleDay(cycleData.cycleStartDate, cycleData.cycleLength);
      const symptomEntry = {
        date: new Date().toISOString(),
        cycleDay: currentDay,
        symptoms: selectedSymptoms,
        timestamp: new Date().getTime(),
      };

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        [`symptoms.${new Date().toISOString().split('T')[0]}`]: symptomEntry
      });

      setSelectedSymptoms({});
      alert('Symptoms saved!');
    } catch (error) {
      console.error('Error saving symptoms:', error);
    }
  };

  const symptoms = [
    { name: 'Cramps', icon: Activity, severity: 2 },
    { name: 'Headache', icon: Activity, severity: 1 },
    { name: 'Bloating', icon: Droplets, severity: 3 },
    { name: 'Mood Swings', icon: Heart, severity: 2 },
    { name: 'Fatigue', icon: Moon, severity: 4 },
  ];

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-24">
        <header className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-serif italic">Symptom Tracker</h1>
          <p className="text-ivory/60 font-light">Document your journey to find patterns and peace.</p>
        </header>

        {/* Cycle Phase Wheel */}
        {cycleData && <CyclePhaseWheel cycleData={cycleData} />}

        {/* Cycle Settings Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => {
              if (cycleData) {
                setTempCycleData({
                  cycleStartDate: cycleData.cycleStartDate.toISOString().split('T')[0],
                  cycleLength: cycleData.cycleLength,
                });
              }
              setShowCycleModal(true);
            }}
            className="px-4 py-2 text-sm bg-copper/10 text-copper rounded-lg hover:bg-copper/20 transition-colors font-mono"
          >
            Edit Cycle
          </button>
        </div>

        {/* Cycle Modal */}
        {showCycleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 sm:p-8 max-w-md w-full rounded-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-copper">Edit Your Cycle</h2>
                <button onClick={() => setShowCycleModal(false)} className="text-ivory/60 hover:text-ivory">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono uppercase tracking-widest text-copper mb-2">
                    Last Period Start Date
                  </label>
                  <input
                    type="date"
                    value={tempCycleData.cycleStartDate}
                    onChange={(e) => setTempCycleData(prev => ({
                      ...prev,
                      cycleStartDate: e.target.value
                    }))}
                    className="w-full px-4 py-2 bg-ivory/5 border border-ivory/20 rounded-lg text-ivory focus:outline-none focus:border-copper"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase tracking-widest text-copper mb-2">
                    Cycle Length: {tempCycleData.cycleLength} days
                  </label>
                  <input
                    type="range"
                    min="21"
                    max="35"
                    value={tempCycleData.cycleLength}
                    onChange={(e) => setTempCycleData(prev => ({
                      ...prev,
                      cycleLength: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveCycleData}
                className="w-full btn-primary py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="glass-card p-4 sm:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-serif">Today's Log</h3>
            <button className="p-2 bg-copper/10 text-copper rounded-full hover:bg-copper/20 transition-colors">
              <Calendar size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {symptoms.map((symptom) => (
              <div key={symptom.name} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-ivory/5 border border-ivory/10">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="p-2 bg-copper/10 rounded-lg sm:rounded-xl text-copper flex-shrink-0">
                    <symptom.icon size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-serif text-sm sm:text-lg truncate">{symptom.name}</span>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button 
                      key={level}
                      onClick={() => handleSymptomChange(symptom.name, level)}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border text-xs transition-all duration-300 ${
                      selectedSymptoms[symptom.name] === level 
                        ? 'bg-copper border-copper text-kurobeni' 
                        : 'border-ivory/20 text-ivory/40 hover:border-copper/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSaveSymptoms} className="w-full mt-6 sm:mt-8 btn-primary flex items-center justify-center gap-2 text-sm sm:text-base">
            <Plus size={18} /> Log Symptoms
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif italic mb-4">Weekly Insight</h3>
            <p className="text-ivory/70 text-sm sm:text-base leading-relaxed">
              Your fatigue levels are 20% higher than last week. Consider increasing your iron intake and prioritizing rest before 10 PM.
            </p>
          </div>
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif italic mb-4">AI Prediction</h3>
            <p className="text-ivory/70 text-sm sm:text-base leading-relaxed">
              Based on your history, you might experience mild headaches tomorrow. Stay hydrated and keep your lavender oil handy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
