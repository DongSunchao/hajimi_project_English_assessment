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
import { resampleAudio, runWasmAudioProcessing, float32ArrayToWav, calculateAudioStats } from './utils/wasmAudio';
import { getRandomTongueTwister } from './utils/tongueTwisters';
import { useStateWithRef } from './hooks/useStateWithRef';
import { RecordingPanel } from './components/RecordingPanel';
import { ScoreResultCard } from './components/ScoreResultCard';
import { AiAdviceCard, type AiAdvice } from './components/AiAdviceCard';
import { AssessmentForm } from './components/AssessmentForm';
import { DevModeIndicator } from './components/DevModeIndicator';
import { Bell, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import svgPaths from "../imports/svg-ubr093inv5";
import { ImageWithFallback } from './components/figma/ImageWithFallback';

type AssessmentMode = 'custom' | 'tongue-twister' | 'free';

function TerminalLoader() {
  const [text, setText] = useState('> INITIALIZING NEURAL LINK...\n');
  useEffect(() => {
    const logs = [
      '> BYPASSING MAINFRAME...',
      '> UPLOADING WASM OPTIMIZED PAYLOAD TO AWS S3...',
      '> INITIATING AZURE PHONEME EXTRACTION PROTOCOL...',
      '> CROSS-REFERENCING ARPAbet MATRICES...',
      '> AWAITING FINAL SCORE...'
    ];
    let i = 0;
    const timer = setInterval(() => {
      if (i < logs.length) {
        setText(prev => prev + logs[i] + '\n');
        i++;
      }
    }, 800);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-[#0a0a0a] border-2 border-[#00ff41]/50 p-4 rounded retro-shadow font-mono text-[#00ff41] text-xs h-32 overflow-hidden flex flex-col justify-end mt-4 w-full">
      <pre className="whitespace-pre-wrap">{text}<span className="animate-pulse">_</span></pre>
    </div>
  );
}

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error';
};

const normalizeAudioDataUri = (audio: string): string => {
  const trimmed = audio.trim();
  if (trimmed.startsWith('data:audio/')) {
    return trimmed;
  }
  return `data:audio/mp3;base64,${trimmed}`;
};

export default function AssessmentPage() {
  const navigate = useNavigate();

  // console.error('Rendering AssessmentPage');
  // State management
  const [mode, setMode] = useState<AssessmentMode>('tongue-twister');
  const [referenceText, setReferenceText] = useState(getRandomTongueTwister());
  const [topicText, setTopicText] = useState('General Practice');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isRecording, setIsRecording, isRecordingRef] = useStateWithRef(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<AiAdvice | null>(null);
  const [quickTip, setQuickTip] = useState<string | null>(null);
  const [currentS3FileName, setCurrentS3FileName] = useState<string>('');
  const [clonedAudio, setClonedAudio] = useState<string | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [wasmStats, setWasmStats] = useState<any>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
      setQuickTip(null);
      setClonedAudio(null);
      setWasmStats(null);

      // Auto-stop after max duration
      setTimeout(() => {
        if (isRecordingRef.current) {
          stopRecording();
        }
      }, config.recording.maxDurationMs);
    } catch (error: unknown) {
      console.error('Error starting recording:', error);
      const errorMessage = getErrorMessage(error);
      const errorName = error instanceof Error ? error.name : '';

      // Provide specific error messages
      if (errorName === 'NotAllowedError') {
        setPermissionError(
          'Microphone access denied. Please click the 🔒 icon in your browser address bar and allow microphone access, then try again.'
        );
      } else if (errorName === 'NotFoundError') {
        setPermissionError(
          'No microphone found. Please connect a microphone and try again.'
        );
      } else if (errorName === 'NotReadableError') {
        setPermissionError(
          'Microphone is already in use by another application. Please close other apps using the microphone and try again.'
        );
      } else {
        setPermissionError(
          `Failed to access microphone: ${errorMessage}. Please check your browser settings.`
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

  const getOrCreateUserId = (): string => {
  const key = 'app_user_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  localStorage.setItem(key, generated);
  return generated;
};

  // Process audio with WASM (client-side resampling)
  const processAudioWithWasm = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Resample first, then run real WASM edge-trimming
      const resampledData = resampleAudio(audioBuffer, config.recording.desiredSampRate);
      const wasmProcessedData = await runWasmAudioProcessing(resampledData);
      const processedBlob = float32ArrayToWav(wasmProcessedData, config.recording.desiredSampRate);

      // Calculate stats
      const stats = calculateAudioStats(
        blob.size,
        processedBlob.size,
        audioBuffer.sampleRate,
        config.recording.desiredSampRate,
        'wasm'
      );
      setWasmStats(stats);

      // Set audio for playback and scoring
      const url = URL.createObjectURL(processedBlob);
      setAudioUrl(url);
      setAudioBlob(processedBlob);

    } catch (error) {
      console.warn('WASM processing failed, fallback to JS-only resampling:', error);

      // Fallback path: keep app functional even if wasm bridge/module fails
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const resampledData = resampleAudio(audioBuffer, config.recording.desiredSampRate);
      const fallbackBlob = float32ArrayToWav(resampledData, config.recording.desiredSampRate);

      const stats = calculateAudioStats(
        blob.size,
        fallbackBlob.size,
        audioBuffer.sampleRate,
        config.recording.desiredSampRate,
        'js-fallback'
      );
      setWasmStats(stats);

      const url = URL.createObjectURL(fallbackBlob);
      setAudioUrl(url);
      setAudioBlob(fallbackBlob);
    }
  };

  // Submit for scoring
  const submitForScoring = async () => {
    if (!audioBlob) return;

    setIsLoadingScore(true);
    try {
      const apiBaseUrl = config.api.baseUrl;
      const userId = getOrCreateUserId();

      const presignRes = await fetch(joinApiUrl(apiBaseUrl, config.api.endpoints.getUploadUrl));
      if (!presignRes.ok) {
        throw new Error(`Failed to get upload url: ${presignRes.status}`);
      }

      const { upload_url, file_name } = unwrapBody(await presignRes.json());
      if (!upload_url || !file_name) {
        throw new Error('Invalid upload url response from backend');
      }
      setCurrentS3FileName(file_name);

      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': 'audio/wav' },
        body: audioBlob,
      });
      if (!uploadRes.ok) {
        throw new Error(`Failed to upload audio: ${uploadRes.status}`);
      }

      const isScriptedMode = mode !== 'free';
      const scoreEndpoint = isScriptedMode
        ? joinApiUrl(apiBaseUrl, config.api.endpoints.score)
        : joinApiUrl(apiBaseUrl, config.api.endpoints.scoreFree);

      let finalTopic = 'General Practice';
      if (mode === 'free') {
        finalTopic = topicText.trim() ? `Free Talk: ${topicText.trim()}` : 'Free Talk';
      } else if (mode === 'tongue-twister') {
        finalTopic = 'Tongue Twister';
      } else if (mode === 'custom') {
        finalTopic = 'Reading Practice';
      }

      const scorePayload = isScriptedMode
        ? {
            fileName: file_name,
            referenceText,
            userId,
            topic: finalTopic,
          }
        : {
            fileName: file_name,
            userId,
            topic: finalTopic,
          };

      const response = await fetch(scoreEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scorePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Scoring failed: ${response.status} ${errorText}`);
      }

      const scoreData = unwrapBody(await response.json());
      if (scoreData.RecognitionStatus && scoreData.RecognitionStatus !== 'Success') {
        throw new Error(`Azure rejected request: ${scoreData.RecognitionStatus}`);
      }

      const nbest = scoreData.NBest?.[0];
      if (!nbest) {
        throw new Error('Invalid scoring response: missing NBest');
      }

      const recognized = scoreData.RecognizedText || scoreData.DisplayText || nbest.Display || nbest.Lexical || '';
      setRecognizedText(recognized);

      setScoreResult({
        overallScore: Math.round(nbest.PronScore || 0),
        pronunciation: Math.round(nbest.PronScore || 0),
        accuracy: Math.round(nbest.AccuracyScore || 0),
        fluency: Math.round(nbest.FluencyScore || 0),
        completeness: Math.round(nbest.CompletenessScore || 0),
      });

      requestAiTutor({
        userId,
        recognizedText: recognized || '',
        mode: 'quick',
      })
        .then((result) => {
          setQuickTip(result.quick_tip || null);
        })
        .catch((err) => {
          console.warn('Quick AI tip retrieval failed:', err);
        });
    } catch (error: unknown) {
      console.error('[Assessment API] ！', error);
      alert(`have you turned it off and on again？\ninfo: ${getErrorMessage(error)}`);
    } finally {
      setIsLoadingScore(false);
    }
  };

  const requestAiTutor = async ({ userId, recognizedText, mode }: { userId: string; recognizedText: string; mode: 'quick' | 'deep' }) => {
    const url = joinApiUrl(config.api.baseUrl, config.api.endpoints.aiTutor);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recognizedText, mode }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI tutor API error, status code: ${response.status}, response: ${errorText}`);
    }

    return unwrapBody(await response.json());
  };

  // Request AI advice
  const requestAiAdvice = async () => {
    if (!currentS3FileName || !recognizedText) {
      alert('Please complete a recording assessment first.');
      return;
    }

    const userId = getOrCreateUserId();
    setIsLoadingAi(true);
    setIsVoiceLoading(true);
    setAiAdvice(null);
    setClonedAudio(null);

    requestAiTutor({
      userId,
      recognizedText: recognizedText || '',
      mode: 'deep',
    })
      .then((advice) => {
        setAiAdvice(advice);
      })
      .catch((err) => {
        console.error('AI tutor call failed:', err);
      })
      .finally(() => {
        setIsLoadingAi(false);
      });

    fetch(joinApiUrl(config.api.baseUrl, config.api.endpoints.genVoice), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: currentS3FileName,
        text: recognizedText,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorDetail = await res.text();
          throw new Error(`Voice API error: ${res.status} - ${errorDetail}`);
        }
        const data = await res.json();
        return unwrapBody(data);
      })
      .then((data) => {
        const audioData = data.audio_base64 || data.audioBase64;
        if (audioData) {
          setClonedAudio(normalizeAudioDataUri(audioData));
        }
      })
      .catch((err) => {
        console.error('Voice cloning API failed (silent fallback):', err);
      })
      .finally(() => {
        setIsVoiceLoading(false);
      });
  };

return (
    <div className="relative min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">

      {/* Background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1765734482991-7c60829a0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb2ZmaWNlJTIwZGVzayUyMDE5ODBzfGVufDF8fHx8MTc3MzQ4MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Office texture"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        <header className="bg-gradient-to-b from-[#8a7a5f] to-[#6a5a4f] border-b-4 border-[#3a3a3a] py-3 px-8 retro-shadow">
        <div className="flex items-center justify-between gap-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-[50px] h-[50px] border-3 border-[#3a3a3a] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-shadow">
                <span className="text-[#3a3a3a] font-bold text-2xl">R</span>
              </div>
              <span className="text-[10px] text-[#f5f3e8] font-bold mt-0.5">INDUSTRIES</span>
            </div>
            <div>
              <h1 className="text-[#f5f3e8] font-bold text-xl tracking-wide">
                Speech Practice
              </h1>
              <p className="text-[#d4cbb8] text-xs">Practice makes perfect</p>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto max-w-[500px]" style={{ overflowX: 'scroll',scrollbarWidth: 'thin', scrollbarColor: '#6a5a4f #4a4a3a' }}>
            <div className="flex items-center gap-2 pb-1">
              <RetroNavButton label="Welcome" onClick={() => navigate('/')} />
              <RetroNavButton label="Practice" active />
              <RetroNavButton label="Statistics" onClick={() => navigate('/statistics')} />
              <RetroNavButton label="History" onClick={() => navigate('/history')} />
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded p-2 relative">
              <Bell className="w-5 h-5" />
            </div>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="retro-key flex items-center gap-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-2"
            >
              <span className="text-[#2a2a2a] font-bold">User menu</span>
              <svg className={clsx("w-3 h-3 text-[#2a2a2a] transition-transform", userDropdownOpen && "rotate-180")} fill="currentColor" viewBox="0 0 12 6">
                <path d={svgPaths.p3e42a480} />
              </svg>
            </button>
            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[#f5f3e8] border-2 border-[#3a3a3a] rounded retro-shadow z-50 min-w-[180px]">
                <div className="p-3 border-b border-[#3a3a3a]">
                  <p className="text-[#2a2a2a] font-bold text-sm">Maurice Moss</p>
                  <p className="text-[#6a6a6a] text-xs">IT Department</p>
                </div>
                <button
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#e8e0cd] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[#2a2a2a] text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Assessment Form */}
        <AssessmentForm
          referenceText={referenceText}
          onReferenceTextChange={setReferenceText}
          topicText={topicText}
          onTopicTextChange={setTopicText}
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
          <div className="crt-screen border-4 border-[#3a3a3a] rounded p-4 retro-shadow bg-[#0a0a0a] relative overflow-hidden">
            <div className="flex items-center justify-between font-['Share_Tech_Mono',monospace]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00ff41] animate-pulse shadow-[0_0_8px_#00ff41]" />
                <div>
                  <div className="text-[#00ff41] text-sm font-bold tracking-wider">
                    {wasmStats.engine === 'wasm' ? '> EDGE_COMPUTING: WASM MODULE ACTIVE' : '> EDGE_COMPUTING: JS FALLBACK'}
                  </div>
                  <div className="text-[#00ff41]/70 text-xs mt-1">
                    [AUDIO_PAYLOAD_OPTIMIZATION_PROTOCOL_INITIATED]
                  </div>
                </div>
              </div>
              <div className="text-right border-l-2 border-[#00ff41]/30 pl-4">
                <div className="text-[#00ff41]/80 text-xs">RESAMPLED: {wasmStats.originalSampleRate}Hz → {wasmStats.targetSampleRate}Hz</div>
                <div className="text-[#ffb700] font-bold text-sm mt-1 shadow-[0_0_5px_#ffb700]/50">
                  BANDWIDTH SAVED: {wasmStats.savedPercentage}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Playback */}
        {audioUrl && (
          <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow">
            <label className="block text-sm font-bold text-[#2a2a2a] mb-3">YOUR RECORDING:</label>
            <audio controls src={audioUrl} className="w-full" />
            {isLoadingScore ? (
              <TerminalLoader />
            ) : (
              <button
                onClick={submitForScoring}
                disabled={isLoadingScore}
                className="retro-key mt-4 w-full bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-3 border-[#6b5f3a] text-[#2a2a2a] font-bold py-4 px-6 rounded-lg text-base hover:scale-105 transition-transform"
              >
                📊 GET SCORE
              </button>
            )}
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

            {quickTip && (
              <div className="retro-paper border-2 border-[#3a3a3a] rounded p-4 retro-shadow">
                <div className="text-xs font-bold text-[#5a5a5a] mb-1">AI QUICK TIP</div>
                <p className="text-sm text-[#2a2a2a]">{quickTip}</p>
              </div>
            )}

            {config.features.enableAiTutor && !aiAdvice && (
              <button
                onClick={requestAiAdvice}
                disabled={isLoadingAi || isVoiceLoading}
                className="retro-key w-full bg-gradient-to-b from-[#a0a0f0] to-[#8080d0] border-3 border-[#4a4a8a] text-[#2a2a2a] font-bold py-4 px-6 rounded-lg text-base hover:scale-105 transition-transform disabled:opacity-50"
              >
                {(isLoadingAi || isVoiceLoading) ? 'GENERATING DEEP ANALYSIS + VOICE...' : '🤖 GET IN-DEPTH AI + CLONED VOICE'}
              </button>
            )}
          </div>
        )}

        {/* AI Advice */}
        {aiAdvice && <AiAdviceCard advice={aiAdvice} />}

        {clonedAudio && (
          <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow">
            <label className="block text-sm font-bold text-[#2a2a2a] mb-3">CLONED VOICE:</label>
            <audio controls autoPlay src={clonedAudio} className="w-full" />
          </div>
        )}
      </div>

      {/* Dev Mode Indicator */}
      <DevModeIndicator />

              {/* Footer */}
        <div className="bg-gradient-to-b from-[#6a5a4f] to-[#5a4a3f] border-t-4 border-[#3a3a3a] py-3 px-8 text-center mt-6">
          <p className="text-[#d4cbb8] text-xs">
            Reynholm Industries • IT Department • Basement Level -1 • "We're not just here, we're also there!"
          </p>
        </div>

    </div>
    </div>
  );
}

interface RetroNavButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function RetroNavButton({ label, active = false, onClick }: RetroNavButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "retro-key px-4 py-2 rounded border-2 font-bold text-sm transition-all flex-shrink-0",
        active
          ? "bg-gradient-to-b from-[#5a8a5a] to-[#4a7a4a] text-white border-[#2a4a2a]"
          : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]",
        isPressed && "retro-key-pressed"
      )}
    >
      {label}
    </button>
  );
}