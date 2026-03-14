/**
 * WelcomePage Component
 * 
 * Landing page for the Reynholm Industries Speech Practice Application.
 * Features a retro 80s office aesthetic with IT Crowd theme.
 * 
 * Design Elements:
 * - Beige gradient background (80s office style)
 * - CRT monitor display for welcome message
 * - Retro 3D button effects
 * - IT Crowd easter eggs and quotes
 */

import React from 'react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">{/* retro-beige-bg is defined in theme.css */}
      
      {/* Background texture - vintage office desk image with low opacity */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1765734482991-7c60829a0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb2ZmaWNlJTIwZGVzayUyMDE5ODBzfGVufDF8fHx8MTc3MzQ4MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Office texture"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        
        {/* Reynholm Industries Logo */}
        <div className="mb-8 text-center">
          <div className="inline-block retro-shadow mb-4">
            <div className="w-32 h-32 border-4 border-[#3a3a3a] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-key">
              <span className="text-[#3a3a3a] font-bold text-6xl">R</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#3a3a3a] mb-2">
            Reynholm Industries
          </h1>
          <div className="text-xl text-[#5a5a5a] mb-1">
            Personal History Practice Analysis
          </div>
          <div className="text-sm text-[#6a6a6a]">
            IT Department • Basement Level -1
          </div>
        </div>

        {/* Navigation - Horizontally scrollable */}
        <div className="flex-1 overflow-x-auto max-w-[500px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#6a5a4f #4a4a3a' }}>
          <div className="flex items-center gap-2 pb-1">
            <RetroNavButton label="Welcome" active />
            <RetroNavButton label="Practice" onClick={() => navigate('/practice')} />
            <RetroNavButton label="Statistics" onClick={() => navigate('/statistics')} />
            <RetroNavButton label="History" onClick={() => navigate('/history')} />
          </div>
        </div>

        {/* Welcome Message - CRT Style */}
        <div className="crt-screen border-8 border-[#4a4a3a] rounded-lg p-8 max-w-2xl mb-8 retro-shadow">
          <div className="relative z-20">
            <p className="crt-text text-center text-lg leading-relaxed mb-4">
              &gt; WELCOME TO SPEECH PRACTICE SYSTEM v2.0
            </p>
            <p className="crt-text text-center text-sm leading-relaxed opacity-80">
              "Have you tried turning it off and on again?"
            </p>
            <p className="crt-text text-center text-sm leading-relaxed opacity-80 mt-2">
              - Maurice Moss, IT Department
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-2xl">
          <button 
            onClick={() => navigate('/practice')}
            className="retro-key flex-1 bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-3 border-[#3a6b4a] text-[#2a2a2a] font-bold py-6 px-8 rounded-lg text-lg hover:scale-105 transition-transform"
          >
            <div className="text-2xl mb-2">🎤</div>
            <div>START PRACTICE</div>
            <div className="text-xs opacity-70 mt-1">Begin voice training session</div>
          </button>
          <button 
            onClick={() => navigate('/statistics')}
            className="retro-key flex-1 bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-3 border-[#6b5f3a] text-[#2a2a2a] font-bold py-6 px-8 rounded-lg text-lg hover:scale-105 transition-transform"
          >
            <div className="text-2xl mb-2">📊</div>
            <div>VIEW STATISTICS</div>
            <div className="text-xs opacity-70 mt-1">Check your progress</div>
          </button>
        </div>

        {/* IT Crowd Easter Eggs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="retro-paper border-2 border-[#3a3a3a] rounded p-4 text-center transform rotate-1">
            <p className="text-xs text-[#4a4a4a] italic">
              "I'm disabled!"<br/>
              - Roy Trenneman
            </p>
          </div>
          <div className="retro-paper border-2 border-[#3a3a3a] rounded p-4 text-center transform -rotate-1">
            <p className="text-xs text-[#4a4a4a] italic">
              "People... what a bunch of bastards!"<br/>
              - Roy Trenneman
            </p>
          </div>
          <div className="retro-paper border-2 border-[#3a3a3a] rounded p-4 text-center transform rotate-2">
            <p className="text-xs text-[#4a4a4a] italic">
              "Four! I mean five! I mean fire!"<br/>
              - Moss's Emergency Call
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-[#6a6a6a]">
          <p>Reynholm Industries © {new Date().getFullYear()}</p>
          <p className="mt-1">"We're not just here, we're also there!"</p>
        </div>
      </div>
    </div>
  );
}

/**
 * RetroNavButton Component
 * Reusable navigation button with retro 3D styling
 */
interface RetroNavButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function RetroNavButton({ label, active = false, onClick }: RetroNavButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick?.();
  };

  return (
    <button 
      onClick={handleClick}
      className={`retro-key px-4 py-2 rounded border-2 font-bold text-sm transition-all flex-shrink-0 ${
        active 
          ? "bg-gradient-to-b from-[#5a8a5a] to-[#4a7a4a] text-white border-[#2a4a2a]" 
          : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]"
      } ${isPressed ? "retro-key-pressed" : ""}`}
    >
      {label}
    </button>
  );
}