/**
 * Formatting Utilities
 * Safe formatting functions for display values
 */

import { escapeHtml } from './security';

/**
 * Format bytes to human readable size
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 B';
  if (!Number.isFinite(bytes) || bytes < 0) return 'N/A';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
};

/**
 * Format uptime seconds to human readable format
 */
export const formatUptime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return 'N/A';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.length > 0 ? parts.join(' ') : '0m';
};

/**
 * Format percentage with color indicator
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  if (!Number.isFinite(value)) return 'N/A';
  
  const clamped = Math.max(0, Math.min(100, value));
  return `${clamped.toFixed(decimals)}%`;
};

/**
 * Format temperature
 */
export const formatTemperature = (celsius: number): string => {
  if (!Number.isFinite(celsius)) return 'N/A';
  
  return `${Math.round(celsius)}°C`;
};

/**
 * Format power usage
 */
export const formatPowerUsage = (watts: number): string => {
  if (!Number.isFinite(watts)) return 'N/A';
  
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${Math.round(watts)} W`;
};

/**
 * Format network speed
 */
export const formatNetworkSpeed = (mbps: number): string => {
  if (!Number.isFinite(mbps)) return 'N/A';
  
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(2)} Gbps`;
  }
  return `${mbps.toFixed(2)} Mbps`;
};

/**
 * Format timestamp to readable date time
 */
export const formatDateTime = (timestamp: number): string => {
  if (!Number.isFinite(timestamp)) return 'N/A';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format duration in milliseconds
 */
export const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) return 'N/A';
  
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  
  return `${minutes}m ${seconds}s`;
};

/**
 * Format log message with HTML escaping for safe display
 */
export const formatLogMessage = (message: string): string => {
  return escapeHtml(message);
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength = 50): string => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get abbreviated name (e.g., "GPU 0" from long name)
 */
export const abbreviate = (name: string): string => {
  if (!name || typeof name !== 'string') return '?';
  
  const words = name.split(' ');
  if (words.length > 1) {
    return words.map(w => w[0]).join('').toUpperCase();
  }
  
  return name.substring(0, 3).toUpperCase();
};

/**
 * Get status badge text color based on status
 */
export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
  const statusStr = String(status).toLowerCase();
  
  if (statusStr.includes('success') || statusStr.includes('completed')) return 'success';
  if (statusStr.includes('error') || statusStr.includes('failed')) return 'error';
  if (statusStr.includes('warning')) return 'warning';
  
  return 'info';
};
