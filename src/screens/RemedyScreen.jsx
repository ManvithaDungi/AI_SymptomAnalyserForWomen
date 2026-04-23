import { useState } from 'react';
import { ChevronRight, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRemedies } from '../hooks/queries/useRemedies';
import { chatRemedyAssistant } from '../services/geminiService';
import { logger } from '../utils/logger';

export default function RemedyScreen() {
  const { t } = useTranslation();
  const categories = ['All', 'Herbal', 'Movement', 'Nutrition', 'Mindfulness'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Ask about hormones, nutrition, mental health, or remedies in your language. I can keep it simple and evidence-based.',
    },
  ]);

  const { data: remedies = [], isLoading: loading, error } = useRemedies('all');

  const filterRemedies = () => {
    if (activeCategory === 'All') {
      return remedies;
    }
    return remedies.filter(r => r.category === activeCategory);
  };

  const sendChatMessage = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const reply = await chatRemedyAssistant(message, { category: activeCategory });
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      logger.error('Remedy chat failed', err);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'I could not answer right now. Please try again in a moment.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const displayedRemedies = filterRemedies();

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        <header className="space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-serif italic">Remedies Library</h1>
              <p className="text-ivory/60 font-light">Evidence-based content on hormones, nutrition, mental health, and culturally familiar remedies.</p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setChatOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-copper/20 bg-copper/10 px-4 py-2 text-sm font-mono uppercase tracking-widest text-copper hover:bg-copper/20 transition-colors"
              >
                <MessageSquare size={16} />
                Chat
              </button>

              {chatOpen && (
                <div className="absolute right-0 z-20 mt-3 w-[min(92vw,420px)] overflow-hidden rounded-3xl border border-copper/20 bg-kurobeni shadow-2xl shadow-black/30">
                  <div className="flex items-center justify-between border-b border-ivory/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-serif text-ivory">Vernacular Health Chat</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-copper">Tamil · Hindi · Telugu · Kannada · Malayalam</p>
                    </div>
                    <button type="button" onClick={() => setChatOpen(false)} className="text-ivory/60 hover:text-ivory">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="max-h-[320px] space-y-3 overflow-y-auto px-4 py-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.role === 'user' ? 'bg-copper text-kurobeni' : 'bg-ivory/5 text-ivory border border-ivory/10'}`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-ivory/10 bg-ivory/5 px-3 py-2 text-sm text-ivory/70">
                          <Sparkles size={14} className="text-copper" />
                          Thinking...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-ivory/10 p-3">
                    <div className="flex items-end gap-2 rounded-2xl border border-ivory/10 bg-ivory/5 px-3 py-2">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        rows={2}
                        placeholder="Ask in Tamil, Hindi, Telugu, Kannada, or Malayalam..."
                        className="flex-1 resize-none bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/30"
                      />
                      <button
                        type="button"
                        onClick={sendChatMessage}
                        disabled={chatLoading || !chatInput.trim()}
                        className="rounded-full bg-copper p-2 text-kurobeni disabled:opacity-50"
                        aria-label="Send message"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
            <p className="text-rose">Failed to load remedies. Please try again.</p>
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
