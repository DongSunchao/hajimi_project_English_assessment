/**
 * DevModeIndicator Component
 * 
 * Shows a subtle indicator when running in development mode with mock data.
 * Helps developers understand when real API calls are being made vs mock data.
 */

import React from 'react';
import { config } from '../config';

export function DevModeIndicator() {
  const isDevelopmentMode = !config.api.baseUrl || config.api.baseUrl.includes('localhost');

  if (!isDevelopmentMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-2 border-[#6b5f3a] rounded-lg px-3 py-2 retro-key shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6b5f3a] animate-pulse" />
          <span className="text-xs font-bold text-[#2a2a2a] font-['Share_Tech_Mono',monospace]">
            DEV MODE • USING MOCK DATA
          </span>
        </div>
      </div>
    </div>
  );
}
