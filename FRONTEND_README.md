# Frontend README - Sahachari AI Symptom Analyzer for Women

## Overview

Sahachari is a comprehensive women's health application designed to help women understand their menstrual cycles, track symptoms, access remedies, connect with community, and find nearby healthcare resources. The frontend is built with React, Vite, and styled with Tailwind CSS.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Pages/Screens Documentation](#pagesscreens-documentation)
3. [Key Features](#key-features)
4. [Design System](#design-system)
5. [Navigation](#navigation)

---

## Architecture Overview

### Tech Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context (Theme)
- **Firebase Integration**: Authentication, Firestore, Storage
- **Localization**: react-i18next
- **Icons**: Lucide React
- **Google Maps**: For location-based services

### Project Structure
```
src/
├── screens/           # Page components
├── components/        # Reusable components
├── context/          # React Context providers
├── services/         # Firebase & API services
├── hooks/            # Custom React hooks
├── locales/          # i18n translations
├── styles/           # Global styles
└── utils/            # Utility functions
```

---

## Pages/Screens Documentation

### 1. **LoginScreen** (`/`)
**Route**: `/`  
**Access**: Public (unauthenticated users)  
**Status**: Required for app entry

#### Purpose
Landing page where users authenticate to access the application.

#### Features
- **Authentication Methods**:
  - Anonymous login (auto-generated account)
  - Email/password signup
  - Email/password login

- **UI Elements**:
  - Tab-based authentication (Login/Signup)
  - Email input field
  - Password field with show/hide toggle
  - Disclaimer acceptance checkbox (required for signup)
  - Confirm password field (signup only)
  - Loading states with spinner

#### Key Components
- `Heart` icon branding
- Error message display
- Loading indicators
- Password visibility toggle

---

### 2. **HomeScreen** (`/home`)
**Route**: `/home`  
**Access**: Authenticated users only  
**Status**: Primary dashboard

#### Purpose
Main homepage providing personalized menstrual cycle insights and daily recommendations.

#### Features
- **Hero Section**:
  - Large banner image with gradient overlay
  - Current cycle phase information (e.g., "Luteal Phase · Day 22")
  - Copper accent line separator
  - Personalized message based on cycle phase
  - Quick action buttons (Daily Check-in, My Insights)

- **Daily Rituals Section**:
  - Grid of 3 personalized wellness rituals
  - Each ritual card includes:
    - High-quality image
    - Activity title
    - Duration time
    - Play button overlay for potential video/audio content
    - Hover scale animation
  - Responsive breakpoints (1 column mobile, 3 columns desktop)

- **Featured Remedies Section**:
  - Two featured remedy cards (2-column grid)
  - Each card contains:
    - Background image with gradient overlay
    - Category badge (Herbal Wisdom, Mindful Nutrition, etc.)
    - Title and description
    - Call-to-action button
  - Different styling per card (copper vs. teal accents)

#### Styling Details
- Very large typography (text-7xl to text-8xl for main title)
- Serif italic fonts for titles
- Copper and teal accent colors
- Kurobeni background (dark burgundy)
- Responsive padding and spacing
- Glass-morphism effects on overlays

#### User Interactions
- Browse daily rituals
- View featured articles/recipes
- Quick access to insights

---

### 3. **SymptomScreen** (`/symptoms`)
**Route**: `/symptoms`  
**Access**: Authenticated users only  
**Status**: Core feature

#### Purpose
Allow users to log and track their current symptoms during their menstrual cycle.

#### Expected Features
- Symptom selection interface
- Multi-select symptom picker
- Symptom severity/intensity levels
- Symptom notes/descriptions
- Submit for analysis
- Symptom tracking history

#### Usage Flow
1. User selects current symptoms from predefined list
2. Rates severity if applicable
3. Adds optional notes
4. Submits for AI analysis

---

### 4. **ResultsScreen** (`/results`)
**Route**: `/results`  
**Access**: Authenticated users only  
**Status**: Core feature

#### Purpose
Display analysis results based on reported symptoms and provide personalized recommendations.

#### Expected Features
- Symptom analysis summary
- Wellness recommendations
- Suggested remedies based on symptoms
- Personalized advice tied to cycle phase
- Risk assessment (if applicable)
- Related articles/resources
- Navigation to relevant remedies

#### Data Display
- Clear, easy-to-understand analysis
- Color-coded severity indicators
- Actionable recommendations
- Links to related remedies

---

### 5. **ForumScreen** (`/forum`)
**Route**: `/forum`  
**Access**: Authenticated users only  
**Status**: Community feature

#### Purpose
Community discussion space where users can share experiences, ask questions, and support each other.

#### Features
- **Forum Post List**:
  - Display all community posts
  - Post cards showing:
    - Title and content preview
    - Author name
    - Timestamp
    - Thread stats (replies, views)
    - Category/tags
    - User avatar
  - Sorting/filtering options
  - Search functionality (optional)

- **Post Creation**:
  - "New Post" button linking to `/forum/new`
  - Access for creating new discussion threads

- **Post Navigation**:
  - Click post to open thread view
  - Reply counter for engagement

#### User Interactions
- Browse community posts
- Create new posts
- View full threads
- Reply to posts

---

### 6. **ThreadScreen** (`/forum/:postId`)
**Route**: `/forum/:postId`  
**Access**: Authenticated users only  
**Status**: Community feature

#### Purpose
Display full thread of a single forum post with all replies and discussion.

#### Features
- **Post View**:
  - Display original post content
  - Author information
  - Post creation date
  - Full content (not truncated)

- **Replies Section**:
  - List all replies in chronological order
  - Each reply shows:
    - User avatar
    - Username
    - Reply timestamp
    - Reply content
    - Like/reaction buttons
    - Reply-to-reply option

- **Reply Input**:
  - Text input for new replies
  - Submit button
  - Character limit (optional)
  - Real-time validation

#### Navigation
- Back button to forum list
- Users can navigate to other threads

---

### 7. **NewPostScreen** (`/forum/new`)
**Route**: `/forum/new`  
**Access**: Authenticated users only  
**Status**: Community feature

#### Purpose
Create and publish new community forum posts.

#### Features
- **Post Creation Form**:
  - Title input field
  - Rich text editor/textarea for content
  - Category/tag selection
  - Anonymous posting option (optional)
  - Character count display

- **Publication Controls**:
  - Submit/Publish button
  - Preview functionality
  - Save as draft (optional)
  - Cancel button

#### User Experience
- Form validation before submission
- Success confirmation
- Redirect to newly created post
- Error handling for submission failures

---

### 8. **RemedyScreen** (`/remedy`)
**Route**: `/remedy`  
**Access**: Authenticated users only  
**Status**: Core feature - Library

#### Purpose
Comprehensive library of natural remedies, wellness practices, and self-care solutions for different cycle phases.

#### Features
- **Category Filters**:
  - All, Herbal, Movement, Nutrition, Mindfulness
  - Horizontal scrollable filter bar
  - Active filter highlighted (copper background)
  - Single-select filtering

- **Remedy Grid**:
  - Responsive grid (1 column mobile, 2-3 columns desktop)
  - Each remedy card displays:
    - High-quality cover image
    - Category badge (copper text, uppercase)
    - Remedy title (serif italic)
    - Preparation/duration time
    - "Learn More" button with chevron icon
    - Hover scale effect on image

- **Remedy Information**:
  - Title and description
  - Category classification
  - Time/difficulty level
  - Visual identification

#### Styling Features
- Glass-card effect on remedy cards
- Category-based organization
- Consistent typography
- Responsive image aspect ratios
- Hover animations (scale + opacity)

#### User Interactions
- Filter by category
- Browse remedy library
- Click to view detailed remedy information
- Responsive on all device sizes

---

### 9. **JournalScreen** (`/journal`)
**Route**: `/journal`  
**Access**: Authenticated users only  
**Status**: Core feature - Personal tracking

#### Purpose
Personal journal for users to record daily reflections, mood, energy levels, and cycle-related notes.

#### Expected Features
- **Journal Entry List**:
  - Chronological display of past entries
  - Date indicators
  - Entry previews
  - Quick access to edit/delete

- **New Entry Creation**:
  - Date picker (auto-filled with today)
  - Mood/energy level selector
  - Rich text editor for thoughts
  - Tags for categorization
  - Save functionality

- **Entry View**:
  - Display full entry details
  - Edit/delete options
  - Share functionality (optional)

#### Data Fields
- Date
- Mood (emoji/scale selector)
- Energy level
- Cycle day/phase
- Physical symptoms
- Emotional notes
- Freeform text

---

### 10. **NearbyHelpScreen** (`/nearby`)
**Route**: `/nearby`  
**Access**: Authenticated users only  
**Status**: Location-based utility

#### Purpose
Find nearby healthcare providers, gynecologists, wellness centers, and emergency medical facilities.

#### Features
- **Dual-Panel Layout**:
  - Split screen on desktop: Map (left) + Results (right)
  - Stacked on mobile: Map top, List bottom

- **Map Integration**:
  - Google Maps with user location marker
  - Nearby place markers (color-coded by type)
  - Interactive marker click for details
  - Map zoom controls
  - Real-time location updates

- **Place Type Selector**:
  - Filter by healthcare type
  - Options: Gynecologist, Hospital, Pharmacy, Mental Health, Wellness Center, etc.

- **Radius Filter**:
  - Adjustable search radius: 1km, 3km, 5km, 10km
  - Dynamic place filtering based on radius

- **Results List**:
  - Card-based display of nearby places
  - Shows:
    - Place name
    - Address
    - Distance from user
    - Rating/reviews
    - Contact phone
    - Website/directions link
  - Sortable by distance
  - Selected place highlights on map

- **Place Actions**:
  - Call directly (tel: link)
  - View directions (Google Maps link)
  - Visit website
  - View more details

#### Technical Features
- Geolocation API for user location
- Google Places API for nearby search
- Dynamic distance calculation
- Loading states and error handling
- Location permission handling

---

### 11. **DiscoverScreen** (`/discover`)
**Route**: `/discover`  
**Access**: Authenticated users only  
**Status**: Unified location-based discovery

#### Purpose
Enhanced discover page combining health resources, nearby providers, and community recommendations with cohesive styling.

#### Features
- **Responsive Dual Layout**:
  - Desktop: Side-by-side map and list (55% map, 45% sidebar)
  - Mobile: Stacked layout with map above results

- **Header Section**:
  - Title: "Discover"
  - Subtitle: "Find healthcare resources near you"
  - Current location display with map pin icon

- **Sidebar Controls** (Desktop) / Top Section (Mobile):
  - Location badge
  - Service type selector (Gynecologist, Hospital, etc.)
  - Search radius buttons (1km, 3km, 5km, 10km)
  - Color-coded active button (copper/kurobeni)

- **Map View**:
  - Full Google Maps integration
  - User location marker
  - Searchable places markers
  - Zoom and pan controls
  - Responsive sizing

- **Results List**:
  - Animated card list
  - Place cards show:
    - Name and address
    - Distance
    - Contact info
    - Action buttons
  - Staggered animation effect (50ms delays)
  - Loading skeletons during search
  - Empty state with helpful suggestions

- **Interactive Features**:
  - Click map marker → scroll to list item
  - Click list item → highlight on map
  - Directions link opens Google Maps
  - Call button initiates phone call
  - Radius change triggers new search

#### Design Cohesion
- Consistent with app color scheme:
  - Background: `bg-kurobeni` (deep burgundy)
  - Text: `text-ivory` (cream)
  - Accents: `text-copper` (rose-gold)
- Typography:
  - Titles: `font-serif italic` (large)
  - Labels: `font-mono uppercase` (small)
  - Body: Normal weight
- Border and glass effects:
  - `border-copper/20` (subtle dividers)
  - `glass-nav` effects for backgrounds
  - `rounded-lg` and `rounded-3xl` for cards and sections

#### Error Handling
- Map loading state
- Geolocation permission denied (defaults to Chennai)
- API errors with retry option
- Empty results with actionable suggestions

---

### 12. **AdminSeedScreen** (`/admin-seed`)
**Route**: `/admin-seed`  
**Access**: Development/Admin only  
**Status**: Development utility

#### Purpose
Development/testing utility for seeding the database with sample data. Not intended for production users.

#### Features
- Data population for testing
- Sample user creation
- Sample content generation
- Database initialization

#### Note
This page is typically hidden from normal users and only accessible for development/testing purposes.

---

## Key Features

### Authentication
- Anonymous account creation
- Email/password signup and login
- Session management
- Secure logout

### Core Tracking
- Symptom logging
- AI-powered analysis
- Cycle tracking and phase detection
- Daily wellness recommendations

### Community & Support
- Forum discussions
- Post creation and threaded replies
- User interaction and engagement

### Resources
- Remedy library with categorization
- Personalized recommendations
- Healthcare provider discovery
- Location-based services

### Personalization
- Theme support (light/dark depending on implementation)
- Cycle-phase-aware content
- Personalized wellness recommendations
- Multi-language support (i18n)

---

## Design System

### Color Palette
- **Primary Text**: `text-ivory` (cream/off-white)
- **Primary Background**: `bg-kurobeni` (deep burgundy)
- **Accent Primary**: `text-copper` (rose-gold)
- **Accent Secondary**: `text-teal` (muted teal)
- **Danger**: `text-rose` (red/rose)

### Typography
- **Headings**: `font-serif italic` (serif font, italicized)
- **Body**: Standard sans-serif
- **Labels/Metadata**: `font-mono uppercase` (monospace, uppercase)

### Spacing & Sizing
- **Container**: `max-w-5xl mx-auto` or `max-w-6xl mx-auto`
- **Padding**: `px-4 sm:px-6 lg:px-8 py-8`
- **Section spacing**: `space-y-12` or `space-y-8` between major sections
- **Grid gaps**: `gap-4 sm:gap-6 lg:gap-8`

### Border Radius
- **Large elements**: `rounded-[40px]` or `lg:rounded-[40px]`
- **Medium elements**: `rounded-3xl` or `rounded-2xl`
- **Small elements**: `rounded-lg` or `rounded-full`

### Special Effects
- **Glass effect**: `glass-nav`, `glass-card` classes
- **Gradients**: `bg-gradient-to-t from-kurobeni` overlays
- **Hover animations**: `transition-transform duration-700 group-hover:scale-110`
- **Opacity overlays**: `bg-kurobeni/20` etc.

---

## Navigation

### Main Navigation (Desktop)
Located in top navbar (Navbar component):
- Health (`/home`)
- Community (`/forum`)
- Symptoms (`/symptoms`)
- Remedies (`/remedy`)
- Discover (`/discover`)
- Journal (`/journal`)
- Nearby (`/nearby`)
- Logout button

### Mobile Navigation (Mobile Bottom Bar)
Located at bottom of screen (MobileNav component):
- Same routes as desktop
- Icon-based representation
- Space-efficient tab bar format

### Route Guard
- Unauthenticated users: Redirected to `/` (LoginScreen)
- Authenticated users: Full access to all pages
- Auto-redirect: Non-logged-in users attempting protected routes go to login

### Navigation Highlights
- Active route indication (text color changes to copper)
- Smooth transitions between pages
- Mobile-responsive layout adjustments

---

## Development Notes

### Key Dependencies
- `react-router-dom`: Client-side routing
- `react-i18next`: Internationalization
- `lucide-react`: Icon library
- `firebase`: Backend services
- `tailwindcss`: Utility-first CSS
- `vite`: Fast build tool

### Important Config Files
- `vite.config.js`: Vite configuration
- `tailwind.config.js`: Tailwind theming
- `tsconfig.json`: TypeScript configuration
- `postcss.config.js`: PostCSS configuration

### Environment Variables Required
- `VITE_GOOGLE_MAPS_KEY`: Google Maps API key
- Firebase configuration variables
- Any translation/localization keys

---

## Performance Considerations

1. **Code Splitting**: Routes are lazy-loaded via React Router
2. **Image Optimization**: External images from Unsplash with query parameters
3. **Animation Performance**: Use of CSS transitions and transform properties
4. **Mobile First**: Responsive design starting from mobile constraint
5. **Accessibility**: Semantic HTML, icon descriptions, proper contrast

---

## Future Enhancements

- Real-time notifications
- Push notifications for health reminders
- Export health data as PDF
- Advanced analytics dashboard
- Video tutorials library
- Integration with wearable devices
- Dark mode toggle
- Accessibility improvements
- Performance monitoring
- Analytics integration

---

## Support & Documentation

For more information, refer to:
- Component documentation in individual screen files
- Firebase documentation
- Tailwind CSS documentation
- React Router documentation
- i18next translation guide
