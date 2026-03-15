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

import { useNavigate } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import React, { useState } from 'react'; // 加上 useState
import { Bell, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import svgPaths from "../imports/svg-ubr093inv5";


export default function WelcomePage() {
  const navigate = useNavigate();
const [userDropdownOpen, setUserDropdownOpen] = useState(false);
return (
    <div className="relative min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1765734482991-7c60829a0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb2ZmaWNlJTIwZGVzayUyMDE5ODBzfGVufDF8fHx8MTc3MzQ4MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Office texture"
          className="absolute w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20">
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
                  Reynholm Industries
                </h1>
                <p className="text-[#d4cbb8] text-xs">IT Department</p>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto max-w-[500px]" style={{ overflowX: 'scroll',scrollbarWidth: 'thin', scrollbarColor: '#6a5a4f #4a4a3a' }}>
              <div className="flex items-center gap-2 pb-1">
                <RetroNavButton label="Welcome" active />
                <RetroNavButton label="Practice" onClick={() => navigate('/practice')} />
                <RetroNavButton label="Statistics" onClick={() => navigate('/statistics')} />
                <RetroNavButton label="History" onClick={() => navigate('/history')} />
              </div>
            </div>

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
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 border-4 border-[#3a3a3a] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-shadow">
            <span className="text-[#3a3a3a] font-bold text-5xl">R</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-widest uppercase">Reynholm Industries</h1>
          <p className="text-[#6a6a6a] tracking-widest">IT Department - Employee Assessment Portal</p>
        </div>

        <div className="crt-screen border-8 border-[#4a4a3a] rounded-lg p-8 max-w-2xl mb-8 retro-shadow">
          <div className="relative z-20">
            <p className="crt-text text-center text-lg leading-relaxed mb-4">
              &gt; WELCOME TO SPEECH PRACTICE SYSTEM v2.0
            </p>
            <div className="bg-[#002200] border border-[#00ff41]/30 p-4 mb-4">
              <p className="crt-text text-left text-sm leading-relaxed opacity-90 text-[#00ff41]">
                <span className="text-[#ffb700]">MISSION OBJECTIVE:</span> Break the "Bamboo Ceiling" in local AU workplaces.
                <br/><br/>
                Analyzing phoneme-level weaknesses. Generating dynamic AI tongue-twisters. Synthesizing voice clones.
              </p>
            </div>
            <p className="crt-text text-center text-sm leading-relaxed opacity-80">
              "Have you tried turning it off and on again?"
            </p>
            <p className="crt-text text-center text-sm leading-relaxed opacity-80 mt-2">
              - Maurice Moss, IT Department
            </p>
          </div>
        </div>

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
        {/* Footer */}
        {/* <div className="bg-gradient-to-b from-[#6a5a4f] to-[#5a4a3f] border-t-4 border-[#3a3a3a] py-3 px-8 text-center mt-6">
          <p className="text-[#d4cbb8] text-xs">
            Reynholm Industries • IT Department • Basement Level -1 • "We're not just here, we're also there!"
          </p>
        </div> */}

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