import React from 'react';
import { TERMINAL_THEME } from '@/config/theme';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'success' | 'warning' | 'error' | 'info';
  animated?: boolean;
  className?: string;
  ariaLabel?: string;
  width?: number; // number of block chars (default 20)
}

const getColorValue = (color: string): string => {
  const colorMap = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#00d4ff',
  };
  return colorMap[color as keyof typeof colorMap] || '#00d4ff';
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'info',
  className = '',
  ariaLabel,
  width = 20,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colorValue = getColorValue(color);
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  return (
    <div
      className={`flex items-center gap-1 font-mono text-xs ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || label}
    >
      {label && (
        <span
          className="shrink-0"
          style={{
            color: TERMINAL_THEME.colors.textSecondary,
            minWidth: '4.5rem',
            display: 'inline-block',
          }}
        >
          {label}
        </span>
      )}
      <span style={{ color: TERMINAL_THEME.colors.textTertiary }}>[</span>
      <span style={{ color: colorValue }}>{'█'.repeat(Math.max(0, filled))}</span>
      <span style={{ color: '#2d3748' }}>{'░'.repeat(Math.max(0, empty))}</span>
      <span style={{ color: TERMINAL_THEME.colors.textTertiary }}>]</span>
      {showPercentage && (
        <span className="ml-1" style={{ color: colorValue }}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
