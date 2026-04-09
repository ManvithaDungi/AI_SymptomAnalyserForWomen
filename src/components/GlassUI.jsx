/**
 * Glassmorphism Component Library
 * Reusable glass-based UI components for the Sahachari redesign
 */

import React from 'react';

/**
 * GlassCard - Base glass card component
 * Provides the core glassmorphism effect with optional accents
 */
export const GlassCard = ({
  children,
  className = '',
  accent = false,
  hover = true,
  deep = false,
  ...props
}) => {
  const baseClass = deep ? 'glass-deep' : 'glass';
  const accentClass = accent ? 'glass-card-accent' : '';
  const hoverClass = hover ? 'hover:shadow-glass-hover' : '';

  return (
    <div
      className={`${baseClass} ${accentClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * GlassButton - Glassmorphic button variants
 * Supports primary, secondary, and ghost styles
 */
export const GlassButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin-copper">⟳</span>
      ) : Icon ? (
        <>
          <Icon size={18} />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * GlassBadge - Badge component with color variants
 * Used for severity, language, sentiment indicators
 */
export const GlassBadge = ({
  children,
  variant = 'mauve',
  className = '',
  ...props
}) => {
  const baseClass = `badge badge-${variant}`;
  return (
    <span className={`${baseClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

/**
 * SeverityBadge - Pre-styled severity indicator
 * Shows Low, Medium, High with appropriate colors
 */
export const SeverityBadge = ({ severity, className = '', ...props }) => {
  const severityMap = {
    low: 'mauve',
    medium: 'gold',
    high: 'rose',
  };

  const variant = severityMap[severity?.toLowerCase()] || 'mauve';

  return (
    <GlassBadge variant={variant} className={className} {...props}>
      {severity}
    </GlassBadge>
  );
};

/**
 * GlassInput - Glassmorphic input field
 * Single bottom border design with focus effects
 */
export const GlassInput = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-label text-accent-mauve">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold opacity-60"
          />
        )}
        <input
          className={`glass-input w-full ${Icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-accent-rose text-xs mt-2">{error}</p>
      )}
    </div>
  );
};

/**
 * GlassModal - Modal with glassmorphism
 * Deep glass backdrop with header accent
 */
export const GlassModal = ({
  children,
  title,
  onClose,
  isOpen = false,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/50 z-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`glass-deep relative z-10 w-full max-w-md mx-4 ${className}`}>
        {/* Header with copper gradient accent */}
        <div className="h-1 bg-gradient-to-r from-accent-gold to-accent-mauve rounded-t-2xl" />

        {/* Content */}
        <div className="p-6">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h3 font-serif text-text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="text-accent-mauve hover:text-accent-gold transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * GlassTab - Tab component with glass styling
 * Copper underline for active state
 */
export const GlassTab = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-glass-accent-gold/20 ${className}`}>
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => onTabChange(idx)}
          className={`px-6 py-3 font-mono text-sm uppercase letter-spacing-1 transition-all ${
            activeTab === idx
              ? 'text-accent-gold border-b-2 border-accent-gold'
              : 'text-accent-mauve hover:text-accent-gold'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

/**
 * LanguagePill - Language selector pill
 * Used for language switching in the UI
 */
export const LanguagePill = ({
  languages = [],
  activeLanguage,
  onLanguageChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`badge ${
            activeLanguage === lang.code ? 'badge-gold' : 'badge-mauve'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

/**
 * LoadingSpinner - Glassmorphic loading spinner
 * Copper arc animation on glass circle
 */
export const LoadingSpinner = ({ size = 48, className = '' }) => {
  return (
    <div
      className={`glass rounded-full animate-spin-copper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderTop: `3px solid var(--accent-gold)`,
        borderRight: `3px solid var(--accent-mauve)`,
        borderBottom: `3px transparent`,
        borderLeft: `3px transparent`,
      }}
    />
  );
};

/**
 * SkeletonLoader - Shimmer skeleton for loading states
 * Shows placeholder during data fetch
 */
export const SkeletonLoader = ({
  width = 'w-full',
  height = 'h-6',
  className = '',
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} glass animate-shimmer rounded-md mb-3 ${className}`}
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(72,25,46,0.5) 0%, rgba(197,156,121,0.1) 50%, rgba(72,25,46,0.5) 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </>
  );
};

/**
 * StateMessage - Glassmorphic state message (error, success, info, warning)
 */
export const StateMessage = ({
  type = 'info',
  message,
  icon: Icon,
  dismissible = true,
  onDismiss,
}) => {
  const colorMap = {
    error: 'border-accent-rose text-accent-rose bg-accent-rose/10',
    success: 'border-accent-gold text-accent-gold bg-accent-gold/10',
    warning: 'border-accent-gold text-accent-gold bg-accent-gold/10',
    info: 'border-accent-mauve text-accent-mauve bg-accent-mauve/10',
  };

  return (
    <div className={`glass ${colorMap[type]} p-4 rounded-lg flex items-start gap-3`}>
      {Icon && <Icon size={20} className="flex-shrink-0 mt-1" />}
      <p className="flex-1 text-sm">{message}</p>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-current hover:opacity-60 transition-opacity flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default {
  GlassCard,
  GlassButton,
  GlassBadge,
  SeverityBadge,
  GlassInput,
  GlassModal,
  GlassTab,
  LanguagePill,
  LoadingSpinner,
  SkeletonLoader,
  StateMessage,
};
