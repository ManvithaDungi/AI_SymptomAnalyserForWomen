# Sahachari Glassmorphism Design System

## Overview

Sahachari has been redesigned with a **luxury glassmorphism aesthetic** featuring:
- Dark luxury palette (Kurobeni deep blacks, copper accents, mauve secondaries)
- Premium typography (Cormorant Garamond serif, DM Sans, DM Mono)
- Glass card effects with backdrop blur and subtle gradients
- Smooth animations and micro-interactions
- Women's health creative inspiration (Nykaa, Flo Health, Clue)

---

## Color Palette

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-deep` | #281822 (Kurobeni) | Page background |
| `--bg-surface` | #48192e (BlackBerry) | Card base |
| `--accent-gold` | #c59c79 (Copper Moon) | CTAs, borders, highlights |
| `--accent-mauve` | #957083 (Meadow Flower) | Secondary elements, helper text |
| `--text-primary` | #f5f0eb (Ivory) | Main text, headings |
| `--accent-rose` | #c0506a | Danger, high severity |
| `--accent-teal` | #4a8a7f | Sentiment safe indicator |

### CSS Variables

All colors available as CSS variables in `:root`:
```css
:root {
  --bg-deep: #281822;
  --accent-gold: #c59c79;
  /* ... etc */
}
```

### Tailwind Classes

Use extended Tailwind colors:
```jsx
<div className="text-glass-accent-gold bg-glass-surface">
  Styled with glassmorphism colors
</div>
```

---

## Typography

### Font Stack

| Usage | Font | CSS |
|-------|------|-----|
| Headings (H1-H4) | Cormorant Garamond | `font-serif` |
| Body text | DM Sans | `font-sans` |
| Labels, code | DM Mono | `font-mono` |

### Font Sizes

Responsive sizes automatically adjust for mobile:

| Class | Desktop | Mobile | Usage |
|-------|---------|--------|-------|
| `.text-h1` | 3.5rem | 1.75rem | Page titles |
| `.text-h2` | 2.5rem | 1.35rem | Section headers |
| `.text-h3` | 1.75rem | 1.1rem | Card titles |
| `.text-h4` | 1.5rem | 1.1rem | Subheadings |
| `.text-body` | 1rem | 0.9rem | Paragraph text |
| `.text-label` | 0.625rem | 0.625rem | Labels, captions |

### Usage

```jsx
import type { FC } from 'react';

// Heading with serif font
<h1 className="font-serif text-h1">
  Your body. Your data. Your story.
</h1>

// Body text with sans
<p className="font-sans text-body">
  Paragraph text in DM Sans.
</p>

// Label in mono
<label className="font-mono text-label">
  Symptom Severity
</label>
```

---

## Glass Morphism Effects

### Base Glass Card

The foundational glass effect used on all cards:

```css
.glass {
  background: rgba(72, 25, 46, 0.45);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(197, 156, 121, 0.2);
  box-shadow:
    0 8px 32px rgba(40, 24, 34, 0.6),
    inset 0 1px 0 rgba(197, 156, 121, 0.12);
  border-radius: 20px;
}
```

### Glass Variants

| Class | Usage |
|-------|-------|
| `.glass` | Standard card |
| `.glass-deep` | Modals, overlays (blur 30px, deeper bg) |
| `.glass-card` | Padded card with hover effect |
| `.glass-card-accent` | Card with left copper border |
| `.glass-input` | Input field with bottom border |

### Component Usage

```jsx
import { GlassCard, GlassButton } from '@/components/GlassUI';

export function Dashboard() {
  return (
    <GlassCard accent>
      <h3 className="text-h3 font-serif text-accent-gold">
        Symptom Insights
      </h3>
      <p className="text-text-secondary">
        Analysis powered by Gemini
      </p>
      <GlassButton variant="primary">
        Analyze Symptoms
      </GlassButton>
    </GlassCard>
  );
}
```

---

## Component Library

### GlassCard

Base card component with glass effect.

```jsx
<GlassCard 
  accent      // Add left copper border
  hover={true} // Enable hover lift (default)
  deep={false} // Use deeper glass (for modals)
  className="p-6"
>
  Content here
</GlassCard>
```

**Props:**
- `accent` - boolean: Add left copper accent border
- `hover` - boolean: Enable hover transform
- `deep` - boolean: Use deeper glass (blur 30px)
- `className` - string: Additional Tailwind classes

### GlassButton

Button with three variants: primary, secondary, ghost.

```jsx
<GlassButton 
  variant="primary"  // "primary" | "secondary" | "ghost"
  size="md"         // Button size
  icon={RefreshIcon} // Optional icon component
  loading={false}    // Show spinner
>
  Click Me
</GlassButton>
```

**Variants:**
- **Primary**: Filled copper background, dark text (CTAs)
- **Secondary**: Glass + copper border (Secondary actions)
- **Ghost**: No background, mauve text with hover underline

### GlassBadge

Badge component with color variants.

```jsx
<GlassBadge variant="gold">
  High Priority
</GlassBadge>

// Severity badge (shortcuts)
<SeverityBadge severity="high" />  // Rose color
<SeverityBadge severity="medium" /> // Gold color
<SeverityBadge severity="low" />   // Mauve color
```

**Variants:**
- `mauve` - Secondary, info
- `gold` - Copper, medium severity
- `rose` - High severity, warnings
- `teal` - Sentiment safe indicator

### GlassInput

Input field with glass styling.

```jsx
<GlassInput
  label="Symptom Description"
  placeholder="Describe your symptoms..."
  icon={HeartIcon}
  error={errors.symptom}
  onChange={(e) => setSymptom(e.target.value)}
/>
```

**Features:**
- Single bottom border with full border on focus
- Icon support (left-aligned)
- Error state with red text
- Placeholder in mauve italic

### GlassModal

Modal overlay with glassmorphism.

```jsx
const [openModal, setOpenModal] = useState(false);

<GlassModal
  isOpen={openModal}
  title="Confirm Action"
  onClose={() => setOpenModal(false)}
>
  <p className="mb-6">Are you sure?</p>
  <div className="flex gap-3">
    <GlassButton variant="primary" onClick={() => setOpenModal(false)}>
      Yes, Proceed
    </GlassButton>
    <GlassButton variant="ghost" onClick={() => setOpenModal(false)}>
      Cancel
    </GlassButton>
  </div>
</GlassModal>
```

### LanguagePill

Language selector with glass pills.

```jsx
<LanguagePill
  languages={[
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
  ]}
  activeLanguage="en"
  onLanguageChange={(lang) => setLanguage(lang)}
/>
```

### LoadingSpinner

Glassmorphic loading animation.

```jsx
<LoadingSpinner size={48} /> // Default 48px
<LoadingSpinner size={32} className="my-4" />
```

### SkeletonLoader

Shimmer placeholder during data loading.

```jsx
// Single skeleton
<SkeletonLoader width="w-full" height="h-12" />

// Multiple skeletons
<SkeletonLoader width="w-full" height="h-20" count={3} />
```

### StateMessage

Message component for status (error, success, warning, info).

```jsx
<StateMessage
  type="error"
  message="Failed to save. Please try again."
  icon={AlertIcon}
  dismissible={true}
  onDismiss={() => setShowError(false)}
/>
```

---

## Animations

### Keyframes

| Name | Duration | Usage |
|------|----------|-------|
| `fade-in` | 300ms | Page transitions |
| `shimmer` | 2s loop | Skeleton loaders |
| `float` | 6s loop | Background orbs |
| `pulse-glow` | 2s loop | Active card hover |

### Utility Classes

```jsx
// Fade in page element
<div className="animate-fade-in">
  Page content
</div>

// Shimmer skeleton
<div className="animate-shimmer">
  Loading...
</div>

// Float animation
<button className="animate-float">
  Floating CTA
</button>

// Pulse glow
<div className="glass animate-pulse-glow">
  Highlighted card
</div>
```

### Custom Transitions

```jsx
// Smooth transform on hover
<div className="transition-transform hover:-translate-y-1">
  Lift on hover
</div>

// All properties
<button className="transition-all hover:shadow-glass-hover">
  All transitions
</button>
```

---

## Responsive Design

### Breakpoints

Mobile <= 640px uses full-width layouts:
- Cards stack vertically
- Navbar → bottom tab bar
- Hero text scales down
- Font sizes reduce

```jsx
// Responsive classes (Tailwind)
<div className="p-6 md:p-8 lg:p-10">
  Auto scales with breakpoints
</div>

<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive heading
</h1>
```

### Mobile Navbar

Below 640px, Navbar collapses to bottom glass tab bar:
- Icons with labels below
- Copper highlight on active
- Full-width container

### Hero Section Mobile

Hero headline scales to 28px on mobile (from 56px desktop).

---

## Component Patterns

### Severity Indicator Pattern

```jsx
// In dashboard card
<div className="glass-card flex items-center justify-between">
  <h4 className="font-serif">Fatigue</h4>
  <SeverityBadge severity="high" />
</div>
```

### Forum Post Pattern

```jsx
<GlassCard accent>
  <div className="flex gap-3 mb-4">
    <img 
      src={avatar} 
      className="w-10 h-10 rounded-full border-2 border-accent-gold"
    />
    <div>
      <p className="font-mono text-label text-text-tertiary">{username}</p>
      <LanguagePill languages={[{code: lang}]} activeLanguage={lang} />
    </div>
  </div>
  
  <h4 className="font-serif text-h4 mb-3">{title}</h4>
  <p className="text-text-secondary mb-4">{content}</p>
  
  <div className="flex gap-2">
    <GlassButton variant="ghost" size="sm">👍 Like</GlassButton>
    <GlassButton variant="ghost" size="sm">💬 Reply</GlassButton>
  </div>
</GlassCard>
```

### Form Pattern

```jsx
<form className="glass-card space-y-4">
  <GlassInput
    label="Full Name"
    placeholder="Enter your name..."
  />
  <GlassInput
    label="Email"
    type="email"
    placeholder="your@email.com"
  />
  <div className="flex gap-3">
    <GlassButton variant="primary" type="submit">
      Save Changes
    </GlassButton>
    <GlassButton variant="ghost" type="reset">
      Clear
    </GlassButton>
  </div>
</form>
```

---

## Best Practices

### 1. Color Usage

- **Copper (#c59c79)**: CTAs, hover states, important borders
- **Mauve (#957083)**: Helper text, secondary labels, secondary buttons
- **Ivory (#f5f0eb)**: Main body text and headings
- **Rose (#c0506a)**: Danger/high severity only

### 2. Typography Hierarchy

```jsx
// Page title
<h1 className="font-serif text-h1">Main Title</h1>

// Section header
<h2 className="font-serif text-h2">Section</h2>

// Card title
<h3 className="font-serif text-h3">Card Title</h3>

// Subheading
<h4 className="font-serif text-h4">Subheading</h4>

// Regular body text
<p className="font-sans text-body">Paragraph</p>

// Helper/label text
<label className="font-mono text-label">Label</label>
```

### 3. Hover States

- **Cards**: Lift (-4px) + brighter shadow
- **Buttons**: Color shift + shadow expansion
- **Links**: Copper underline + glow

### 4. Loading States

- Primary spinners: `LoadingSpinner` component
- Content placeholder: `SkeletonLoader` component
- Buttons: Add `loading` prop to show spinner

### 5. Accessibility

- All interactive elements: Keyboard accessible
- Color not only indicator: Always add text/icons
- Contrast ratios: Meet WCAG AA standard (copper/ivory ratio ~7:1)
- Aria labels on icon-only buttons

---

## Migration Guide

### From Old Design

**Before:**
```jsx
<div className="bg-white rounded-lg shadow-lg p-6">
  <h3>Title</h3>
</div>
```

**After:**
```jsx
<GlassCard accent>
  <h3 className="font-serif text-h3">Title</h3>
</GlassCard>
```

### Common Replacements

| Old | New |
|-----|-----|
| `bg-white` | `glass` or `glass-deep` |
| `shadow-lg` | `glass` (built-in) |
| `text-primary: #6D5BD0` | `text-accent-gold` |
| `Plus Jakarta Sans` | `font-sans` (DM Sans) |
| Plain `<button>` | `<GlassButton>` |

---

## Troubleshooting

### Text not readable?

Ensure sufficient contrast:
- Primary text: Use `text-text-primary` (#f5f0eb)
- Secondary text: Use `text-text-secondary` (#d4ccc1)
- Avoid white text on glass cards

### Glass effect not showing?

Check:
- Browser supports CSS backdrop-filter (Chrome 76+, Safari 9+, Firefox 103+)
- Element has `backdrop-filter` in CSS
- Not nested inside other filters

### Colors not matching?

Verify CSS variables loaded:
```js
// In browser console
getComputedStyle(document.documentElement).getPropertyValue('--accent-gold')
// Should return: " #c59c79"
```

### Animations janky?

- Check for too many simultaneous animations
- Use `will-change: transform` for frequently animated elements
- Test on low-end devices

---

## Resources

- **Design Inspiration**: Linear.app, Vercel dark, Raycast, Nykaa app
- **Glassmorphism**: ui.glass, Dribbble dark glass UI
- **Typography**: Google Fonts (Cormorant Garamond, DM Sans, DM Mono)
- **Lucide Icons**: lucide.dev (for all UI icons)
- **Tailwind Setup**: tailwindcss.com

---

## Version History

- **v1.0** (April 2026): Initial glassmorphism redesign
  - Dark luxury palette
  - Glass card system
  - Component library
  - Animation framework
  - Responsive mobile design

---

**Last Updated**: April 9, 2026
**Design System**: Sahachari Luxury Glassmorphism v1.0
