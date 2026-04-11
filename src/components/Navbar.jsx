import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../services/firebaseService';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { GlassButton } from './GlassUI';
import { logger } from '../utils/logger';
import { LogOut, Search } from 'lucide-react';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      logger.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { name: t('home.community'), path: '/forum' },
    { name: t('home.check_symptoms'), path: '/symptoms' },
    { name: t('home.remedies'), path: '/remedy' },
    { name: t('home.journal'), path: '/journal' },
    { name: t('home.nearby'), path: '/nearby' }
  ];

  return (
    <nav 
      className="glass-nav px-6 py-4 flex items-center justify-between"
    >
      <div className="flex-1">
        <div 
          className="flex items-baseline gap-2 cursor-pointer hover:text-accent-gold transition-colors"
          onClick={() => navigate('/forum')}
        >
          <h1 className="text-2xl font-serif font-bold text-ivory italic tracking-tight">
            Sahachari
          </h1>
          <span className="text-xs font-mono text-text-secondary tracking-wider">
            సహచరి
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`nav-link ${
              location.pathname === link.path ? 'text-accent-gold' : ''
            }`}
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <button className="p-2 text-ivory/60 hover:text-accent-gold transition-colors">
          <Search size={20} />
        </button>
        <ThemeToggle />
        <LanguageSelector />

        <GlassButton
          variant="ghost"
          size="sm"
          icon={LogOut}
          onClick={handleLogout}
          title={t('common.logout')}
        >
          <span className="hidden sm:inline text-xs">{t('common.logout')}</span>
        </GlassButton>
      </div>
    </nav>
  );
}

