import { WifiOff, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OfflineNotification() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-4 right-4 bg-rose/20 border border-rose/50 rounded-lg p-4 flex items-center gap-3 z-40 md:top-24">
      <WifiOff size={18} className="text-rose flex-shrink-0" />
      <p className="text-sm text-ivory flex-1">
        <span className="font-mono uppercase text-xs tracking-widest text-rose">Offline:</span> Viewing cached data
      </p>
      <button className="p-1 hover:bg-rose/20 rounded transition-colors">
        <X size={16} className="text-rose" />
      </button>
    </div>
  );
}
