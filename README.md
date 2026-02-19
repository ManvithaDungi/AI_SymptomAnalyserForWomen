

# 🌸 AI-Powered Symptom Analyzer & Anonymous Peer Support Community

### Women’s Health Empowerment Platform for Tamil Nadu

---

## 🚀 Overview

This is a **privacy-first mobile/web application** designed to empower women in India by addressing prevalent women’s health challenges such as:

* **Anemia** (affecting 50–60% of reproductive-age women in India, with high rural burdens)
* **PCOS** (prevalence up to 18–20% in southern India)
* Cultural taboos around menstrual health
* Stigma limiting open discussion and access to care

The platform combines **Explainable AI + Community Support** to promote awareness, safe conversations, and culturally sensitive health education — without replacing medical professionals.

> ⚠️ This application does NOT provide medical diagnosis. It is an awareness and support tool.

---

## 💡 Problem Statement

Women in Tamil Nadu often face:

* Limited access to reliable health information
* Cultural stigma around menstrual and reproductive health
* Isolation due to lack of safe discussion spaces
* Delayed diagnosis of common conditions like anemia and PCOS

This app bridges the gap between **AI-driven awareness tools and peer emotional support**, while maintaining privacy and inclusivity.

---

## 🧠 Core Features

### 1️⃣ AI Symptom Analyzer

Users can input symptoms via:

* ✍️ Text (Tamil / English)
* 🎙 Voice (Web Speech API – `ta-IN` support)

A lightweight ML model (TensorFlow.js classifier trained on Indian-relevant symptom patterns) provides:

* Probable common condition (e.g., PCOS, Iron Deficiency Anemia)
* Probability score
* Explainable reasoning (top contributing symptoms)
* Culturally sensitive self-care tips
* Doctor referral suggestions via Google Maps integration

---

### 2️⃣ Anonymous Peer Support Community

To combat stigma and isolation, the platform includes:

* Topic-based discussion forums:

  * “Coping with PCOS Fatigue”
  * “Menstrual Health Myths”
  * “Iron-Rich Diet Tips”
* Anonymous posting (Firebase Anonymous Auth)
* Experience-sharing threads
* Safe, moderated interactions

No identity is revealed at any stage.

---

### 3️⃣ AI-Powered Moderation

To ensure positivity and safety:

* Hugging Face NLP sentiment analysis
* Toxicity detection
* Harmful content flagging
* Encouragement of supportive discussions

This creates a safe digital environment for women to share without fear.

---

### 4️⃣ Symptom Journal & Pattern Tracking

Users can:

* Track recurring symptoms
* Detect cycle-related fatigue patterns
* Monitor wellness trends over time

Helps promote proactive health awareness.

---

### 5️⃣ Home Remedy Validator

Users can input traditional remedies.

AI system:

* Uses rule-based checks + Gemini prompts
* Assesses safety
* Flags myths
* Provides educational insights

Promotes informed cultural practices.

---

### 6️⃣ Simple Period Health Risk Screener

* Wellness score
* Anemia risk indicator
* Alerts for persistent symptoms

Encourages early awareness and consultation.

---

## 🏗️ Tech Stack

### Frontend

* Flutter (Web & Mobile)
* Web Speech API (`ta-IN`)
* TensorFlow.js

### Backend / AI

* TensorFlow.js Symptom Classifier
* Hugging Face NLP Moderation
* Gemini (for remedy validation prompts)

### Database & Auth

* Firebase Firestore
* Firebase Anonymous Authentication

### APIs

* Google Maps API (Doctor Referral)

---

## 🔐 Privacy-First Architecture

* No mandatory personal information
* Anonymous authentication
* Secure Firebase storage
* No diagnostic claims
* Ethical AI moderation

---

## 🎯 Impact

This platform:

* Reduces stigma around women’s health discussions
* Encourages early awareness of anemia and PCOS
* Provides culturally sensitive education
* Builds safe digital solidarity
* Bridges technology with grassroots empowerment

Designed specifically for Indian women, starting with Tamil Nadu.

---

## 🌍 Future Scope

* Doctor-verified responses
* NGO integration
* Teleconsultation partnerships
* Government scheme integration
* Rural SMS-based access

---

## Built For

Hackathon Track: **Tech for Good – Women Empowerment & Healthcare**

---

## Disclaimer

This platform provides awareness and educational guidance only.
It is not a substitute for professional medical diagnosis or treatment.
Users are encouraged to consult licensed healthcare professionals.

---
