/**
 * Terminal UI Status Badge Component
 * Displays status with color indicator and optional animation
 */

import React from 'react';
import { TERMINAL_THEME } from '@/config/theme';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending';
  label: string;
  animated?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  animated = false,
  className = '',
  ariaLabel,
}) => {
  const statusColors = {
    success: TERMINAL_THEME.colors.status.success,
    error: TERMINAL_THEME.colors.status.error,
    warning: TERMINAL_THEME.colors.status.warning,
    info: TERMINAL_THEME.colors.status.info,
    pending: TERMINAL_THEME.colors.accent.orange,
  };

  const color = statusColors[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-sm border border-solid font-mono text-xs font-semibold ${className}`}
      style={{
        borderColor: color,
        backgroundColor: `${color}15`,
        color: color,
      }}
      role="status"
      aria-label={ariaLabel || `Status: ${status}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${animated ? 'pulse' : ''}`}
        style={{
          backgroundColor: color,
          boxShadow: animated ? `0 0 6px ${color}` : 'none',
          animation: animated ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
        }}
      />
      <span>{label}</span>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
