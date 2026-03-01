'use client';

import React, { useMemo } from 'react';
import { TuiBox } from '@/components/base/TuiBox';
import { ProgressBar } from '@/components/base/ProgressBar';
import { TERMINAL_THEME as T } from '@/config/theme';
import { ConversionStats } from '@/hooks/useMockData';
import { BuildStatus } from '@/types';

interface OverviewTabProps {
  conversionStats: ConversionStats;
  buildStatus: BuildStatus;
}

const PIPELINE_STAGES = [
  { label: 'Code Analysis',         desc: 'API discovery · 214 files · 1,042 CUDA calls',     pct: 100, done: true  },
  { label: 'hipify-clang',          desc: '209/214 converted · 5 manual required',              pct: 100, done: true  },
  { label: 'Header Substitution',   desc: 'cuda_runtime.h → hip/hip_runtime.h · 8 libs',       pct: 100, done: true  },
  { label: 'CMake Patch',           desc: 'FindCUDA → FindHIP · GPU_TARGETS=gfx1100',           pct: 100, done: true  },
  { label: 'ROCm Compile',          desc: 'Linux · gfx1100 · 57/98 modules done',               pct: 62,  done: false },
  { label: 'Windows HIP SDK',       desc: 'Pending ROCm compile pass',                          pct: 0,   done: false },
  { label: 'Runtime Correctness',   desc: 'Pending compilation',                                pct: 0,   done: false },
  { label: 'Perf Regression',       desc: 'Pending runtime validation',                         pct: 0,   done: false },
] as const;

const DIM = T.colors.textTertiary;
const SEC = T.colors.textSecondary;
const PRI = T.colors.textPrimary;
const WHT = '#ffffff';
const GRY = '#666666';

function scoreGrade(n: number) {
  if (n >= 90) return { label: 'EXCELLENT', c: '#aaaaaa' };
  if (n >= 75) return { label: 'GOOD', c: '#888888' };
  if (n >= 55) return { label: 'WARN', c: '#666666' };
  return { label: 'CRITICAL', c: '#ffffff' };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ conversionStats: stats, buildStatus }) => {
  const grade = useMemo(() => scoreGrade(stats.portabilityScore), [stats.portabilityScore]);

  return (
    <div
      className="flex h-full overflow-hidden p-1 gap-1"
      role="tabpanel"
      id="panel-overview"
      style={{ backgroundColor: '#080808' }}
    >
      {/* ── LEFT: portability score + pipeline stages ── */}
      <div className="flex flex-col gap-2 overflow-y-auto" style={{ width: '48%', minWidth: 0 }}>

        <TuiBox title="Portability Score" subtitle={`${Math.round(stats.portabilityScore)}%`} variant="elevated">
          <div className="space-y-1.5">
            <ProgressBar value={stats.portabilityScore} label="Score" color="info" width={26} />
            <div className="text-xs flex gap-4 mt-1">
              <span style={{ color: DIM }}>grade </span>
              <span style={{ color: grade.c, fontWeight: 'bold' }}>{grade.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-xs mt-1">
              <span style={{ color: DIM }}>mapped</span><span style={{ color: DIM }}>partial</span><span style={{ color: DIM }}>unsupported</span>
              <span style={{ color: '#aaaaaa' }}>{stats.mappedApis}</span>
              <span style={{ color: '#777777' }}>{stats.partialApis}</span>
              <span style={{ color: WHT, fontWeight: 'bold' }}>{stats.unsupportedApis}</span>
            </div>
          </div>
        </TuiBox>

        <TuiBox title="Conversion Pipeline" subtitle={`${PIPELINE_STAGES.filter(s => s.done || s.pct > 0).length}/${PIPELINE_STAGES.length} active`}>
          <div className="space-y-2">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: stage.done ? '#aaaaaa' : stage.pct > 0 ? WHT : DIM }}>
                    {stage.done ? '✓' : stage.pct > 0 ? '▶' : '○'}
                  </span>
                  <span style={{ color: stage.done ? SEC : stage.pct > 0 ? PRI : DIM, fontWeight: stage.pct > 0 && !stage.done ? 'bold' : 'normal' }}>
                    {stage.label}
                  </span>
                  {stage.pct > 0 && !stage.done && (
                    <span style={{ color: DIM, marginLeft: 'auto' }}>{stage.pct}%</span>
                  )}
                </div>
                <div className="pl-4 text-xs" style={{ color: DIM }}>{stage.desc}</div>
                {stage.pct > 0 && !stage.done && (
                  <div className="pl-4">
                    <ProgressBar value={stage.pct} showPercentage={false} color="info" width={22} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TuiBox>

      </div>

      {/* ── RIGHT: file stats + api summary + issues ── */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto" style={{ minWidth: 0 }}>

        <TuiBox title="File Conversion">
          <div className="space-y-1.5">
            <ProgressBar
              value={(stats.convertedFiles / stats.totalFiles) * 100}
              label="Files "
              color="info"
              width={24}
            />
            <div className="flex gap-6 text-xs">
              <span style={{ color: DIM }}>converted <span style={{ color: SEC }}>{stats.convertedFiles}/{stats.totalFiles}</span></span>
              <span style={{ color: DIM }}>manual <span style={{ color: WHT }}>{stats.totalFiles - stats.convertedFiles}</span></span>
            </div>
          </div>
        </TuiBox>

        <TuiBox title="API Coverage">
          <div className="space-y-1.5">
            <ProgressBar
              value={(stats.mappedApis / stats.totalApis) * 100}
              label="APIs  "
              color="info"
              width={24}
            />
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span style={{ color: DIM }}>✓ Fully mapped</span>
                <span style={{ color: '#aaaaaa' }}>{stats.mappedApis}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: DIM }}>⚠ Partial / workaround</span>
                <span style={{ color: '#777777' }}>{stats.partialApis}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: DIM }}>✗ Unsupported</span>
                <span style={{ color: WHT, fontWeight: 'bold' }}>{stats.unsupportedApis}</span>
              </div>
              <div className="flex justify-between border-t pt-0.5 mt-0.5" style={{ borderColor: '#333' }}>
                <span style={{ color: DIM }}>Total APIs</span>
                <span style={{ color: SEC }}>{stats.totalApis}</span>
              </div>
            </div>
          </div>
        </TuiBox>

        <TuiBox title="Build Signals">
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span style={{ color: DIM }}>Errors</span>
              <span style={{ color: stats.buildErrors > 0 ? WHT : '#555', fontWeight: stats.buildErrors > 0 ? 'bold' : 'normal' }}>
                {stats.buildErrors}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: DIM }}>Warnings</span>
              <span style={{ color: '#888888' }}>{stats.buildWarnings}</span>
            </div>
          </div>
        </TuiBox>

        <TuiBox title="Target Platforms">
          <div className="space-y-0.5 text-xs">
            {[
              { name: 'Linux ROCm (gfx1100)',      status: 'IN PROGRESS', c: WHT   },
              { name: 'Linux ROCm (gfx1030)',       status: 'PENDING',    c: GRY   },
              { name: 'Windows HIP SDK 5.7',        status: 'PENDING',    c: GRY   },
            ].map(p => (
              <div key={p.name} className="flex justify-between">
                <span style={{ color: DIM }}>{p.name}</span>
                <span style={{ color: p.c, fontWeight: p.status === 'IN PROGRESS' ? 'bold' : 'normal' }}>{p.status}</span>
              </div>
            ))}
          </div>
        </TuiBox>

        <TuiBox title="Remediation Queue" subtitle={`${stats.unsupportedApis + stats.partialApis} items`}>
          <div className="space-y-0.5 text-xs" style={{ color: DIM }}>
            <div>• cudaMemAdvise — annotate with #ifdef __HIP_PLATFORM_AMD__</div>
            <div>• cudaStreamAttachMemAsync — replace with hipMemPrefetchAsync</div>
            <div>• cudaLaunchCooperativeKernelMultiDevice — split to per-device calls</div>
            <div>• nvJPEG — replace with turbojpeg or stb_image</div>
            <div>• cudaOccupancyMaxBlockSizeByVariableSharedMem — manual grid tune</div>
          </div>
        </TuiBox>

      </div>
    </div>
  );
};
