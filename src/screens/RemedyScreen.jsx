import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRemedies } from '../services/firebaseService';
import { logger } from '../utils/logger';

export default function RemedyScreen() {
  const { t } = useTranslation();
  const categories = ['All', 'Herbal', 'Movement', 'Nutrition', 'Mindfulness'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRemedies();
  }, []);

  useEffect(() => {
    filterRemedies();
  }, [activeCategory, remedies]);

  const fetchRemedies = async () => {
    try {
      setLoading(true);
      setError('');
      const allRemedies = await getRemedies('all');
      setRemedies(allRemedies);
    } catch (err) {
      logger.error('Failed to fetch remedies:', err);
      setError('Failed to load remedies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterRemedies = () => {
    if (activeCategory === 'All') {
      return remedies;
    }
    return remedies.filter(r => r.category === activeCategory);
  };

  const displayedRemedies = filterRemedies();

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        <header className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-serif italic">Remedies Library</h1>
          <p className="text-ivory/60 font-light">Natural solutions for your unique rhythm.</p>
        </header>

        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full font-mono text-[8px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-copper text-kurobeni' 
                : 'bg-blackberry/40 text-ivory/60 border border-copper/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-copper/20 border-t-copper rounded-full animate-spin mx-auto mb-4" />
              <p className="text-ivory/60">Loading remedies...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-6 border border-rose/30 bg-rose/5">
            <p className="text-rose">{error}</p>
            <button onClick={fetchRemedies} className="mt-4 px-4 py-2 bg-rose/20 text-rose rounded-lg hover:bg-rose/30 transition-colors">
              Try Again
            </button>
          </div>
        ) : displayedRemedies.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-ivory/60">No remedies in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedRemedies.map((remedy) => (
              <div 
                key={remedy.id}
                className="glass-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={remedy.imageUrl || remedy.image || 'https://images.unsplash.com/photo-1594631252845-29fc4586c562?q=80&w=400&auto=format&fit=crop'} 
                    alt={remedy.name || remedy.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-copper truncate">{remedy.category}</span>
                    <span className="text-ivory/40 text-xs flex-shrink-0">{remedy.duration || remedy.time || '10 min'}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-serif italic line-clamp-2">{remedy.name || remedy.title}</h3>
                  <p className="text-ivory/60 text-sm line-clamp-2">{remedy.description || 'Natural remedy for wellness'}</p>
                  <button className="text-copper font-mono text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
