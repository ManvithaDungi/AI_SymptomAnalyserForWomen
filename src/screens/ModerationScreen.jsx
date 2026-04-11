import { Check, Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';

export default function ModerationScreen() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'User123',
      content: 'This post contains inappropriate content',
      flagCount: 3,
      hfScore: 0.87,
      geminiVerdict: 'Toxicity Risk: High',
      status: 'flagged'
    },
    {
      id: 2,
      author: 'User456',
      content: 'This post is waiting for review',
      flagCount: 1,
      hfScore: 0.32,
      geminiVerdict: 'Misinformation Risk: Medium',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      if (!auth.currentUser) {
        navigate('/');
        return;
      }

      const token = await auth.currentUser.getIdTokenResult();
      if (!token.claims.admin) {
        navigate('/home');
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/home');
    }
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  const handleApprove = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? {...p, status: 'approved'} : p));
  };

  const handleRemove = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? {...p, status: 'removed'} : p));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ivory/60">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kurobeni px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        <header>
          <h1 className="text-4xl sm:text-5xl font-serif italic text-copper">Moderation Queue</h1>
          <p className="text-sm uppercase font-mono tracking-widest text-copper mt-2">
            {filteredPosts.length} POSTS AWAITING REVIEW
          </p>
        </header>

        <div className="flex gap-3 flex-wrap">
          {['all', 'flagged', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-mono uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-copper/20 text-copper border border-copper/50'
                  : 'bg-ivory/5 text-ivory/60 border border-ivory/20 hover:border-copper/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="glass-card p-6 sm:p-8 space-y-6 border border-copper/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif">{post.author}</h3>
                  <p className="text-sm text-ivory/60 mt-1">Flagged by: {post.flagCount} users</p>
                </div>
                <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                  post.status === 'flagged' ? 'bg-rose/20 text-rose' : 'bg-mauve/20 text-mauve'
                }`}>
                  {post.status}
                </span>
              </div>

              <p className="text-ivory/80 leading-relaxed text-base">{post.content}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 border border-rose/30 rounded-lg">
                  <p className="text-xs text-ivory/60 font-mono uppercase mb-1">HuggingFace Score</p>
                  <p className={`text-lg font-mono font-bold ${
                    post.hfScore > 0.7 ? 'text-rose' : 'text-copper'
                  }`}>
                    Toxicity: {(post.hfScore * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="glass-card p-4 border border-copper/30 rounded-lg">
                  <p className="text-xs text-ivory/60 font-mono uppercase mb-1">Gemini Verdict</p>
                  <p className="text-sm text-copper">{post.geminiVerdict}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(post.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal/20 text-teal border border-teal/50 rounded-lg hover:bg-teal/30 transition-colors font-mono text-sm uppercase"
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => handleRemove(post.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose/20 text-rose border border-rose/50 rounded-lg hover:bg-rose/30 transition-colors font-mono text-sm uppercase"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="glass-card p-8 text-center space-y-2">
              <AlertCircle className="w-12 h-12 text-copper/40 mx-auto" />
              <p className="text-ivory/60">No posts to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
