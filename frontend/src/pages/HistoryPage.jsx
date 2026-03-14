import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHistoryByUuid } from '../utils/historyApi';
import '../App.css';
import { getOrCreateUserId } from '../utils/useId';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getOrCreateUserId();

  useEffect(() => {
    const getHistory = async () => {
      try {
        // Using the user's UUID by calling getOrCreateUserId() to fetch their specific history records from DynamoDB
        const data = await fetchHistoryByUuid(userId);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  return (
    <div className="app-shell history-container">
      <header className="app-header">
        <Link to="/" className="back-link">← Back</Link>
        <h2>Assessment History</h2>
      </header>

      {loading ? (
        <div className="loading-container">
          <p>Loading your history...</p>
        </div>
      ) : (
        <div className="history-list">
          {history.length === 0 ? (
            <p>No previous attempts found.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-header">
                  <span className="history-date">{item.date}</span>
                  <span className={`history-score ${getScoreClass(item.score)}`}>
                    Score: {item.score}
                  </span>
                </div>
                <div className="history-body">
                  <div className="history-topic" style={{ 
                    fontSize: '0.85rem', 
                    color: '#0056b3', 
                    backgroundColor: '#e6f2ff', 
                    display: 'inline-block', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    🏷️ {item.topic || 'General Practice'}
                  </div>
                  
                  <p className="history-text" style={{ marginTop: '0', fontStyle: 'italic', color: '#444' }}>
                    "{item.text}"
                  </p>
                  
                  <div className="history-stats">
                    <span>Fluency: {item.fluency}%</span>
                    <span>Pronunciation: {item.pronunciation}%</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/app" className="record-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
          New Assessment
        </Link>
      </div>
    </div>
  );
};

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent';
  if (score >= 75) return 'score-good';
  if (score >= 60) return 'score-average';
  return 'score-poor';
};

export default HistoryPage;
