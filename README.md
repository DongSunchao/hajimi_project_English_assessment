# Hajimi English: AI-Powered Pronunciation Tutor

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


## How to compile the cpp optimizer:

### PowerShell (backtick line break) or write directly on one line:
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

## The architecture of the app
![Architecture](frontend/public/architecture%20of%20the%20app.png)







没问题，这个“云端音色克隆”的设计非常惊艳！我已经将这个隐藏的“黑科技”完美整合到了 README 的核心功能介绍中。

您可以直接复制以下最新版本的 README：

---

# Hajimi 英语发音评测平台 (English Assessment Portal)

这是一个结合了复古 80 年代办公室风格（灵感来自《IT狂人》Reynholm Industries）的 AI 英语发音评测与练习平台。系统能够精准到“音标级”对用户的发音进行分析和指导。

## 🚀 已实现的核心功能

1. **精准语音评测 (Speech Assessment)**
* 前端采集录音并发送至后端（对接 SpeechSuper API），从流利度、完整度等多维度进行评分，并在前端精确展示到具体单词和音标的得分。


2. **AI 辅导老师 (AI Tutor Feedback)**
* 结合 Google Gemini 大模型，分析用户的发音得分数据，提供个性化、可操作的口语发音改进建议。


3. **专属音色克隆与 TTS 示范 (Voice Cloning & Text-to-Speech)**
* 系统不仅集成 Edge-TTS 提供标准发音，还会**通过云端处理提取用户的讲话音色特征，使用用户自己的声音来朗读自动生成的练习句子**，为用户带来极具沉浸感和个性化的跟读对比体验。


4. **交互式音标统计面板 (Statistics Dashboard)**
* **动态音标网格**：准确分类的元音和辅音网格，根据用户的历史练习数据动态改变颜色（Excellent/Good/Poor）。
* **复古数据看板**：包含详尽的英式(UK IPA)、美式(US IPA)与 ARPAbet 音标对照表及发音字母高亮展示。


5. **高性能音频引擎 (Audio Engine)**
* 前端集成了基于 C++ 编译的 WebAssembly (WASM) 模块，实现低延迟、高性能的浏览器端录音与音频处理。


6. **云存储与历史记录 (Cloud Storage & History)**
* 使用 AWS S3 预签名 URL 安全高效地存取用户录音。
* 提供历史记录页面，展示过往的练习时间、文本及总分。



## 🛠️ 技术栈

* **前端**: React 18, TypeScript, Vite, Tailwind CSS, WebAssembly (WASM)
* **后端**: Python (负责评分、AI、TTS和S3微服务), C++ (音频引擎)
* **第三方集成**: AWS S3, SpeechSuper API, Google Gemini API, Edge-TTS (含云端音色处理)

---

## 🚧 已知问题与未完成功能 (Known Issues)

本项目仍在开发中，以下功能尚未完全实现：

* **全局导航栏**：
* “消息 (Messages)” 和 “用户 (User)” 模块尚未完成。
* 用户下拉菜单中的“个人资料 (Profile)”和“退出登录 (Logout)”选项可见但尚未实现对应功能。


* **录音练习页 (Practice Page)**：
* 开始录音后，目前无法动态显示录音时长。


* **统计数据页 (Statistic Page)**：
* 中间 CRT 显示器内的“分析报告 (Analysis Report)”部分尚未开发完成。
* 美式音标与英式音标的切换功能尚未实现。
* 页面底部“自动生成两个练习句子”的功能尚未实现。
* 目前页面上的所有统计数据均固定为“过去三个月”的用户数据，“切换时间范围”的功能尚未实现。


* **历史记录页 (History Page)**：
* 目前不支持点击单条历史记录来查看详细的评测内容和得分详情。
