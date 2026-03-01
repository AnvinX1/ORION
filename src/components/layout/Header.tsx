'use client';

import React, { useState, useEffect } from 'react';
import { TERMINAL_THEME } from '@/config/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  statusIndicator?: {
    status: 'online' | 'offline' | 'busy' | 'idle';
    label: string;
  };
  showTimestamp?: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  online: TERMINAL_THEME.colors.status.success,
  offline: TERMINAL_THEME.colors.status.error,
  busy: TERMINAL_THEME.colors.status.warning,
  idle: TERMINAL_THEME.colors.status.info,
};

export const Header: React.FC<HeaderProps> = ({
  title,
  statusIndicator,
  showTimestamp = true,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const statusColor = STATUS_COLOR[statusIndicator?.status ?? 'idle'];

  return (
    <header
      className="font-mono text-xs px-2 py-1 flex items-center justify-between select-none shrink-0"
      style={{
        backgroundColor: '#0d1117',
        borderBottom: `1px solid #4a5568`,
        color: TERMINAL_THEME.colors.textSecondary,
      }}
      role="banner"
    >
      <span
        className="font-bold"
        style={{ color: TERMINAL_THEME.colors.accent.cyan, fontSize: '0.8rem' }}
      >
        ◆ {title}
      </span>
      <span className="flex items-center gap-4">
        {statusIndicator && (
          <span style={{ color: statusColor }}>
            ● {statusIndicator.label}
          </span>
        )}
        {showTimestamp && time && (
          <span style={{ color: TERMINAL_THEME.colors.accent.lime }}>
            {time}
          </span>
        )}
        <span style={{ color: TERMINAL_THEME.colors.textTertiary }}>
          [1-6] switch · [←→] nav
        </span>
      </span>
    </header>
  );
};
