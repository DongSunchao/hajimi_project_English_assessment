import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHistoryByUuid } from '../utils/historyApi';
import '../App.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        // Using a fake UUID for now
        const data = await fetchHistoryByUuid('fake-uuid-123');
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
                  <p className="history-text">"{item.text}"</p>
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
