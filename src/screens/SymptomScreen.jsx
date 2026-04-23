import { useState, useEffect } from 'react';
import { Activity, Droplets, Heart, Moon, Plus, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../services/firebaseService';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import CyclePhaseWheel from '../components/CyclePhaseWheel';
import { calculateCycleDay, getPhaseInfo } from '../utils/cycleUtils';

const formatDateKey = (date) => {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatLongDate = (date) =>
  date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const formatMonthLabel = (date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

const buildMonthGrid = (date) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    return cellDate;
  });
};

const getCycleDayForDate = (date, cycleStartDate, cycleLength = 28) => {
  if (!date || !cycleStartDate) return 1;

  const target = new Date(date);
  const start = new Date(cycleStartDate);
  target.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const daysElapsed = Math.floor((target - start) / (1000 * 60 * 60 * 24));
  return ((daysElapsed % cycleLength) + cycleLength) % cycleLength + 1;
};

const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);

  return candidate > today;
};

export default function SymptomScreen() {
  const { t } = useTranslation();
  const [cycleData, setCycleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [tempCycleData, setTempCycleData] = useState({ cycleStartDate: '', cycleLength: 28 });
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [symptomEntries, setSymptomEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    loadCycleData();
  }, []);

  useEffect(() => {
    const selectedKey = formatDateKey(selectedDate);
    setSelectedSymptoms(symptomEntries[selectedKey]?.symptoms || {});
  }, [selectedDate, symptomEntries]);

  const loadCycleData = async () => {
    try {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const existingSymptoms = userDoc.exists() ? (userDoc.data().symptoms || {}) : {};
      
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

      setSymptomEntries(existingSymptoms);
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
      if (isFutureDate(selectedDate)) {
        alert('You cannot log symptoms for a future date.');
        return;
      }
      
      const selectedDateKey = formatDateKey(selectedDate);
      const selectedDay = getCycleDayForDate(selectedDate, cycleData.cycleStartDate, cycleData.cycleLength);
      const phase = getPhaseInfo(selectedDay, cycleData.cycleLength);
      const symptomEntry = {
        date: selectedDate.toISOString(),
        cycleDay: selectedDay,
        symptoms: selectedSymptoms,
        period: symptomEntries[selectedDateKey]?.period || false,
        phaseName: phase?.name || null,
        phaseRange: phase ? { start: phase.range[0], end: phase.range[1] } : null,
        timestamp: new Date().getTime(),
      };

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        [`symptoms.${selectedDateKey}`]: symptomEntry
      });

      setSymptomEntries(prev => ({
        ...prev,
        [selectedDateKey]: symptomEntry,
      }));

      setSelectedSymptoms({});
      alert('Symptoms saved!');
    } catch (error) {
      console.error('Error saving symptoms:', error);
    }
  };

  const handleTogglePeriodDay = async () => {
    try {
      if (!auth.currentUser || !cycleData) return;
      if (isFutureDate(selectedDate)) {
        alert('You cannot mark a future date as period day.');
        return;
      }

      const selectedDateKey = formatDateKey(selectedDate);
      const selectedDay = getCycleDayForDate(selectedDate, cycleData.cycleStartDate, cycleData.cycleLength);
      const phase = getPhaseInfo(selectedDay, cycleData.cycleLength);
      const existingEntry = symptomEntries[selectedDateKey] || {
        date: selectedDate.toISOString(),
        cycleDay: selectedDay,
        symptoms: selectedSymptoms,
        timestamp: new Date().getTime(),
      };

      const updatedEntry = {
        ...existingEntry,
        period: !existingEntry.period,
        cycleDay: selectedDay,
        phaseName: phase?.name || null,
        phaseRange: phase ? { start: phase.range[0], end: phase.range[1] } : null,
      };

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        [`symptoms.${selectedDateKey}`]: updatedEntry,
      });

      setSymptomEntries(prev => ({
        ...prev,
        [selectedDateKey]: updatedEntry,
      }));
    } catch (error) {
      console.error('Error updating period day:', error);
    }
  };

  const navigateMonth = (offset) => {
    setCalendarMonth(prev => {
      const nextMonth = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      if (nextMonth > currentMonth) {
        return currentMonth;
      }

      return nextMonth;
    });
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const selectedEntry = symptomEntries[selectedDateKey] || null;
  const selectedCycleDay = cycleData
    ? getCycleDayForDate(selectedDate, cycleData.cycleStartDate, cycleData.cycleLength)
    : 1;
  const selectedPhase = cycleData ? getPhaseInfo(selectedCycleDay, cycleData.cycleLength) : null;
  const currentCycleDay = cycleData ? calculateCycleDay(cycleData.cycleStartDate, cycleData.cycleLength) : 14;
  const monthCells = buildMonthGrid(calendarMonth);
  const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        {cycleData && <CyclePhaseWheel cycleData={cycleData} selectedDay={currentCycleDay} />}

        {/* Calendar */}
        <div className="glass-card p-4 sm:p-8 space-y-6 border border-copper/20 rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-copper">Cycle Calendar</h2>
              <p className="text-ivory/60 text-sm">Tap a day to view symptoms and period logs.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-full bg-copper/10 text-copper hover:bg-copper/20 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-serif text-lg sm:text-xl text-ivory">{formatMonthLabel(calendarMonth)}</span>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-full bg-copper/10 text-copper hover:bg-copper/20 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-ivory/50">
            {weekLabels.map(day => <span key={day}>{day}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {monthCells.map((day) => {
              const dayKey = formatDateKey(day);
              const entry = symptomEntries[dayKey];
              const inMonth = day.getMonth() === calendarMonth.getMonth();
              const isSelected = dayKey === selectedDateKey;
              const isToday = dayKey === formatDateKey(new Date());
              const isFuture = isFutureDate(day);
              const hasSymptoms = !!entry && Object.values(entry.symptoms || {}).some(value => value > 0);
              const isPeriod = !!entry?.period;

              return (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => !isFuture && setSelectedDate(new Date(day))}
                  disabled={isFuture}
                  className={`relative min-h-[72px] sm:min-h-[88px] rounded-xl border p-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-copper text-kurobeni border-copper shadow-lg shadow-copper/10'
                      : inMonth
                        ? 'bg-ivory/5 text-ivory border-ivory/10 hover:border-copper/40 hover:bg-ivory/10'
                        : 'bg-black/10 text-ivory/30 border-ivory/5'
                  } ${isToday && !isSelected ? 'ring-1 ring-copper/60' : ''} ${isFuture ? 'opacity-40 cursor-not-allowed hover:bg-ivory/5 hover:border-ivory/10' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm sm:text-base font-serif">{day.getDate()}</span>
                    {isPeriod && <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest ${isSelected ? 'text-kurobeni/80' : 'text-rose'}`}>P</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    {hasSymptoms && <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-kurobeni' : 'bg-copper'}`} />}
                    {isPeriod && <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-kurobeni/80' : 'bg-rose'}`} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <div className="glass-card p-4 sm:p-5 border border-ivory/10 rounded-2xl">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif text-ivory">{formatLongDate(selectedDate)}</h3>
                  <p className="text-ivory/60 text-sm mt-1">
                    Cycle day {selectedCycleDay}
                    {selectedPhase ? ` · ${selectedPhase.name} phase` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePeriodDay}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-mono uppercase tracking-widest transition-colors ${
                    selectedEntry?.period
                      ? 'bg-rose text-kurobeni'
                      : 'bg-rose/10 text-rose hover:bg-rose/20'
                  }`}
                >
                  {selectedEntry?.period ? 'Period day' : 'Mark period day'}
                </button>
              </div>

              {selectedEntry ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-copper font-mono mb-2">Symptoms logged</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedEntry.symptoms || {}).filter(([, severity]) => severity > 0).length > 0 ? (
                        Object.entries(selectedEntry.symptoms || {})
                          .filter(([, severity]) => severity > 0)
                          .map(([name, severity]) => (
                            <span key={name} className="inline-flex items-center gap-2 rounded-full border border-copper/20 bg-copper/10 px-3 py-1 text-xs text-ivory">
                              <span className="font-medium">{name}</span>
                              <span className="text-copper">{severity}/5</span>
                            </span>
                          ))
                      ) : (
                        <p className="text-ivory/50 text-sm">No symptoms saved for this day yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="rounded-full border border-copper/20 bg-copper/5 px-3 py-1 text-copper">
                      {selectedEntry.period ? 'Period marked' : 'Period not marked'}
                    </div>
                    <div className="rounded-full border border-ivory/10 bg-ivory/5 px-3 py-1 text-ivory/70">
                      Logged {selectedEntry.timestamp ? new Date(selectedEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-ivory/60 text-sm leading-relaxed">
                  No logs for this date yet. Select a symptom and save it to start tracking patterns.
                </p>
              )}
            </div>

            <div className="glass-card p-4 sm:p-5 border border-ivory/10 rounded-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-copper font-mono">Legend</p>
              <div className="flex items-center gap-3 text-sm text-ivory/70">
                <span className="h-3 w-3 rounded-full bg-copper" />
                <span>Symptoms logged</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ivory/70">
                <span className="h-3 w-3 rounded-full bg-rose" />
                <span>Period day</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ivory/70">
                <span className="h-3 w-3 rounded-full ring-1 ring-copper/60" />
                <span>Today</span>
              </div>
              <p className="text-ivory/50 text-xs leading-relaxed pt-2">
                This calendar follows your actual cycle data and keeps each day’s symptom and period markers tied to the date you select.
              </p>
            </div>
          </div>
        </div>

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

        <div className="glass-card p-4 sm:p-8 border border-copper/20 rounded-2xl">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif">Log Symptoms</h3>
              <p className="text-ivory/60 text-sm">Saving for {formatLongDate(selectedDate)}</p>
            </div>
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
