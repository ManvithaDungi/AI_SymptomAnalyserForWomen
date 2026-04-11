import { Plus, Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SahachariCommunityScreen() {
  const { t } = useTranslation();
  const posts = [
    { 
      author: 'Elena R.', 
      time: '2h ago', 
      content: 'Has anyone tried red raspberry leaf tea for cramps? Thinking of starting it this cycle.', 
      likes: 24, 
      comments: 8,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'
    },
    { 
      author: 'Sarah M.', 
      time: '5h ago', 
      content: 'Finally found a yoga routine that actually helps with my PCOS symptoms. Sharing the link below!', 
      likes: 56, 
      comments: 12,
      image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=600&auto=format&fit=crop'
    },
    { 
      author: 'Maya K.', 
      time: '1d ago', 
      content: 'The luteal phase fatigue is hitting hard today. Sending love to everyone in the same boat. 🤍', 
      likes: 89, 
      comments: 34,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop'
    },
  ];

  return (
    <div className="space-y-8 pb-24">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif italic">Community</h1>
          <p className="text-ivory/60 font-light">You are not alone in this journey.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Post
        </button>
      </header>

      <div className="space-y-8">
        {posts.map((post, i) => (
          <div key={i} className="glass-card overflow-hidden space-y-4">
            <div className="p-8 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-meadow/20 border border-meadow/40 flex items-center justify-center text-meadow font-serif italic">
                  {post.author[0]}
                </div>
                <div>
                  <h4 className="font-serif italic text-lg">{post.author}</h4>
                  <span className="text-xs text-ivory/40">{post.time}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="text-ivory/40 hover:text-copper transition-colors"><Bookmark size={18} /></button>
                <button className="text-ivory/40 hover:text-copper transition-colors"><Share2 size={18} /></button>
              </div>
            </div>
            
            <div className="px-8 space-y-4">
              <p className="text-ivory/80 leading-relaxed text-lg">
                {post.content}
              </p>
            </div>

            <div className="h-64 w-full overflow-hidden px-8">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-8 pt-4 flex gap-6 border-t border-ivory/10">
              <button className="flex items-center gap-2 text-ivory/60 hover:text-rose transition-colors">
                <Heart size={18} /> <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-ivory/60 hover:text-copper transition-colors">
                <MessageSquare size={18} /> <span className="text-sm">{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
