/**
 * Security Utilities
 * Functions to prevent XSS, injection attacks, and other security issues
 */

import { APP_CONFIG, LIMITS } from '@/config/constants';

/**
 * Escape HTML entities to prevent XSS attacks
 * Converts dangerous characters to their HTML entity equivalents
 */
export const escapeHtml = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  
  // Truncate to prevent excessively long strings
  const truncated = str.substring(0, LIMITS.MAX_LOG_LENGTH);
  
  return truncated.replace(/[&<>"'\/]/g, (char) => {
    const key = char as keyof typeof APP_CONFIG.HTML_ENTITIES;
    return APP_CONFIG.HTML_ENTITIES[key] || char;
  });
};

/**
 * Sanitize user input
 * Removes potentially dangerous content and limits length
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Limit length
  sanitized = sanitized.substring(0, LIMITS.MAX_MESSAGE_LENGTH);
  
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized;
};

/**
 * Validate safe string format
 * Checks against regex to ensure only allowed characters
 */
export const isValidSafeString = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false;
  if (str.length > LIMITS.MAX_MESSAGE_LENGTH) return false;
  
  return APP_CONFIG.REGEX.SAFE_STRING.test(str);
};

/**
 * Validate file path
 * Prevents directory traversal attacks
 */
export const isValidFilePath = (path: string): boolean => {
  if (!path || typeof path !== 'string') return false;
  if (path.length > LIMITS.MAX_FILENAME_LENGTH) return false;
  
  // Prevent directory traversal
  if (path.includes('..') || path.includes('~')) return false;
  
  return APP_CONFIG.REGEX.SAFE_PATH.test(path);
};

/**
 * Sanitize object for safe JSON serialization
 * Prevents circular references and removes sensitive data
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T, depth = 0): T => {
  if (depth > 10) return obj; // Prevent deep recursion
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized: Record<string, any> = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip sensitive keys
      if (['password', 'token', 'secret', 'apiKey'].some(s => key.toLowerCase().includes(s))) {
        continue;
      }
      
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value, depth + 1);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized as T;
};

/**
 * Safely parse JSON
 * Prevents parsing attacks and invalid JSON
 */
export const safeJsonParse = <T = unknown>(json: string, defaultValue: T | null = null): T | null => {
  try {
    if (!json || typeof json !== 'string') return defaultValue;
    
    const parsed = JSON.parse(json);
    return sanitizeObject(parsed) as T;
  } catch {
    console.error('[orion-security] Failed to parse JSON:', json.substring(0, 100));
    return defaultValue;
  }
};

/**
 * Generate secure random ID
 * Uses crypto API for cryptographic randomness
 */
export const generateSecureId = (): string => {
  if (typeof window !== 'undefined' && window.crypto) {
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for server-side
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Validate and sanitize URL
 * Prevents javascript: and data: URL schemes
 */
export const isValidHttpUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Rate limiting helper
 * Simple in-memory rate limiter for API calls
 */
const rateLimitMap = new Map<string, number[]>();

export const isRateLimited = (key: string, limit = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  
  // Remove old timestamps outside the window
  const recent = timestamps.filter(time => now - time < windowMs);
  
  if (recent.length >= limit) {
    return true;
  }
  
  recent.push(now);
  rateLimitMap.set(key, recent);
  
  return false;
};

/**
 * Clear rate limit for a key
 */
export const clearRateLimit = (key: string): void => {
  rateLimitMap.delete(key);
};
