import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

const languages = [
   { code: 'en', label: 'EN', native: 'English' },
   { code: 'hi', label: 'HI', native: 'हिंदी' },
   { code: 'ta', label: 'TA', native: 'தமிழ்' },
   { code: 'te', label: 'TE', native: 'తెలుగు' },
   { code: 'kn', label: 'KN', native: 'ಕನ್ನಡ' },
   { code: 'ml', label: 'ML', native: 'മലയാളം' }
];

const LanguageSelector = () => {
   const { i18n } = useTranslation();
   const [open, setOpen] = useState(false);
   const dropdownRef = useRef(null);
   const current = languages.find(l => l.code === i18n.language) || languages[0];

   // Close on outside click
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const switchLanguage = (code) => {
      i18n.changeLanguage(code);
      localStorage.setItem('language', code);
      setOpen(false);
   };

   return (
      <div className="relative" ref={dropdownRef}>
         {/* Trigger button - Glass style */}
         <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            font-mono text-xs text-accent-mauve hover:text-accent-gold
            border border-accent-gold/20 hover:border-accent-gold/40
            glass-input transition-all"
         >
            <span className="uppercase">{current.label}</span>
            <span className="text-xs opacity-60">▾</span>
         </button>

         {/* Dropdown - Glass style */}
         {open && (
            <div className="absolute right-0 top-10 w-44 z-50
            glass rounded-xl overflow-hidden
            border border-accent-gold/20 animate-fade-in origin-top-right">
               <div className="py-2">
                  {languages.map((lang) => (
                     <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`w-full flex items-center justify-between
                        px-4 py-2.5 text-sm font-mono transition-all
                        ${i18n.language === lang.code 
                           ? 'bg-accent-gold/10 text-accent-gold border-l-2 border-accent-gold' 
                           : 'text-text-secondary hover:text-accent-gold hover:bg-accent-gold/5'
                        }
                     `}
                     >
                        <span className="text-sm font-medium">
                           {lang.native}
                        </span>

                        <div className="flex items-center gap-2">
                           <span className="text-text-tertiary text-xs uppercase">{lang.label}</span>
                           {i18n.language === lang.code && (
                              <span className="text-accent-gold text-xs">✓</span>
                           )}
                        </div>
                     </button>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default LanguageSelector;
