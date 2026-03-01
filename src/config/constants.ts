/**
 * Application Constants
 * Secure configuration values and defaults
 */

export const APP_CONFIG = {
  // Tab configuration
  tabs: [
    { id: 'overview', label: 'Pipeline', icon: '' },
    { id: 'build', label: 'Conversion', icon: '' },
    { id: 'logs', label: 'Diagnostics', icon: '' },
    { id: 'metrics', label: 'Regression', icon: '' },
    { id: 'gpu', label: 'API Compat', icon: '' },
    { id: 'settings', label: 'Config', icon: '' },
  ],

  // Keyboard shortcuts
  shortcuts: {
    PREV_TAB: 'ArrowLeft',
    NEXT_TAB: 'ArrowRight',
    EXPAND: 'ArrowUp',
    COLLAPSE: 'ArrowDown',
    QUIT: 'Escape',
  } as const,

  // Log buffer size for memory optimization
  MAX_LOGS: 1000,
  LOG_BUFFER_SIZE: 100,

  // API polling intervals (in ms)
  UPDATE_INTERVALS: {
    GPU_STATS: 1000,
    BUILD_STATUS: 2000,
    SYSTEM_METRICS: 3000,
  },

  // Validation
  REGEX: {
    // Safe string validation - alphanumeric, spaces, hyphens only
    SAFE_STRING: /^[a-zA-Z0-9\s\-_]{0,255}$/,
    // Path validation
    SAFE_PATH: /^[a-zA-Z0-9\/\.\-_]{0,500}$/,
    // Numeric values
    POSITIVE_NUMBER: /^\d+\.?\d*$/,
  },

  // Security - CSP and HTML entity encoding
  HTML_ENTITIES: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  } as const,
} as const;

// Maximum values for validation
export const LIMITS = {
  MAX_LOG_LENGTH: 5000,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_FILENAME_LENGTH: 255,
  MAX_GPU_COUNT: 16,
} as const;

export type AppConfig = typeof APP_CONFIG;
