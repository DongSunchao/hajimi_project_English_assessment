/**
 * HistoryPage Component
 * 
 * Displays historical assessment records with retro office filing cabinet aesthetic.
 * Shows past scores, dates, and allows filtering/sorting.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { fetchHistory, type HistoryEntry } from './utils/historyApi';
import { Bell, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import svgPaths from "../imports/svg-ubr093inv5";
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    // 添加了 relative 和 overflow-hidden
    <div className="relative min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">
      
      {/* 统一的背景纹理 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1765734482991-7c60829a0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb2ZmaWNlJTIwZGVzayUyMDE5ODBzfGVufDF8fHx8MTc3MzQ4MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Office texture"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* 使用 relative z-10 确保内容在背景之上 */}
      <div className="relative z-10">
        <header className="bg-gradient-to-b from-[#8a7a5f] to-[#6a5a4f] border-b-4 border-[#3a3a3a] py-3 px-8 retro-shadow">
        <div className="flex items-center justify-between gap-8 max-w-[1440px] mx-auto">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-[50px] h-[50px] border-3 border-[#3a3a3a] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-shadow">
                <span className="text-[#3a3a3a] font-bold text-2xl">R</span>
              </div>
              <span className="text-[10px] text-[#f5f3e8] font-bold mt-0.5">INDUSTRIES</span>
            </div>
            <div>
              <h1 className="text-[#f5f3e8] font-bold text-xl tracking-wide">
                Practice History
              </h1>
              <p className="text-[#d4cbb8] text-xs">Only records</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-x-auto max-w-[500px]" style={{ overflowX: 'scroll',scrollbarWidth: 'thin', scrollbarColor: '#6a5a4f #4a4a3a' }}>
            <div className="flex items-center gap-2 pb-1">
              <RetroNavButton label="Welcome" onClick={() => navigate('/')} />
              <RetroNavButton label="Practice" onClick={() => navigate('/practice')} />
              <RetroNavButton label="Statistics" onClick={() => navigate('/statistics')} />
              <RetroNavButton label="History" active />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3 relative">
            <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded p-2 relative">
              <Bell className="w-5 h-5" />
            </div>
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="retro-key flex items-center gap-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-2"
            >
              <span className="text-[#2a2a2a] font-bold">User menu</span>
              <svg className={clsx("w-3 h-3 text-[#2a2a2a] transition-transform", userDropdownOpen && "rotate-180")} fill="currentColor" viewBox="0 0 12 6">
                <path d={svgPaths.p3e42a480} />
              </svg>
            </button>
            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[#f5f3e8] border-2 border-[#3a3a3a] rounded retro-shadow z-50 min-w-[180px]">
                <div className="p-3 border-b border-[#3a3a3a]">
                  <p className="text-[#2a2a2a] font-bold text-sm">Maurice Moss</p>
                  <p className="text-[#6a6a6a] text-xs">IT Department</p>
                </div>
                <button 
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#e8e0cd] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[#2a2a2a] text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filing Cabinet Header */}
        <div className="crt-screen border-8 border-[#4a4a3a] rounded-lg p-6 mb-6 retro-shadow">
          <div className="relative z-20 flex items-center gap-4">
            <div className="text-4xl">🗄️</div>
            <div>
              <h2 className="crt-text text-2xl font-bold">PRACTICE RECORDS</h2>
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
              {/* Footer */}
        <div className="bg-gradient-to-b from-[#6a5a4f] to-[#5a4a3f] border-t-4 border-[#3a3a3a] py-3 px-8 text-center mt-6">
          <p className="text-[#d4cbb8] text-xs">
            Reynholm Industries • IT Department • Basement Level -1 • "We're not just here, we're also there!"
          </p>
        </div>

    </div>
    </div>
  );
}
interface RetroNavButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function RetroNavButton({ label, active = false, onClick }: RetroNavButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick?.();
  };

  return (
    <button 
      onClick={handleClick}
      className={clsx(
        "retro-key px-4 py-2 rounded border-2 font-bold text-sm transition-all flex-shrink-0",
        active 
          ? "bg-gradient-to-b from-[#5a8a5a] to-[#4a7a4a] text-white border-[#2a4a2a]" 
          : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]",
        isPressed && "retro-key-pressed"
      )}
    >
      {label}
    </button>
  );
}