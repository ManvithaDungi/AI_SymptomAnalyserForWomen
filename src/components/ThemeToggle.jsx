import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-accent-gold/20 hover:border-accent-gold/40
        text-accent-mauve hover:text-accent-gold transition-all duration-200
        glass-input flex items-center justify-center"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="animate-fade-in" />
      ) : (
        <Moon size={18} className="animate-fade-in" />
      )}
    </button>
  );
}
