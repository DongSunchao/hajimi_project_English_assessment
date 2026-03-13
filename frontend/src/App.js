import React, { useState, useRef, useEffect, useCallback } from 'react';
import RecordRTC from 'recordrtc';
import config from './config.json';
import './App.css';
import { runWasmAudioProcessing, encodeWAV } from './utils/wasmAudio';

const unwrapBody = (raw) => {
  if (raw.body) {
    return typeof raw.body === 'string' ? JSON.parse(raw.body) : raw.body;
  }
  return raw;
};

const joinApiUrl = (baseUrl, path) => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBaseUrl}/${normalizedPath}`;
};

const useStateWithRef = (initial) => {
  const [val, setVal] = useState(initial);
  const ref = useRef(initial);
  const set = (v) => { ref.current = v; setVal(v); };
  return [val, set, ref];
};

const AiAdviceCard = ({ aiAdvice }) => {
  const advice = typeof aiAdvice === 'string'
    ? (() => { try { return JSON.parse(aiAdvice); } catch { return { greeting: aiAdvice }; } })()
    : aiAdvice;
  const { greeting, tongue_twister, tip, practice_sentences } = advice;

  return (
    <div className="ai-advice-card">
      <div className="ai-advice-header">
        <div className="ai-advice-header-icon">AI</div>
        <div>
          <div className="ai-advice-header-title">AI Personal Tutor Suggestions</div>
          <div className="ai-advice-header-subtitle">Powered by GPT - Personalized Voice Feedback</div>
        </div>
        <div className="ai-advice-header-badge">New</div>
      </div>

      <div className="ai-advice-body">
        {greeting && (
          <div className="ai-advice-greeting-row">
            <div className="ai-advice-greeting-icon">Hi</div>
            <p className="ai-advice-greeting-text">{greeting}</p>
          </div>
        )}

        {tongue_twister && (
          <div className="ai-advice-section ai-advice-section-bordered">
            <span className="ai-advice-chip ai-advice-chip-purple">Exclusive Tongue Twister</span>
            <div className="ai-advice-tongue-card">
              <p className="ai-advice-tongue-text">" {tongue_twister} "</p>
            </div>
          </div>
        )}

        {tip && (
          <div className="ai-advice-tip-card">
            <span className="ai-advice-tip-icon">Tip</span>
            <div>
              <div className="ai-advice-tip-title">Secrets to Oral Pronunciation Power</div>
              <p className="ai-advice-tip-text">{tip}</p>
            </div>
          </div>
        )}

        {practice_sentences?.length > 0 && (
          <div className="ai-advice-section ai-advice-practice-section">
            <span className="ai-advice-chip ai-advice-chip-blue">Scene Practice Sentences</span>
            <div className="ai-advice-practice-list">
              {practice_sentences.map((sentence, idx) => (
                <div key={idx} className="ai-advice-practice-item">
                  <div className="ai-advice-practice-index">{idx + 1}</div>
                  <p className="ai-advice-practice-text">{sentence}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ai-advice-footer">
        <span>Goal</span>
        <span>Try reading the tongue twister and practice sentences out loud, then record again to compare your progress!</span>
      </div>
    </div>
  );
};

const RecordingPanel = ({ canvasRef }) => (
  <div className="recording-panel">
    <canvas
      ref={canvasRef}
      width={440}
      height={80}
      className="visualizer-canvas"
    />
    <div className="recording-status-row">
      <span className="wasm-blink wasm-indicator-dot" />
      <span className="recording-status-label">
        Wasm Audio Pre-processing: Noise Reduced (20ms)
      </span>
    </div>
  </div>
);

const ScoreResultCard = ({
  wasmStats,
  quickTip,
  recognizedText,
  scoreResult,
  aiLoading,
  onCallAiTutor,
}) => (
  <>
    {wasmStats && (
      <div className="wasm-summary">
        <span className="wasm-summary-icon">Info</span>
        <div className="wasm-summary-text">
          <span className="wasm-summary-title">Wasm Edge Processing</span>
          {' - '}
          Noise reduction & silence trimming
          <br />
          <span className="wasm-summary-from">{wasmStats.originalLen.toLocaleString()}</span>
          {' to '}
          <span className="wasm-summary-to">{wasmStats.trimmedLen.toLocaleString()}</span>
          {' samples '}
          <span className="wasm-summary-saved">
            (-{Math.round((1 - wasmStats.trimmedLen / wasmStats.originalLen) * 100)}%)
          </span>
        </div>
      </div>
    )}

    <div className="score-card">
      <h3>Microsoft Azure Scoring Results</h3>
      {recognizedText && <p>AI understood what you said: <em>{recognizedText}</em></p>}
      {quickTip && <div className="quick-tip-bubble">{quickTip}</div>}
      <p>Pronunciation Accuracy (Accuracy): <strong>{scoreResult.accuracy}</strong></p>
      <p>Fluency (Fluency): <strong>{scoreResult.fluency}</strong></p>
      <p>Completeness (Completeness): <strong>{scoreResult.completeness}</strong></p>
      <p>Overall Pronunciation (Pronunciation): <strong>{scoreResult.pronunciation}</strong></p>

      <button
        onClick={onCallAiTutor}
        disabled={aiLoading}
        className={`ai-tutor-button ${aiLoading ? 'is-loading' : ''}`}
      >
        {aiLoading ? 'Deep analysis generation in progress...' : 'Generate Deep Analysis Report'}
      </button>
    </div>
  </>
);

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [statusText, setStatusText] = useState('Ready');
  const [scoreResult, setScoreResult] = useState(null);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState(null);
  const [wasmStats, setWasmStats] = useState(null);
  const [quickTip, setQuickTip] = useState(null);

  const [assessmentMode, setAssessmentMode, assessmentModeRef] = useStateWithRef('with-text');
  const [inputText, setInputText, inputTextRef] = useStateWithRef(config.referenceText);
  const [topicText, setTopicText, topicTextRef] = useStateWithRef('Job Interview');

  const [currentS3FileName, setCurrentS3FileName] = useState(null);
  const [clonedAudio, setClonedAudio] = useState(null);
  const [, setIsVoiceLoading] = useState(false);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Audio visualization related refs
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafIdRef = useRef(null);
  const sourceRef = useRef(null);

  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('app_user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('app_user_id', userId);
    }
    return userId;
  };

  // Start audio spectrum visualization
  const startVisualizer = useCallback((stream) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume(); // Ensure AudioContext is not in suspended state
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafIdRef.current = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return; // Skip drawing if canvas is not mounted, but continue scheduling
      const canvasCtx = canvas.getContext('2d');
      const { width, height } = canvas;

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, width, height);

      const barCount = 40;
      const gap = 2;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      const half = barCount / 2;
      const step = Math.floor(bufferLength / half);

      for (let i = 0; i < barCount; i++) {
        // Mirror mapping: center corresponds to low frequency (strongest energy), sides correspond to high frequency
        const binIndex = i < half ? (half - 1 - i) : (i - half);
        const val = dataArray[binIndex * step] / 255;
        const barHeight = Math.max(3, val * height);

        const hue = 220 + val * 60;
        canvasCtx.fillStyle = `hsl(${hue}, 85%, ${55 + val * 20}%)`;
        canvasCtx.fillRect(i * (barWidth + gap), height - barHeight, barWidth, barHeight);
      }
    };
    rafIdRef.current = requestAnimationFrame(draw);
  }, []);

  // Stop visualization
  const stopVisualizer = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    sourceRef.current?.disconnect();
    audioCtxRef.current?.close();
    rafIdRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current = null;
    sourceRef.current = null;
  }, []);

  // Clean up when component is unmounted
  useEffect(() => () => stopVisualizer(), [stopVisualizer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: config.recording.desiredSampRate,
        numberOfAudioChannels: config.recording.numberOfAudioChannels,
      });

      recorderRef.current.startRecording();
      setIsRecording(true);
      startVisualizer(stream);
      setStatusText('Recording... (Please read English loudly, time limit 15 seconds)');
      setScoreResult(null);
      setAiAdvice(null);
      setQuickTip(null);
      setRecognizedText(null);

      timerRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setStatusText(`Reached ${config.recording.maxDurationMs / 1000} seconds time limit, auto stopped.`);
        }
      }, config.recording.maxDurationMs);
    } catch (err) {
      console.error('Unable to access microphone:', err);
      setStatusText('Error: Please allow microphone permissions');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearTimeout(timerRef.current);
    stopVisualizer();
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(async () => {
      const rawBlob = recorderRef.current.getBlob();
      streamRef.current?.getTracks().forEach(track => track.stop());

      setStatusText('Using edge computing to trim silence...');
      let finalBlob = rawBlob;
      setWasmStats(null);

      try {
        const arrayBuffer = await rawBlob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const rawSamples = audioBuffer.getChannelData(0);
        const cleanData = await runWasmAudioProcessing(rawSamples);
        finalBlob = encodeWAV(cleanData, 16000);
        setWasmStats({ originalLen: rawSamples.length, trimmedLen: cleanData.length });
        setStatusText('Processing complete, preparing to upload to the cloud!');
      } catch (error) {
        console.error('Wasm processing failed, falling back to original recording:', error);
        setStatusText('Edge processing skipped, using original recording for upload...');
        finalBlob = rawBlob;
      }

      setAudioUrl(URL.createObjectURL(finalBlob));
      uploadToS3AndScore(finalBlob, assessmentModeRef.current, topicTextRef.current);
    });
  };

  const uploadToS3AndScore = async (audioBlob, currentMode, currentTopic) => {
    const apiBaseUrl = config.apiBaseUrl;
    setStatusText('Getting S3 upload credentials...');

    try {
      const presignRes = await fetch(joinApiUrl(apiBaseUrl, 'get-upload-url'));
      if (!presignRes.ok) {
        const errorText = await presignRes.text();
        console.error('Presign API error:', errorText);
        throw new Error(`: ${errorText}`);
      }
      const { upload_url, file_name } = unwrapBody(await presignRes.json());
      if (!upload_url) throw new Error('Backend data format incorrect, upload_url not found');

      setCurrentS3FileName(file_name);
      setStatusText('Uploading directly to S3...');

      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': 'audio/wav' },
        body: audioBlob,
      });
      if (!uploadRes.ok) throw new Error('Audio upload to S3 failed');

      setStatusText('Upload successful! Calling Azure scoring...');
      const currentUserId = getOrCreateUserId();
      const isWithText = currentMode === 'with-text';
      const scoreEndpoint = isWithText
        ? joinApiUrl(apiBaseUrl, 'score')
        : joinApiUrl(apiBaseUrl, config.scoreFreeApiPath);
      const scorePayload = isWithText
        ? { fileName: file_name, referenceText: inputTextRef.current, userId: currentUserId }
        : { fileName: file_name, userId: currentUserId, topicText: currentTopic };

      const scoreRes = await fetch(scoreEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scorePayload),
      });
      if (!scoreRes.ok) throw new Error(`Scoring API error, status code: ${scoreRes.status}`);

      const scoreData = unwrapBody(await scoreRes.json());

      if (scoreData.RecognitionStatus && scoreData.RecognitionStatus !== 'Success') {
        setStatusText(`Azure rejected scoring, reason: ${scoreData.RecognitionStatus}`);
        setScoreResult(null);
        return;
      }

      const nbest = scoreData.NBest?.[0];
      if (!nbest) {
        setStatusText('Data parsing error: NBest scoring field not found');
        setScoreResult(null);
        return;
      }

      const recognizedSnapshot = scoreData.RecognizedText || scoreData.DisplayText || nbest.Display || nbest.Lexical || null;
      setRecognizedText(recognizedSnapshot);
      setScoreResult({
        accuracy: nbest.AccuracyScore || 0,
        fluency: nbest.FluencyScore || 0,
        completeness: nbest.CompletenessScore || 0,
        pronunciation: nbest.PronScore || 0,
      });
      setStatusText('All done!');

      requestAiTutor({
        userId: currentUserId,
        recognizedText: recognizedSnapshot || '',
        mode: 'quick',
      })
        .then((result) => {
          setQuickTip(result.quick_tip || null);
        })
        .catch((err) => {
          console.warn('Quick AI tip retrieval failed:', err);
        });
    } catch (err) {
      console.error('Process failed:', err);
      setStatusText('Process interrupted, please press F12 to check the console.');
    }
  };

  const requestAiTutor = async ({ userId, recognizedText, mode }) => {
    const res = await fetch(joinApiUrl(config.apiBaseUrl, 'ai-tutor'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recognizedText, mode }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`AI tutor API error, status code: ${res.status}, response: ${errorText}`);
    }

    return unwrapBody(await res.json());
  };

  const callAiTutor = () => {
    if (!currentS3FileName || !recognizedText) {
      alert("please complete a recording assessment first!");
      return;
    }

    const currentUserId = getOrCreateUserId();
    
    // 1. Enable both loading states and initialize
    setAiLoading(true);
    setIsVoiceLoading(true); // enable voice cloning loading
    setAiAdvice(null);
    setClonedAudio(null);    // clear previous cloned audio
    setStatusText('Generating in-depth analysis and cloning your voice...');

    // ==========================================
    // Parallel task A: call Gemini for deep analysis (no await)
    // ==========================================
    requestAiTutor({
      userId: currentUserId,
      recognizedText: recognizedText || '',
      mode: 'deep',
    })
      .then((advice) => {
        setAiAdvice(advice);
        setStatusText('In-depth analysis report generated!');
      })
      .catch((err) => {
        console.error('AI tutor call failed:', err);
        setStatusText('AI tutor call failed, please check the console.');
      })
      .finally(() => {
        setAiLoading(false); // Text analysis is complete.
      });

    // ==========================================
    // Parallel task B: call genVoice to obtain cloned recording (concurrent)
    // ==========================================
    fetch(joinApiUrl(config.apiBaseUrl, 'gen-voice'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: currentS3FileName, // Must pass the most recently saved S3 file name.
        text: recognizedText         // feed the user's original sentence directly to ElevenLabs!
      }),
    })
      .then(async (res) => {
        if (!res.ok){
          const errorDetail = await res.text();
          throw new Error(`Voice API error: ${res.status} - ${errorDetail}`);
        } 

        const data = await res.json(); 
        const unwrappedData = data.body ? JSON.parse(data.body) : data;
        return unwrappedData;
      })
      .then((data) => {
        if (data.audio_base64 || data.audio_base64) {
           // extract Base64 audio and store in state
           const audioData = data.audio_base64 || data.audio_base64;
           setClonedAudio(audioData); 
        }
      })
      .catch((err) => {
        console.error('Voice cloning API failed (silent fallback, core flow unaffected):', err.message);
      })
      .finally(() => {
        setIsVoiceLoading(false); // audio loading finished
      });

    // Both promises run concurrently; whichever finishes first will render!
  };

  return (
    <div className="app-shell">
      <h2>English Pronunciation Assessment Demo</h2>

      {/* Mode selection */}
      <div className="mode-switch">
        {[['with-text', 'Score given text'], ['free', 'Free reading score']].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setAssessmentMode(mode)}
            className={`mode-button ${assessmentMode === mode ? 'is-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Free reading mode: input topic */}
      {assessmentMode === 'free' && (
        <div className="form-section">
          <label className="form-label">
            Topic:
          </label>
          <input
            type="text"
            value={topicText}
            onChange={e => setTopicText(e.target.value)}
            className="form-input"
            placeholder="E.g.: Job Interview, Daily Life..."
          />
          <p className="form-hint">
            Azure will assess your language expression ability in the context of this topic
          </p>
        </div>
      )}

      {/* Given text mode: input reference text */}
      {assessmentMode === 'with-text' && (
        <div className="form-section">
          <label className="form-label">
            Please enter the English text to read:
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={3}
            className="form-input form-textarea"
            placeholder="Please enter English sentence..."
          />
        </div>
      )}

      <div className="record-action">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? 'is-recording' : ''}`}
        >
          {isRecording ? 'Stop recording' : 'Press to start reading'}
        </button>
      </div>

      {/* Recording: visualization panel + Wasm status indicator */}
      {isRecording && <RecordingPanel canvasRef={canvasRef} />}

      <p className="status-text">{statusText}</p>

      {audioUrl && (
        <div className="audio-playback">
          <p>Recording playback:</p>
          <audio src={audioUrl} controls className="audio-player" />
        </div>
      )}

      {scoreResult && (
        <ScoreResultCard
          wasmStats={wasmStats}
          quickTip={quickTip}
          recognizedText={recognizedText}
          scoreResult={scoreResult}
          aiLoading={aiLoading}
          onCallAiTutor={callAiTutor}
        />
      )}

      {aiAdvice && <AiAdviceCard aiAdvice={aiAdvice} />}
      {clonedAudio && (<audio controls src={clonedAudio} autoPlay /> )}
    </div>
  );
};

export default App;