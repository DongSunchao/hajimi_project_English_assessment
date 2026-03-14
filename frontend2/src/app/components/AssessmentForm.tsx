/**
 * AssessmentForm Component
 * 
 * Form for configuring assessment parameters.
 * Includes text input and tongue twister selection.
 */

import React, { useState } from 'react';
import { getRandomTongueTwister } from '../utils/tongueTwisters';

interface AssessmentFormProps {
  referenceText: string;
  onReferenceTextChange: (text: string) => void;
  mode: 'custom' | 'tongue-twister';
  onModeChange: (mode: 'custom' | 'tongue-twister') => void;
}

export function AssessmentForm({
  referenceText,
  onReferenceTextChange,
  mode,
  onModeChange,
}: AssessmentFormProps) {
  const handleRandomTwister = () => {
    const newTwister = getRandomTongueTwister();
    onReferenceTextChange(newTwister);
    onModeChange('tongue-twister');
  };

  return (
    <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow space-y-4">
      {/* Mode Selector */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onModeChange('custom')}
          className={`retro-key px-4 py-2 rounded border-2 font-bold text-sm transition-all ${
            mode === 'custom'
              ? 'bg-gradient-to-b from-[#5a8a5a] to-[#4a7a4a] text-white border-[#2a4a2a]'
              : 'bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]'
          }`}
        >
          CUSTOM TEXT
        </button>
        <button
          onClick={() => onModeChange('tongue-twister')}
          className={`retro-key px-4 py-2 rounded border-2 font-bold text-sm transition-all ${
            mode === 'tongue-twister'
              ? 'bg-gradient-to-b from-[#5a8a5a] to-[#4a7a4a] text-white border-[#2a4a2a]'
              : 'bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]'
          }`}
        >
          TONGUE TWISTER
        </button>
      </div>

      {/* Custom Text Input */}
      {mode === 'custom' && (
        <div>
          <label className="block text-sm font-bold text-[#2a2a2a] mb-2 font-['Share_Tech_Mono',monospace]">
            ENTER TEXT TO PRACTICE:
          </label>
          <textarea
            value={referenceText}
            onChange={(e) => onReferenceTextChange(e.target.value)}
            className="w-full px-4 py-3 border-3 border-[#3a3a3a] rounded bg-white text-[#2a2a2a] font-['Share_Tech_Mono',monospace] text-sm resize-vertical min-h-[100px] focus:outline-none focus:border-[#5a8a5a]"
            placeholder="Type the text you want to practice..."
          />
          <p className="text-xs text-[#6a6a6a] mt-1">
            Tip: Use clear, complete sentences for best results.
          </p>
        </div>
      )}

      {/* Tongue Twister Display */}
      {mode === 'tongue-twister' && (
        <div>
          <div className="bg-gradient-to-b from-[#7fdb9f]/20 to-[#5fc77f]/20 border-3 border-[#3a6b4a] rounded-lg p-4 mb-3 retro-key">
            <p className="text-base text-[#2a2a2a] italic font-['Share_Tech_Mono',monospace] text-center leading-relaxed">
              {referenceText}
            </p>
          </div>
          <button
            onClick={handleRandomTwister}
            className="retro-key w-full bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-3 border-[#6b5f3a] text-[#2a2a2a] font-bold py-3 px-6 rounded text-sm hover:scale-105 transition-transform"
          >
            🎲 GET RANDOM TWISTER
          </button>
          <p className="text-xs text-[#6a6a6a] mt-2 text-center">
            Click to get a new random tongue twister
          </p>
        </div>
      )}
    </div>
  );
}
