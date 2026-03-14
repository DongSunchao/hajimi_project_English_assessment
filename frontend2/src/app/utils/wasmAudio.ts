/**
 * WebAssembly Audio Processing Utilities
 *
 * Real processing path:
 * 1) JS resample to target sample rate
 * 2) WASM edge-trimming (silence/noise edge removal)
 * 3) Encode to WAV
 */

type WasmModule = {
  cwrap: (name: string, returnType: string, argTypes: string[]) => (...args: number[]) => number;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  wasmMemory: WebAssembly.Memory;
};

declare global {
  interface Window {
    createWasmModule?: () => Promise<WasmModule>;
  }
}

let wasmInstance: WasmModule | null = null;

/**
 * Resamples audio data from original sample rate to target sample rate
 * Uses linear interpolation for simplicity
 * 
 * @param audioBuffer - Original audio buffer from recording
 * @param targetSampleRate - Desired sample rate (e.g., 16000)
 * @returns Resampled Float32Array
 */
export function resampleAudio(
  audioBuffer: AudioBuffer,
  targetSampleRate: number
): Float32Array {
  const originalSampleRate = audioBuffer.sampleRate;
  const originalData = audioBuffer.getChannelData(0); // Get mono channel
  const originalLength = originalData.length;
  
  // Calculate new length based on sample rate ratio
  const ratio = originalSampleRate / targetSampleRate;
  const newLength = Math.round(originalLength / ratio);
  const resampledData = new Float32Array(newLength);

  // Linear interpolation resampling
  for (let i = 0; i < newLength; i++) {
    const originalIndex = i * ratio;
    const index = Math.floor(originalIndex);
    const fraction = originalIndex - index;
    
    if (index + 1 < originalLength) {
      // Interpolate between two samples
      resampledData[i] = 
        originalData[index] * (1 - fraction) +
        originalData[index + 1] * fraction;
    } else {
      // Use last sample if at the end
      resampledData[i] = originalData[originalLength - 1];
    }
  }

  return resampledData;
}

export async function runWasmAudioProcessing(audioData: Float32Array): Promise<Float32Array> {
  if (!wasmInstance) {
    if (typeof window.createWasmModule === 'undefined') {
      throw new Error('WASM bridge is not loaded. Ensure /wasm/audio_engine.js is included in index.html');
    }
    wasmInstance = await window.createWasmModule();
  }

  const processAudioEdge = wasmInstance.cwrap('process_audio_edge', 'number', ['number', 'number']);

  const length = audioData.length;
  const bufferPtr = wasmInstance._malloc(length * 4);

  try {
    const getHeapF32 = () => new Float32Array(wasmInstance!.wasmMemory.buffer);
    getHeapF32().set(audioData, bufferPtr >>> 2);

    const newLength = processAudioEdge(bufferPtr, length);
    if (newLength <= 0) {
      throw new Error('Audio is too quiet or fully trimmed by WASM.');
    }

    return getHeapF32().slice(bufferPtr >>> 2, (bufferPtr >>> 2) + newLength);
  } finally {
    wasmInstance._free(bufferPtr);
  }
}

/**
 * Converts Float32Array audio data to WAV file Blob
 * 
 * @param samples - Audio samples as Float32Array
 * @param sampleRate - Sample rate of the audio
 * @returns WAV file as Blob
 */
export function float32ArrayToWav(
  samples: Float32Array,
  sampleRate: number
): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Convert float32 to int16
  const offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Calculates audio processing statistics
 * Returns information about size reduction and processing
 */
export function calculateAudioStats(
  originalSize: number,
  processedSize: number,
  originalSampleRate: number,
  targetSampleRate: number,
  engine: 'wasm' | 'js-fallback' = 'wasm'
) {
  const savedBytes = originalSize - processedSize;
  const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(1);
  
  return {
    originalSize,
    processedSize,
    savedBytes,
    savedPercentage,
    originalSampleRate,
    targetSampleRate,
    engine,
  };
}
