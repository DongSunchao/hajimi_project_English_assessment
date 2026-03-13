import React from 'react';

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

export default RecordingPanel;
