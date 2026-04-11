import { useState } from 'react';
import { Activity, Droplets, Heart, Moon, Plus, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SymptomScreen() {
  const { t } = useTranslation();
  const symptoms = [
    { name: 'Cramps', icon: Activity, severity: 2 },
    { name: 'Headache', icon: Activity, severity: 1 },
    { name: 'Bloating', icon: Droplets, severity: 3 },
    { name: 'Mood Swings', icon: Heart, severity: 2 },
    { name: 'Fatigue', icon: Moon, severity: 4 },
  ];

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-5xl font-serif italic">Symptom Tracker</h1>
        <p className="text-ivory/60 font-light">Document your journey to find patterns and peace.</p>
      </header>

      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif">Today's Log</h3>
          <button className="p-2 bg-copper/10 text-copper rounded-full hover:bg-copper/20 transition-colors">
            <Calendar size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {symptoms.map((symptom) => (
            <div key={symptom.name} className="flex items-center justify-between p-4 rounded-2xl bg-ivory/5 border border-ivory/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-copper/10 rounded-xl text-copper">
                  <symptom.icon size={20} />
                </div>
                <span className="font-serif text-lg">{symptom.name}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button 
                    key={level}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 ${
                      level <= symptom.severity 
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

        <button className="w-full mt-8 btn-primary flex items-center justify-center gap-2">
          <Plus size={20} /> Add Custom Symptom
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8">
          <h3 className="text-xl font-serif italic mb-4">Weekly Insight</h3>
          <p className="text-ivory/70 leading-relaxed">
            Your fatigue levels are 20% higher than last week. Consider increasing your iron intake and prioritizing rest before 10 PM.
          </p>
        </div>
        <div className="glass-card p-8">
          <h3 className="text-xl font-serif italic mb-4">AI Prediction</h3>
          <p className="text-ivory/70 leading-relaxed">
            Based on your history, you might experience mild headaches tomorrow. Stay hydrated and keep your lavender oil handy.
          </p>
        </div>
      </section>
    </div>
  );
}
