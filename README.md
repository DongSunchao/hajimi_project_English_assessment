# Hajimi English: AI-Powered Pronunciation Tutor

GitHub README English Version

Hajimi English is an intelligent pronunciation analysis and voice cloning platform built on a high-performance, serverless, multi-cloud architecture. It does more than score spoken English: it identifies phonetic patterns, tracks persistent weaknesses, and generates personalized feedback.

our app has deployed on AWS cloudfront:https://d32exl1srs8962.cloudfront.net/

QR:

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


# how to compile the cpp optimizer:

## PowerShell (backtick line break) or write directly on one line:
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

## our architecture of the app
![Architecture](frontend/public/architecture%20of%20the%20app.png)
