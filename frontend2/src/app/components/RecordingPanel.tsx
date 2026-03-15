/**
 * RecordingPanel Component
 * 
 * Displays audio waveform visualization during recording.
 * Uses retro terminal aesthetic with green phosphor display.
 */

import React, { useEffect, useRef } from 'react';

interface RecordingPanelProps {
  isRecording: boolean;
  audioStream?: MediaStream;
}

export function RecordingPanel({ isRecording, audioStream }: RecordingPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isRecording || !audioStream || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up audio analysis
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      // Retro terminal background
      ctx.fillStyle = 'rgba(0, 20, 0, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green phosphor waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff41';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [isRecording, audioStream]);

  return (
    <div className="border-4 border-[#4a4a3a] rounded-lg overflow-hidden retro-shadow">
      <canvas
        ref={canvasRef}
        width={600}
        height={100}
        className="w-full h-[100px] bg-[#001400]"
      />
      {isRecording && (
        <div className="bg-[#001a00] border-t-2 border-[#00ff41] px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
          <span className="font-['Share_Tech_Mono',monospace] text-xs text-[#00ff41] tracking-wider">
            RECORDING IN PROGRESS...
          </span>
        </div>
      )}
    </div>
  );
}
