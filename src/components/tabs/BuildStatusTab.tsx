'use client';

import React from 'react';
import { BuildStatus } from '@/types';
import { TuiBox } from '@/components/base/TuiBox';
import { ProgressBar } from '@/components/base/ProgressBar';
import { TERMINAL_THEME as T } from '@/config/theme';
import { formatDuration, formatDateTime } from '@/utils/format';

interface BuildStatusTabProps {
  buildStatus: BuildStatus;
}

const STEP_ICON: Record<string, string> = {
  success: '✓',
  running: '▶',
  error:   '✗',
  pending: '○',
  skipped: '–',
};

const STEP_COLOR: Record<string, string> = {
  success: '#888888',
  running: '#ffffff',
  error:   '#ffffff',
  pending: '#444444',
  skipped: '#333333',
};

export const BuildStatusTab: React.FC<BuildStatusTabProps> = ({ buildStatus }) => {
  const elapsed = buildStatus.endTime
    ? buildStatus.endTime - buildStatus.startTime
    : Date.now() - buildStatus.startTime;

  return (
    <div
      className="flex h-full overflow-hidden p-1 gap-1"
      role="tabpanel"
      id="panel-build"
      style={{ backgroundColor: '#080808' }}
    >
      {/* ── LEFT: progress + steps ── */}
      <div className="flex flex-col gap-2 overflow-y-auto" style={{ width: '55%', minWidth: 0 }}>

        <TuiBox title="Conversion Pipeline" subtitle={buildStatus.status.toUpperCase()} variant="elevated">
          <div className="space-y-1.5">
            <div className="text-xs mb-1" style={{ color: T.colors.textSecondary }}>
              {buildStatus.name}
            </div>
            <ProgressBar
              value={buildStatus.progress}
              label="Total "
              color={buildStatus.status === 'failed' ? 'error' : 'info'}
              width={26}
            />
            <div className="flex gap-4 text-xs mt-1">
              <span style={{ color: T.colors.textTertiary }}>
                elapsed <span style={{ color: T.colors.textSecondary }}>{formatDuration(elapsed)}</span>
              </span>
              <span style={{ color: T.colors.textTertiary }}>
                started <span style={{ color: T.colors.textSecondary }}>{formatDateTime(buildStatus.startTime)}</span>
              </span>
            </div>
          </div>
        </TuiBox>

        <TuiBox title="Pipeline Steps" subtitle={`${buildStatus.steps.filter(s => s.status === 'success').length}/${buildStatus.steps.length} done`}>
          <div className="space-y-2">
            {buildStatus.steps.map((step, idx) => (
              <div key={step.id} className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: STEP_COLOR[step.status], minWidth: '0.8rem' }}>
                    {STEP_ICON[step.status] ?? '?'}
                  </span>
                  <span
                    style={{
                      color: STEP_COLOR[step.status],
                      fontWeight: step.status === 'running' ? 'bold' : 'normal',
                    }}
                  >
                    {idx + 1}. {step.name}
                  </span>
                  {step.status === 'success' && step.duration > 0 && (
                    <span style={{ color: T.colors.textTertiary, marginLeft: 'auto' }}>
                      {formatDuration(step.duration)}
                    </span>
                  )}
                  {step.status === 'running' && (
                    <span style={{ color: T.colors.textTertiary, marginLeft: 'auto' }}>
                      {Math.round(step.progress)}%
                    </span>
                  )}
                </div>
                {step.status === 'running' && (
                  <div className="pl-4">
                    <ProgressBar value={step.progress} showPercentage={false} color="info" width={24} />
                  </div>
                )}
                {step.error && (
                  <div className="pl-4 text-xs" style={{ color: '#ffffff' }}>
                    ! {step.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TuiBox>

      </div>

      {/* ── RIGHT: warnings + remediation ── */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto" style={{ minWidth: 0 }}>

        <TuiBox title="Portability Warnings">
          <div className="space-y-1 text-xs" style={{ color: T.colors.textTertiary }}>
            <div style={{ color: '#777777' }}>⚠ cudaFuncSetCacheConfig — Windows HIP SDK only</div>
            <div style={{ color: '#777777' }}>⚠ CMAKE_CUDA_ARCHITECTURES — remapped to GPU_TARGETS</div>
            <div style={{ color: '#777777' }}>⚠ __shfl_sync mask arg dropped — deprecated in HIP</div>
            <div style={{ color: '#777777' }}>⚠ cusparseSpMM alpha/beta semantics diverge</div>
            <div style={{ color: '#777777' }}>⚠ hipDeviceSynchronize inside kernel loop (perf risk)</div>
          </div>
        </TuiBox>

        <TuiBox title="Unsupported APIs">
          <div className="space-y-1 text-xs">
            <div style={{ color: '#ffffff' }}>✗ cudaMemAdvise</div>
            <div className="pl-3 text-xs" style={{ color: T.colors.textTertiary }}>No Windows HIP SDK equivalent. Use #ifdef guard.</div>
            <div style={{ color: '#ffffff', marginTop: '4px' }}>✗ cudaStreamAttachMemAsync</div>
            <div className="pl-3 text-xs" style={{ color: T.colors.textTertiary }}>Linux: hipMemPrefetchAsync. Windows: remove.</div>
            <div style={{ color: '#ffffff', marginTop: '4px' }}>✗ cudaLaunchCooperativeKernelMultiDevice</div>
            <div className="pl-3 text-xs" style={{ color: T.colors.textTertiary }}>Split into per-device cooperative kernel calls.</div>
            <div style={{ color: '#ffffff', marginTop: '4px' }}>✗ nvJPEG</div>
            <div className="pl-3 text-xs" style={{ color: T.colors.textTertiary }}>Replace with turbojpeg / stb_image.</div>
          </div>
        </TuiBox>

        <TuiBox title="Build Environment">
          <div className="space-y-0.5 text-xs">
            {[
              ['Platform',   'Linux x86_64'],
              ['ROCm',       '5.7.1'],
              ['hipcc',      '5.7.31921'],
              ['Target GPU', 'gfx1100 (navi31)'],
              ['hipify',     '5.7.0'],
              ['CMake',      '3.28.1'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span style={{ color: T.colors.textTertiary }}>{k}</span>
                <span style={{ color: T.colors.textSecondary }}>{v}</span>
              </div>
            ))}
          </div>
        </TuiBox>

      </div>
    </div>
  );
};

interface BuildStatusTabProps {
  buildStatus: BuildStatus;
}

const statusBadgeMap = {
  pending: 'pending' as const,
  running: 'info' as const,
  success: 'success' as const,
  error: 'error' as const,
  skipped: 'warning' as const,
};

