'use client';

import React, { useState } from 'react';
import { TuiBox } from '@/components/base/TuiBox';
import { TERMINAL_THEME as T } from '@/config/theme';

type Platform = 'linux-rocm' | 'windows-hip' | 'both';

interface PipelineConfig {
  targetPlatform: Platform;
  gpuTargets: string;
  hipifyFlags: string;
  warnThreshold: number;
  failThreshold: number;
  parallelWorkers: number;
  enableCorrectness: boolean;
  enablePerfRegression: boolean;
  rocmVersion: string;
  hipSdkVersion: string;
}

const DEFAULT_CONFIG: PipelineConfig = {
  targetPlatform: 'both',
  gpuTargets: 'gfx1100,gfx1030',
  hipifyFlags: '--cuda-kernel-execution-syntax',
  warnThreshold: 5,
  failThreshold: 15,
  parallelWorkers: 4,
  enableCorrectness: true,
  enablePerfRegression: true,
  rocmVersion: '5.7.1',
  hipSdkVersion: '5.7.0',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #333',
  color: '#cccccc',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  padding: '2px 6px',
  width: '100%',
  outline: 'none',
};

const labelStyle: React.CSSProperties = { color: '#555555', marginBottom: '2px', fontSize: '0.75rem' };
const valueStyle: React.CSSProperties = { color: '#aaaaaa' };

interface FieldProps { label: string; children: React.ReactNode; }
const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div>
    <div style={labelStyle}>{label}</div>
    {children}
  </div>
);

export const SettingsTab: React.FC = () => {
  const [cfg, setCfg] = useState<PipelineConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof PipelineConfig>(key: K, value: PipelineConfig[K]) {
    setCfg(c => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function handleSave() { setSaved(true); }

  return (
    <div
      className="flex h-full overflow-auto p-1 gap-2 flex-col"
      role="tabpanel"
      id="panel-settings"
      style={{ backgroundColor: '#080808' }}
    >
      <div className="flex gap-2">
        {/* Platform & GPU */}
        <TuiBox title="Target Platform" padding="sm" style={{ flex: 1 }}>
          <div className="space-y-2 text-xs font-mono">
            <Field label="platform">
              <select value={cfg.targetPlatform} onChange={e => update('targetPlatform', e.target.value as Platform)} style={inputStyle}>
                <option value="linux-rocm">linux  — ROCm</option>
                <option value="windows-hip">windows — HIP SDK</option>
                <option value="both">both</option>
              </select>
            </Field>
            <Field label="gpu targets (comma-sep)">
              <input type="text" value={cfg.gpuTargets} onChange={e => update('gpuTargets', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="rocm version">
              <input type="text" value={cfg.rocmVersion} onChange={e => update('rocmVersion', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="hip sdk version">
              <input type="text" value={cfg.hipSdkVersion} onChange={e => update('hipSdkVersion', e.target.value)} style={inputStyle} />
            </Field>
          </div>
        </TuiBox>

        {/* hipify */}
        <TuiBox title="hipify-clang" padding="sm" style={{ flex: 1 }}>
          <div className="space-y-2 text-xs font-mono">
            <Field label="extra flags">
              <input type="text" value={cfg.hipifyFlags} onChange={e => update('hipifyFlags', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="parallel workers">
              <input type="number" min={1} max={32} value={cfg.parallelWorkers} onChange={e => update('parallelWorkers', parseInt(e.target.value) || 1)} style={inputStyle} />
            </Field>
          </div>
        </TuiBox>
      </div>

      <div className="flex gap-2">
        {/* Thresholds */}
        <TuiBox title="Regression Thresholds" padding="sm" style={{ flex: 1 }}>
          <div className="space-y-2 text-xs font-mono">
            <Field label="warn threshold (%)">
              <input type="number" min={0} max={100} value={cfg.warnThreshold} onChange={e => update('warnThreshold', parseInt(e.target.value) || 0)} style={inputStyle} />
            </Field>
            <Field label="fail threshold (%)">
              <input type="number" min={0} max={100} value={cfg.failThreshold} onChange={e => update('failThreshold', parseInt(e.target.value) || 0)} style={inputStyle} />
            </Field>
          </div>
        </TuiBox>

        {/* Pipeline stages */}
        <TuiBox title="Pipeline Stages" padding="sm" style={{ flex: 1 }}>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="correctness" checked={cfg.enableCorrectness} onChange={e => update('enableCorrectness', e.target.checked)} />
              <label htmlFor="correctness" style={valueStyle}>correctness tests</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="perf" checked={cfg.enablePerfRegression} onChange={e => update('enablePerfRegression', e.target.checked)} />
              <label htmlFor="perf" style={valueStyle}>performance regression</label>
            </div>
          </div>
        </TuiBox>
      </div>

      {/* Current config dump */}
      <TuiBox title="Active Configuration" subtitle="read-only" padding="sm" style={{ flex: 1 }}>
        <pre className="text-xs font-mono" style={{ color: '#555555', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
{`platform         = ${cfg.targetPlatform}
gpu_targets      = ${cfg.gpuTargets}
rocm_version     = ${cfg.rocmVersion}
hip_sdk_version  = ${cfg.hipSdkVersion}
hipify_flags     = ${cfg.hipifyFlags}
parallel_workers = ${cfg.parallelWorkers}
warn_threshold   = ${cfg.warnThreshold}%
fail_threshold   = ${cfg.failThreshold}%
correctness      = ${cfg.enableCorrectness}
perf_regression  = ${cfg.enablePerfRegression}`}
        </pre>
      </TuiBox>

      {/* Save button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleSave}
          className="px-4 py-1 border font-mono text-xs"
          style={{ borderColor: '#444', color: saved ? '#888888' : '#eeeeee', backgroundColor: '#111' }}
        >
          {saved ? '✓ saved' : 'apply config'}
        </button>
        {saved && <span style={{ color: '#555', fontSize: '0.7rem' }}>configuration applied (in-memory)</span>}
      </div>
    </div>
  );
};
