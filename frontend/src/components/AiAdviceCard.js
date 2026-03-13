import React from 'react';

const AiAdviceCard = ({ aiAdvice }) => {
  const advice = typeof aiAdvice === 'string'
    ? (() => { try { return JSON.parse(aiAdvice); } catch { return { greeting: aiAdvice }; } })()
    : aiAdvice;
  const { greeting, tongue_twister, tip, practice_sentences } = advice;

  return (
    <div className="ai-advice-card">
      <div className="ai-advice-header">
        <div className="ai-advice-header-icon">AI</div>
        <div>
          <div className="ai-advice-header-title">AI Personal Tutor Suggestions</div>
          <div className="ai-advice-header-subtitle">Powered by GPT - Personalized Voice Feedback</div>
        </div>
        <div className="ai-advice-header-badge">New</div>
      </div>

      <div className="ai-advice-body">
        {greeting && (
          <div className="ai-advice-greeting-row">
            <div className="ai-advice-greeting-icon">Hi</div>
            <p className="ai-advice-greeting-text">{greeting}</p>
          </div>
        )}

        {tongue_twister && (
          <div className="ai-advice-section ai-advice-section-bordered">
            <span className="ai-advice-chip ai-advice-chip-purple">Exclusive Tongue Twister</span>
            <div className="ai-advice-tongue-card">
              <p className="ai-advice-tongue-text">" {tongue_twister} "</p>
            </div>
          </div>
        )}

        {tip && (
          <div className="ai-advice-tip-card">
            <span className="ai-advice-tip-icon">Tip</span>
            <div>
              <div className="ai-advice-tip-title">Secrets to Oral Pronunciation Power</div>
              <p className="ai-advice-tip-text">{tip}</p>
            </div>
          </div>
        )}

        {practice_sentences?.length > 0 && (
          <div className="ai-advice-section ai-advice-practice-section">
            <span className="ai-advice-chip ai-advice-chip-blue">Scene Practice Sentences</span>
            <div className="ai-advice-practice-list">
              {practice_sentences.map((sentence, idx) => (
                <div key={idx} className="ai-advice-practice-item">
                  <div className="ai-advice-practice-index">{idx + 1}</div>
                  <p className="ai-advice-practice-text">{sentence}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ai-advice-footer">
        <span>Goal</span>
        <span>Try reading the tongue twister and practice sentences out loud, then record again to compare your progress!</span>
      </div>
    </div>
  );
};

export default AiAdviceCard;
