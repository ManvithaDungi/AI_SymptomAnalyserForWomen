import { Sun, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SahachariJournalScreen() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-5xl font-serif italic">Wellness Journal</h1>
        <p className="text-ivory/60 font-light">A safe space for your thoughts and feelings.</p>
      </header>

      <div className="glass-card p-8 space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-copper">April 11, 2026</span>
          <h3 className="text-2xl font-serif italic">How are you feeling today?</h3>
        </div>
        
        <textarea 
          placeholder="Start writing..."
          className="w-full h-64 bg-ivory/5 border border-ivory/10 rounded-2xl p-6 text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-copper/40 transition-colors font-light leading-relaxed resize-none"
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button className="p-3 bg-ivory/5 rounded-xl text-ivory/40 hover:text-copper transition-colors">
              <Sun size={20} />
            </button>
            <button className="p-3 bg-ivory/5 rounded-xl text-ivory/40 hover:text-rose transition-colors">
              <Heart size={20} />
            </button>
          </div>
          <button className="btn-primary">Save Entry</button>
        </div>
      </div>

      <section className="space-y-6">
        <h3 className="text-2xl font-serif italic">Past Entries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Follicular Phase Reflections', date: 'April 09, 2026', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop' },
            { title: 'New Moon Intentions', date: 'April 05, 2026', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop' }
          ].map((entry, i) => (
            <div key={i} className="glass-card p-4 flex gap-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={entry.img} 
                  alt={entry.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center space-y-1">
                <h4 className="font-serif italic text-lg leading-tight">{entry.title}</h4>
                <span className="text-xs text-ivory/40">{entry.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
