import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseService';

export default function Navbar({ language, setLanguage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isForum = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { name: 'Community Forum', path: '/forum' },
    { name: 'Check Symptoms', path: '/symptoms' },
    { name: 'Home Remedies', path: '/remedy' },
    { name: 'Journal', path: '/journal' },
    { name: 'Nearby Help', path: '/nearby' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-[#F8F7FF]/85 backdrop-blur-lg border-b border-primary/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-baseline gap-2 cursor-pointer" onClick={() => navigate('/forum')}>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Sahachari</h1>
            <span className="text-sm font-medium text-text-secondary">సహచరి</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-sm font-semibold transition-colors duration-200 ${location.pathname === link.path
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-primary'
                  }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'EN' ? 'TE' : 'EN')}
            className="px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-all duration-200"
          >
            {language}
          </button>

          <button
            onClick={handleLogout}
            className="text-text-secondary hover:text-danger p-2 transition-colors text-sm font-medium"
            title="Sign Out"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
