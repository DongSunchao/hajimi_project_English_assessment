import React from 'react';

const AssessmentForm = ({
  assessmentMode,
  setAssessmentMode,
  topicText,
  setTopicText,
  inputText,
  setInputText
}) => {
  return (
    <>
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
    </>
  );
};

export default AssessmentForm;
