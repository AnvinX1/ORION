/**
 * Terminal UI Code Block Component
 * Displays syntax-highlighted code with copy functionality
 */

import React, { useState } from 'react';
import { TERMINAL_THEME } from '@/config/theme';
import { escapeHtml } from '@/utils/security';

interface CodeBlockProps {
  code: string;
  language?: string;
  lineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
  ariaLabel?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  lineNumbers = true,
  maxHeight = '300px',
  className = '',
  ariaLabel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = code.split('\n');
  const escapeCode = escapeHtml(code);

  return (
    <div
      className={`rounded-sm border border-solid ${className}`}
      style={{
        borderColor: TERMINAL_THEME.colors.textTertiary,
        backgroundColor: TERMINAL_THEME.colors.background,
      }}
      role="region"
      aria-label={ariaLabel || `Code block in ${language}`}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-solid"
        style={{ borderColor: TERMINAL_THEME.colors.textTertiary }}
      >
        <span
          className="text-xs font-mono font-semibold uppercase"
          style={{ color: TERMINAL_THEME.colors.accent.cyan }}
        >
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="px-2 py-1 rounded text-xs font-mono font-semibold transition-colors"
          style={{
            backgroundColor: copied ? TERMINAL_THEME.colors.status.success : TERMINAL_THEME.colors.surfaceAlt,
            color: copied ? TERMINAL_THEME.colors.background : TERMINAL_THEME.colors.accent.lime,
            border: `1px solid ${copied ? TERMINAL_THEME.colors.status.success : TERMINAL_THEME.colors.textTertiary}`,
          }}
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div
        className="overflow-auto font-mono text-sm p-3"
        style={{
          maxHeight,
          backgroundColor: TERMINAL_THEME.colors.background,
          color: TERMINAL_THEME.colors.textPrimary,
        }}
      >
        <div className="flex">
          {lineNumbers && (
            <div
              className="pr-4 text-right select-none"
              style={{ color: TERMINAL_THEME.colors.textTertiary }}
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <div className="flex-1 whitespace-pre-wrap break-words">
            {/* Safe HTML escaping done above */}
            {lines.map((line, i) => (
              <div key={i}>{line || '\n'}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
