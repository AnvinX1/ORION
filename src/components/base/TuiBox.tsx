import React, { ReactNode } from 'react';
import { TERMINAL_THEME } from '@/config/theme';

interface TuiBoxProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  role?: string;
  style?: React.CSSProperties;
}

export const TuiBox: React.FC<TuiBoxProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  style,
  padding = 'md',
  className = '',
  onClick,
  ariaLabel,
  role,
}) => {
  const paddingMap = { sm: 'p-1', md: 'p-2', lg: 'p-3' };
  const borderColor =
    variant === 'elevated'
      ? TERMINAL_THEME.colors.accent.cyan
      : '#4a5568';

  return (
    <div
      className={`relative ${paddingMap[padding]} ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: TERMINAL_THEME.colors.surface,
        marginTop: title ? '10px' : '0',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel || title}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {title && (
        <span
          className="absolute font-mono text-xs font-bold px-1 select-none"
          style={{
            top: '-9px',
            left: '8px',
            backgroundColor: TERMINAL_THEME.colors.surface,
            color: TERMINAL_THEME.colors.accent.cyan,
            lineHeight: '1',
          }}
        >
          ─[ {title} ]
        </span>
      )}
      {subtitle && (
        <span
          className="absolute font-mono text-xs px-1 select-none"
          style={{
            top: '-9px',
            right: '8px',
            backgroundColor: TERMINAL_THEME.colors.surface,
            color: TERMINAL_THEME.colors.textSecondary,
            lineHeight: '1',
          }}
        >
          {subtitle} ─
        </span>
      )}
      <div className="font-mono text-xs" style={{ color: TERMINAL_THEME.colors.textPrimary }}>
        {children}
      </div>
    </div>
  );
};
