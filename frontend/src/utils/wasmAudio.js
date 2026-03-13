let wasmInstance = null;

// 1. Call the bridge function of C++ engine
export async function runWasmAudioProcessing(audioData) {
  // Ensure the module is correctly initialized so HEAPF32 will never be lost
  if (!wasmInstance) {
    if (typeof window.createWasmModule === 'undefined') {
      throw new Error("Wasm script has not loaded yet, please check if audio_engine.js is imported in index.html");
    }
    // Call the factory function, wait for Wasm engine to start
    wasmInstance = await window.createWasmModule();
  }

  // C++ signature: int process_audio_edge(float* buffer, int total_length)
  // Process buffer in place, return the new length after trimming
  const processAudioEdge = wasmInstance.cwrap(
    'process_audio_edge', 'number', ['number', 'number']
  );

  const length = audioData.length;
  const bufferPtr = wasmInstance._malloc(length * 4);

  try {
        // _malloc may trigger memory growth, refresh view before each operation
        const getHeapF32 = () => new Float32Array(wasmInstance.wasmMemory.buffer);

        // Write audio data
        getHeapF32().set(audioData, bufferPtr >>> 2);

        // Execute C++ edge computing and return new length
        const newLength = processAudioEdge(bufferPtr, length);
        console.log(`[WASM Edge Computing] Original length: ${length}, Trimmed length: ${newLength}`);

        if (newLength <= 0) {
          throw new Error("Audio is too quiet or completely trimmed!");
        }

        // C++ has moved valid data to buffer start position, directly read newLength samples
        const processedAudio = getHeapF32().slice(bufferPtr >>> 2, (bufferPtr >>> 2) + newLength);
        return processedAudio;
      } finally {
        wasmInstance._free(bufferPtr);
      }

}

// 2. Re-pack C++ output Float32Array back into WAV Blob (no changes)
export function encodeWAV(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}