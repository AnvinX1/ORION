/**
 * Keyboard Navigation Hook
 * Handles keyboard shortcuts for tab navigation and actions
 */

import { useEffect, useCallback } from 'react';
import { APP_CONFIG } from '@/config/constants';

export interface KeyboardHandler {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
}

export const useKeyboardNavigation = (handlers: KeyboardHandler[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const handler of handlers) {
        const keyMatches = event.key === handler.key;
        const ctrlMatches = handler.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const shiftMatches = handler.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatches = handler.altKey ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          handler.handler();
          break;
        }
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Tab Navigation Hook
 * Simplified hook for tab arrow key navigation
 */
export const useTabNavigation = (
  tabs: any[],
  currentIndex: number,
  onTabChange: (index: number) => void
) => {
  useKeyboardNavigation([
    {
      key: APP_CONFIG.shortcuts.PREV_TAB,
      handler: () => {
        const newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        onTabChange(newIndex);
      },
    },
    {
      key: APP_CONFIG.shortcuts.NEXT_TAB,
      handler: () => {
        const newIndex = (currentIndex + 1) % tabs.length;
        onTabChange(newIndex);
      },
    },
    {
      key: APP_CONFIG.shortcuts.QUIT,
      handler: () => {
        console.log('[orion] Quit command received');
        // Handle quit - close panel or exit
      },
    },
  ]);
};
