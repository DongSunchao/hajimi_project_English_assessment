import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { Bell, LogOut, Mic } from 'lucide-react';
import svgPaths from "../imports/svg-ubr093inv5";
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export function PracticePageWrapper() {
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'processing' | 'complete'>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingStatus('recording');
    setRecordingDuration(0);
    
    // Start timer to track recording duration
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 0.1);
    }, 100);
    setRecordingInterval(interval);
  };

  const stopRecording = () => {
    // Stop timer
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
    
    setIsRecording(false);
    setRecordingStatus('processing');
    
    // Simulate processing
    setTimeout(() => {
      setRecordingStatus('complete');
    }, 1500);
  };

  const resetRecording = () => {
    setRecordingStatus('idle');
    setRecordingDuration(0);
  };

  // Format duration as MM:SS.S
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const decimal = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${decimal}`;
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  return (
    <div className="relative min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">
      
      {/* Background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1765734482991-7c60829a0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb2ZmaWNlJTIwZGVzayUyMDE5ODBzfGVufDF8fHx8MTc3MzQ4MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Office texture"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="bg-gradient-to-b from-[#8a7a5f] to-[#6a5a4f] border-b-4 border-[#3a3a3a] py-3 px-8 retro-shadow">
          <div className="flex items-center justify-between gap-8">
            {/* Reynholm Industries Logo & Title */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-[50px] h-[50px] border-3 border-[#3a3a3a] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-shadow">
                  <span className="text-[#3a3a3a] font-bold text-2xl">R</span>
                </div>
                <span className="text-[10px] text-[#f5f3e8] font-bold mt-0.5">INDUSTRIES</span>
              </div>
              <div>
                <h1 className="text-[#f5f3e8] font-bold text-xl tracking-wide">
                  Speech Practice System
                </h1>
                <p className="text-[#d4cbb8] text-xs">Reynholm Industries IT Department</p>
              </div>
            </div>

            {/* Navigation - Horizontally scrollable with custom scrollbar */}
            <div 
              className="flex-1 overflow-x-auto max-w-[500px]" 
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#6a5a4f #4a4a3a',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex items-center gap-2 pb-1">
                <RetroNavButton label="Welcome" onClick={() => navigate('/')} />
                <RetroNavButton label="Practice" active />
                <RetroNavButton label="Statistics" onClick={() => navigate('/statistics')} />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 relative">
              <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded p-2 relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#d67676] border border-[#3a3a3a] rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">3</span>
                </div>
              </div>
              
              {/* User Dropdown Button */}
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="retro-key flex items-center gap-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-2"
              >
                <span className="text-[#2a2a2a] font-bold">User menu</span>
                <svg className={clsx("w-3 h-3 text-[#2a2a2a] transition-transform", userDropdownOpen && "rotate-180")} fill="currentColor" viewBox="0 0 12 6">
                  <path d={svgPaths.p3e42a480} />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#f5f3e8] border-2 border-[#3a3a3a] rounded retro-shadow z-50 min-w-[180px]">
                  <div className="p-3 border-b border-[#3a3a3a]">
                    <p className="text-[#2a2a2a] font-bold text-sm">Maurice Moss</p>
                    <p className="text-[#6a6a6a] text-xs">IT Department</p>
                  </div>
                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      // Handle logout
                    }}
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
        <div className="flex-1 px-8 py-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            
            {/* Input Text Area */}
            <div className="mb-6">
              <label className="block text-[#2a2a2a] font-bold mb-2 text-sm">
                Enter Practice Text:
              </label>
              <div className="retro-paper border-2 border-[#3a3a3a] rounded p-4">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Please enter the (1)ipsum: English text, ideally with IPA/lex symbols."
                  className="w-full bg-transparent text-[#2a2a2a] font-mono text-sm focus:outline-none min-h-[100px] resize-none"
                />
              </div>
            </div>

            {/* Recording Interface Panel - Retro Office Style */}
            <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-8 mb-6 retro-shadow min-h-[300px] flex flex-col justify-center bg-gradient-to-b from-[#f5f3e8] to-[#e8e0cd]">
              <div className="relative z-20 text-center">
                
                {/* Status Display */}
                <div className="mb-8">
                  {recordingStatus === 'idle' && (
                    <div>
                      <div className="text-[#2a2a2a] text-3xl mb-4 font-bold tracking-wide">
                        &gt; READY_TO_RECORD_
                      </div>
                      <p className="text-[#6a6a6a] text-sm">
                        Click button to start recording
                      </p>
                    </div>
                  )}
                  {recordingStatus === 'recording' && (
                    <div>
                      <div className="text-[#d67676] text-3xl mb-4 animate-pulse font-bold tracking-wide">
                        🔴 RECORDING_IN_PROGRESS...
                      </div>
                      <div className="text-[#2a2a2a] text-4xl font-bold mb-4 tabular-nums">
                        {formatDuration(recordingDuration)}
                      </div>
                      <p className="text-[#6a6a6a] text-sm">
                        Click again to stop recording
                      </p>
                    </div>
                  )}
                  {recordingStatus === 'processing' && (
                    <div>
                      <div className="text-[#2a2a2a] text-3xl mb-4 font-bold tracking-wide">
                        &gt; PROCESSING_AUDIO...
                      </div>
                      <div className="text-[#2a2a2a] text-xl mb-2">
                        Duration: {formatDuration(recordingDuration)}
                      </div>
                      <p className="text-[#6a6a6a] text-sm">
                        Analyzing pronunciation...
                      </p>
                    </div>
                  )}
                  {recordingStatus === 'complete' && (
                    <div>
                      <div className="text-[#5a8a5a] text-3xl mb-4 font-bold tracking-wide">
                        &gt; ANALYSIS_COMPLETE
                      </div>
                      <div className="text-[#2a2a2a] text-xl mb-3">
                        Recording Duration: {formatDuration(recordingDuration)}
                      </div>
                      <div className="text-[#2a2a2a] text-sm space-y-1">
                        <p>Accuracy: 85%</p>
                        <p>Pronunciation: Good</p>
                        <p>Fluency: Excellent</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recording Control */}
                <div className="flex justify-center">
                  {!isRecording ? (
                    <button 
                      onClick={startRecording}
                      className="retro-key bg-gradient-to-b from-[#ea9999] to-[#d67676] border-3 border-[#6b3a3a] rounded-full w-24 h-24 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Mic className="w-12 h-12" />
                    </button>
                  ) : (
                    <button 
                      onClick={stopRecording}
                      className="retro-key bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-3 border-[#3a6b4a] rounded-full w-24 h-24 flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
                    >
                      <div className="w-8 h-8 bg-white rounded-sm"></div>
                    </button>
                  )}
                </div>

                {/* IT Crowd Quote */}
                <p className="text-[#8a7a5f] italic text-xs mt-6">
                  "Have you tried speaking off and on again?"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/statistics')}
                className="retro-key bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-2 border-[#6b5f3a] text-[#2a2a2a] py-3 px-4 rounded font-bold text-sm"
              >
                View Statistics
              </button>
              <button 
                onClick={() => setInputText('')}
                className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] text-[#2a2a2a] py-3 px-4 rounded font-bold text-sm"
              >
                Clear Text
              </button>
              <button 
                onClick={resetRecording}
                className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] text-[#2a2a2a] py-3 px-4 rounded font-bold text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-b from-[#6a5a4f] to-[#5a4a3f] border-t-4 border-[#3a3a3a] py-3 px-8 text-center">
          <p className="text-[#d4cbb8] text-xs">
            Reynholm Industries • IT Department • Basement Level -1 • "People... what a bunch of bastards!"
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
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