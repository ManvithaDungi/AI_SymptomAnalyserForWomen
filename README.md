# Sahachari / Vaazhvu (Women's Health Companion) 💜

A safe, AI-powered space for women's health, privacy, and community. Built for the Google AI Hackathon.

## ✨ Key Features

### 🌸 AI Symptom Checker & Remedies
- **Private Analysis:** Describe symptoms in plain English (or Tamil/Hindi) and get immediate AI-driven insights.
- **Home Remedies:** Curated, safe home remedies for common issues like PCOS, Anemia, and Menstrual cramps.
- **Emergency Detection:** Intelligent flagging of urgent symptoms (e.g., severe pain, heavy bleeding).

### 💬 Safe Community Circle (Forum)
- **Anonymous & Supportive:** Share experiences without revealing your identity ("Anon#1234").
- **AI Moderation:** Double-layer safety check (Hugging Face + Gemini) to prevent hate speech, misinformation, and unsafe content *before* it's posted.
- **Topic Channels:** Dedicated spaces for PCOS, Anemia, Menstrual Health, and Wellness.
- **Gentle Interactions:** "Support", "Me Too", and "Helpful" reactions instead of toxic "Likes".

### 🩺 Doctor Connect & Q&A
- **Verified Directory:** Find trusted gynecologists and nutritionists near you.
- **Private Q&A:** Ask questions anonymously and get answers from verified experts.

### 📔 Wellness Journal
- **Daily Tracking:** Log mood, symptoms, water intake, and sleep.
- **Cycle Insights:** Visual tracking of health patterns over time.

### 🔒 Privacy First
- **Anonymous by Design:** No real names required for community participation.
- **Local-First Storage:** Sensitive logs kept private where possible.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (Glassmorphism UI)
- **Backend:** Firebase (Auth, Firestore)
- **AI Models:** 
  - **Google Gemini 1.5 Flash:** For symptom analysis and deep content moderation.
  - **Hugging Face (Roberta):** For real-time sentiment analysis latency checks.
- **Language:** English (Multi-language support architecture ready).

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/ManvithaDungi/AI_SymptomAnalyserForWomen.git
   cd AI_SymptomAnalyserForWomen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_HF_TOKEN=your_hugging_face_token
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

5. **Seed Database (First Time Only)**
    - Navigate to `/admin-seed` in your browser.
    - Click **"Seed Database"** to populate initial topics, remedies, and doctors.

## 📱 Screenshots

_(Add screenshots of Home, Symptom Checker, and Forum here)_

## 🤝 Contributing

Built with love for women's health. Issues and PRs welcome!
