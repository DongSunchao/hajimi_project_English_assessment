import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const WelcomePage = () => {
  return (
    <div className="app-shell welcome-container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to English Pronunciation Assessment</h1>
      <p>Improve your English speaking skills with our AI-powered assessment tool.</p>
      <div style={{ marginTop: '50px' }}>
        <Link to="/app" className="record-button" style={{ textDecoration: 'none', padding: '15px 30px' }}>
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
