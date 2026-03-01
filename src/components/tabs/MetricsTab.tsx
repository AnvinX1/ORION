'use client';

import React, { useMemo } from 'react';
import { RegressionMetric } from '@/hooks/useMockData';
import { TuiBox } from '@/components/base/TuiBox';
import { TERMINAL_THEME as T } from '@/config/theme';

interface MetricsTabProps {
  regressionData: RegressionMetric[];
}

function deltaColor(status: RegressionMetric['status']): string {
  if (status === 'ok')   return '#666666';
  if (status === 'warn') return '#888888';
  if (status === 'fail') return '#ffffff';
  return '#444444';
}

function deltaPrefix(d: number): string {
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
}

export const MetricsTab: React.FC<MetricsTabProps> = ({ regressionData }) => {
  const summary = useMemo(() => {
    const ok   = regressionData.filter(r => r.status === 'ok').length;
    const warn = regressionData.filter(r => r.status === 'warn').length;
    const fail = regressionData.filter(r => r.status === 'fail').length;
    const avgDelta = regressionData.length
      ? regressionData.reduce((s, r) => s + r.delta, 0) / regressionData.length
      : 0;
    return { ok, warn, fail, avgDelta };
  }, [regressionData]);

  return (
    <div
      className="flex h-full overflow-hidden p-1 gap-1 flex-col"
      role="tabpanel"
      id="panel-metrics"
      style={{ backgroundColor: '#080808' }}
    >
      <div className="flex gap-2 shrink-0">
        <TuiBox title="Pass" padding="sm" style={{ minWidth: 70 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#666666' }}>{summary.ok}</div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>benchmarks</div>
        </TuiBox>
        <TuiBox title="Warn" padding="sm" style={{ minWidth: 70 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#888888' }}>{summary.warn}</div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>&gt;5% slower</div>
        </TuiBox>
        <TuiBox title="Fail" padding="sm" style={{ minWidth: 70 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#ffffff' }}>{summary.fail}</div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>&gt;15% slower</div>
        </TuiBox>
        <TuiBox title="Avg Delta" padding="sm" style={{ minWidth: 90 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: summary.avgDelta > 10 ? '#ffffff' : '#888888' }}>
            {deltaPrefix(summary.avgDelta)}%
          </div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>CUDA vs HIP</div>
        </TuiBox>
        <TuiBox title="Coverage" padding="sm" style={{ flex: 1 }}>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>
            <span style={{ color: '#aaaaaa' }}>{regressionData.length}</span> benchmarks
            &nbsp;·&nbsp;score:&nbsp;
            <span style={{ color: summary.fail > 0 ? '#ffffff' : '#888888' }}>
              {Math.round(100 - (summary.fail / Math.max(regressionData.length, 1)) * 100)}
            </span>/100
          </div>
        </TuiBox>
      </div>

      <div className="flex-1 overflow-hidden">
        <TuiBox title="Performance Regression" subtitle="CUDA baseline vs HIP" padding="sm" className="h-full overflow-y-auto">
          <div className="font-mono text-xs">
            <div className="flex gap-2 pb-1 mb-1 border-b font-bold" style={{ borderColor: '#2a2a2a', color: T.colors.textTertiary }}>
              <span style={{ width: '200px', minWidth: '200px' }}>Benchmark</span>
              <span style={{ width: '90px', minWidth: '90px', textAlign: 'right' }}>CUDA</span>
              <span style={{ width: '90px', minWidth: '90px', textAlign: 'right' }}>HIP</span>
              <span style={{ width: '50px', minWidth: '50px', textAlign: 'right' }}>Unit</span>
              <span style={{ width: '70px', minWidth: '70px', textAlign: 'right' }}>Δ%</span>
              <span style={{ flex: 1 }}>Status</span>
            </div>
            {regressionData.map(row => (
              <div key={row.name} className="flex gap-2 py-0.5 border-b" style={{ borderColor: '#121212' }}>
                <span style={{ width: '200px', minWidth: '200px', color: T.colors.textSecondary }}>{row.name}</span>
                <span style={{ width: '90px', minWidth: '90px', textAlign: 'right', color: '#555' }}>{row.cudaValue.toFixed(2)}</span>
                <span style={{ width: '90px', minWidth: '90px', textAlign: 'right', color: '#555' }}>{row.hipValue.toFixed(2)}</span>
                <span style={{ width: '50px', minWidth: '50px', textAlign: 'right', color: '#444' }}>{row.unit}</span>
                <span style={{ width: '70px', minWidth: '70px', textAlign: 'right', fontWeight: row.status !== 'ok' ? 'bold' : 'normal', color: deltaColor(row.status) }}>
                  {deltaPrefix(row.delta)}%
                </span>
                <span style={{ flex: 1, color: deltaColor(row.status) }}>
                  {row.status === 'ok' ? '✓ ok' : row.status === 'warn' ? '⚠ warn' : '✗ fail'}
                </span>
              </div>
            ))}
            {regressionData.length === 0 && (
              <div style={{ color: T.colors.textTertiary, padding: '4px 0' }}>— no regression data —</div>
            )}
          </div>
        </TuiBox>
      </div>
    </div>
  );
};
