import { Plus, Heart, MessageSquare, Bookmark, Share2, Flag, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getForumPosts, getUserId, flagForumPost } from '../services/firebaseService';
import { logger } from '../utils/logger';

export default function ForumScreen() {
  const { t } = useTranslation();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggedPostId, setFlaggedPostId] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flagSubmitting, setFlagSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const forumPosts = await getForumPosts('all', 'recent');
      setPosts(forumPosts);
    } catch (err) {
      logger.error('Failed to fetch forum posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFlag = async () => {
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging.');
      return;
    }
    try {
      setFlagSubmitting(true);
      const userId = getUserId();
      await flagForumPost(flaggedPostId, userId, flagReason);
      alert('Thank you. The post has been flagged for review.');
      setShowFlagModal(false);
      setFlagReason('');
      setFlaggedPostId(null);
    } catch (err) {
      logger.error('Failed to flag post:', err);
      alert('Failed to flag post. Please try again.');
    } finally {
      setFlagSubmitting(false);
    }
  }

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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-copper/20 border-t-copper rounded-full animate-spin mx-auto mb-4" />
              <p className="text-ivory/60">Loading community posts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-6 border border-rose/30 bg-rose/5">
            <p className="text-rose">{error}</p>
            <button onClick={fetchPosts} className="mt-4 px-4 py-2 bg-rose/20 text-rose rounded-lg hover:bg-rose/30 transition-colors">
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-ivory/60">No posts yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {posts.map((post) => {
              const styles = getStatusStyles(post.status || 'approved');
              
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
                      {post.anonName?.[0] || post.author?.[0] || 'A'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif italic text-sm sm:text-lg truncate">{post.anonName || post.author}</h4>
                      <span className="text-xs text-ivory/60">{post.time || new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-4 flex-shrink-0">
                    <button className="text-ivory/60 hover:text-copper transition-colors"><Bookmark size={16} className="sm:w-5 sm:h-5" /></button>
                    <button 
                      onClick={() => {
                        setFlaggedPostId(post.id);
                        setShowFlagModal(true);
                      }}
                      className="text-ivory/60 hover:text-rose transition-colors"
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

                <div className="p-4 sm:p-6 pt-3 sm:pt-4 flex gap-4 sm:gap-6 border-t border-ivory/10">
                  <button className="flex items-center gap-2 text-ivory/60 hover:text-rose transition-colors text-sm sm:text-base">
                    <Heart size={16} className="sm:w-5 sm:h-5" /> <span>{post.upvotes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-ivory/60 hover:text-copper transition-colors text-sm sm:text-base">
                    <MessageSquare size={16} className="sm:w-5 sm:h-5" /> <span>{post.commentCount || 0}</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif text-rose">Report Post</h2>
              <button onClick={() => setShowFlagModal(false)} className="text-ivory/60 hover:text-ivory">
                <X size={24} />
              </button>
            </div>

            <p className="text-ivory/80 text-sm">
              Help us keep our community safe. Why are you reporting this?
            </p>

            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Describe why you're reporting this post..."
              className="w-full bg-blackberry/40 border border-copper/20 rounded-lg p-3 text-ivory placeholder-ivory/60 focus:outline-none focus:border-copper/60 resize-none h-24"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                disabled={flagSubmitting}
                className="flex-1 px-4 py-2 bg-ivory/10 text-ivory rounded-lg hover:bg-ivory/20 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFlag}
                disabled={flagSubmitting || !flagReason.trim()}
                className="flex-1 px-4 py-2 bg-rose/20 text-rose rounded-lg hover:bg-rose/30 transition-colors font-mono text-sm disabled:opacity-50"
              >
                {flagSubmitting ? 'Submitting...' : 'Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
