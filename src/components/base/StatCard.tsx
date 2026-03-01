/**
 * Terminal UI Stat Card Component
 * Displays a single metric with icon and label
 */

import React from 'react';
import { TERMINAL_THEME } from '@/config/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'accent';
  className?: string;
  ariaLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className = '',
  ariaLabel,
}) => {
  const accentColor = variant === 'accent' ? TERMINAL_THEME.colors.accent.cyan : TERMINAL_THEME.colors.accent.lime;

  return (
    <div
      className={`p-3 rounded-sm border border-solid ${className}`}
      style={{
        borderColor: TERMINAL_THEME.colors.textTertiary,
        backgroundColor: TERMINAL_THEME.colors.surfaceAlt,
      }}
      role="region"
      aria-label={ariaLabel || label}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-mono font-semibold uppercase tracking-widest"
          style={{ color: TERMINAL_THEME.colors.textSecondary }}
        >
          {icon} {label}
        </span>
        {trend && (
          <span
            className="text-xs font-bold"
            style={{
              color:
                trend === 'up'
                  ? TERMINAL_THEME.colors.status.success
                  : trend === 'down'
                    ? TERMINAL_THEME.colors.status.error
                    : TERMINAL_THEME.colors.textSecondary,
            }}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className="text-lg font-mono font-bold"
          style={{ color: accentColor }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-xs font-mono"
            style={{ color: TERMINAL_THEME.colors.textSecondary }}
          >
            {unit}
          </span>
        )}
      </div>

      {trendValue && (
        <p
          className="text-xs font-mono mt-1 truncate"
          style={{ color: TERMINAL_THEME.colors.textTertiary }}
        >
          {trendValue}
        </p>
      )}
    </div>
  );
};
