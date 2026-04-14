import React from 'react';

export default function ProgressBar({ current, total, showLabel = true, colorClass = 'bg-primary' }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm font-bold text-muted mb-1.5">
          <span>{current} / {total}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="w-full h-4 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
