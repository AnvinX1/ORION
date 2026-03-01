'use client';

import React, { useMemo } from 'react';
import { ApiEntry } from '@/hooks/useMockData';
import { TuiBox } from '@/components/base/TuiBox';
import { TERMINAL_THEME as T } from '@/config/theme';

interface GpuMonitorTabProps {
  apiTable: ApiEntry[];
}

const STATUS_ICON: Record<ApiEntry['status'], string> = {
  mapped:      '✓',
  partial:     '⚠',
  unsupported: '✗',
  unknown:     '?',
};

const STATUS_COLOR: Record<ApiEntry['status'], string> = {
  mapped:      '#666666',
  partial:     '#888888',
  unsupported: '#ffffff',
  unknown:     '#444444',
};

const PLATFORM_LABEL: Record<ApiEntry['platform'], string> = {
  both:    'lin+win',
  linux:   'linux  ',
  windows: 'windows',
  none:    '  none ',
};

export const GpuMonitorTab: React.FC<GpuMonitorTabProps> = ({ apiTable }) => {
  const counts = useMemo(() => ({
    mapped:      apiTable.filter(a => a.status === 'mapped').length,
    partial:     apiTable.filter(a => a.status === 'partial').length,
    unsupported: apiTable.filter(a => a.status === 'unsupported').length,
    unknown:     apiTable.filter(a => a.status === 'unknown').length,
  }), [apiTable]);

  const pct = useMemo(() => {
    const n = apiTable.length || 1;
    return Math.round((counts.mapped / n) * 100);
  }, [counts, apiTable.length]);

  return (
    <div
      className="flex h-full overflow-hidden p-1 gap-1 flex-col"
      role="tabpanel"
      id="panel-gpu"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Summary row */}
      <div className="flex gap-2 shrink-0">
        <TuiBox title="Mapped" padding="sm" style={{ minWidth: 80 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#666666' }}>{counts.mapped}</div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>✓ full support</div>
        </TuiBox>
        <TuiBox title="Partial" padding="sm" style={{ minWidth: 80 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#888888' }}>{counts.partial}</div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>⚠ workaround</div>
        </TuiBox>
        <TuiBox title="Unsupported" padding="sm" style={{ minWidth: 90 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#ffffff' }}>{counts.unsupported}</div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>✗ no equiv.</div>
        </TuiBox>
        <TuiBox title="Coverage" padding="sm" style={{ flex: 1 }}>
          <div className="text-2xl font-bold font-mono" style={{ color: pct >= 80 ? '#888888' : '#ffffff' }}>
            {pct}%
          </div>
          <div className="text-xs" style={{ color: T.colors.textTertiary }}>{apiTable.length} APIs audited</div>
        </TuiBox>
      </div>

      {/* API Table */}
      <div className="flex-1 overflow-hidden">
        <TuiBox title="API Compatibility Matrix" subtitle="CUDA → ROCm/HIP" padding="sm" className="h-full overflow-y-auto">
          <div className="font-mono text-xs">
            <div className="flex gap-2 pb-1 mb-1 border-b font-bold" style={{ borderColor: '#2a2a2a', color: T.colors.textTertiary }}>
              <span style={{ width: '220px', minWidth: '220px' }}>CUDA API</span>
              <span style={{ width: '220px', minWidth: '220px' }}>HIP Equivalent</span>
              <span style={{ width: '28px', minWidth: '28px', textAlign: 'center' }}>St.</span>
              <span style={{ width: '70px', minWidth: '70px' }}>Platform</span>
              <span style={{ flex: 1 }}>Notes</span>
            </div>
            {apiTable.map(api => (
              <div key={api.cudaApi} className="flex gap-2 py-0.5 border-b" style={{ borderColor: '#111111' }}>
                <span style={{ width: '220px', minWidth: '220px', color: T.colors.textSecondary }}>{api.cudaApi}</span>
                <span style={{ width: '220px', minWidth: '220px', color: '#555555' }}>{api.hipEquiv || '—'}</span>
                <span style={{ width: '28px', minWidth: '28px', textAlign: 'center', fontWeight: 'bold', color: STATUS_COLOR[api.status] }}>
                  {STATUS_ICON[api.status]}
                </span>
                <span style={{ width: '70px', minWidth: '70px', color: '#444444' }}>{PLATFORM_LABEL[api.platform]}</span>
                <span style={{ flex: 1, color: T.colors.textTertiary }}>{api.note}</span>
              </div>
            ))}
            {apiTable.length === 0 && (
              <div style={{ color: T.colors.textTertiary, padding: '4px 0' }}>— no API data —</div>
            )}
          </div>
        </TuiBox>
      </div>
    </div>
  );
};
