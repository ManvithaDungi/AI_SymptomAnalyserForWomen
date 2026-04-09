# Icon System Documentation

## Overview

This project uses **[Lucide React](https://lucide.dev)** for all UI icons instead of emojis or custom SVG files. Lucide provides a consistent, professional icon set with excellent performance and accessibility.

## Installation

Lucide React is already installed:
```bash
npm install lucide-react
```

## Icon Map

The icon system uses a centralized mapping in `src/utils/iconMap.js` that converts icon names to Lucide components.

### Supported Icons

#### Nature & Health
- `flower` - Flower icon (Lucide: Flower)
- `leaf` - Leaf icon (Lucide: Leaf)
- `moon` - Moon icon (Lucide: Moon)
- `sparkles` - Sparkles icon (Lucide: Sparkles)
- `sprout` - Sprout icon (Lucide: Sprout)
- `plant` (alias: leaf)
- `salad` (alias: leaf)

#### Action & UI
- `search` - Search icon (Lucide: Search)
- `chart` - Bar chart icon (Lucide: BarChart3)
- `alert` - Alert circle icon (Lucide: AlertCircle)
- `check` - Check circle icon (Lucide: CheckCircle)
- `globe` - Globe icon (Lucide: Globe)
- `zap` - Lightning bolt icon (Lucide: Zap)
- `heart` - Heart icon (Lucide: Heart)
- `shield` - Shield icon (Lucide: Shield)
- `messageSquare` - Message/chat icon (Lucide: MessageSquare)
- `home` - Home icon (Lucide: Home)
- `settings` - Settings icon (Lucide: Settings)
- `user` - User icon (Lucide: User)
- `logout` - Logout icon (Lucide: LogOut)
- `menu` - Menu icon (Lucide: Menu)
- `close` - Close/X icon (Lucide: X)
- `next` - Next arrow (Lucide: ArrowRight)
- `prev` - Previous arrow (Lucide: ArrowLeft)

## Usage

### 1. Basic Usage with `renderIcon`

```jsx
import { renderIcon } from '@/utils/iconMap';

export function ForumTopicCard({ topic }) {
  return (
    <div className="topic-card">
      <div className="icon">
        {renderIcon(topic.icon, 32, '#6d5bd0')}
      </div>
      <h3>{topic.title}</h3>
    </div>
  );
}
```

### 2. Advanced: Getting Icon Component

```jsx
import { getIcon } from '@/utils/iconMap';

export function Header() {
  const HomeIcon = getIcon('home');
  const HeartIcon = getIcon('heart');

  return (
    <header>
      <div className="logo">
        {HomeIcon && <HomeIcon size={24} />}
      </div>
      <button>
        {HeartIcon && <HeartIcon size={20} />}
        Favorite
      </button>
    </header>
  );
}
```

### 3. Direct Lucide Import

For frequently used icons, import directly from lucide-react:

```jsx
import { Sparkles, Heart, Shield } from 'lucide-react';

export function Dashboard() {
  return (
    <div>
      <Sparkles size={28} className="text-yellow-500" />
      <Heart size={28} className="text-red-500" />
      <Shield size={28} className="text-blue-500" />
    </div>
  );
}
```

## Icon Sizes (Best Practices)

- **xs**: 16px - Small inline icons
- **sm**: 20px - Labels, buttons
- **md**: 24px (default) - Nav items, cards
- **lg**: 32px - Feature highlights
- **xl**: 48px - Hero sections

```jsx
// Size examples
renderIcon('leaf', 16)  // xs
renderIcon('leaf', 20)  // sm
renderIcon('leaf', 24)  // md (default)
renderIcon('leaf', 32)  // lg
renderIcon('leaf', 48)  // xl
```

## Styling Icons

### Using Tailwind Classes

```jsx
import { Heart } from 'lucide-react';

<Heart 
  size={24} 
  className="text-red-500 hover:text-red-600 transition-colors" 
/>
```

### Using Inline Styles

```jsx
<Heart 
  size={24} 
  color="#ef4444"
  style={{ stroke: '#ef4444' }}
/>
```

### Using CSS

```jsx
<Heart size={24} className="my-icon" />

/* styles.css */
.my-icon {
  color: #ef4444;
  stroke-width: 2.5;
}
```

## Database Schema Change

Forum topics now store icon names instead of emojis:

**Before:**
```json
{
  "id": "PCOS",
  "title": "PCOS",
  "icon": "🌸"
}
```

**After:**
```json
{
  "id": "PCOS",
  "title": "PCOS",
  "icon": "flower"
}
```

## Adding New Icons

To add new icons to the system:

1. **Import the icon** in `src/utils/iconMap.js`:
   ```jsx
   import { YourNewIcon } from 'lucide-react';
   ```

2. **Add to the map**:
   ```jsx
   const iconMap = {
     // ... existing icons
     yourNewIcon: YourNewIcon,
   };
   ```

3. **Use throughout the app**:
   ```jsx
   renderIcon('yourNewIcon', 24)
   ```

## Migrating from Emojis

### Frontend Components

Already updated files:
- `src/utils/logger.js` - Replaced emoji prefixes with `[ERROR]`, `[DEBUG]`
- `src/data/seedDatabase.js` - Replaced seed data emojis with icon names
- `README.md` - Replaced documentation emojis with `[IconName]` format

### New Emojis in Code

If you find remaining emojis in the codebase:

1. **Identify the emoji's purpose**
2. **Find matching Lucide icon** at [lucide.dev](https://lucide.dev)
3. **Add to iconMap** and use `getIcon()` or direct import

## Accessibility

Lucide icons are SVGs with proper accessibility attributes:

```jsx
import { Heart } from 'lucide-react';

// With aria-label for screen readers
<Heart size={24} aria-label="Add to favorites" />

// In icon-only buttons, use title prop
<button title="Add to favorites">
  <Heart size={20} />
</button>
```

## Performance Tips

1. **Use tree-shaking** - Lucide automatically removes unused icons
2. **Keep icon sizes consistent** - Prevents layout shift
3. **Memoize icon components** if rendering many in a list:
   ```jsx
   const MemoizedArrow = React.memo(ArrowRight);
   ```

## Resources

- **Lucide React Docs**: https://lucide.dev
- **Icon Gallery**: https://lucide.dev/icons
- **GitHub**: https://github.com/lucide-icons/lucide

## Support

For questions about icons:
1. Check Lucide's icon gallery: https://lucide.dev/icons
2. Review this documentation
3. Check existing component implementations in `src/components/`

---

**Migration Status**: ✅ Complete
- Emojis removed from code files
- Icon mapping system implemented
- Long-term maintenance docs created
