import { Plus, Heart, MessageSquare, Bookmark, Share2, Flag, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function ForumScreen() {
  const { t } = useTranslation();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggedPostId, setFlaggedPostId] = useState(null);
  const [posts, setPosts] = useState([
    { 
      id: 1,
      author: 'Elena R.', 
      time: '2h ago', 
      content: 'Has anyone tried red raspberry leaf tea for cramps? Thinking of starting it this cycle.', 
      likes: 24, 
      comments: 8,
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 2,
      author: 'Sarah M.', 
      time: '5h ago', 
      content: 'Finally found a yoga routine that actually helps with my PCOS symptoms. Sharing the link below!', 
      likes: 56, 
      comments: 12,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 3,
      author: 'Maya K.', 
      time: '1d ago', 
      content: 'The luteal phase fatigue is hitting hard today. Sending love to everyone in the same boat. 🤍', 
      likes: 89, 
      comments: 34,
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop'
    },
  ]);

  const getStatusStyles = (status) => {
    switch(status) {
      case 'pending':
        return {
          border: 'border-mauve',
          bg: 'bg-mauve/5',
          blurred: true,
          chipBg: 'rgba(149, 112, 131, 0.2)',
          chipBorder: 'border-mauve',
          chipText: 'text-mauve'
        };
      case 'flagged':
        return {
          border: 'border-rose',
          bg: 'bg-rose/5',
          blurred: true,
          chipBg: 'rgba(192, 80, 106, 0.15)',
          chipBorder: 'border-rose',
          chipText: 'text-rose'
        };
      default:
        return {
          border: 'border-copper',
          bg: 'bg-black',
          blurred: false,
          chipBg: '',
          chipBorder: '',
          chipText: ''
        };
    }
  };

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-24">
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-serif italic">Community</h1>
            <p className="text-ivory/60 font-light">You are not alone in this journey.</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm sm:text-base">
            <Plus size={20} /> New Post
          </button>
        </header>

        <div className="space-y-6 sm:space-y-8">
          {posts.map((post) => {
            const styles = getStatusStyles(post.status);
            
            if (post.status === 'removed') {
              return (
                <div key={post.id} className="glass-card p-4 sm:p-6 rounded-2xl">
                  <p className="text-sm text-ivory/60 font-mono italic">Post removed</p>
                </div>
              );
            }

            return (
            <div key={post.id} className={`glass-card overflow-hidden space-y-4 border ${styles.border} ${styles.bg}`}>
              {post.status !== 'approved' && (
                <div className="bg-gradient-to-r from-transparent via-copper/10 to-transparent px-4 sm:px-6 py-2 flex items-center gap-2">
                  <AlertCircle size={14} className={post.status === 'pending' ? 'text-mauve' : 'text-rose'} />
                  <span className={`text-xs font-mono uppercase tracking-widest ${post.status === 'pending' ? 'text-mauve' : 'text-rose'}`}>
                    {post.status === 'pending' ? 'Under Review' : 'Flagged'}
                  </span>
                </div>
              )}

              <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-meadow/20 border border-meadow/40 flex items-center justify-center text-meadow font-serif italic flex-shrink-0">
                    {post.author[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif italic text-sm sm:text-lg truncate">{post.author}</h4>
                    <span className="text-xs text-ivory/40">{post.time}</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-4 flex-shrink-0">
                  <button className="text-ivory/40 hover:text-copper transition-colors"><Bookmark size={16} className="sm:w-5 sm:h-5" /></button>
                  <button 
                    onClick={() => {
                      setFlaggedPostId(post.id);
                      setShowFlagModal(true);
                    }}
                    className="text-ivory/40 hover:text-rose transition-colors"
                  >
                    <Flag size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              
              <div className={`px-4 sm:px-6 space-y-4 ${post.status !== 'approved' ? 'filter blur-sm' : ''}`}>
                <p className="text-ivory/80 leading-relaxed text-base sm:text-lg">
                  {post.content}
                </p>
              </div>

              {post.status !== 'approved' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className={`text-sm font-mono uppercase tracking-widest ${post.status === 'pending' ? 'text-mauve' : 'text-rose'}`}>
                      Content under review
                    </p>
                  </div>
                </div>
              )}

              <div className={`h-40 sm:h-64 w-full overflow-hidden px-4 sm:px-6 ${post.status !== 'approved' ? 'filter blur-sm' : ''}`}>
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 sm:p-6 pt-3 sm:pt-4 flex gap-4 sm:gap-6 border-t border-ivory/10">
                <button className="flex items-center gap-2 text-ivory/60 hover:text-rose transition-colors text-sm sm:text-base">
                  <Heart size={16} className="sm:w-5 sm:h-5" /> <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-ivory/60 hover:text-copper transition-colors text-sm sm:text-base">
                  <MessageSquare size={16} className="sm:w-5 sm:h-5" /> <span>{post.comments}</span>
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full rounded-2xl space-y-6">
            <h2 className="text-2xl font-serif text-rose">Report This Post?</h2>
            <p className="text-ivory/80 text-sm">
              Help us keep our community safe by reporting content that violates our guidelines.
            </p>

            <div className="space-y-3">
              {['Inappropriate content', 'Spam', 'Misinformation', 'Harassment', 'Other'].map((reason) => (
                <label key={reason} className="flex items-center gap-3 p-3 rounded-lg hover:bg-rose/5 cursor-pointer border border-ivory/10 hover:border-rose/30 transition-all">
                  <input type="radio" name="reason" value={reason} className="w-4 h-4 accent-rose" />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFlagModal(false)}
                className="flex-1 px-4 py-2 bg-ivory/10 text-ivory rounded-lg hover:bg-ivory/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPosts(prev => prev.map(p => p.id === flaggedPostId ? {...p, status: 'flagged'} : p));
                  setShowFlagModal(false);
                }}
                className="flex-1 px-4 py-2 bg-rose/20 text-rose rounded-lg hover:bg-rose/30 transition-colors font-mono text-sm"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
