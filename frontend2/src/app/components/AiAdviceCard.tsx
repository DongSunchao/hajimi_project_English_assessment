/**
 * AiAdviceCard Component
 * 
 * Displays AI-generated pronunciation advice in retro terminal style.
 * Inspired by 80s office computers and IT Crowd aesthetic.
 */

import React, { useState, useEffect } from 'react';

export interface AiAdvice {
  greeting: string;
  targetSound: string;
  tongueTwister: string;
  tip: string;
  practices: string[];
}

interface AiAdviceCardProps {
  advice: AiAdvice;
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}<span className="animate-pulse bg-[#00ff41] text-[#003300] ml-1">█</span></span>;
}

export function AiAdviceCard({ advice }: AiAdviceCardProps) {
  return (
    <div className="crt-screen border-8 border-[#4a4a3a] rounded-lg overflow-hidden retro-shadow">
      {/* CRT Header */}
      <div className="bg-gradient-to-b from-[#003300] to-[#002200] border-b-2 border-[#00ff41] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <div className="crt-text font-bold text-base">AI PRONUNCIATION TUTOR</div>
            <div className="crt-text text-xs opacity-70">Reynholm Industries Speech System</div>
          </div>
          <div className="ml-auto bg-[#00ff41]/10 rounded px-3 py-1 border border-[#00ff41]/30">
            <span className="crt-text text-xs">ANALYSIS COMPLETE</span>
          </div>
        </div>
      </div>

      {/* CRT Body */}
      <div className="p-6 space-y-4 relative z-20">
        {/* Greeting */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#ffd700] to-[#ffb700] flex items-center justify-center flex-shrink-0 retro-key">
            <span className="text-base">💡</span>
          </div>
          <div className="flex-1">
            <div className="bg-[#003300]/50 border-2 border-[#00ff41]/30 rounded-lg p-3 retro-key">
              <p className="crt-text text-sm leading-relaxed min-h-[60px]">
                <TypewriterText text={advice.greeting} />
              </p>
            </div>
          </div>
        </div>

        {/* Target Sound */}
        <div>
          <div className="inline-block bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-1 mb-2 retro-key">
            <span className="text-xs font-bold text-[#2a2a2a]">TARGET SOUND</span>
          </div>
          <div className="bg-gradient-to-b from-[#7fdb9f]/20 to-[#5fc77f]/20 border-2 border-[#00ff41]/50 rounded-lg p-4 retro-key">
            <p className="crt-text font-bold text-lg text-center italic">
              {advice.tongueTwister}
            </p>
          </div>
        </div>

        {/* Tip */}
        {advice.tip && (
          <div className="bg-[#003300]/30 border-2 border-[#00ff41]/40 rounded-lg p-4 retro-key">
            <div className="flex gap-2 items-start">
              <span className="crt-text text-base flex-shrink-0">💡</span>
              <div>
                <div className="crt-text text-xs font-bold mb-1">QUICK TIP</div>
                <p className="crt-text text-sm leading-relaxed opacity-90">
                  {advice.tip}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Practice List */}
        {advice.practices && advice.practices.length > 0 && (
          <div>
            <div className="inline-block bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-1 mb-3 retro-key">
              <span className="text-xs font-bold text-[#2a2a2a]">PRACTICE EXERCISES</span>
            </div>
            <div className="space-y-2">
              {advice.practices.map((practice, index) => (
                <div
                  key={index}
                  className="flex gap-3 bg-[#003300]/20 border-2 border-[#00ff41]/30 rounded-lg p-3 retro-key"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00ff41] text-[#001a00] flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {index + 1}
                  </div>
                  <p className="crt-text text-sm leading-relaxed flex-1">
                    {practice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t-2 border-[#00ff41]/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
          <span className="crt-text text-xs opacity-70">
            Powered by Reynholm Industries AI • Version 2.0
          </span>
        </div>
      </div>
    </div>
  );
}
