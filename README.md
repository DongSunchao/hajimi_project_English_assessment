# Hajimi English: AI-Powered Pronunciation Tutor

Hajimi English is an intelligent pronunciation analysis and voice cloning platform built on a high-performance, serverless, multi-cloud architecture. It does more than score spoken English: it identifies phonetic patterns, tracks persistent weaknesses, and generates personalized feedback.

**Live Demo:** https://d32exl1srs8962.cloudfront.net/

**QR Code:**

![CloudFront QR](frontend/public/qrcode_d32exl1srs8962.cloudfront.net.png)


## Technical Highlights

- **Multi-Cloud "Best-of-Breed" Strategy**
  Strategically orchestrated the strongest capabilities across three major cloud providers: AWS for robust, zero-maintenance serverless computing; Azure Cognitive Services for industry-leading, phoneme-level pronunciation assessment; and Google Gemini for dynamic, context-aware LLM interactions.

- **Global Edge Acceleration & Enterprise-Grade Security**
  Deployed the React frontend via Amazon CloudFront (CDN) coupled with S3 static hosting to ensure sub-second load times globally over HTTPS. Implemented strict CORS policies and API Gateway rate limiting to protect backend endpoints from abuse and cost overruns.

- **Zero-Compute Direct Audio Uploads**
  Utilized S3 Presigned URLs to allow the frontend to bypass API Gateway payload limits and upload audio streams directly to storage, drastically reducing Lambda compute costs and network latency.

- **Granular Data Modeling & Continuous Tracking**
  Designed a custom DynamoDB NoSQL schema with sub-millisecond latency to track user-specific weak phonemes across sessions, building a personalized learning curve and identifying recurring pronunciation flaws.

- **Hyper-Personalized AI Voice Cloning**
  Integrated ElevenLabs API for ultra-fast, high-fidelity voice synthesis, enabling the AI tutor to provide feedback and pronounce tongue twisters using a custom-cloned voice.

## Tech Stack

**Frontend (Client & Edge)**
- React.js — UI Framework
- RecordRTC — Browser Audio Capture
- Amazon CloudFront — Global Edge CDN & HTTPS
- Amazon S3 — Static Website Hosting

**Backend (Serverless Core)**
- Python 3.x — Core Logic
- AWS Lambda — Microservices: `score`, `ai-tutor`, `gen-voice`, `get-history`, `get-s3-url`
- Amazon API Gateway — RESTful Routing, CORS & Throttling

**Data & Storage**
- Amazon DynamoDB — NoSQL User Analytics & Phoneme Tracking
- Amazon S3 — Audio Stream Storage
- Amazon CloudWatch — Centralized Logging & Observability

**External AI & Cognitive Engines**
- Microsoft Azure Speech Service — Pronunciation Assessment & Phoneme Scoring
- Google Gemini Pro API — LLM-driven dynamic content & Tongue Twister generation
- ElevenLabs API — Voice Cloning & Neural TTS


## How to Compile the C++ Optimizer
```powershell
emcc audio_engine.cpp -o audio_engine.js `
  -O3 `
  -s WASM=1 `
  -s MODULARIZE=1 `
  -s EXPORT_NAME="createWasmModule" `
  -s EXPORTED_RUNTIME_METHODS="['cwrap','wasmMemory']" `
  -s EXPORTED_FUNCTIONS="['_process_audio_edge','_malloc','_free']" `
  -s ALLOW_MEMORY_GROWTH=1

Copy-Item audio_engine.js, audio_engine.wasm ..\..\frontend\public\wasm\
```

## Application Architecture
![Architecture](frontend/public/architecture%20of%20the%20app.png)

---

## Core Features Implemented

### 🎯 1. Precise Speech Assessment
- Frontend captures recorded audio and sends it to the backend (integrated with Azure Speech Service API)
- Multi-dimensional scoring including fluency and completeness
- Displays detailed scores for specific words and phonemes on the frontend

### 🤖 2. AI Tutor Feedback
- Leverages Google Gemini LLM to analyze user pronunciation scores
- Provides personalized, actionable recommendations for improving spoken English

### 🎙️ 3. Personalized Voice Cloning & Text-to-Speech
- System integrates both standard Edge-TTS pronunciation and custom voice cloning
- **Cloud-based voice extraction:** Analyzes user's voice characteristics and uses the user's own voice to read auto-generated practice sentences
- Delivers an immersive, personalized shadowing and comparison experience

### 📊 4. Interactive Phonetic Statistics Dashboard
- **Dynamic Vowel/Consonant Grid:** Accurately categorized phoneme grid that dynamically changes color (Excellent/Good/Poor) based on user's historical practice data
- **Retro Data Panel:** Comprehensive IPA charts (UK IPA, US IPA) and ARPAbet notation with pronunciation letter highlights

### ⚡ 5. High-Performance Audio Engine
- WebAssembly (WASM) module compiled from C++
- Enables low-latency, high-performance in-browser audio recording and processing

### ☁️ 6. Cloud Storage & Practice History
- Secure and efficient access to user recordings using AWS S3 Presigned URLs
- History page displays past practice sessions with timestamps, text content, and overall scores

---

## Known Issues & Incomplete Features

This project is still in active development. The following features are not yet fully implemented:

### Global Navigation Bar
- "Messages" and "User" modules are incomplete
- Profile and Logout options are visible but not yet functional

### Practice Page
- Recording duration is not displayed dynamically after starting a recording

### Statistics Page
- Analysis Report section (center CRT monitor) is not yet implemented
- US IPA and UK IPA switching functionality is not yet implemented
- Auto-generating two practice sentences at the bottom is not yet implemented
- All statistics on the page are currently fixed to "past three months" data; time range switching is not yet implemented

### History Page
- Clicking individual history records to view detailed assessment content and scores is not yet supported
