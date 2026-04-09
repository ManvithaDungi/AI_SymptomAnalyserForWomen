import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../services/firebaseService';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { GlassButton } from './GlassUI';
import { logger } from '../utils/logger';
import { LogOut } from 'lucide-react';

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
      className="glass fixed top-0 z-50 w-full h-16 border-b border-accent-gold/30"
      style={{ backdropFilter: 'blur(24px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        {/* Logo & Brand */}
        <div 
          className="flex items-baseline gap-2 cursor-pointer hover:text-accent-gold transition-colors"
          onClick={() => navigate('/forum')}
        >
          <h1 className="text-2xl font-serif font-bold text-text-primary italic tracking-tight">
            Sahachari
          </h1>
          <span className="text-xs font-mono text-text-secondary letter-spacing-1">
            సహచరి
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`font-mono text-xs uppercase letter-spacing-1 transition-all pb-2 border-b-2 ${
                location.pathname === link.path
                  ? 'text-accent-gold border-accent-gold'
                  : 'text-accent-mauve border-transparent hover:text-accent-gold'
              }`}
              style={
                location.pathname === link.path
                  ? { textShadow: '0 0 12px rgba(197, 156, 121, 0.4)' }
                  : {}
              }
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />

          <GlassButton
            variant="ghost"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
            title={t('common.logout')}
          >
            <span className="hidden sm:inline">{t('common.logout')}</span>
          </GlassButton>
        </div>
      </div>
    </nav>
  );
}

