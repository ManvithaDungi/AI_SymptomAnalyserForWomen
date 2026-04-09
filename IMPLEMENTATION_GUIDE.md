# Sahachari Glassmorphism Implementation Guide

## Overview

This guide provides step-by-step instructions for refactoring all React components to match the luxury glassmorphism design system. Follow the patterns provided and apply them systematically to each screen.

**Total Components to Update**: 15+ screens  
**Estimated Time**: 4-6 hours (full implementation)  
**Priority Phases**: 3 phases (critical → enhanced → polish)

---

## Table of Contents

1. [Quick Start Checklist](#quick-start-checklist)
2. [Phase 1: Critical Components (Navbar, Buttons, Inputs)](#phase-1-critical-components)
3. [Phase 2: Core Screens (Forum, Symptoms, Remedy)](#phase-2-core-screens)
4. [Phase 3: Enhanced Features (Journal, Analysis, Modals)](#phase-3-enhanced-features)
5. [Code Patterns & Templates](#code-patterns--templates)
6. [Testing & Validation](#testing--validation)

---

## Quick Start Checklist

Before starting, verify:

- ✅ `src/styles/glassmorphism.css` exists
- ✅ `tailwind.config.js` has glass colors and animations
- ✅ `src/components/GlassUI.jsx` imported in screens
- ✅ Fonts loaded: Cormorant Garamond, DM Sans, DM Mono
- ✅ `.env.local` has valid API keys for testing

---

## Phase 1: Critical Components

### 1.1 Navbar Refactor

**Current Status**: Light purple background, basic styling  
**Target**: Dark glass strip with copper accents

**File**: `src/components/Navbar.jsx`

**Changes**:

```jsx
// BEFORE
<nav className="sticky top-0 z-50 w-full h-16 bg-[#F8F7FF]/85 backdrop-blur-lg border-b border-primary/10">

// AFTER
<nav className="glass fixed top-0 z-50 w-full h-16 border-b border-accent-gold/30 bg-glass-surface/40" style={{
  backdropFilter: 'blur(24px)'
}}>
```

**Step-by-step**:

1. Replace background color with `glass` utility class
2. Change border color from `border-primary/10` → `border-accent-gold/30`
3. Update brand wordmark styling:

```jsx
// BEFORE
<h1 className="text-2xl font-bold text-primary tracking-tight">Sahachari</h1>

// AFTER
<h1 className="text-2xl font-serif font-bold text-text-primary italic tracking-tight">
  Sahachari
</h1>
```

4. Update nav links to DM Mono uppercase with letter-spacing:

```jsx
// BEFORE
className={`text-sm font-semibold transition-colors ${...}`}

// AFTER
className={`font-mono text-xs uppercase letter-spacing-1 transition-colors ${
  location.pathname === link.path
    ? 'text-accent-gold border-b-2 border-accent-gold glow-sm'
    : 'text-accent-mauve hover:text-accent-gold'
}`}
```

5. Add active state with subtle glow:

```jsx
// Active state styling
const activeStyle = location.pathname === link.path
  ? {
      boxShadow: '0 0 12px rgba(197, 156, 121, 0.4)',
      borderBottomColor: 'var(--accent-gold)'
    }
  : {};
```

6. Update buttons (Logout):

```jsx
// BEFORE
<button className="px-4 py-2 bg-primary text-white rounded-lg">

// AFTER
<GlassButton variant="secondary" size="sm">
  {t('home.logout')}
</GlassButton>
```

**Complete Navbar Template** (simplified):

```jsx
import { GlassButton } from './GlassUI';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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
        {/* Logo */}
        <div 
          className="flex items-baseline gap-2 cursor-pointer hover:text-accent-gold transition-colors"
          onClick={() => navigate('/forum')}
        >
          <h1 className="text-2xl font-serif font-bold text-text-primary italic">
            Sahachari
          </h1>
          <span className="text-sm font-mono text-text-secondary">సహచరి</span>
        </div>

        {/* Desktop Nav */}
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
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <GlassButton variant="ghost" size="sm" onClick={() => signOut(auth)}>
            {t('home.logout')}
          </GlassButton>
        </div>
      </div>
    </nav>
  );
}
```

---

### 1.2 Button Refactor

**Current Status**: Using default/custom buttons  
**Target**: 3 variants (primary, secondary, ghost) using `GlassButton`

**File**: `src/components/GlassUI.jsx` (already created)

**Usage across screens**:

```jsx
// Import
import { GlassButton } from '@/components/GlassUI';

// PRIMARY - Main CTAs (submit, analyze, send)
<GlassButton variant="primary" onClick={handleSubmit}>
  Analyze Symptoms
</GlassButton>

// SECONDARY - Secondary actions (optional, cancel-ish)
<GlassButton variant="secondary" onClick={handleAlternate}>
  Ask Another
</GlassButton>

// GHOST - Tertiary, minimal emphasis
<GlassButton variant="ghost" onClick={handleMinor}>
  Learn More
</GlassButton>

// With Icon
import { RefreshCw } from 'lucide-react';
<GlassButton 
  variant="primary" 
  icon={RefreshCw}
  onClick={handleRefresh}
>
  Refresh
</GlassButton>

// Loading State
<GlassButton 
  variant="primary" 
  loading={isLoading}
  disabled={isLoading}
>
  {isLoading ? 'Analyzing...' : 'Analyze'}
</GlassButton>
```

**Replace Pattern** (across all screens):

```jsx
// Old button styles - search and replace
// TODO: Replace all instances of:
// className="px-4 py-2 bg-primary text-white rounded-full"
// With: <GlassButton variant="primary">

// className="px-4 py-2 border border-primary text-primary rounded-full"
// With: <GlassButton variant="secondary">

// className="px-4 py-2 text-primary hover:underline"
// With: <GlassButton variant="ghost">
```

---

### 1.3 Input Refactor

**Current Status**: Basic input fields  
**Target**: Glass inputs with copper bottom border, mauve placeholder

**File**: Any screen with forms (LoginScreen, NewPostScreen, etc.)

**Changes**:

```jsx
// Import
import { GlassInput } from '@/components/GlassUI';

// BEFORE
<input 
  type="email" 
  placeholder="Email"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
/>

// AFTER
<GlassInput
  label="Email"
  type="email"
  placeholder="your@email.com"
  icon={Mail} // Optional Lucide icon
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

**Template**:

```jsx
// Login form example
<form className="glass-card space-y-6 max-w-md">
  <div>
    <h2 className="text-h2 font-serif text-text-primary mb-2">
      Sign In
    </h2>
    <p className="text-text-secondary text-sm">
      Welcome back to your wellness journey
    </p>
  </div>

  <GlassInput
    label="Email Address"
    type="email"
    placeholder="you@example.com"
    onChange={(e) => setEmail(e.target.value)}
    error={emailError}
  />

  <GlassInput
    label="Password"
    type="password"
    placeholder="••••••••"
    onChange={(e) => setPassword(e.target.value)}
    error={passwordError}
  />

  <GlassButton variant="primary" type="submit" className="w-full">
    Sign In
  </GlassButton>

  <GlassButton variant="ghost" className="w-full">
    Need an account? Sign up
  </GlassButton>
</form>
```

---

## Phase 2: Core Screens

### 2.1 Dashboard/Forum Cards

**File**: `src/components/SymptomCard.jsx`, `src/components/forum/PostCard.jsx`

**Pattern - Dashboard Card**:

```jsx
import { GlassCard } from '@/components/GlassUI';
import { Heart } from 'lucide-react';

export function DashboardMetricCard({ title, value, label, icon: Icon }) {
  return (
    <GlassCard accent hover className="space-y-2">
      {/* Header with left copper accent border (built into GlassCard accent) */}
      
      <div className="flex items-center justify-between">
        <label className="font-mono text-label text-accent-mauve uppercase">
          {title}
        </label>
        {Icon && <Icon size={20} className="text-accent-gold" />}
      </div>

      {/* Metric number in copper */}
      <div className="flex items-baseline gap-2">
        <p className="text-5xl font-serif text-accent-gold font-bold">
          {value}
        </p>
        <span className="text-text-secondary text-sm">
          {label}
        </span>
      </div>

      {/* Change indicator */}
      <p className="text-text-tertiary text-xs">
        Last updated: {lastUpdated}
      </p>
    </GlassCard>
  );
}

// Usage
<DashboardMetricCard
  title="Heart Rate"
  value="72"
  label="bpm"
  icon={Heart}
/>
```

**Pattern - Forum Post Card**:

```jsx
import { GlassCard, SeverityBadge } from '@/components/GlassUI';
import { MessageCircle, ThumbsUp } from 'lucide-react';

export function ForumPostCard({ post, onReply }) {
  return (
    <GlassCard 
      accent
      className="space-y-4"
      tint={post.sentiment === 'safe' ? 'teal' : 'normal'}
    >
      {/* Header with avatar */}
      <div className="flex gap-3 items-start">
        {/* Avatar with copper ring */}
        <div className="w-10 h-10 rounded-full border-2 border-accent-gold overflow-hidden flex-shrink-0">
          <img 
            src={post.avatar || '/default-avatar.png'}
            alt={post.author}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-mono text-sm text-text-secondary">
              {post.author}
            </p>
            {post.language && (
              <span className="text-xs badge badge-mauve">
                {post.language}
              </span>
            )}
          </div>
          <p className="text-xs text-text-tertiary">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-h4 font-serif text-text-primary">
          {post.title}
        </h3>
        <p className="text-text-secondary leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Topic badge */}
      <div className="flex gap-2 flex-wrap">
        <SeverityBadge severity={post.topic?.toLowerCase()} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-accent-gold/20">
        <GlassButton 
          variant="ghost" 
          size="sm"
          icon={ThumbsUp}
          onClick={handleLike}
        >
          {post.likes || 0}
        </GlassButton>
        <GlassButton 
          variant="ghost" 
          size="sm"
          icon={MessageCircle}
          onClick={() => onReply(post.id)}
        >
          Reply
        </GlassButton>
      </div>
    </GlassCard>
  );
}
```

---

### 2.2 ForumScreen

**File**: `src/screens/ForumScreen.jsx`

**Structure**:

```jsx
import { GlassCard, GlassButton, LanguagePill } from '@/components/GlassUI';
import { PostCard } from '@/components/forum/PostCard';
import { Plus } from 'lucide-react';

export default function ForumScreen() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [posts, setPosts] = useState([]);

  return (
    <main className="min-h-screen bg-glass-deep pt-20 pb-16">
      <div className="contain-layout">
        
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-h1 font-serif text-text-primary mb-2">
              {t('forum.title') || 'Community Support Circle'}
            </h1>
            <p className="text-text-secondary">
              Share experiences, ask questions, support each other
            </p>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-label text-accent-mauve">
              {t('language')}
            </label>
            <LanguagePill
              languages={[
                { code: 'en', label: 'English' },
                { code: 'te', label: 'Telugu' },
                { code: 'ta', label: 'Tamil' },
              ]}
              activeLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {/* New Post Button */}
          <div className="flex gap-3">
            <GlassButton 
              variant="primary" 
              icon={Plus}
              onClick={() => navigate('/forum/new')}
            >
              New Post
            </GlassButton>
          </div>
        </div>

        {/* Topic Filter Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {['PCOS', 'Anemia', 'Menstrual Health', 'Remedies', 'Wellness'].map((topic) => (
            <GlassButton
              key={topic}
              variant={selectedTopic === topic ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </GlassButton>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              onReply={(postId) => navigate(`/forum/${postId}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <GlassCard className="text-center py-12">
            <p className="text-text-secondary mb-4">
              No posts yet. Be the first to share!
            </p>
            <GlassButton variant="primary" icon={Plus}>
              Start a Discussion
            </GlassButton>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
```

---

### 2.3 SymptomScreen

**File**: `src/screens/SymptomScreen.jsx`

**Structure**:

```jsx
import { GlassCard, GlassInput, GlassButton, SkeletonLoader } from '@/components/GlassUI';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function SymptomScreen() {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // API call
      const result = await analyzeSymptoms(symptoms);
      // Handle result
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-glass-deep pt-20 pb-16">
      <div className="contain-layout max-w-2xl">

        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-h1 font-serif text-text-primary">
            Symptom Insights
          </h1>
          <p className="text-text-secondary">
            Describe your symptoms. Get personalized insights powered by AI.
          </p>
        </div>

        {/* Input Section */}
        <GlassCard accent className="space-y-6 mb-8">
          <div>
            <label className="text-label text-accent-mauve">
              What's bothering you?
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms, duration, severity..."
              className="glass-input w-full h-32 resize-none mt-2"
              style={{
                backgroundColor: 'rgba(72, 25, 46, 0.3)',
                borderBottom: '1px solid var(--accent-gold)',
                padding: '1rem'
              }}
            />
          </div>

          {error && (
            <StateMessage 
              type="error" 
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          <GlassButton
            variant="primary"
            icon={Sparkles}
            loading={loading}
            disabled={!symptoms || loading}
            onClick={handleAnalyze}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Get AI Insights'}
          </GlassButton>
        </GlassCard>

        {/* Results Section */}
        {loading && (
          <GlassCard>
            <SkeletonLoader count={3} height="h-12" />
          </GlassCard>
        )}

        {!loading && analysis && (
          <GlassCard accent className="space-y-6">
            <div>
              <h2 className="text-h3 font-serif text-text-primary mb-4">
                Analysis Results
              </h2>
              
              {/* Severity Badge */}
              <div className="mb-6">
                <label className="text-label text-accent-mauve">Severity</label>
                <SeverityBadge severity={analysis.severity} />
              </div>

              {/* AI Response (Georgia italic) */}
              <div 
                style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  borderLeft: '3px solid var(--accent-gold)',
                  paddingLeft: '1rem'
                }}
              >
                {analysis.response}
              </div>

              {/* Powered by label */}
              <p className="text-xs text-accent-mauve font-mono mt-4">
                Powered by Gemini 2.5 Flash
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-accent-gold/20">
              <GlassButton 
                variant="primary" 
                onClick={() => navigate('/results')}
              >
                View Full Analysis
              </GlassButton>
              <GlassButton 
                variant="ghost"
                onClick={() => navigate('/remedy')}
              >
                Browse Remedies
              </GlassButton>
            </div>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
```

---

### 2.4 RemedyScreen

**File**: `src/screens/RemedyScreen.jsx`

**Structure**:

```jsx
import { GlassCard, GlassBadge, GlassButton } from '@/components/GlassUI';
import { Leaf, AlertCircle } from 'lucide-react';

export function RemedyCard({ remedy }) {
  // Evidence level shown as copper dots (1-3)
  const dots = Array(remedy.evidenceLevel || 2).fill('●');

  return (
    <GlassCard accent className="space-y-4 h-full flex flex-col">
      
      {/* Category Icon & Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-h4 font-serif text-text-primary mb-1">
            {remedy.name}
          </h3>
          <p className="text-sm text-accent-mauve font-mono uppercase">
            {remedy.category}
          </p>
        </div>
        <Leaf size={24} className="text-accent-gold" />
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm flex-grow">
        {remedy.description}
      </p>

      {/* Evidence Level - Copper Dots */}
      <div className="space-y-1">
        <p className="text-xs text-accent-mauve font-mono">Evidence Level</p>
        <p style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>
          {dots.join('')}
        </p>
      </div>

      {/* Safety Notes - Rose-red accent */}
      {remedy.safety && (
        <div 
          className="bg-glass rounded-lg p-3 border-l-2 border-accent-rose"
          style={{ borderLeftColor: 'var(--accent-rose)' }}
        >
          <div className="flex gap-2">
            <AlertCircle size={16} className="text-accent-rose flex-shrink-0" />
            <p className="text-xs text-accent-rose">
              {remedy.safety}
            </p>
          </div>
        </div>
      )}

      {/* Learn More Button */}
      <GlassButton variant="secondary" size="sm" className="w-full">
        Learn More
      </GlassButton>
    </GlassCard>
  );
}

export default function RemedyScreen() {
  const [remedies, setRemedies] = useState([]);

  return (
    <main className="min-h-screen bg-glass-deep pt-20 pb-16">
      <div className="contain-layout">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-serif text-text-primary mb-2">
            Remedies Library
          </h1>
          <p className="text-text-secondary">
            Evidence-aware remedies for women's health
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['All', 'PCOS', 'Anemia', 'Menstrual', 'Wellness'].map((cat) => (
            <GlassButton
              key={cat}
              variant={cat === 'All' ? 'primary' : 'secondary'}
              size="sm"
            >
              {cat}
            </GlassButton>
          ))}
        </div>

        {/* Remedy Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {remedies.map((remedy) => (
            <RemedyCard key={remedy.id} remedy={remedy} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

---

## Phase 3: Enhanced Features

### 3.1 ResultsScreen (AI Analysis Panel)

**File**: `src/screens/ResultsScreen.jsx`

**Spec**: Deeper glass (blur 30px), left vertical copper rule, Georgia italic response text

```jsx
import { GlassCard } from '@/components/GlassUI';

export default function ResultsScreen() {
  const analysis = useLocation().state?.analysis;

  return (
    <main className="min-h-screen bg-glass-deep pt-20 pb-16">
      <div className="contain-layout max-w-3xl">

        {/* Header */}
        <h1 className="text-h1 font-serif text-text-primary mb-8">
          Your Analysis
        </h1>

        {/* Deep Glass Analysis Panel */}
        <GlassCard 
          deep 
          className="space-y-6"
          style={{
            borderLeft: '4px solid var(--accent-gold)',
            backgroundImage: `
              radial-gradient(circle at top right, rgba(197, 156, 121, 0.08), transparent 60%),
              radial-gradient(circle at bottom left, rgba(149, 112, 131, 0.06), transparent 60%)
            `
          }}
        >
          
          {/* Severity & Classification */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-label text-accent-mauve mb-2">Severity</p>
              <SeverityBadge severity={analysis.severity} />
            </div>
            <div>
              <p className="text-label text-accent-mauve mb-2">Onset</p>
              <p className="text-text-primary">{analysis.onset}</p>
            </div>
            <div>
              <p className="text-label text-accent-mauve mb-2">Duration</p>
              <p className="text-text-primary">{analysis.duration}</p>
            </div>
            <div>
              <p className="text-label text-accent-mauve mb-2">Recommendation</p>
              <p className="text-text-primary">{analysis.recommendation}</p>
            </div>
          </div>

          {/* AI Response - Georgia Italic */}
          <div className="border-t border-accent-gold/20 pt-6">
            <p className="text-label text-accent-mauve mb-4">Analysis</p>
            <p 
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                paddingLeft: '1rem',
                borderLeft: '2px solid var(--accent-gold)'
              }}
            >
              {analysis.response}
            </p>
          </div>

          {/* Powered by Label */}
          <div className="text-center pt-4 border-t border-accent-gold/20">
            <p className="text-xs text-accent-mauve font-mono">
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        </GlassCard>

        {/* Related Remedies Section */}
        <div className="mt-12">
          <h2 className="text-h2 font-serif text-text-primary mb-6">
            Recommended Remedies
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.remedies?.map((remedy) => (
              <RemedyCard key={remedy.id} remedy={remedy} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

### 3.2 JournalScreen (Calendar + Timeline)

**File**: `src/screens/JournalScreen.jsx`

**Spec**: Calendar grid with copper pulse dots on active days, mood timeline SVG with copper stroke

```jsx
import { GlassCard, GlassButton, GlassInput } from '@/components/GlassUI';
import { Calendar, TrendingUp } from 'lucide-react';

export default function JournalScreen() {
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calendar grid
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

  return (
    <main className="min-h-screen bg-glass-deep pt-20 pb-16">
      <div className="contain-layout max-w-4xl">

        {/* Header */}
        <h1 className="text-h1 font-serif text-text-primary mb-8">
          Wellness Journal
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Left: Calendar */}
          <div className="md:col-span-1">
            <GlassCard accent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-h4 text-text-primary">
                  {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <Calendar size={20} className="text-accent-gold" />
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div 
                    key={day} 
                    className="text-center text-xs font-mono text-accent-mauve p-1"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty starting cells */}
                {Array(firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Day cells */}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
                  const hasEntry = entries[dateStr];

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                      className={`
                        aspect-square rounded-lg text-sm font-mono relative
                        transition-all duration-200 hover:bg-accent-gold/10
                        ${hasEntry ? 'bg-glass-surface/60' : 'bg-glass/30'}
                      `}
                    >
                      {/* Copper pulse dot for active days */}
                      {hasEntry && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            animation: 'pulse-glow 2s ease-in-out infinite'
                          }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: 'var(--accent-gold)',
                              boxShadow: '0 0 8px var(--accent-gold)'
                            }}
                          />
                        </div>
                      )}
                      <span className="relative z-10 text-text-primary">
                        {day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Right: Entry Form */}
          <div className="md:col-span-2">
            <GlassCard accent className="space-y-6">
              <div>
                <h3 className="text-h4 font-serif text-text-primary mb-1">
                  {selectedDate.toDateString()}
                </h3>
                <p className="text-text-secondary text-sm">
                  How are you feeling today?
                </p>
              </div>

              {/* Mood selector */}
              <div className="space-y-2">
                <label className="text-label text-accent-mauve">Mood</label>
                <div className="flex gap-2">
                  {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                    <button
                      key={i}
                      className="text-2xl p-2 rounded-lg transition-all hover:scale-110 hover:shadow-lg"
                      onClick={() => setMood(i)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry text */}
              <div>
                <label className="text-label text-accent-mauve mb-2 block">
                  Notes
                </label>
                <textarea
                  placeholder="How are you feeling? Any symptoms? Energy levels?"
                  className="glass-input w-full h-24 resize-none"
                  onChange={(e) => setEntry(e.target.value)}
                />
              </div>

              {/* Save button */}
              <GlassButton variant="primary" className="w-full">
                Save Entry
              </GlassButton>
            </GlassCard>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-12">
          <h2 className="text-h2 font-serif text-text-primary mb-6">
            Mood Trends
          </h2>
          
          <GlassCard deep className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-accent-gold" />
              <h3 className="font-serif text-h4 text-text-primary">
                Last 30 Days
              </h3>
            </div>

            {/* SVG Line Chart */}
            <svg width="100%" height="200" className="bg-gradient-to-b from-accent-gold/5 to-transparent rounded-lg p-4">
              {/* Chart implementation - copper stroke line */}
              <polyline
                points={moodChartPoints}
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="2"
              />
              {/* Gradient fill */}
              <polygon
                points={moodChartPoints + ` ${chartWidth} 200 0 200`}
                fill="url(#copperGradient)"
                opacity="0.2"
              />
              <defs>
                <linearGradient id="copperGradient">
                  <stop offset="0%" stopColor="var(--accent-gold)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>

            <p className="text-xs text-accent-mauve font-mono">
              Data collected from your daily journal entries
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
```

---

### 3.3 Modals (GlassModal Component)

**File**: Any screen with modal/dialog (confirmation, settings, etc.)

```jsx
import { GlassModal, GlassButton } from '@/components/GlassUI';

export default function SomeScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <GlassButton onClick={() => setShowModal(true)}>
        Open Modal
      </GlassButton>

      <GlassModal
        isOpen={showModal}
        title="Confirm Action"
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to proceed? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <GlassButton 
              variant="primary"
              onClick={handleConfirm}
            >
              Yes, Proceed
            </GlassButton>
            <GlassButton 
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </>
  );
}
```

---

## Code Patterns & Templates

### General Layout Pattern

All screens follow this structure:

```jsx
import { GlassCard, GlassButton } from '@/components/GlassUI';

export default function ScreenName() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-glass-deep pt-20 pb-16">
      <div className="contain-layout">
        
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-h1 font-serif text-text-primary">
            Screen Title
          </h1>
          <p className="text-text-secondary">
            Subtitle or description
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Cards go here */}
          <GlassCard accent>
            {/* Card content */}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
```

### State Message Pattern

Show errors, success, warnings, info:

```jsx
import { StateMessage } from '@/components/GlassUI';
import { AlertCircle, CheckCircle } from 'lucide-react';

{error && (
  <StateMessage
    type="error"
    icon={AlertCircle}
    message={error}
    dismissible
    onDismiss={() => setError('')}
  />
)}

{success && (
  <StateMessage
    type="success"
    icon={CheckCircle}
    message="Saved successfully!"
  />
)}
```

### Responsive Grid Pattern

```jsx
{/* Auto-responsive grid */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <GlassCard key={item.id} accent>
      {/* Item content */}
    </GlassCard>
  ))}
</div>

{/* Force single column on mobile */}
<div className="grid gap-4 md:grid-cols-2">
  <GlassCard accent>Left</GlassCard>
  <GlassCard accent>Right</GlassCard>
</div>
```

---

## Testing & Validation

### 1. Visual Testing Checklist

- [ ] **Colors**: Verify dark background, copper accents, ivory text
- [ ] **Glass Effect**: Blur visible, semi-transparent cards
- [ ] **Typography**: Serif headings, sans body, mono labels
- [ ] **Borders**: Left copper accent on cards, copper bottom on inputs
- [ ] **Hover States**: Card lift (-4px), button color shift, link underline
- [ ] **Responsive**: Check mobile (< 640px), tablet, desktop layouts

### 2. Component Verification

```jsx
// Test each component:
// GlassCard ✅ - Should have glass effect, lift on hover
// GlassButton ✅ - All 3 variants working
// GlassInput ✅ - Bottom border, placeholder color, focus state
// GlassBadge ✅ - All color variants
// LanguagePill ✅ - Selection highlighting
// LoadingSpinner ✅ - Copper rotation animation
// SkeletonLoader ✅ - Shimmer animation
// StateMessage ✅ - All 4 types render correctly
```

### 3. Performance Check

```bash
npm run build
# Check:
# - CSS file size (should be ~60KB gzipped)
# - No console warnings
# - No layout shifts
# - Animation frame rate (60fps)
```

### 4. Browser Compatibility

- Chrome 76+ ✅
- Safari 9+ ✅
- Firefox 103+ ✅
- Mobile browsers ✅

---

## Migration Checklist

Track progress by marking complete:

### Phase 1: Critical
- [ ] Create glassmorphism.css ✅ (Already done)
- [ ] Update Navbar
- [ ] Refactor buttons to GlassButton
- [ ] Update inputs to GlassInput

### Phase 2: Core Screens
- [ ] ForumScreen → glass cards, copper rings, teal tint
- [ ] SymptomScreen → glass inputs, copper buttons
- [ ] RemedyScreen → remedy cards with evidence dots, safety chips

### Phase 3: Enhanced
- [ ] ResultsScreen → deep glass panel, Georgia italic
- [ ] JournalScreen → calendar with copper pulse dots, mood timeline
- [ ] Modals → deep glass, copper header strip

### Polish & QA
- [ ] Mobile responsiveness testing
- [ ] Animation performance check
- [ ] Cross-browser testing
- [ ] Accessibility review
- [ ] Final design review

---

## Common Gotchas

### 1. Text Color Issues

```jsx
// ❌ Too dark on dark background
className="text-primary" // #6D5BD0 won't show on #281822

// ✅ Use correct text colors
className="text-text-primary"   // #f5f0eb - main text
className="text-text-secondary" // #d4ccc1 - secondary
className="text-accent-gold"    // #c59c79 - emphasis
```

### 2. Glass Effect Not Showing

```jsx
// Make sure backdrop-filter property is present
<div className="glass">  {/* ✅ Includes backdrop-filter */}
<div className="bg-glass-surface"> {/* ❌ Missing backdrop-filter */}
```

### 3. Font Loading Delays

```jsx
// Add font preload in index.html <head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap" rel="preload" as="style">
```

### 4. Mobile Bottom Tab Bar

Original prompt mentions "collapses to bottom tab bar" - implement when reaching mobile size:

```jsx
{/* Desktop Nav */}
<div className="hidden md:flex gap-6">
  {/* Desktop navigation */}
</div>

{/* Mobile Bottom Tab Bar */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 glass h-16 border-t border-accent-gold/30">
  <div className="flex justify-around items-center h-full">
    {navLinks.map(link => (
      <button 
        key={link.path}
        className={location.pathname === link.path ? 'text-accent-gold' : 'text-accent-mauve'}
      >
        {link.icon}
      </button>
    ))}
  </div>
</nav>
```

---

## Estimated Time Breakdown

| Phase | Component | Time |
|-------|-----------|------|
| 1 | Navbar | 30 min |
| 1 | Buttons & Inputs | 45 min |
| 2 | ForumScreen | 1 hour |
| 2 | SymptomScreen | 45 min |
| 2 | RemedyScreen | 45 min |
| 3 | ResultsScreen | 30 min |
| 3 | JournalScreen | 1 hour |
| 3 | Modals & Polish | 30 min |
| **TOTAL** | | **~5.5 hours** |

---

## Resources & References

- **Glassmorphism**: ui.glass, Dribbble "dark glass UI"
- **Design Components**: GlassUI.jsx (pre-built)
- **Icon Library**: lucide.dev
- **Colors**: DESIGN_SYSTEM.md
- **Fonts**: Google Fonts (Cormorant Garamond, DM Sans, DM Mono)
- **Animations**: Tailwind + custom CSS in glassmorphism.css

---

**Good luck with the redesign! 🎨**  
Follow this guide section-by-section and test frequently. The design system is already in place—just apply the patterns to each screen.

