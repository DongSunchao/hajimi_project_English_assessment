import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import AssessmentPage from './pages/AssessmentPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/app" element={<AssessmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;