/**
 * Terminal UI Theme Configuration
 * Centralized color and styling constants following security best practices
 */

export const TERMINAL_THEME = {
  colors: {
    background: '#080808',
    surface: '#101010',
    surfaceAlt: '#1a1a1a',

    textPrimary: '#e0e0e0',
    textSecondary: '#888888',
    textTertiary: '#444444',

    accent: {
      cyan: '#ffffff',
      lime: '#cccccc',
      magenta: '#aaaaaa',
      orange: '#bbbbbb',
      red: '#eeeeee',
      blue: '#999999',
      green: '#bbbbbb',
    },

    status: {
      success: '#aaaaaa',
      warning: '#777777',
      error: '#ffffff',
      info: '#bbbbbb',
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      mono: '"JetBrains Mono","Fira Code",monospace',
      sans: '"Inter",system-ui,-apple-system,sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4,0,0.2,1)',
    base: '250ms cubic-bezier(0.4,0,0.2,1)',
    slow: '350ms cubic-bezier(0.4,0,0.2,1)',
  },
};

