/**
 * Icon mapping utility for Lucide React icons
 * Maps string icon names to Lucide icon components
 * Usage: getIcon('flower') returns Flower component
 */

import {
  Flower,
  Leaf, 
  Moon,
  Sparkles,
  Sprout,
  Search,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Globe,
  Zap,
  Heart,
  Shield,
  MessageSquare,
  Home,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

/**
 * Map of icon names to Lucide components
 * Used for dynamic icon rendering throughout the app
 */
const iconMap = {
  // Nature & Health Icons
  flower: Flower,
  leaf: Leaf,
  moon: Moon,
  sparkles: Sparkles,
  sprout: Sprout,

  // UI Icons
  search: Search,
  chart: BarChart3,
  alert: AlertCircle,
  check: CheckCircle,
  globe: Globe,
  zap: Zap,
  heart: Heart,
  shield: Shield,
  messageSquare: MessageSquare,
  home: Home,
  settings: Settings,
  user: User,
  logout: LogOut,
  menu: Menu,
  close: X,
  next: ArrowRight,
  prev: ArrowLeft,

  // Aliases for common names
  salad: Leaf,
  plant: Sprout,
  energy: Zap,
  filter: Search,
};

/**
 * Get a Lucide icon component by name
 * @param {string} iconName - The name of the icon (e.g., 'flower', 'leaf')
 * @returns {React.Component|null} The Lucide icon component or null if not found
 */
export const getIcon = (iconName) => {
  if (!iconName) return null;
  return iconMap[iconName.toLowerCase()] || null;
};

/**
 * Render a Lucide icon as a React component
 * @param {string} iconName - The name of the icon
 * @param {number} size - Icon size in pixels (default: 24)
 * @param {string} color - Icon color (default: 'currentColor')
 * @param {object} props - Additional props to pass to the icon component
 * @returns {JSX.Element|null} React element or null if icon not found
 */
export const renderIcon = (iconName, size = 24, color = 'currentColor', props = {}) => {
  const IconComponent = getIcon(iconName);
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} {...props} />;
};

export default iconMap;
