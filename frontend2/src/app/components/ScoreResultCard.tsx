/**
 * ScoreResultCard Component
 * 
 * Displays pronunciation assessment scores in retro office style.
 * Shows overall score and detailed metrics.
 */

import React from 'react';

interface ScoreResultCardProps {
  overallScore: number;
  pronunciation?: number;
  accuracy?: number;
  fluency?: number;
  completeness?: number;
}

export function ScoreResultCard({
  overallScore,
  pronunciation,
  accuracy,
  fluency,
  completeness,
}: ScoreResultCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-[#7fdb9f] to-[#5fc77f]'; // Excellent - Green
    if (score >= 70) return 'from-[#f0e68c] to-[#dac86a]'; // Good - Yellow
    if (score >= 60) return 'from-[#f0bc8c] to-[#da9a6a]'; // Average - Orange
    return 'from-[#f08c8c] to-[#da6a6a]'; // Poor - Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 60) return 'AVERAGE';
    return 'NEEDS WORK';
  };

  return (
    <div className="retro-paper border-4 border-[#3a3a3a] rounded-lg p-6 retro-shadow">
      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`inline-block bg-gradient-to-b ${getScoreColor(overallScore)} border-3 border-[#3a3a3a] rounded-lg px-8 py-4 retro-key`}>
          <div className="text-5xl font-bold text-[#2a2a2a] mb-1">{overallScore}</div>
          <div className="text-xs font-bold text-[#4a4a4a] tracking-wider">
            {getScoreLabel(overallScore)}
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      {(pronunciation !== undefined || accuracy !== undefined || 
        fluency !== undefined || completeness !== undefined) && (
        <div className="grid grid-cols-2 gap-3">
          {pronunciation !== undefined && (
            <ScoreMetric label="PRONUNCIATION" score={pronunciation} />
          )}
          {accuracy !== undefined && (
            <ScoreMetric label="ACCURACY" score={accuracy} />
          )}
          {fluency !== undefined && (
            <ScoreMetric label="FLUENCY" score={fluency} />
          )}
          {completeness !== undefined && (
            <ScoreMetric label="COMPLETENESS" score={completeness} />
          )}
        </div>
      )}

      {/* Retro Office Decoration */}
      <div className="mt-6 pt-4 border-t-2 border-[#d4cbb8] text-center">
        <p className="text-xs text-[#6a6a6a] font-['Share_Tech_Mono',monospace]">
          ASSESSMENT COMPLETE • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

interface ScoreMetricProps {
  label: string;
  score: number;
}

function ScoreMetric({ label, score }: ScoreMetricProps) {
  return (
    <div className="bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-2 retro-key">
      <div className="text-[10px] font-bold text-[#5a5a5a] tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-[#2a2a2a]">{score}</div>
    </div>
  );
}
