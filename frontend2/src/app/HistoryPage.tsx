/**
 * HistoryPage Component
 * 
 * Displays historical assessment records with retro office filing cabinet aesthetic.
 * Shows past scores, dates, and allows filtering/sorting.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { fetchHistory, type HistoryEntry } from './utils/historyApi';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setIsLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-[#7fdb9f] to-[#5fc77f]';
    if (score >= 70) return 'from-[#f0e68c] to-[#dac86a]';
    if (score >= 60) return 'from-[#f0bc8c] to-[#da9a6a]';
    return 'from-[#f08c8c] to-[#da6a6a]';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 60) return 'AVERAGE';
    return 'NEEDS WORK';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] border-b-4 border-[#1a1a1a] py-4 px-6 retro-shadow">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-3 border-[#f5f3e8] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-key">
              <span className="text-[#3a3a3a] font-bold text-2xl">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#f5f3e8]">ASSESSMENT HISTORY</h1>
              <p className="text-xs text-[#d4cbb8]">Reynholm Industries • Records Archive</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="retro-key px-3 py-2 rounded border-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a] text-xs font-bold hover:scale-105 transition-transform"
            >
              HOME
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="retro-key px-3 py-2 rounded border-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a] text-xs font-bold hover:scale-105 transition-transform"
            >
              PRACTICE
            </button>
            <button
              onClick={() => navigate('/statistics')}
              className="retro-key px-3 py-2 rounded border-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a] text-xs font-bold hover:scale-105 transition-transform"
            >
              STATISTICS
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filing Cabinet Header */}
        <div className="crt-screen border-8 border-[#4a4a3a] rounded-lg p-6 mb-6 retro-shadow">
          <div className="relative z-20 flex items-center gap-4">
            <div className="text-4xl">🗄️</div>
            <div>
              <h2 className="crt-text text-2xl font-bold">ASSESSMENT RECORDS</h2>
              <p className="crt-text text-sm opacity-70">
                {history.length} {history.length === 1 ? 'record' : 'records'} on file
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-12 text-center retro-shadow">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg font-bold">LOADING RECORDS...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && history.length === 0 && (
          <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-12 text-center retro-shadow">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-bold mb-2">NO RECORDS FOUND</p>
            <p className="text-sm text-[#6a6a6a] mb-6">
              Start practicing to create your first assessment record!
            </p>
            <button
              onClick={() => navigate('/practice')}
              className="retro-key bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-3 border-[#3a6b4a] text-[#2a2a2a] font-bold py-4 px-8 rounded-lg hover:scale-105 transition-transform"
            >
              START PRACTICE
            </button>
          </div>
        )}

        {/* History List */}
        {!isLoading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow hover:scale-[1.02] transition-transform"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-[#6a6a6a] mb-1">
                      📅 {formatDate(entry.timestamp)}
                    </div>
                    <p className="italic text-base text-[#3a3a3a] leading-relaxed">
                      "{entry.referenceText}"
                    </p>
                  </div>
                  <div className={`ml-4 bg-gradient-to-b ${getScoreColor(entry.overallScore)} border-3 border-[#3a3a3a] rounded-lg px-6 py-3 retro-key text-center`}>
                    <div className="text-3xl font-bold text-[#2a2a2a]">
                      {entry.overallScore}
                    </div>
                    <div className="text-[10px] font-bold text-[#4a4a4a]">
                      {getScoreLabel(entry.overallScore)}
                    </div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-2 py-2 retro-key text-center">
                    <div className="text-xs text-[#5a5a5a] font-bold">PRONUNCIATION</div>
                    <div className="text-lg font-bold text-[#2a2a2a]">{entry.pronunciation}</div>
                  </div>
                  <div className="bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-2 py-2 retro-key text-center">
                    <div className="text-xs text-[#5a5a5a] font-bold">ACCURACY</div>
                    <div className="text-lg font-bold text-[#2a2a2a]">{entry.accuracy}</div>
                  </div>
                  <div className="bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-2 py-2 retro-key text-center">
                    <div className="text-xs text-[#5a5a5a] font-bold">FLUENCY</div>
                    <div className="text-lg font-bold text-[#2a2a2a]">{entry.fluency}</div>
                  </div>
                  <div className="bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-2 py-2 retro-key text-center">
                    <div className="text-xs text-[#5a5a5a] font-bold">COMPLETENESS</div>
                    <div className="text-lg font-bold text-[#2a2a2a]">{entry.completeness}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}