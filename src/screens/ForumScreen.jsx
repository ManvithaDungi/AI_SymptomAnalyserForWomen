import { useState, useEffect } from 'react';
import ForumPostCard from '../components/ForumPostCard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { getForumPosts, saveForumPost, getUserId } from '../services/firebaseService';

export default function ForumScreen() {
  const [posts, setPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [newTopic, setNewTopic] = useState('PCOS');
  const [loading, setLoading] = useState(true);

  const topics = ['All', 'PCOS', 'Anemia', 'Menstrual Health', 'Remedies'];

  useEffect(() => {
    fetchPosts();
  }, [selectedTopic]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getForumPosts(selectedTopic);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) {
      alert('Please write something');
      return;
    }

    try {
      const userId = getUserId();
      await saveForumPost(userId, newPost, newTopic);
      setNewPost('');
      setShowComposer(false);
      fetchPosts();
    } catch (error) {
      console.error('Error posting:', error);
      alert('Error posting. Please try again.');
    }
  };

  return (
    <div className="min-h-full pb-20 pt-8 animate-fade-in relative">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-text-primary mb-2 tracking-tight">Community Support</h2>
          <p className="text-text-secondary text-lg">Connect anonymously with other women.</p>
        </div>

        <DisclaimerBanner />

        {/* Topic Filter Tabs */}
        <div className="flex overflow-x-auto gap-3 mb-8 pb-2 no-scrollbar">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 border ${selectedTopic === topic
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/50 text-text-secondary border-primary/10 hover:border-primary/40 hover:bg-white'
                }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="mb-24">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary animate-pulse">Loading conversations...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <span className="text-4xl mb-4 block">💬</span>
              <p className="text-text-primary font-bold text-lg mb-2">No posts yet</p>
              <p className="text-text-secondary">Be the first to share your experience!</p>
            </div>
          ) : (
            posts.map(post => (
              <ForumPostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Post Composer Modal */}
        {showComposer && (
          <div className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#F8F7FF]/95 backdrop-blur-xl w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in border border-white/50 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-text-primary">New Post</h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-danger/10 text-text-secondary hover:text-danger transition-colors"
                >
                  ✕
                </button>
              </div>

              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your experience or ask a question..."
                className="w-full px-5 py-4 bg-white border border-primary/10 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none mb-6 text-text-primary placeholder:text-text-secondary/50 min-h-[160px]"
              />

              <div className="flex gap-4 items-center">
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="px-4 py-3 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-primary text-text-primary font-medium flex-1 cursor-pointer appearance-none"
                >
                  {topics.slice(1).map(topic => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handlePostSubmit}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-[#5A4AB8] transition-all shadow-lg shadow-primary/25 hover:translate-y-[-2px] active:scale-95"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setShowComposer(true)}
          className="fixed bottom-24 right-6 md:bottom-12 md:right-12 bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-3xl z-40"
        >
          <span className="mb-1">+</span>
        </button>
      </div>
    </div>
  );
}
