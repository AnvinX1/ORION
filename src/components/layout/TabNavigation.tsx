import React, { useCallback } from 'react';
import { TERMINAL_THEME } from '@/config/theme';
import { useTabNavigation } from '@/hooks/useKeyboardNavigation';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  className = '',
  ariaLabel,
}) => {
  const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);

  const handleTabChange = useCallback(
    (index: number) => {
      if (index >= 0 && index < tabs.length) {
        onTabChange(tabs[index].id);
      }
    },
    [tabs, onTabChange]
  );

  useTabNavigation(tabs, currentIndex, handleTabChange);

  return (
    <nav
      className={`flex items-center gap-0 px-2 py-0 font-mono text-xs select-none shrink-0 ${className}`}
      style={{
        backgroundColor: '#0d1117',
        borderBottom: `1px solid #4a5568`,
      }}
      role="tablist"
      aria-label={ariaLabel || 'Navigation tabs'}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-3 py-1 focus:outline-none transition-colors"
            style={{
              color: isActive ? '#0d1117' : TERMINAL_THEME.colors.textSecondary,
              backgroundColor: isActive ? TERMINAL_THEME.colors.accent.cyan : 'transparent',
              fontWeight: isActive ? 'bold' : 'normal',
              borderRight: `1px solid #4a5568`,
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (index - 1 + tabs.length) % tabs.length;
                onTabChange(tabs[prevIndex].id);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % tabs.length;
                onTabChange(tabs[nextIndex].id);
              }
            }}
          >
            <span style={{ color: isActive ? '#0d1117' : TERMINAL_THEME.colors.accent.cyan }}>
              {index + 1}
            </span>
            <span style={{ color: isActive ? '#0d1117' : TERMINAL_THEME.colors.textSecondary }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
