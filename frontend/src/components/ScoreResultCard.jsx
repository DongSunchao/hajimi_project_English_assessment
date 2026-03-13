import React from 'react';

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

export default ScoreResultCard;
