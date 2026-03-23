# 🔍 Project Issues Report
**Sahachari - AI Symptom Analyser For Women**

**Audit Date:** March 23, 2026  
**Status:** ⚠️ **MAJOR ISSUES FOUND - REQUIRES IMMEDIATE ACTION**  
**Total Issues:** 25  

---

## 📊 Issues Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 3 | **REQUIRES IMMEDIATE FIX** |
| 🟠 MAJOR | 9 | **MUST FIX BEFORE PRODUCTION** |
| 🟡 MINOR | 13 | **SHOULD FIX** |
| **TOTAL** | **25** | 0% Fixed |

---

## 🔴 CRITICAL ISSUES
### ⚠️ These will break the app or expose security vulnerabilities

---

### **CRITICAL #1: Exposed Firebase API Key in Version Control**

**File:** `.env.production`  
**Line:** All lines  
**Severity:** 🔴 **CRITICAL - SECURITY BREACH**  
**Status:** UNFIXED  

#### Problem
Production Firebase API key is hardcoded and committed to GitHub repository:
```
VITE_FIREBASE_API_KEY=AIzaSyDAabcYtk1gK5zi27x6xZrOgGulxA8xmrM
```

#### Why It's Dangerous
- ✗ Any person with access to your GitHub repo can steal this key
- ✗ Malicious actor can impersonate your app
- ✗ Can access/manipulate your entire Firestore database
- ✗ Can steal files from Cloud Storage
- ✗ Can access user authentication data
- ✗ Will incur charges to your Google Cloud account

#### Fix Instructions

**Step 1: Revoke the Key NOW**
```bash
# Go to Firebase Console → Project Settings → Service Accounts → Database Key
# Click "..." → Delete/Disable this key
# Create a new API key
```

**Step 2: Remove from Git History (IMPORTANT)**
```bash
# Option A: Using git-filter-branch (Nuclear option - rewrites all history)
git filter-branch --tree-filter 'rm -f .env.production' HEAD
git push origin main --force-with-lease

# Option B: Using git-filter-repo (Cleaner)
git filter-repo --path .env.production --invert-paths
git push origin main --force-with-lease
```

**Step 3: Update .gitignore**
```bash
# Add to .gitignore:
.env
.env.local
.env.*.local
.env.production
```

**Step 4: Create Safe .env.example**
```bash
# Create .env.example with ONLY placeholders:
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=women-ai-cd813.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=women-ai-cd813
VITE_FIREBASE_STORAGE_BUCKET=women-ai-cd813.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_HF_TOKEN=your_hf_token_here
VITE_GOOGLE_MAPS_KEY=your_maps_key_here
VITE_CLOUD_NATURAL_LANGUAGE_KEY=your_nl_key_here
```

**Step 5: Use GitHub Secrets Instead (Already Correct)**
Your `.github/workflows/firebase-deploy.yml` already correctly uses GitHub Secrets. ✓

**Verification:**
```bash
# Verify the key is removed from all commits:
git log --all -- '.env*' | head -20
# Should only show .env.example in history, never .env.production
```

---

### **CRITICAL #2: Firestore Storage Rules Expired**

**File:** `storage.rules`  
**Lines:** 23-25  
**Severity:** 🔴 **CRITICAL - APP BROKEN**  
**Status:** UNFIXED  

#### Problem
Storage security rules contain an expiration date that has PASSED:
```
allow read, write: if request.time < timestamp.date(2026, 3, 21);
```
**Current date:** March 23, 2026 → **RULES EXPIRED 2 DAYS AGO**

#### Why It's Critical
- ✗ All file uploads are blocked
- ✗ All file downloads are blocked
- ✗ Users cannot upload forum post images
- ✗ Users cannot download/view journal attachments
- ✗ Storage-dependent features completely broken

#### Current Content
```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 21);  // ← EXPIRED!
    }
  }
}
```

#### Fix Instructions

**Replace entire storage.rules file with:**
```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Forum post images
    match /forum/{postId}/{allFiles=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.resource.size < 5000000 && // 5MB max
                      request.resource.contentType.matches('image/.*');
    }
    
    // Journal entry attachments - private to user
    match /journal/{userId}/{allFiles=**} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId &&
                           request.resource.size < 10000000; // 10MB max
    }
    
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.contentType.matches('image/.*') &&
                      request.resource.size < 3000000; // 3MB max
    }
    
    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Deploy the Fix:**
```bash
cd /path/to/project
npx firebase-tools@latest deploy --only storage --project women-ai-cd813
```

**Verify in Firebase Console:**
- Go to Storage → Rules tab
- Confirm new rules are deployed
- No expiration dates visible

---

### **CRITICAL #3: TypeScript Configuration Has Next.js Settings in Vite Project**

**File:** `tsconfig.json`  
**Lines:** 18-22  
**Severity:** 🔴 **CRITICAL - BUILD ISSUES**  
**Status:** UNFIXED  

#### Problem
TypeScript config includes Next.js-specific plugin in a Vite + React project:
```json
"plugins": [
  { "name": "next" }
],
"include": ["next-env.d.ts", ...]
```

#### Why It's Critical
- ✗ IDE type checking fails/conflicts
- ✗ Auto-complete shows wrong suggestions
- ✗ Build warnings about undefined paths
- ✗ Confuses developers about project setup
- ✗ May cause TypeScript compilation errors

#### Current File Content
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES2020",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx",
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "src/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Fix Instructions

**Replace with correct Vite configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Verification:**
```bash
# Check that TypeScript compilation works:
npx tsc --noEmit
# Should complete without errors
```

---

## 🟠 MAJOR ISSUES
### ⚠️ These will cause bugs, poor performance, or security vulnerabilities

---

### **MAJOR #1: Firestore N+1 Query Problem in Journal Entries**

**File:** `src/services/firebaseService.js`  
**Lines:** 189-210  
**Severity:** 🟠 **MAJOR - PERFORMANCE & COST**  
**Status:** UNFIXED  

#### Problem
Fetches ALL journal entries, then filters on client-side by month. This is inefficient:

```javascript
export const getJournalEntries = async (userId, monthKey) => {
  const q = query(
    collection(db, 'journal_entries'),
    where('userId', '==', userId)  // ← Gets ALL entries
  );
  const snapshot = await getDocs(q);
  let all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  if (monthKey) {
    // ← Filters on client side (wasteful!)
    return all.filter(e => e.date.startsWith(monthKey));
  }
  return all;
};
```

#### Why It's a Problem
- ✗ Reads 1000 entries to get 5
- ✗ Firestore charges you for EVERY document read (even if not used)
- ✗ With 10,000 entries: costs 10,000 reads instead of ~5
- ✗ Slow UI updates (parsing large JSON)
- ✗ Memory waste on client

**Cost Example:**
- With 10,000 journal entries, loading March 2026 entries:
  - Current: 10,000 reads × $0.06 per 100k = $600/month
  - Fixed: 30 reads × $0.06 per 100k = $0.02/month
  - **Savings: 599.98/month!**

#### Fix Instructions

**Replace getJournalEntries:**
```javascript
export const getJournalEntries = async (userId, monthKey) => {
  try {
    const constraints = [
      where('userId', '==', userId),
      orderBy('date', 'desc')
    ];
    
    // If month provided, add range constraint
    if (monthKey) {
      const [year, month] = monthKey.split('-');
      const startDate = `${year}-${month}-01`;
      
      // Calculate end of month
      const nextMonth = parseInt(month) === 12 
        ? `${parseInt(year) + 1}-01-01`
        : `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
      
      constraints.push(where('date', '>=', startDate));
      constraints.push(where('date', '<', nextMonth));
    }
    
    const q = query(collection(db, 'journal_entries'), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw new Error('Failed to load journal entries');
  }
};
```

**Required Firestore Index:**
Add this to `firestore.indexes.json`:
```json
{
  "collectionGroup": "journal_entries",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "date", "order": "DESCENDING" }
  ]
}
```

---

### **MAJOR #2: Missing API Key Validation**

**Files:**
- `src/services/geminiService.js` (Line 1-2)
- `src/services/nlpService.js` (Line 1-2)
- `src/services/placesService.js` (Multiple places)

**Severity:** 🟠 **MAJOR - USER EXPERIENCE**  
**Status:** UNFIXED  

#### Problem
Services don't validate if API keys exist before making requests:

```javascript
// Bad: geminiService.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://api.example.com?key=${API_KEY}`;

const response = await fetch(API_URL, {...});
// If API_KEY is undefined, request fails silently!
```

#### Why It's a Problem
- ✗ User sees vague error: "Failed to analyze symptoms"
- ✗ No guidance on how to fix it (missing .env)
- ✗ Hard to debug in production
- ✗ Makes deployment failures cryptic

#### Fix Instructions

**Create `src/utils/apiConfig.js`:**
```javascript
/**
 * Validates and retrieves API keys with helpful error messages
 */
export const getApiKey = (keyName) => {
  const envKey = `VITE_${keyName}_KEY`;
  const key = import.meta.env[envKey];
  
  if (!key) {
    throw new Error(
      `Missing ${keyName} API key. ` +
      `Add it to your .env file as ${envKey}`
    );
  }
  
  if (key.includes('placeholder') || key.includes('your_')) {
    throw new Error(
      `Invalid ${keyName} API key. Replace placeholder in .env file.`
    );
  }
  
  return key;
};

export const createApiUrl = (baseUrl, keyName) => {
  const key = getApiKey(keyName);
  return `${baseUrl}?key=${key}`;
};
```

**Update `src/services/geminiService.js`:**
```javascript
import { getApiKey } from '../utils/apiConfig';

const API_KEY = getApiKey('GEMINI');
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const analyzeSymptoms = async (symptoms) => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Missing') || error.message.includes('Invalid')) {
      // Re-throw API key errors (these should fail fast)
      throw error;
    }
    throw new Error('Failed to analyze symptoms');
  }
};
```

**Update similar code in:**
- `src/services/nlpService.js`
- `src/services/placesService.js`
- `src/services/moderationService.js`

---

### **MAJOR #3: Missing Network Timeout and Retry Logic**

**Files:**
- `src/services/geminiService.js` (Line 5-22)
- `src/services/nlpService.js` (Line 8-25)
- `src/services/placesService.js` (Line 30-70)

**Severity:** 🟠 **MAJOR - RELIABILITY**  
**Status:** UNFIXED  

#### Problem
Network requests have NO timeout handling:

```javascript
// Bad: No timeout!
const response = await fetch(`${API_URL}?key=${API_KEY}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({...})
});
```

#### Why It's a Problem
- ✗ If API hangs (dead server), user's app freezes forever
- ✗ Poor network = response takes 5+ minutes
- ✗ No way to abort/cancel requests
- ✗ Browser might kill tab → poor UX

#### Fix Instructions

**Create `src/utils/fetchWithTimeout.js`:**
```javascript
/**
 * Fetch with timeout and retry logic
 */
export const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = 10000,
  maxRetries = 2
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Retry on 5xx errors (server errors)
      if (response.status >= 500 && attempt < maxRetries - 1) {
        lastError = new Error(`Server error: ${response.status}`);
        await new Promise(r => setTimeout(r, (attempt + 1) * 1000)); // Exponential backoff
        continue;
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      
      if (error.name === 'AbortError') {
        lastError = new Error(`Request timeout after ${timeoutMs}ms`);
      }
      
      // Don't retry on client errors (400-499)
      if (error.message?.includes('400') || error.message?.includes('401')) {
        throw error;
      }
      
      // On last attempt, throw
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      // Wait before retry
      await new Promise(r => setTimeout(r, (attempt + 1) * 1000));
    }
  }
  
  throw lastError;
};
```

**Update `src/services/geminiService.js`:**
```javascript
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

export const analyzeSymptoms = async (symptoms) => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      },
      30000,  // 30 second timeout for this API
      2       // retry once
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    throw new Error(`Symptom analysis failed: ${error.message}`);
  }
};
```

---

### **MAJOR #4: Unhandled Promise in Google Maps Script Loading**

**File:** `src/screens/NearbyHelpScreen.jsx`  
**Lines:** 40-60  
**Severity:** 🟠 **MAJOR - MEMORY LEAK**  
**Status:** UNFIXED  

#### Problem
If component unmounts during script load, state updates happen on unmounted component:

```javascript
useEffect(() => {
  if (window.google && window.google.maps) {
    setScriptLoaded(true);  // ← If unmounted, causes warning!
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=...`;
  script.async = true;
  script.onload = () => setScriptLoaded(true);  // ← Fires after unmount!
  script.onerror = () => setError('Failed to load maps');
  document.head.appendChild(script);
  // ← No cleanup!
}, []);
```

#### Why It's a Problem
- ✗ React warning: "Can't perform a React state update on an unmounted component"
- ✗ Memory leak (script continues loading even if component gone)
- ✗ Multiple instances load same script multiple times
- ✗ Error in console confuses users

#### Fix Instructions

**Replace useEffect in NearbyHelpScreen.jsx:**
```javascript
useEffect(() => {
  let mounted = true;  // Track component mount status
  
  // Check if script already loaded
  if (window.google && window.google.maps) {
    if (mounted) setScriptLoaded(true);
    return;
  }
  
  // Check if script already in DOM (prevent duplicates)
  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    existingScript.onload = () => { if (mounted) setScriptLoaded(true); };
    if (existingScript.dataset.loaded === 'true') {
      if (mounted) setScriptLoaded(true);
    }
    return;
  }
  
  // Create and load script
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
  script.async = true;
  
  script.onload = () => {
    script.dataset.loaded = 'true';
    if (mounted) setScriptLoaded(true);
  };
  
  script.onerror = () => {
    if (mounted) setError('Failed to load Google Maps. Please refresh.');
  };
  
  document.head.appendChild(script);
  
  // Cleanup: cancel state updates if unmounted
  return () => {
    mounted = false;
  };
}, []);
```

---

### **MAJOR #5: XSS Vulnerability - User Content Not Sanitized**

**File:** `src/components/forum/PostCard.jsx`  
**Lines:** 62-75  
**Severity:** 🟠 **MAJOR - SECURITY**  
**Status:** UNFIXED  

#### Problem
User-generated content displayed without sanitization:

```javascript
<h3 className="...">
  {post.title}  // ← No sanitization!
</h3>
<p className="...">
  {post.content}  // ← Could contain <script> tags!
</p>
<img src={post.imageUrl} />  // ← URL not validated!
```

#### Why It's a Problem
- ✗ Malicious user submits post with `<script>alert('hacked')</script>`
- ✗ Script executes in every user's browser
- ✗ Attacker can steal session tokens, personal data
- ✗ Can inject iframe to redirect to phishing site

#### Fix Instructions

**Install DOMPurify:**
```bash
npm install dompurify
npm install -D @types/dompurify  # For TypeScript
```

**Update PostCard.jsx:**
```javascript
import DOMPurify from 'dompurify';

export default function PostCard({ post }) {
  // Validate Image URL
  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      // Only allow https://, http://, or blob: images
      return ['http:', 'https:', 'blob:'].includes(urlObj.protocol);
    } catch (e) {
      return false;
    }
  };

  // Sanitize text content
  const sanitizedTitle = DOMPurify.sanitize(post.title, { 
    ALLOWED_TAGS: [] // No HTML tags in title
  });
  
  const sanitizedContent = DOMPurify.sanitize(post.content, { 
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'li']
  });

  return (
    <div className="forum-post">
      <h3>{sanitizedTitle}</h3>
      
      <div dangerouslySetInnerHTML={{ 
        __html: sanitizedContent 
      }} />
      
      {isValidImageUrl(post.imageUrl) && (
        <img 
          src={post.imageUrl} 
          alt={sanitizedTitle}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
    </div>
  );
}
```

**Also sanitize in screens/NewPostScreen.jsx before saving:**
```javascript
const handleSubmitPost = async () => {
  const sanitized = {
    title: DOMPurify.sanitize(title, { ALLOWED_TAGS: [] }),
    content: DOMPurify.sanitize(content, { ALLOWED_TAGS: [] }),
    imageUrl: isValidImageUrl(imageUrl) ? imageUrl : null
  };
  
  await saveForumPost(sanitized);
};
```

---

### **MAJOR #6: Race Condition in Upvote Logic**

**Files:**
- `src/services/firebaseService.js` (Line 212-235) - Backend
- `src/screens/ForumScreen.jsx` (Line 43-62) - Frontend

**Severity:** 🟠 **MAJOR - DATA CONSISTENCY**  
**Status:** UNFIXED  

#### Problem
Optimistic UI update happens BEFORE Firebase operation. If network fails, UI and DB are inconsistent:

```javascript
// ForumScreen.jsx - BAD
const handleReact = async (id, liked) => {
  // Optimistic update (immediate)
  setPosts(prev => prev.map(p => 
    p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
  ));
  
  try {
    // Then call Firebase
    await togglePostUpvote(id, userId);
  } catch (error) {
    // If fails here, UI still shows +1 upvote but DB doesn't!
    alert('Failed to update');
  }
};
```

#### Why It's a Problem
- ✗ User clicks upvote twice rapidly
- ✗ UI shows "+2" immediately
- ✗ Network request fails on second one
- ✗ DB says "+1", UI says "+2"
- ✗ User refreshes page and "+2" disappears (confusing)

#### Fix Instructions

**Update ForumScreen.jsx:**
```javascript
const handleReact = async (id, liked) => {
  // Save current state
  const originalPosts = posts;
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) return;
  
  const currentPost = posts[postIndex];
  const newUpvotes = liked ? currentPost.upvotes + 1 : currentPost.upvotes - 1;
  
  // Optimistic update
  setPosts(prev => prev.map((p, idx) => 
    idx === postIndex ? { ...p, upvotes: newUpvotes } : p
  ));
  
  try {
    // Call Firebase
    await togglePostUpvote(id, userId);
    // Success - keep optimistic update
  } catch (error) {
    // Revert to original state on failure
    setPosts(originalPosts);
    
    // Show error message
    toast.error(t('errors.failed_to_update_reaction'));
  }
};
```

**Also add loading state to prevent double-clicks:**
```javascript
const [loadingPostId, setLoadingPostId] = useState(null);

const handleReact = async (id) => {
  if (loadingPostId === id) return;  // Prevent double-click
  
  setLoadingPostId(id);
  try {
    // ... rest of logic ...
  } finally {
    setLoadingPostId(null);
  }
};
```

---

### **MAJOR #7: Insecure Anonymous User Identification**

**File:** `src/services/firebaseService.js`  
**Lines:** 244-249  
**Severity:** 🟠 **MAJOR - SECURITY**  
**Status:** UNFIXED  

#### Problem
Anonymous user names are easily spoofed:

```javascript
export const getAnonName = () => {
  const existing = localStorage.getItem('anonName');
  if (existing) return existing;
  
  const newName = `Anon#${Math.floor(1000 + Math.random() * 9000)}`;
  // ↑ Only 9000 combinations! Collisions likely.
  
  localStorage.setItem('anonName', newName);
  return newName;
};
```

#### Why It's a Problem
- ✗ Only 9000 possible names (1000-9999)
- ✗ User can open DevTools and change `localStorage['anonName'] = 'Anon#1234'`
- ✗ Can impersonate another user's anonymous identity
- ✗ Can manipulate upvote counts

#### Fix Instructions

**Create secure anonymous ID:**
```javascript
// src/utils/anonId.js
import crypto from 'crypto-js';  // Or use TweetNaCl.js in browser

/**
 * Generate secure, unique anonymous ID
 * Based on browser fingerprint + timestamp
 */
export const getSecureAnonId = async () => {
  let storedId = sessionStorage.getItem('__anonId');
  if (storedId) return storedId;
  
  // Create fingerprint from user-agent + platform
  const fingerprint = `${navigator.userAgent}|${navigator.platform}|${navigator.hardwareConcurrency}`;
  
  // Hash with crypto
  const hash = crypto.SHA256(fingerprint).toString();
  
  // Use first 8 chars of hash + random suffix
  const anonId = `Anon#${hash.substring(0, 6).toUpperCase()}_${Math.random().toString(36).substring(2, 8)}`;
  
  // Store in sessionStorage (cleared on browser close)
  sessionStorage.setItem('__anonId', anonId);
  return anonId;
};

/**
 * Validate anonymous ID to prevent spoofing
 */
export const validateAnonId = (claimedId) => {
  const actualId = sessionStorage.getItem('__anonId');
  return claimedId === actualId;
};
```

**Update firebaseService.js:**
```javascript
import { getSecureAnonId, validateAnonId } from '../utils/anonId';

export const getAnonName = async () => {
  return getSecureAnonId();
};

// When saving posts with anonymous user:
export const saveForumPost = async (userId, postData) => {
  if (userId === 'anonymous') {
    const anonId = await getAnonName();
    // Store anonId with post
    postData.anonId = anonId;
  }
  // ...
};
```

---

### **MAJOR #8: Missing Input Validation Before API Calls**

**File:** `src/screens/SymptomScreen.jsx`  
**Lines:** 31-50  
**Severity:** 🟠 **MAJOR - SECURITY & RELIABILITY**  
**Status:** UNFIXED  

#### Problem
User input not validated for length, special characters, or prompt injection:

```javascript
const handleAnalyze = async () => {
  if (selected.length === 0 && !additional.trim()) {
    alert("Please select...");
    return;
  }
  
  // ← No validation!
  const result = await analyzeSymptoms(finalSymptoms, additional);
};
```

#### Why It's a Problem
- ✗ User can submit 10,000 characters → timeouts/errors
- ✗ Special characters in prompt injection attack
- ✗ SQL injection if data sent to backend
- ✗ XSS if data reflected back in response

**Example Attack:**
```
User submits: "Pain in chest" but also: "); DROP TABLE forum_posts; --
```

#### Fix Instructions

**Create validation utility:**
```javascript
// src/utils/inputValidator.js
export const validateSymptomInput = (symptoms, notes) => {
  const MAX_SYMPTOMS = 50;
  const MAX_NOTE_LENGTH = 2000;
  const FORBIDDEN_CHARS = /<script|javascript:|onerror|onclick|<iframe|<img|<embed|eval\(|alert\(/gi;
  
  const errors = [];
  
  if (symptoms.length > MAX_SYMPTOMS) {
    errors.push(`Maximum ${MAX_SYMPTOMS} symptoms allowed`);
  }
  
  if (notes.length > MAX_NOTE_LENGTH) {
    errors.push(`Description maximum ${MAX_NOTE_LENGTH} characters`);
  }
  
  if (FORBIDDEN_CHARS.test(notes)) {
    errors.push('Invalid characters in description');
  }
  
  // Check for suspicious patterns
  if (notes.toLowerCase().includes('drop table') || 
      notes.toLowerCase().includes('delete from')) {
    errors.push('Invalid input');
  }
  
  return errors;
};

/**
 * Sanitize input for API transmission
 */
export const sanitizeInput = (text) => {
  return text
    .replace(/<[^>]*>/g, '')  // Remove HTML tags
    .replace(/[<>]/g, '')      // Remove angle brackets
    .trim()
    .substring(0, 2000);       // Max length
};
```

**Update SymptomScreen.jsx:**
```javascript
import { validateSymptomInput, sanitizeInput } from '../utils/inputValidator';

const handleAnalyze = async () => {
  if (selected.length === 0 && !additional.trim()) {
    alert(t('errors.select_symptom_or_describe'));
    return;
  }
  
  // Validate input
  const validationErrors = validateSymptomInput(selected, additional);
  if (validationErrors.length > 0) {
    alert(validationErrors.join('\n'));
    return;
  }
  
  setLoading(true);
  try {
    // Sanitize before sending
    const sanitized = sanitizeInput(additional);
    const result = await analyzeSymptoms(selected, sanitized);
    setResults(result);
  } catch (error) {
    setError(t('errors.analysis_failed'));
  } finally {
    setLoading(false);
  }
};
```

---

### **MAJOR #9: Incomplete Forum Post Moderation**

**Files:**
- `src/services/firebaseService.js` (Line 128-145)
- `src/screens/NewPostScreen.jsx` (Line 76-80)

**Severity:** 🟠 **MAJOR - MODERATION FAILURE**  
**Status:** UNFIXED  

#### Problem
Moderation happens but approval status not properly saved to database:

```javascript
// NewPostScreen.jsx
const moderationResult = await moderateContent(`${title}\n${content}`);
if (!moderationResult.approved) {
  alert('Post did not pass moderation');
  return;  // ← Stops here
}

// ← If approved, saves post
await saveForumPost({
  title,
  content,
  // But approved status might not reflect moderation result!
});
```

In `firebaseService.js`:
```javascript
export const saveForumPost = async (postData) => {
  await addDoc(collection(db, 'forum_posts'), {
    ...postData,
    approved: postData.approved ?? false,  // ← Defaults to false!
  });
};
```

#### Why It's a Problem
- ✗ Approved posts show as unapproved in forum
- ✗ Mismatch between moderation service and DB
- ✗ Confuses admin about which posts were reviewed

#### Fix Instructions

**Update firebaseService.js:**
```javascript
export const saveForumPost = async (postData) => {
  // Ensure approved status is explicit
  if (typeof postData.approved !== 'boolean') {
    throw new Error('Post must have explicit approved status');
  }
  
  const now = new Date();
  const docRef = await addDoc(collection(db, 'forum_posts'), {
    title: postData.title,
    content: postData.content,
    imageUrl: postData.imageUrl || null,
    anonName: postData.anonName || 'Anonymous',
    approved: postData.approved,
    isPinned: postData.isPinned || false,
    upvotes: 0,
    upvotedBy: [],
    topic: postData.topic,
    language: postData.language,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    moderated: postData.approved,  // Explicit moderation flag
    moderatedAt: postData.approved ? now : null,
    moderatedBy: 'ai-moderation'
  });
  
  return docRef.id;
};
```

**Update NewPostScreen.jsx:**
```javascript
const handleSubmitPost = async () => {
  try {
    setLoading(true);
    
    // Step 1: Moderate content
    const moderationResult = await moderateContent(`${title}\n${content}`);
    
    if (!moderationResult.approved) {
      setError(t('errors.post_not_approved', {
        reason: moderationResult.reason || 'Contains inappropriate content'
      }));
      return;
    }
    
    // Step 2: Save with explicit approved status
    const postId = await saveForumPost({
      title: title.trim(),
      content: content.trim(),
      imageUrl: selectedImage || null,
      anonName: anonName,
      topic: activeTopic,
      language: i18n.language,
      approved: true,  // ← Explicit!
      isPinned: false
    });
    
    // Step 3: Confirm to user
    toast.success(t('success.post_created'));
    
    // Clear form and navigate
    setTitle('');
    setContent('');
    navigate(`/forum/${activeTopic}`);
    
  } catch (error) {
    setError(t('errors.post_creation_failed'));
  } finally {
    setLoading(false);
  }
};
```

---

## 🟡 MINOR ISSUES
### 💡 These affect code quality and maintainability

---

### **MINOR #1: Magic Numbers Without Constants**

**Files:** Multiple throughout project  
**Severity:** 🟡 **MINOR - MAINTAINABILITY**  

**Examples:**
- `NearbyHelpScreen.jsx:66` → `radius: 3000` (hardcoded km)
- `firebaseService.js:103` → `limit(20)` (hardcoded pagination)
- `VoiceInputButton.jsx:36` → `#6D5BD0` (hardcoded color)
- `placesService.js:8` → `timeout: 10000` (hardcoded 10s)

**Fix:** Create constants file:
```javascript
// src/config/constants.js
export const API_TIMEOUTS = {
  GEMINI: 30000,
  NLP: 15000,
  PLACES: 10000,
  DEFAULT: 10000
};

export const PAGINATION = {
  FORUM_POSTS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 10,
  NEARBY_RESULTS: 15
};

export const SEARCH = {
  NEARBY_RADIUS_M: 3000,
  MAX_SYMPTOMS: 50,
  MAX_DESCRIPTION_LENGTH: 2000
};

export const COLORS = {
  PRIMARY: '#6D5BD0',
  SECONDARY: '#9B8EC4',
  SUCCESS: '#10B981',
  ERROR: '#EF4444'
};
```

---

### **MINOR #2: Code Duplication - API Key Validation Repeated 4 Times**

**Files:**
- `src/services/geminiService.js:1`
- `src/services/nlpService.js:1`
- `src/services/placesService.js:24`
- `src/services/moderationService.js:1`

**Severity:** 🟡 **MINOR - DRY PRINCIPLE**  

**Fix:** Create utility (already in MAJOR #2 above)
```javascript
// src/utils/apiConfig.js
export const getApiKey = (keyName) => { ... };
export const createApiUrl = (baseUrl, keyName) => { ... };
```

---

### **MINOR #3: Missing Error Boundaries**

**File:** `src/App.jsx`  
**Severity:** 🟡 **MINOR - ERROR HANDLING**  

No Error Boundary wraps routes. Single component crash = blank screen.

**Fix:** Create ErrorBoundary component:
```javascript
// src/components/ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('React Error:', error, info);
    // Could send to error tracking service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry for the inconvenience.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary text-white px-6 py-2 rounded hover:opacity-90"
            >
              Go Home
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer font-mono text-sm">Error details</summary>
                <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Use in App.jsx:
```javascript
<ErrorBoundary>
  <BrowserRouter>
    <Routes>
      {/* routes... */}
    </Routes>
  </BrowserRouter>
</ErrorBoundary>
```

---

### **MINOR #4: Inefficient Re-renders in ForumScreen**

**File:** `src/screens/ForumScreen.jsx:15-25`  
**Severity:** 🟡 **MINOR - PERFORMANCE**  

```javascript
// Current - re-fetches posts on language change
useEffect(() => {
  fetchPosts();
}, [activeTopic, i18n.language]);  // ← Language doesn't need new fetch
```

**Fix:**
```javascript
// Only fetch when topic changes
useEffect(() => {
  fetchPosts();
}, [activeTopic]);

// Separate effect for translation (client-side)
useEffect(() => {
  // Filter or sort posts based on language
  // But don't refetch from Firestore
  const filtered = posts.filter(p => p.language === i18n.language);
  setFilteredPosts(filtered);
}, [i18n.language, posts]);
```

---

### **MINOR #5: Missing PropTypes Validation**

**Files:** All components  
**Severity:** 🟡 **MINOR - TYPE SAFETY**  

Components don't validate props, making bugs hard to detect.

**Example fix for PostCard.jsx:**
```javascript
import PropTypes from 'prop-types';

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.instanceOf(Date)
    ]).isRequired,
    upvotes: PropTypes.number,
    anonName: PropTypes.string
  }).isRequired,
  onUpvote: PropTypes.func
};
```

---

### **MINOR #6: Console Logs Left in Production**

**Files:** Multiple  
**Examples:**
- `NearbyHelpScreen.jsx:50` → `console.log("MapView: Initializing...")`
- `moderationService.js:86` → `console.error('Gemini Safety Check...')`

**Severity:** 🟡 **MINOR - PRODUCTION QUALITY**

**Fix:** Create debug utility:
```javascript
// src/utils/logger.js
const isDev = import.meta.env.DEV;

export const logger = {
  log: (msg, data) => isDev && console.log(msg, data),
  error: (msg, data) => isDev && console.error(msg, data),
  warn: (msg, data) => isDev && console.warn(msg, data)
};
```

Replace all `console` calls:
```javascript
// Before:
console.error('Failed to load maps');

// After:
import { logger } from '../utils/logger';
logger.error('Failed to load maps');
```

---

### **MINOR #7: Unused State Variable in App.jsx**

**File:** `src/App.jsx:20`  
**Severity:** 🟡 **MINOR - CLEANUP**  

```javascript
const [language, setLanguage] = useState('EN');
// ↑ Set but never updates. i18n manages this, not App state.
```

**Fix:** Remove it entirely, use `i18n.language` instead.

---

### **MINOR #8: Missing Nullish Coalescing Operator**

**Files:** Multiple  
**Example:**
```javascript
// Bad:
const language = localStorage.getItem('language');
// Could be null!

// Good:
const language = localStorage.getItem('language') ?? 'en';
```

**Find and fix all instances.**

---

### **MINOR #9: Incorrect Error Handling in geminiService**

**File:** `src/services/geminiService.js:19-26`  
**Severity:** 🟡 **MINOR - RELIABILITY**  

```javascript
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(`Error: ${response.status}`);
  // ↑ errorData is never used!
}
```

**Fix:**
```javascript
if (!response.ok) {
  let errorMsg = `HTTP ${response.status}`;
  try {
    const errorData = await response.json();
    errorMsg += `: ${errorData.error?.message || 'Unknown error'}`;
  } catch (e) {
    // Not JSON, that's ok
  }
  throw new Error(`API Error: ${errorMsg}`);
}
```

---

### **MINOR #10: Firebase Rules Missing Compound Index Documentation**

**File:** `firestore.indexes.json`  
**Severity:** 🟡 **MINOR - PERFORMANCE**  

Only one index defined, but queries use multiple field combinations not covered:
- forum_posts × language × approved × createdAt
- journal_entries × userId × date

**Fix:** Add missing indexes:
```json
{
  "indexes": [
    {
      "collectionGroup": "comments",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "approved", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "forum_posts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "language", "order": "ASCENDING" },
        { "fieldPath": "approved", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "journal_entries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

### **MINOR #11: Hardcoded Colors Instead of Theme**

**Files:** Multiple components  
**Severity:** 🟡 **MINOR - MAINTAINABILITY**  

```javascript
// Bad:
className="bg-[#B5756B]"
style={{ color: '#6D5BD0' }}

// Good:
className="bg-danger"  // From tailwind theme
className="text-primary"  // From config
```

Use Tailwind theme colors consistently.

---

### **MINOR #12: Missing Input Sanitization in Search**

**File:** `src/screens/NearbyHelpScreen.jsx:80+`  
**Severity:** 🟡 **MINOR - SECURITY**  

Search input not sanitized before API call.

**Fix:**
```javascript
const handleSearch = (value) => {
  // Sanitize input
  const clean = value.replace(/[<>]/g, '').trim();
  
  if (clean.length < 2) return;
  if (clean.length > 100) {
    alert('Search term too long');
    return;
  }
  
  searchPlaces(clean);
};
```

---

### **MINOR #13: Inconsistent Error Messages**

**Files:** Multiple services  
**Severity:** 🟡 **MINOR - UX**  

Services return different error formats:
- geminiService: `"Gemini API Error: 500"`
- nlpService: `"Cloud NL Error: ..."`
- placesService: `"Could not load places"`

**Fix:** Standardize:
```javascript
// src/utils/errorFormatter.js
export const formatApiError = (service, originalError) => {
  const baseMsg = `${service} failed`;
  const details = originalError.message || 'Unknown error';
  return `${baseMsg}: ${details}. Please try again.`;
};

// Use everywhere:
throw new Error(formatApiError('Gemini', originalError));
```

---

## 🔵 SUGGESTIONS & IMPROVEMENTS

### 1. **Add TypeScript Migration**
- Current: JSX + PropTypes
- Better: TypeScript with proper types
- Benefit: Catch errors at build time

### 2. **Add Logging Service**
- Current: `console.log()` everywhere
- Better: Centralized logger with levels (debug, info, warn, error)
- Benefit: Easy to toggle in production

### 3. **Create Services Testing**
- Current: No unit tests visible
- Better: Test services with `vitest`
- Add: Try-catch error scenarios

### 4. **Add E2E Testing**
- Tool: Cypress or Playwright
- Test: Full user journeys (symptom analysis, forum post creation, etc.)

### 5. **Implement Caching**
- Current: Every page reload fetches all forum posts
- Better: Keep in localStorage/IndexedDB with TTL
- Save: Bandwidth and API calls

### 6. **Add Analytics**
- Track: User symptom queries, forum engagement
- Help: Understand which features are used
- Tool: Google Analytics 4

### 7. **Accessibility Improvements**
- Add: ARIA labels to interactive elements
- Add: Keyboard navigation support
- Test: With screen readers

### 8. **Mobile Optimization**
- Ensure: Responsive design works on all screen sizes
- Test: Touch events work properly
- Add: Mobile-specific gestures

---

## ✅ ACTION PLAN

### **PHASE 1: CRITICAL (Today)**
- [ ] Remove `.env.production` from git history
- [ ] Revoke Firebase API key
- [ ] Fix `storage.rules` expiration
- [ ] Fix `tsconfig.json` (remove Next.js settings)

### **PHASE 2: MAJOR (This Week)**
- [ ] Add API key validation
- [ ] Add network timeouts + retry logic
- [ ] Fix Google Maps unmount issue
- [ ] Add XSS protection with DOMPurify
- [ ] Fix race condition in upvotes
- [ ] Secure anonymous IDs
- [ ] Add input validation
- [ ] Fix forum moderation

### **PHASE 3: MINOR (Next Week)**
- [ ] Create constants file
- [ ] Fix N+1 queries in Firestore
- [ ] Add Error Boundaries
- [ ] Remove console logs
- [ ] Add PropTypes validation
- [ ] Add missing Firestore indexes
- [ ] Fix hardcoded colors
- [ ] Add logging utility

### **PHASE 4: ENHANCEMENTS (This Month)**
- [ ] Add TypeScript
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Implement caching
- [ ] Add analytics
- [ ] Improve accessibility

---

## 📊 Summary

**Total Issues Found:** 25
- 🔴 Critical: 3 (Must fix immediately)
- 🟠 Major: 9 (Fix before production)
- 🟡 Minor: 13 (Code quality)
- 🔵 Suggestions: 8 (Nice to have)

**Current Status:** ⚠️ **NOT PRODUCTION READY**

**Estimated Fix Time:**
- Phase 1: 2 hours
- Phase 2: 1-2 days
- Phase 3: 2-3 days
- Phase 4: 1-2 weeks

---

**Generated:** March 23, 2026  
**Project:** Sahachari - AI Symptom Analyser For Women  
**Branch:** `fixing-deploy-issues`
