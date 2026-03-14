import React from 'react';
import { tongueTwisters } from '../utils/tongueTwisters';

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
        {[
          ['with-text', 'Score given text'],
          ['tongue-twister', 'Tongue Twister'],
          ['free', 'Free reading score']
        ].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => {
              setAssessmentMode(mode);
              // Set initial tongue twister if switching to this mode
              if (mode === 'tongue-twister' && !tongueTwisters.includes(inputText)) {
                setInputText(tongueTwisters[0]);
              }
            }}
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

      {assessmentMode === 'tongue-twister' && (
        <div className="form-section">
          <label className="form-label">
            Choose a Tongue Twister:
          </label>
          <select
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="form-input"
          >
            {tongueTwisters.map((twister, index) => (
              <option key={index} value={twister}>
                {twister}
              </option>
            ))}
          </select>
          <div className="tongue-twister-display">
            <p className="twister-text">"{inputText}"</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AssessmentForm;
