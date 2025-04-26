import React, { useState } from 'react';

interface ProgressBarProps {
  progress: number;
  showTooltip?: boolean;
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  showTooltip = true,
  className = ''
}: ProgressBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div 
      className={`relative w-full max-w-[700px] mx-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full flex gap-1">
        <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              clampedProgress >= 50 ? "bg-green-500" : "bg-gray-300"
            }`}
            style={{
              width: `${clampedProgress >= 50 ? 100 : 0}%`,
              transform: 'translateX(0)',
            }}
          />
        </div>
        <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              clampedProgress === 100 ? "bg-green-500" : "bg-gray-300"
            }`}
            style={{
              width: `${clampedProgress === 100 ? 100 : 0}%`,
              transform: 'translateX(0)',
            }}
          />
        </div>
      </div>

      {showTooltip && isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-all duration-200 opacity-100"
          style={{
            transform: 'translate(-50%, 0)',
          }}
        >
          {clampedProgress}%
        </div>
      )}
    </div>
  );
}