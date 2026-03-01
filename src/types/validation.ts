/**
 * Validation Schemas with Zod
 * Security-focused input validation to prevent injection attacks
 */

import { z } from 'zod';

// Safe string validation - prevent XSS
const SafeString = z
  .string()
  .max(255, 'String too long')
  .regex(/^[a-zA-Z0-9\s\-_.,:'"%()]*$/, 'Contains invalid characters')
  .or(z.string().length(0));

// Safe path validation
const SafePath = z
  .string()
  .max(500, 'Path too long')
  .regex(/^[a-zA-Z0-9/\.\-_]*$/, 'Invalid path characters');

// Log entry schema
export const LogEntrySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().positive(),
  level: z.enum(['info', 'warn', 'error', 'debug', 'success']),
  category: SafeString,
  message: z.string().max(5000),
  source: SafeString,
  data: z.record(z.unknown()).optional(),
});

// GPU stats schema
export const GpuStatsSchema = z.object({
  id: z.number().int().min(0).max(15),
  name: SafeString,
  utilization: z.number().min(0).max(100),
  memory: z.object({
    used: z.number().min(0),
    total: z.number().min(0),
    utilization: z.number().min(0).max(100),
  }),
  temperature: z.number().min(0).max(150),
  powerUsage: z.number().min(0),
  timestamp: z.number().positive(),
});

// Build step schema
export const BuildStepSchema = z.object({
  id: z.string().uuid(),
  name: SafeString,
  status: z.enum(['pending', 'running', 'success', 'error', 'skipped']),
  progress: z.number().min(0).max(100),
  duration: z.number().min(0),
  error: SafeString.optional(),
  startTime: z.number().positive(),
  endTime: z.number().positive().optional(),
});

// Build status schema
export const BuildStatusSchema = z.object({
  id: z.string().uuid(),
  name: SafeString,
  status: z.enum(['idle', 'building', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  currentStep: BuildStepSchema.optional(),
  steps: z.array(BuildStepSchema),
  startTime: z.number().positive(),
  endTime: z.number().positive().optional(),
  error: SafeString.optional(),
});

// System metrics schema
export const SystemMetricsSchema = z.object({
  cpu: z.number().min(0).max(100),
  memory: z.number().min(0).max(100),
  disk: z.number().min(0).max(100),
  network: z.object({
    upload: z.number().min(0),
    download: z.number().min(0),
  }),
  uptime: z.number().min(0),
  timestamp: z.number().positive(),
});

// Settings schema
export const SettingsSchema = z.object({
  theme: z.enum(['dark', 'light']),
  autoRefresh: z.boolean(),
  refreshInterval: z.number().int().min(100).max(60000),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']),
  notifications: z.boolean(),
  soundEnabled: z.boolean(),
});

// Type exports from schemas
export type LogEntry = z.infer<typeof LogEntrySchema>;
export type GpuStats = z.infer<typeof GpuStatsSchema>;
export type BuildStep = z.infer<typeof BuildStepSchema>;
export type BuildStatus = z.infer<typeof BuildStatusSchema>;
export type SystemMetrics = z.infer<typeof SystemMetricsSchema>;
export type AppSettings = z.infer<typeof SettingsSchema>;
