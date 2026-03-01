/**
 * Terminal UI Gauge Chart Component
 * Circular progress indicator for utilization metrics
 */

import React from 'react';
import { TERMINAL_THEME } from '@/config/theme';
import { formatPercentage } from '@/utils/format';

interface GaugeChartProps {
  value: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'info' | 'warning' | 'success' | 'error';
  className?: string;
  ariaLabel?: string;
}

const getColorForValue = (value: number, explicitColor?: string): string => {
  if (explicitColor) {
    const colorMap = {
      success: TERMINAL_THEME.colors.status.success,
      warning: TERMINAL_THEME.colors.status.warning,
      error: TERMINAL_THEME.colors.status.error,
      info: TERMINAL_THEME.colors.accent.cyan,
    };
    return colorMap[explicitColor as keyof typeof colorMap];
  }

  if (value >= 80) return TERMINAL_THEME.colors.status.error;
  if (value >= 60) return TERMINAL_THEME.colors.status.warning;
  if (value >= 40) return TERMINAL_THEME.colors.accent.cyan;
  return TERMINAL_THEME.colors.status.success;
};

const sizeMap = {
  sm: { size: 60, strokeWidth: 4, textSize: 14 },
  md: { size: 100, strokeWidth: 6, textSize: 20 },
  lg: { size: 140, strokeWidth: 8, textSize: 28 },
};

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label,
  size = 'md',
  color,
  className = '',
  ariaLabel,
}) => {
  const dims = sizeMap[size];
  const radius = (dims.size - dims.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, value));
  const strokeDash = (percentage / 100) * circumference;
  const fillColor = getColorForValue(percentage, color);

  const cx = dims.size / 2;
  const cy = dims.size / 2;

  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="img"
      aria-label={ariaLabel || `${label || 'Gauge'}: ${formatPercentage(percentage)}`}
    >
      <svg width={dims.size} height={dims.size} className="relative">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={TERMINAL_THEME.colors.surfaceAlt}
          strokeWidth={dims.strokeWidth}
          style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={dims.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDash}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 4px ${fillColor}80)`,
          }}
        />

        {size !== 'sm' && (
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fontSize={dims.textSize}
            fontWeight="bold"
            fill={fillColor}
            fontFamily="monospace"
            style={{ textShadow: `0 0 8px ${fillColor}` }}
          >
            {Math.round(percentage)}%
          </text>
        )}
      </svg>

      {label && (
        <p
          className="mt-2 text-xs font-mono font-semibold text-center truncate max-w-[120px]"
          style={{ color: TERMINAL_THEME.colors.textSecondary }}
        >
          {label}
        </p>
      )}
    </div>
  );
};
