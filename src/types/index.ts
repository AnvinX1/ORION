/**
 * Type Definitions for Terminal UI
 * Strict TypeScript types for safety and maintainability
 */

// Tab types
export type TabId = 'overview' | 'build' | 'logs' | 'metrics' | 'gpu' | 'settings';

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

// GPU/System monitoring types
export interface GpuStats {
  id: number;
  name: string;
  utilization: number; // 0-100
  memory: {
    used: number; // MB
    total: number; // MB
    utilization: number; // 0-100
  };
  temperature: number; // Celsius
  powerUsage: number; // Watts
  timestamp: number;
}

export interface SystemMetrics {
  cpu: number; // 0-100
  memory: number; // 0-100
  disk: number; // 0-100
  network: {
    upload: number; // Mbps
    download: number; // Mbps
  };
  uptime: number; // seconds
  timestamp: number;
}

// Build & Process types
export interface BuildStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  progress: number; // 0-100
  duration: number; // ms
  error?: string;
  startTime: number;
  endTime?: number;
}

export interface BuildStatus {
  id: string;
  name: string;
  status: 'idle' | 'building' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep?: BuildStep;
  steps: BuildStep[];
  startTime: number;
  endTime?: number;
  error?: string;
}

// Log types
export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  category: string;
  message: string;
  source: string;
  data?: Record<string, unknown>;
}

// UI State types
export interface TerminalState {
  activeTab: TabId;
  isExpanded: boolean;
  selectedLog?: string;
  filters: {
    logLevel?: LogEntry['level'];
    category?: string;
    searchTerm?: string;
  };
}

export interface PanelState {
  isOpen: boolean;
  title: string;
  content: string;
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  role?: string;
}

export interface ProgressBarProps extends BaseComponentProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'success' | 'warning' | 'error' | 'info';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  variant?: 'default' | 'compact' | 'elevated';
  onClick?: () => void;
}

// Settings types
export interface AppSettings {
  theme: 'dark' | 'light';
  autoRefresh: boolean;
  refreshInterval: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  notifications: boolean;
  soundEnabled: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Error handling
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
  stack?: string;
}
