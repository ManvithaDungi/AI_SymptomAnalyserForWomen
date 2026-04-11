import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, MapPin, Activity, Leaf, BookOpen } from 'lucide-react';

export default function BottomNav() {
   const navigate = useNavigate();
   const location = useLocation();

   const navItems = [
      { id: 1, icon: MessageSquare, label: 'Forum', route: '/forum' },
      { id: 5, icon: MapPin, label: 'Nearby', route: '/nearby' },
      { id: 2, icon: Activity, label: 'Check', route: '/symptoms' },
      { id: 3, icon: Leaf, label: 'Remedies', route: '/remedy' },
      { id: 4, icon: BookOpen, label: 'Journal', route: '/journal' },
   ];

   return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-accent-gold/20 flex justify-around items-center px-2 z-50 py-3">
         {navItems.map((item) => {
            const isActive = location.pathname === item.route;
            const Icon = item.icon;
            return (
               <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                     isActive 
                        ? 'text-accent-gold' 
                        : 'text-text-tertiary hover:text-text-secondary'
                  }`}
               >
                  <Icon size={20} className="transition-transform duration-200" />
                  <span className="text-xs font-mono tracking-wider uppercase">
                     {item.label}
                  </span>
               </button>
            );
         })}
      </div>
   );
}
