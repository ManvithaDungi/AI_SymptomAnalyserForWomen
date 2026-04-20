import { useState } from 'react';
import { Heart, Play, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-12 pb-24">
        {/* Hero Section */}
        <section className="relative h-80 sm:h-96 md:h-[500px] rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1920&auto=format&fit=crop" 
          alt="Peaceful Nature" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kurobeni via-kurobeni/20 to-transparent" />
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-12 h-px bg-copper" />
            <span className="font-mono text-xs uppercase tracking-[2px] sm:tracking-[4px] text-copper">Luteal Phase · Day 22</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tighter">
            Embrace the <br />
            <span className="italic text-teal">Gentle Pause</span>
          </h1>
          <p className="text-ivory/70 max-w-lg font-light text-base sm:text-lg leading-relaxed">
            Your body is preparing for renewal. Today, prioritize soft light, warm infusions, and quiet contemplation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
            <button className="btn-primary text-sm sm:text-base">Daily Check-in</button>
            <button className="btn-outline text-sm sm:text-base">My Insights</button>
          </div>
        </div>
        </section>

      {/* Daily Rituals */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif italic">Daily Rituals</h2>
            <p className="text-ivory/60 font-light text-sm sm:text-base">Small acts of self-devotion for today.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            { title: 'Morning Dew Meditation', time: '10 MIN', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop' },
            { title: 'Golden Milk Elixir', time: '5 MIN', img: 'https://images.unsplash.com/photo-1594631252845-29fc4586c562?q=80&w=600&auto=format&fit=crop' },
            { title: 'Restorative Yin Yoga', time: '20 MIN', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop' }
          ].map((ritual, i) => (
            <div key={i} className="group cursor-pointer space-y-3 sm:space-y-4">
              <div className="relative aspect-4/5 rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden">
                <img 
                  src={ritual.img} 
                  alt={ritual.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-kurobeni/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-ivory/10 backdrop-blur-md border border-ivory/20 flex items-center justify-center text-ivory">
                    <Play size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-start px-2 gap-2">
                <h4 className="font-serif italic text-sm sm:text-lg lg:text-xl leading-tight">{ritual.title}</h4>
                <span className="font-mono text-[8px] sm:text-[10px] text-copper tracking-widest flex-shrink-0">{ritual.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Remedies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" 
            alt="Herbal Wisdom" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-blackberry/90 via-blackberry/20 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 right-6 sm:right-8 lg:right-10">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[2px] sm:tracking-[4px] text-copper mb-2 block">Herbal Wisdom</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif italic mb-2 sm:mb-3 lg:mb-4">The Power of Raspberry Leaf</h3>
            <p className="text-ivory/60 font-light mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">Discover how this ancient remedy supports uterine health and eases monthly transitions.</p>
            <button className="btn-outline px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">Read Article</button>
          </div>
        </div>
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop" 
            alt="Mindful Nutrition" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-teal/90 via-teal/20 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 right-6 sm:right-8 lg:right-10">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[2px] sm:tracking-[4px] text-ivory mb-2 block">Mindful Nutrition</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif italic mb-2 sm:mb-3 lg:mb-4">Cycle-Syncing Your Plate</h3>
            <p className="text-ivory/80 font-light mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">Learn which nutrients your body craves during the luteal phase for optimal balance.</p>
            <button className="bg-ivory text-teal font-serif italic px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-ivory/90 transition-all">Explore Recipes</button>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
