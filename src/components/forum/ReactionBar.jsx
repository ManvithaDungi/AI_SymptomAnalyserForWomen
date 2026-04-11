
export default function ReactionBar({ post, onReact, onComment, onShare, currentUserId }) {
   const { upvotes = 0, upvotedBy = [], commentCount = 0 } = post;
   const isReacted = upvotedBy.includes(currentUserId);

   return (
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-primary/5">
         <div className="flex items-center gap-4">
            <button
               onClick={() => onReact(post.id, !isReacted)}
               className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group ${isReacted ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'
                  }`}
            >
               <span className={`text-base transition-transform duration-300 ${isReacted ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {isReacted ? '💜' : '🤍'}
               </span>
               <span>{upvotes}</span>
               <span className="hidden sm:inline ml-1 font-normal opacity-70">
                  {isReacted ? 'Supported' : 'Support'}
               </span>
            </button>

            <button
               onClick={() => onComment(post.id)}
               className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent-gold transition-colors group"
            >
               <span className="text-base group-hover:scale-110 transition-transform duration-200">💬</span>
               <span>{commentCount}</span>
               <span className="hidden sm:inline ml-1 font-normal opacity-70">Comments</span>
            </button>
         </div>

         <button
            onClick={() => onShare(post.id)}
            className="text-text-secondary hover:text-accent-gold transition-colors p-1"
            title="Share Post"
         >
            <span className="text-base">🔗</span>
         </button>
      </div>
   );
}
