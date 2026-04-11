import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SahachariRemediesScreen() {
  const { t } = useTranslation();
  const categories = ['All', 'Herbal', 'Movement', 'Nutrition', 'Mindfulness'];
  const [activeCategory, setActiveCategory] = useState('All');

  const remedies = [
    { title: 'Ginger & Turmeric Tea', category: 'Herbal', time: '10 min', image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c562?q=80&w=400&auto=format&fit=crop' },
    { title: 'Magnesium-Rich Smoothie', category: 'Nutrition', time: '5 min', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=400&auto=format&fit=crop' },
    { title: 'Lower Back Release', category: 'Movement', time: '15 min', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' },
    { title: 'Guided Breathwork', category: 'Mindfulness', time: '8 min', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop' },
    { title: 'Adaptogenic Ashwagandha', category: 'Herbal', time: '5 min', image: 'https://images.unsplash.com/photo-1611241893603-3c359704e0ee?q=80&w=400&auto=format&fit=crop' },
    { title: 'Pelvic Floor Relaxation', category: 'Movement', time: '12 min', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-5xl font-serif italic">Remedies Library</h1>
        <p className="text-ivory/60 font-light">Natural solutions for your unique rhythm.</p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-copper text-kurobeni' 
                : 'bg-blackberry/40 text-ivory/60 border border-copper/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remedies.map((remedy, i) => (
          <div 
            key={remedy.title}
            className="glass-card overflow-hidden group cursor-pointer"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={remedy.image} 
                alt={remedy.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-copper">{remedy.category}</span>
                <span className="text-ivory/40 text-xs">{remedy.time}</span>
              </div>
              <h3 className="text-xl font-serif italic">{remedy.title}</h3>
              <button className="text-copper font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
