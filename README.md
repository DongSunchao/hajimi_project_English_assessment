# Hajimi English: AI-Powered Pronunciation Tutor

📘 GitHub README English Version

Hajimi English is an intelligent pronunciation analysis and voice cloning platform built on a high-performance, serverless, multi-cloud architecture. It does more than score spoken English: it identifies phonetic patterns, tracks persistent weaknesses, and generates personalized feedback.

## 🚀 Technical Highlights

- **Low-Latency Serverless Architecture**
  Deployed on AWS in the Sydney region using API Gateway and Lambda for responsive, event-driven processing.

- **Precision Phonetic Analysis**
  Powered by Azure Speech Service, with word-level and phoneme-level pronunciation scoring.

- **Granular Data Modeling**
  Uses a custom DynamoDB schema to track the lowest score of each phoneme across sessions, helping identify recurring pronunciation issues.

- **AI Voice Cloning**
  Integrates ElevenLabs for fast voice synthesis, enabling the tutor to respond using the user's cloned voice.

- **Hybrid Cloud Strategy**
  Coordinates AWS for compute and storage, Azure for speech analysis, and Google Gemini for LLM-driven interaction.

## 🛠️ Tech Stack

- **Frontend:** React.js, RecordRTC
- **Backend:** Python, AWS Lambda, AWS API Gateway
- **Storage:** Amazon S3, Amazon DynamoDB
- **AI Services:** Azure Speech-to-Text, ElevenLabs API, Google Gemini API

## 🧠 Data Schema: The "Phoneme Master" Design

Pronunciation data is stored in a sparse map format to reduce DynamoDB write costs while preserving detailed session-level phoneme weakness data.

| Field | Type | Description |
| --- | --- | --- |
| `userId` | String (Partition Key) | Unique user identifier |
| `timestamp` | Number (Sort Key) | Unix epoch timestamp |
| `score` | Number | Overall pronunciation accuracy score from 0 to 100 |
| `phonemeScores` | Map | Example: `{ "th": 65, "r": 82 }`, storing the weakest phoneme scores in the session |