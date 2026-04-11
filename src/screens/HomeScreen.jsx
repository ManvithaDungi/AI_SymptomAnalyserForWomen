import { useState } from 'react';
import { Heart, Play, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[40px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1920&auto=format&fit=crop" 
          alt="Peaceful Nature" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kurobeni via-kurobeni/20 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[1px] bg-copper" />
            <span className="font-mono text-xs uppercase tracking-[4px] text-copper">Luteal Phase · Day 22</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter">
            Embrace the <br />
            <span className="italic text-teal">Gentle Pause</span>
          </h1>
          <p className="text-ivory/70 max-w-xl font-light text-lg leading-relaxed">
            Your body is preparing for renewal. Today, prioritize soft light, warm infusions, and quiet contemplation.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="btn-primary">Daily Check-in</button>
            <button className="btn-outline">My Insights</button>
          </div>
        </div>
      </section>

      {/* Daily Rituals */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif italic">Daily Rituals</h2>
            <p className="text-ivory/40 font-light">Small acts of self-devotion for today.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Morning Dew Meditation', time: '10 MIN', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop' },
            { title: 'Golden Milk Elixir', time: '5 MIN', img: 'https://images.unsplash.com/photo-1594631252845-29fc4586c562?q=80&w=600&auto=format&fit=crop' },
            { title: 'Restorative Yin Yoga', time: '20 MIN', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop' }
          ].map((ritual, i) => (
            <div key={i} className="group cursor-pointer space-y-4">
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden">
                <img 
                  src={ritual.img} 
                  alt={ritual.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-kurobeni/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-6 right-6">
                  <div className="w-10 h-10 rounded-full bg-ivory/10 backdrop-blur-md border border-ivory/20 flex items-center justify-center text-ivory">
                    <Play size={16} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-start px-2">
                <h4 className="font-serif italic text-xl">{ritual.title}</h4>
                <span className="font-mono text-[10px] text-copper tracking-widest">{ritual.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Remedies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[400px] rounded-[40px] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" 
            alt="Herbal Wisdom" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blackberry/90 via-blackberry/20 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <span className="font-mono text-[10px] uppercase tracking-[4px] text-copper mb-2 block">Herbal Wisdom</span>
            <h3 className="text-3xl font-serif italic mb-4">The Power of Raspberry Leaf</h3>
            <p className="text-ivory/60 font-light mb-6">Discover how this ancient remedy supports uterine health and eases monthly transitions.</p>
            <button className="btn-outline px-6 py-2 text-sm">Read Article</button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-[40px] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop" 
            alt="Mindful Nutrition" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal/90 via-teal/20 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <span className="font-mono text-[10px] uppercase tracking-[4px] text-ivory mb-2 block">Mindful Nutrition</span>
            <h3 className="text-3xl font-serif italic mb-4">Cycle-Syncing Your Plate</h3>
            <p className="text-ivory/80 font-light mb-6">Learn which nutrients your body craves during the luteal phase for optimal balance.</p>
            <button className="bg-ivory text-teal font-serif italic px-6 py-2 rounded-full text-sm hover:bg-ivory/90 transition-all">Explore Recipes</button>
          </div>
        </div>
      </section>
    </div>
  );
}
