# Sahachari / Vaazhvu (Women's Health Companion)

A privacy-first women's health companion with AI-backed symptom analysis, multilingual community support, and evidence-aware remedies recommendations.

**[[Globe] Live Demo](https://women-ai-cd813.web.app)**

## [Sparkles] Features

### [Flower] Symptom Insights
- **AI-Powered Analysis:** Uses Gemini 1.5 Flash API for real-time symptom interpretation
- **Privacy-First:** All analysis processed securely with Firestore, minimal data retention
- **Culturally Contextualized:** Localized medical terminology and health awareness notes
- **Structured Output:** Severity classification (Low/Medium/High), differential analysis, and recommended next steps

### [Leaf] Remedies Library
- **Evidence-Aware**: Cross-references common myths with scientific literature
- **Structured Database**: Organized by conditions (PCOS, Anemia, Menstrual Health, General Wellness)
- **Safety Notes**: Contraindications, drug interactions, and when to seek professional care
- **Full-Text Search**: Firestore-based indexing for instant recipe/remedy discovery

### [MessageSquare] Community Forum (Support Circle)
- **Multilingual Stack:** Telugu, Malayalam, Tamil, Kannada, Hindi + English
- **Language-Based Filtering:** Firestore queries segregate content by selected language
- **Dual Moderation Pipeline:** 
  - Hugging Face sentiment analysis (offensive language detection)
  - Gemini safety API (contextual misinformation check)
- **Threaded Architecture:** Parent posts with nested replies, lightweight emoji reactions
- **Real-time Updates:** Cloud Firestore listeners for instant comment notifications

### [BookOpen] Wellness Journal & Geolocation
- **Temporal Analytics:** Track symptom patterns, mood trends, and health metrics
- **Nearby Healthcare Discovery:** Google Places API integration for nearest pharmacies, clinics, hospitals
- **Geofencing:** Location-based alerts for health services within configurable radius

## [Blocks] Tech Stack

### Frontend
- **Framework:** React 18 + Vite (SPA with HMR)
- **Styling:** Tailwind CSS 3.4 + PostCSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Routing:** React Router v6 (client-side SPAs)
- **Internationalization:** i18next with language-specific `locales/` bundles
- **Testing:** Vitest 4 + React Testing Library + jsdom

### Backend & Data
- **Authentication:** Firebase Auth (multi-provider: email, Google, anonymous)
- **Database:** Firestore (Realtime + Cloud Functions)
- **Hosting:** Firebase Hosting (CDN, Vite build output)
- **Storage:** Firebase Cloud Storage (images, journal attachments)
- **Rules Engine:** Firestore Security Rules + Custom Claims

### AI/ML Services
- **Symptom Analysis:** Google Gemini 1.5 Flash API
- **Content Moderation:** Hugging Face Inference API (sentiment classification)
- **Safety Checks:** Gemini API safety filters
- **Geolocation:** Google Places API (nearby healthcare discovery)

### DevOps & CI/CD
- **VCS:** GitHub
- **CI/CD Pipeline:** GitHub Actions (automated build & deploy on push to main)
- **Build:** Vite (esbuild/Rollup bundling)
- **Deployment:** Firebase Hosting CLI (auto-triggered on main branch)

## [Rocket] Run Locally (Step by Step)

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or pnpm
- Firebase project with Firestore enabled (Native mode, not Datastore)

### Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/ManvithaDungi/AI_SymptomAnalyserForWomen.git
   cd AI_SymptomAnalyserForWomen
   ```

2. **Install Dependencies**
   ```bash
   npm ci  # or: pnpm install
   ```

3. **Configure Environment Variables**
   
   Create `.env.local` in project root:
   ```env
   # Firebase Web Config (from Firebase Console > Project Settings)
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=women-ai-cd813.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=women-ai-cd813
   VITE_FIREBASE_STORAGE_BUCKET=women-ai-cd813.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=446611...
   VITE_FIREBASE_APP_ID=1:446611...:web:172e3f2c...

   # AI Service Keys
   VITE_GEMINI_API_KEY=AIzaSy...  # From Google AI Studio (https://aistudio.google.com)
   VITE_HF_TOKEN=hf_...            # From Hugging Face (https://huggingface.co/settings/tokens)
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Server runs at http://localhost:5173 with HMR enabled
   ```

5. **Seed Firestore (First Time Only)**
   - Navigate to `http://localhost:5173/admin-seed`
   - Click **Seed Firestore Database** button
   - Waits for Firestore rules to permit write access
   - Populates initial remedies library and categories

## [TestTube] Testing

### Unit & Component Tests
```bash
npm run test        # Watch mode
npm run test:run    # Single run (CI mode)
```

**Test Configuration:**
- **Runner:** Vitest 4 (Vite-native test framework)
- **Environment:** jsdom (DOM simulation)
- **Test Files:** `src/**/*.test.jsx`
- **Coverage:** React Testing Library best practices

**Known Issues & Solutions:**
- `ERR_REQUIRE_ESM` with jsdom: Configured `vite.config.js` with `singleFork: true` and dependency inlining
- See `.github/workflows/firebase-deploy.yml` for CI test execution

## [Ship] Deployment

### Automated Deployment (Recommended)

**GitHub Actions CI/CD Pipeline** automatically deploys on push to `main`:
- [Check] Runs tests (`npm run test:run`)
- [Check] Builds project (`npm run build`)
- [Check] Deploys to Firebase Hosting
- ✅ Live at: https://women-ai-cd813.web.app

**Workflow file:** `.github/workflows/firebase-deploy.yml`

### Manual Deployment

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Build**
   ```bash
   npm run build
   # Output: dist/ directory (configured in firebase.json)
   ```

3. **Deploy**
   ```bash
   firebase deploy
   # Deploys Hosting, Firestore rules, Storage rules, Functions
   ```

**Configuration:**
- **Hosting Root:** `dist/` (Vite output)
- **Rewrites:** All routes → `/index.html` (SPA mode)
- **Security Rules:** `firestore.rules`, `storage.rules` auto-deployed

## [Wrench] Troubleshooting

### Build & Dependencies
| Issue | Solution |
|-------|----------|
| **Module not found** | Run `npm ci` to reinstall lockfile-pinned dependencies |
| **Vite HMR timeout** | Check firewall/proxy settings; adjust `vite.config.js` if needed |
| **Vitest ERR_REQUIRE_ESM** | Ensure `deps.inline: ['html-encoding-sniffer', '@exodus/bytes']` in `vite.config.js` |

### Firebase Configuration
| Issue | Solution |
|-------|----------|
| **Firestore seeding stuck** | Verify rules allow `.write` for authenticated users; check project ID in `.env.local` |
| **Missing environment variables** | Use `.env.local` (never commit to git); all `VITE_*` vars must be set |
| **Auth not working** | Enable Email/Google providers in Firebase Console > Authentication > Sign-in methods |
| **Forum data not visible** | Ensure seeding completed (`/admin-seed`); verify Firestore rules in console |

### API Rate Limiting
- **Gemini API:** 60 req/min free tier; implement exponential backoff
- **Hugging Face:** Depends on model tier; use caching for sentiment analysis
- **Google Places:** Verify API key has Places API enabled

### Performance
- **Large Firestore queries:** Use pagination; add composite indexes for multi-field filters
- **AI API latency:** Implement request debouncing in UI; show skeleton loaders

## [Folder] Project Structure

```
.
├── .github/workflows/          # GitHub Actions CI/CD
├── app/                       # Next.js app directory (legacy)
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── theme-provider.tsx     # Tailwind theme config
├── functions/                 # Firebase Cloud Functions
├── hooks/                     # Custom React hooks
├── src/
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   ├── components/           # Feature components
│   ├── firebase/             # Firebase SDK setup
│   ├── services/             # API/business logic
│   ├── locales/              # i18n translations
│   └── data/                 # Static data, fixtures
├── dataconnect/              # Firebase Data Connect schema
├── firestore.rules           # Firestore Security Rules
├── storage.rules             # Storage Security Rules
├── firebase.json             # Firebase deployment config
├── vite.config.js           # Vite build config
└── tsconfig.json            # TypeScript config
```

## [Shield] Security Best Practices

1. **Firestore Rules:** Rows use `auth.uid` to scope data access
2. **API Keys:** Use `.env.local`; never commit; rotate keys regularly
3. **Functions:** Validate input; rate-limit external API calls
4. **CORS:** Firebase Hosting auto-handles; Storage rules prevent direct access

## [BarChart3] Architecture Decisions

- **Client-Side AI:** Kept Gemini API calls on frontend for reduced latency + cost
- **Firestore over SQL:** Schema flexibility for multilingual content; real-time updates
- **Dual Moderation:** Sentiment analysis + LLM safety for high-confidence filtering
- **Vite over CRA:** ESM-first dev experience, faster builds, better tree-shaking

## [HandshakeIcon] Contributing

Issues and PRs are welcome. For major changes:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Ensure tests pass (`npm run test:run`)
4. Commit with clear messages
5. Push and open a Pull Request

## [Book] Resources

- [Firebase Console](https://console.firebase.google.com)
- [Gemini API Docs](https://ai.google.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router v6](https://reactrouter.com)
- [i18next](https://www.i18next.com)
- [Live Application](https://women-ai-cd813.web.app)

## 📝 License

[Add license information here]
