import { Sun, Heart, Download, FileText, Download as FileJson } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseService';
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function JournalScreen() {
  const { t } = useTranslation();
  const [streakData, setStreakData] = useState({ current: 12, best: 45 });
  const [patterns, setPatterns] = useState([
    { text: "You feel anxious on days 18-22", icon: "🌙", borderColor: "mauve" },
    { text: "Energy peaks around day 10", icon: "☀️", borderColor: "teal" },
    { text: "Cramps logged 4 times this month", icon: "💔", borderColor: "rose" }
  ]);
  const [moodData, setMoodData] = useState([3, 3, 2, 2, 4, 4, 3, 2, 3, 3, 4, 4, 5, 4, 3, 2, 1, 2, 2, 3, 4, 4, 5, 5, 4, 3, 2, 1]);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = async () => {
    try {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data().streakData) {
        setStreakData(userDoc.data().streakData);
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const handleExportJSON = async () => {
    try {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      const exportData = {
        user: {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          exportDate: new Date().toISOString(),
        },
        cycleData: userDoc.data()?.cycleData,
        symptoms: userDoc.data()?.symptoms,
        journalEntries: userDoc.data()?.journalEntries,
        patterns: userDoc.data()?.patterns,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sahachari-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting JSON:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      const doc_pdf = new jsPDF();
      doc_pdf.setFont('Courier');
      doc_pdf.setTextColor(197, 156, 121); // copper
      doc_pdf.setFontSize(24);
      doc_pdf.text('Sahachari Health Report', 20, 20);
      
      doc_pdf.setTextColor(245, 240, 235); // ivory
      doc_pdf.setFontSize(10);
      doc_pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
      
      doc_pdf.setFillColor(40, 24, 34); // kurobeni
      doc_pdf.rect(0, 0, 210, 297, 'F');
      
      doc_pdf.setTextColor(197, 156, 121);
      doc_pdf.setFontSize(14);
      doc_pdf.text('Symptom History', 20, 50);
      
      doc_pdf.setTextColor(245, 240, 235);
      doc_pdf.setFontSize(10);
      const symptoms = userDoc.data()?.symptoms || {};
      Object.entries(symptoms).slice(0, 5).forEach(([date, data], index) => {
        doc_pdf.text(`${date}: ${Object.keys(data.symptoms || {}).join(', ')}`, 20, 60 + (index * 10));
      });

      const filename = `sahachari-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc_pdf.save(filename);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-24">
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-serif italic">Wellness Journal</h1>
            <p className="text-ivory/60 font-light">Track your journey and discover patterns.</p>
          </div>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-copper/10 text-copper rounded-lg hover:bg-copper/20 transition-colors font-mono text-sm"
          >
            <Download size={18} /> Export
          </button>
        </header>

        {/* Streak Hero Card */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-mono tracking-widest text-copper mb-2">Current Streak</p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-serif text-copper">{streakData.current}</span>
                <span className="text-lg font-mono text-ivory/60">days</span>
              </div>
              <p className="text-sm text-ivory/60 mt-2">🔥 Best: {streakData.best} days</p>
            </div>

            {/* 7-day sparkline */}
            <div className="flex items-end gap-2 h-20">
              {[3, 5, 7, 6, 8, 10, 12].map((height, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-sm transition-all ${
                    i === 6 ? 'bg-copper animate-pulse' : 'bg-copper/60'
                  }`}
                  style={{ height: `${(height / 12) * 100}%`, minHeight: '4px' }}
                />
              ))}
            </div>
          </div>

          {/* Milestone chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: '7 Day Streak', unlocked: true },
              { label: '30 Days', unlocked: true },
              { label: '3 Months', unlocked: false }
            ].map((milestone, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${
                  milestone.unlocked
                    ? 'bg-copper/20 border border-copper/50 text-copper'
                    : 'bg-ivory/5 border border-ivory/20 text-ivory/40'
                }`}
              >
                {milestone.unlocked ? '✓' : '🔒'} {milestone.label}
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Insights */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-serif italic text-copper mb-2">Your Patterns</h2>
            <p className="text-xs uppercase font-mono tracking-widest text-ivory/50">Last 30 Days</p>
          </div>

          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-full glass-card border flex items-center gap-3 ${
                  pattern.borderColor === 'mauve'
                    ? 'border-mauve/50'
                    : pattern.borderColor === 'teal'
                    ? 'border-teal/50'
                    : 'border-rose/50'
                }`}
              >
                <span className="text-xl">{pattern.icon}</span>
                <span className="text-sm text-ivory/80">{pattern.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Timeline Chart */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-serif italic text-copper">Monthly Mood Timeline</h2>
          
          <svg width="100%" height="150" viewBox="0 0 900 150" className="w-full">
            {/* Phase background bands */}
            <rect x="0" y="0" width="200" height="150" fill="rgba(192, 80, 106, 0.1)" />
            <rect x="200" y="0" width="280" height="150" fill="rgba(197, 156, 121, 0.1)" />
            <rect x="480" y="0" width="120" height="150" fill="rgba(74, 138, 127, 0.1)" />
            <rect x="600" y="0" width="300" height="150" fill="rgba(149, 112, 131, 0.1)" />

            {/* Y-axis */}
            <line x1="40" y1="10" x2="40" y2="130" stroke="rgba(197, 156, 121, 0.3)" strokeWidth="1" />

            {/* Mood line */}
            <polyline
              points={moodData.map((val, i) => `${50 + i * 30},${130 - (val / 5) * 100}`).join(' ')}
              fill="none"
              stroke="#c59c79"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Area fill */}
            <polygon
              points={`40,130 ${moodData.map((val, i) => `${50 + i * 30},${130 - (val / 5) * 100}`).join(' ')} 890,130`}
              fill="url(#gradient)"
              opacity="0.3"
            />

            {/* Data points */}
            {moodData.map((val, i) => (
              <circle
                key={i}
                cx={50 + i * 30}
                cy={130 - (val / 5) * 100}
                r="4"
                fill="#c59c79"
              />
            ))}

            {/* X-axis labels */}
            {[1, 7, 14, 21, 28].map((day, i) => (
              <text
                key={i}
                x={50 + (day - 1) * 30}
                y="145"
                textAnchor="middle"
                fontSize="10"
                fill="rgba(197, 156, 121, 0.6)"
              >
                {day}
              </text>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c59c79" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#c59c79" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="glass-card p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-copper">{new Date().toLocaleDateString()}</span>
            <h3 className="text-lg sm:text-2xl font-serif italic">How are you feeling today?</h3>
          </div>
          
          <textarea 
            placeholder="Start writing..."
            className="w-full h-40 sm:h-64 bg-ivory/5 border border-ivory/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-copper/40 transition-colors font-light leading-relaxed resize-none text-sm sm:text-base"
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-2 sm:gap-4">
              <button className="p-2 sm:p-3 bg-ivory/5 rounded-lg sm:rounded-xl text-ivory/40 hover:text-copper transition-colors">
                <Sun size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button className="p-2 sm:p-3 bg-ivory/5 rounded-lg sm:rounded-xl text-ivory/40 hover:text-rose transition-colors">
                <Heart size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <button className="btn-primary text-sm sm:text-base">Save Entry</button>
          </div>
        </div>

        <section className="space-y-4 sm:space-y-6">
          <h3 className="text-2xl sm:text-3xl font-serif italic">Past Entries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { title: 'Follicular Phase Reflections', date: 'April 09, 2026', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop' },
              { title: 'New Moon Intentions', date: 'April 05, 2026', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop' }
            ].map((entry, i) => (
              <div key={i} className="glass-card p-3 sm:p-4 flex gap-3 sm:gap-4 group cursor-pointer">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={entry.img} 
                    alt={entry.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-1">
                  <h4 className="font-serif italic text-sm sm:text-lg leading-tight">{entry.title}</h4>
                  <span className="text-xs text-ivory/40">{entry.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 sm:p-8 max-w-md w-full rounded-2xl space-y-6">
              <h2 className="text-2xl font-serif text-copper">Export Your Data</h2>

              <div className="space-y-3">
                <button
                  onClick={handleExportJSON}
                  className="w-full glass-card p-4 rounded-lg border border-copper/30 hover:bg-copper/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="w-6 h-6 text-copper" />
                    <div>
                      <p className="font-mono text-sm text-copper uppercase">JSON Export</p>
                      <p className="text-xs text-ivory/60">Full data archive · machine readable</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="w-full glass-card p-4 rounded-lg border border-mauve/30 hover:bg-mauve/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-mauve" />
                    <div>
                      <p className="font-mono text-sm text-mauve uppercase">PDF Report</p>
                      <p className="text-xs text-ivory/60">Health report · printable</p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="w-full px-4 py-2 bg-ivory/10 text-ivory rounded-lg hover:bg-ivory/20 transition-colors font-mono text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
