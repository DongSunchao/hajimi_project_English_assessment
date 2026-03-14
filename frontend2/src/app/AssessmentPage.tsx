/**
 * AssessmentPage Component
 * 
 * Main page for voice recording and pronunciation assessment.
 * Features:
 * - Voice recording with waveform visualization
 * - WASM audio processing for reduced payload
 * - Pronunciation scoring
 * - AI tutor recommendations
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import RecordRTC from 'recordrtc';
import { config } from './config';
import { joinApiUrl, unwrapBody } from './utils/apiUtils';
import { resampleAudio, float32ArrayToWav, calculateAudioStats } from './utils/wasmAudio';
import { getRandomTongueTwister } from './utils/tongueTwisters';
import { useStateWithRef } from './hooks/useStateWithRef';
import { RecordingPanel } from './components/RecordingPanel';
import { ScoreResultCard } from './components/ScoreResultCard';
import { AiAdviceCard, type AiAdvice } from './components/AiAdviceCard';
import { AssessmentForm } from './components/AssessmentForm';
import { DevModeIndicator } from './components/DevModeIndicator';

type AssessmentMode = 'custom' | 'tongue-twister';

export default function AssessmentPage() {
  const navigate = useNavigate();
  
  // State management
  const [mode, setMode] = useState<AssessmentMode>('tongue-twister');
  const [referenceText, setReferenceText] = useState(getRandomTongueTwister());
  const [isRecording, setIsRecording, isRecordingRef] = useStateWithRef(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<AiAdvice | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [wasmStats, setWasmStats] = useState<any>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Refs
  const recorderRef = useRef<RecordRTC | null>(null);
  const startTimeRef = useRef<number>(0);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  // Check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      // @ts-ignore - permissions API not fully typed
      const permissionStatus = await navigator.permissions?.query({ name: 'microphone' });
      if (permissionStatus.state === 'denied') {
        setPermissionError('Microphone access is blocked. Please enable it in your browser settings.');
      }
    } catch (error) {
      // Permissions API not supported, will handle on record attempt
      console.log('Permissions API not supported');
    }
  };

  // Start recording
  const startRecording = async () => {
    setPermissionError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: config.recording.numberOfAudioChannels,
        desiredSampRate: 48000, // Record at high quality first
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setScoreResult(null);
      setAiAdvice(null);
      setWasmStats(null);

      // Auto-stop after max duration
      setTimeout(() => {
        if (isRecordingRef.current) {
          stopRecording();
        }
      }, config.recording.maxDurationMs);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError') {
        setPermissionError(
          'Microphone access denied. Please click the 🔒 icon in your browser address bar and allow microphone access, then try again.'
        );
      } else if (error.name === 'NotFoundError') {
        setPermissionError(
          'No microphone found. Please connect a microphone and try again.'
        );
      } else if (error.name === 'NotReadableError') {
        setPermissionError(
          'Microphone is already in use by another application. Please close other apps using the microphone and try again.'
        );
      } else {
        setPermissionError(
          `Failed to access microphone: ${error.message || 'Unknown error'}. Please check your browser settings.`
        );
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current!.getBlob();
      processAudioWithWasm(blob);
      
      // Clean up
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
      setIsRecording(false);
    });
  };

  // Process audio with WASM (client-side resampling)
  const processAudioWithWasm = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Resample to target sample rate
      const resampledData = resampleAudio(audioBuffer, config.recording.desiredSampRate);
      const resampledBlob = float32ArrayToWav(resampledData, config.recording.desiredSampRate);

      // Calculate stats
      const stats = calculateAudioStats(
        blob.size,
        resampledBlob.size,
        audioBuffer.sampleRate,
        config.recording.desiredSampRate
      );
      setWasmStats(stats);

      // Set audio for playback and scoring
      const url = URL.createObjectURL(resampledBlob);
      setAudioUrl(url);
      setAudioBlob(resampledBlob);

    } catch (error) {
      console.error('Error processing audio:', error);
      // Fallback to original blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
    }
  };

  // Submit for scoring
  const submitForScoring = async () => {
    if (!audioBlob) return;

    setIsLoadingScore(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('referenceText', referenceText);

      const url = joinApiUrl(config.api.baseUrl, config.api.endpoints.scoreFree);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get score');
      }

      const data = await response.json();
      const result = unwrapBody(data);
      setScoreResult(result);
    } catch (error) {
      console.info('[Assessment API] Backend unavailable, using mock scores');
      // Mock response for development
      setScoreResult({
        overallScore: 75,
        pronunciation: 78,
        accuracy: 72,
        fluency: 76,
        completeness: 74,
      });
    } finally {
      setIsLoadingScore(false);
    }
  };

  // Request AI advice
  const requestAiAdvice = async () => {
    if (!scoreResult) return;

    setIsLoadingAi(true);
    try {
      const url = joinApiUrl(config.api.baseUrl, config.api.endpoints.aiTutor);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceText,
          score: scoreResult,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI advice');
      }

      const data = await response.json();
      const advice = unwrapBody(data);
      setAiAdvice(advice);
    } catch (error) {
      console.info('[AI Tutor API] Backend unavailable, using mock advice');
      // Mock response for development
      setAiAdvice({
        greeting: "Hello! I've analyzed your pronunciation and identified areas for improvement.",
        targetSound: "TH sound (/θ/ and /ð/)",
        tongueTwister: "The thirty-three thieves thought that they thrilled the throne.",
        tip: "Place your tongue between your teeth and blow air gently for the 'th' sound. Practice makes perfect!",
        practices: [
          "Say 'th' slowly 10 times, focusing on tongue placement",
          "Practice words: think, that, three, father, mother",
          "Record yourself and compare with native speakers",
        ],
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] border-b-4 border-[#1a1a1a] py-4 px-6 retro-shadow">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-3 border-[#f5f3e8] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-key">
              <span className="text-[#3a3a3a] font-bold text-2xl">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#f5f3e8]">PRONUNCIATION ASSESSMENT</h1>
              <p className="text-xs text-[#d4cbb8]">Reynholm Industries • Speech Practice System</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="retro-key px-3 py-2 rounded border-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a] text-xs font-bold hover:scale-105 transition-transform"
            >
              HOME
            </button>
            <button
              onClick={() => navigate('/statistics')}
              className="retro-key px-3 py-2 rounded border-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a] text-xs font-bold hover:scale-105 transition-transform"
            >
              STATISTICS
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Assessment Form */}
        <AssessmentForm
          referenceText={referenceText}
          onReferenceTextChange={setReferenceText}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Recording Controls */}
        <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow text-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoadingScore}
            className={`retro-key font-bold py-6 px-12 rounded-lg text-lg hover:scale-105 transition-transform ${
              isRecording
                ? 'bg-gradient-to-b from-[#f08c8c] to-[#da6a6a] border-3 border-[#8a3a3a] text-white'
                : 'bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-3 border-[#3a6b4a] text-[#2a2a2a]'
            }`}
          >
            <div className="text-3xl mb-2">{isRecording ? '⏹️' : '🎤'}</div>
            <div>{isRecording ? 'STOP RECORDING' : 'START RECORDING'}</div>
            {isRecording && (
              <div className="text-xs opacity-70 mt-1">Recording in progress...</div>
            )}
          </button>
          
          {/* Permission Error - Displayed prominently */}
          {permissionError && (
            <div className="mt-6 bg-gradient-to-b from-[#f08c8c] to-[#da6a6a] border-3 border-[#8a3a3a] rounded-lg p-4 retro-key">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">⚠️</div>
                <div className="text-left">
                  <div className="font-bold text-[#2a2a2a] mb-1 text-sm">MICROPHONE ACCESS ERROR</div>
                  <p className="text-xs text-[#2a2a2a] leading-relaxed">{permissionError}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPermissionError(null);
                  startRecording();
                }}
                className="retro-key mt-4 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] text-[#2a2a2a] font-bold py-2 px-6 rounded text-xs hover:scale-105 transition-transform"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Recording Visualization */}
        {isRecording && <RecordingPanel isRecording={isRecording} audioStream={audioStream || undefined} />}

        {/* WASM Stats */}
        {wasmStats && (
          <div className="retro-paper border-2 border-[#3a3a3a] rounded p-4 retro-shadow">
            <div className="flex items-center gap-3 text-xs text-[#4a4a4a] font-['Share_Tech_Mono',monospace]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#5fc77f]" />
                <span>WASM PROCESSING COMPLETE</span>
              </div>
              <span>•</span>
              <span>FROM: {wasmStats.originalSampleRate}Hz</span>
              <span>•</span>
              <span>TO: {wasmStats.targetSampleRate}Hz</span>
              <span>•</span>
              <span className="text-[#5fc77f] font-bold">SAVED: {wasmStats.savedPercentage}%</span>
            </div>
          </div>
        )}

        {/* Audio Playback */}
        {audioUrl && (
          <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow">
            <label className="block text-sm font-bold text-[#2a2a2a] mb-3">YOUR RECORDING:</label>
            <audio controls src={audioUrl} className="w-full" />
            <button
              onClick={submitForScoring}
              disabled={isLoadingScore}
              className="retro-key mt-4 w-full bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-3 border-[#6b5f3a] text-[#2a2a2a] font-bold py-4 px-6 rounded-lg text-base hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isLoadingScore ? 'ANALYZING...' : '📊 GET SCORE'}
            </button>
          </div>
        )}

        {/* Score Results */}
        {scoreResult && (
          <div className="space-y-4">
            <ScoreResultCard
              overallScore={scoreResult.overallScore}
              pronunciation={scoreResult.pronunciation}
              accuracy={scoreResult.accuracy}
              fluency={scoreResult.fluency}
              completeness={scoreResult.completeness}
            />

            {config.features.enableAiTutor && !aiAdvice && (
              <button
                onClick={requestAiAdvice}
                disabled={isLoadingAi}
                className="retro-key w-full bg-gradient-to-b from-[#a0a0f0] to-[#8080d0] border-3 border-[#4a4a8a] text-[#2a2a2a] font-bold py-4 px-6 rounded-lg text-base hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isLoadingAi ? 'CONSULTING AI...' : '🤖 GET AI TUTOR ADVICE'}
              </button>
            )}
          </div>
        )}

        {/* AI Advice */}
        {aiAdvice && <AiAdviceCard advice={aiAdvice} />}
      </div>
      
      {/* Dev Mode Indicator */}
      <DevModeIndicator />
    </div>
  );
}