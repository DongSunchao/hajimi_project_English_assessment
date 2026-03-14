import React, { useState, useRef, useEffect, useCallback } from 'react';
import RecordRTC from 'recordrtc';
import config from '../config.json';
import '../App.css';
import { runWasmAudioProcessing, encodeWAV } from '../utils/wasmAudio';
import { unwrapBody, joinApiUrl } from '../utils/apiUtils';
import { useStateWithRef } from '../hooks/useStateWithRef';
import AiAdviceCard from '../components/AiAdviceCard';
import RecordingPanel from '../components/RecordingPanel';
import ScoreResultCard from '../components/ScoreResultCard';
import AssessmentForm from '../components/AssessmentForm';
import TutorialDialog from '../components/TutorialDialog';

const AssessmentPage = () => {
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('has_seen_tutorial');
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
      localStorage.setItem('has_seen_tutorial', 'true');
    }
  }, []);

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
      const isWithText = currentMode === 'with-text' || currentMode === 'tongue-twister';
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
    <div className="app-shell" id="step-0">
      <header className="app-header">
        <h2>English Pronunciation Assessment Demo</h2>
        <button 
          className="help-button" 
          onClick={() => setIsTutorialOpen(true)}
          title="Replay Tutorial"
        >
          ?
        </button>
      </header>

      {/* Mode selection and Assessment form */}
      <div id="step-1">
        <AssessmentForm
          assessmentMode={assessmentMode}
          setAssessmentMode={setAssessmentMode}
          topicText={topicText}
          setTopicText={setTopicText}
          inputText={inputText}
          setInputText={setInputText}
        />
      </div>

      <div className="record-action" id="step-2">
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
        <div id="step-3">
          <ScoreResultCard
            wasmStats={wasmStats}
            quickTip={quickTip}
            recognizedText={recognizedText}
            scoreResult={scoreResult}
            aiLoading={aiLoading}
            onCallAiTutor={callAiTutor}
          />
        </div>
      )}

      {aiAdvice && <AiAdviceCard aiAdvice={aiAdvice} />}
      {clonedAudio && (<audio controls src={clonedAudio} autoPlay /> )}
      
      <TutorialDialog 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />
    </div>
  );
};

export default AssessmentPage;
