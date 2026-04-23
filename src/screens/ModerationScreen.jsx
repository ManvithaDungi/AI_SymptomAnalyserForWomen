import { Check, Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebaseService';
import { useFlaggedPosts } from '../hooks/queries/useFlaggedPosts';
import { useResolveFlaggedPost } from '../hooks/mutations/useResolveFlaggedPost';
import { useNavigate } from 'react-router-dom';

export default function ModerationScreen() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState('all');

  // Use React Query hooks for flagged posts
  const { data: posts = [], isLoading: loading } = useFlaggedPosts(filter);
  const resolvePost = useResolveFlaggedPost();

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

  const handleApprove = async (flagId) => {
    try {
      await resolvePost.mutateAsync({ flagId, resolution: 'approved' });
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleRemove = async (flagId) => {
    try {
      await resolvePost.mutateAsync({ flagId, resolution: 'removed' });
    } catch (error) {
      console.error('Error removing post:', error);
    }
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
            {posts.length} POSTS AWAITING REVIEW
          </p>
        </header>

        <div className="flex gap-3 flex-wrap">
          {['all', 'pending', 'approved', 'removed'].map(f => (
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

        {loading ? (
          <div className="glass-card p-8 text-center">
            <p className="text-ivory/60">Loading flagged posts...</p>
          </div>
        ) : (
        <div className="space-y-6">
          {posts.map(flagRecord => (
            <div key={flagRecord.id} className="glass-card p-6 sm:p-8 space-y-6 border border-copper/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif">{flagRecord.post?.author || 'Anonymous'}</h3>
                  <p className="text-sm text-ivory/60 mt-1">Flagged for: {flagRecord.reason}</p>
                  <p className="text-xs text-ivory/60 mt-1">Flag ID: {flagRecord.id}</p>
                </div>
                <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                  flagRecord.resolved ? 'bg-teal/20 text-teal' : 'bg-rose/20 text-rose'
                }`}>
                  {flagRecord.resolved ? flagRecord.resolution || 'Resolved' : 'Pending'}
                </span>
              </div>

              <p className="text-ivory/80 leading-relaxed text-base">{flagRecord.post?.content || 'Post content not available'}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 border border-copper/30 rounded-lg">
                  <p className="text-xs text-ivory/60 font-mono uppercase mb-1">Flagged At</p>
                  <p className="text-sm text-copper">
                    {flagRecord.timestamp ? new Date(flagRecord.timestamp.toDate()).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="glass-card p-4 border border-copper/30 rounded-lg">
                  <p className="text-xs text-ivory/60 font-mono uppercase mb-1">Resolution</p>
                  <p className="text-sm text-copper">{flagRecord.resolution || 'Pending Review'}</p>
                </div>
              </div>

              {!flagRecord.resolved && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(flagRecord.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal/20 text-teal border border-teal/50 rounded-lg hover:bg-teal/30 transition-colors font-mono text-sm uppercase"
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => handleRemove(flagRecord.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose/20 text-rose border border-rose/50 rounded-lg hover:bg-rose/30 transition-colors font-mono text-sm uppercase"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
              )}
            </div>
          ))}

          {posts.length === 0 && (
            <div className="glass-card p-8 text-center space-y-2">
              <AlertCircle className="w-12 h-12 text-copper/40 mx-auto" />
              <p className="text-ivory/60">No posts to review</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
