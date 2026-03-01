import { useState, useEffect } from 'react';
import { GpuStats, SystemMetrics, BuildStatus, LogEntry } from '@/types';
import { generateSecureId } from '@/utils/security';

// ─────────────────────────────────────────────────────────────────────────────
// HIPBridge Sentinel — domain types
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiEntry {
  id: string;
  cudaApi: string;
  hipEquiv: string;
  status: 'mapped' | 'partial' | 'unsupported' | 'unknown';
  platform: 'both' | 'linux' | 'windows' | 'none';
  note?: string;
}

export interface RegressionMetric {
  name: string;
  cudaValue: number;
  hipValue: number;
  unit: string;
  delta: number; // %
  status: 'ok' | 'warn' | 'fail';
}

export interface ConversionStats {
  totalFiles: number;
  convertedFiles: number;
  totalApis: number;
  mappedApis: number;
  partialApis: number;
  unsupportedApis: number;
  buildErrors: number;
  buildWarnings: number;
  portabilityScore: number; // 0-100
}

// ─────────────────────────────────────────────────────────────────────────────
// GPU Stats (kept for system awareness panel)
// ─────────────────────────────────────────────────────────────────────────────

export const useMockGpuStats = () => {
  const [gpuStats, setGpuStats] = useState<GpuStats[]>([
    {
      id: 0,
      name: 'AMD Radeon RX 7900 XTX',
      utilization: 72,
      memory: { used: 18432, total: 24576, utilization: 75 },
      temperature: 68,
      powerUsage: 310,
      timestamp: Date.now(),
    },
    {
      id: 1,
      name: 'AMD Radeon RX 7800 XT',
      utilization: 55,
      memory: { used: 12000, total: 16384, utilization: 73 },
      temperature: 62,
      powerUsage: 215,
      timestamp: Date.now(),
    },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setGpuStats(prev =>
        prev.map(gpu => ({
          ...gpu,
          utilization: Math.max(20, Math.min(95, gpu.utilization + (Math.random() - 0.5) * 10)),
          memory: {
            ...gpu.memory,
            used: Math.max(1000, Math.min(gpu.memory.total * 0.95, gpu.memory.used + (Math.random() - 0.5) * 400)),
            utilization: 0,
          },
          temperature: Math.max(40, Math.min(88, gpu.temperature + (Math.random() - 0.5) * 3)),
          powerUsage: Math.max(50, Math.min(400, gpu.powerUsage + (Math.random() - 0.5) * 15)),
          timestamp: Date.now(),
        })).map(g => ({
          ...g,
          memory: { ...g.memory, utilization: Math.round((g.memory.used / g.memory.total) * 100) },
        }))
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return gpuStats;
};

export const useMockSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 38,
    memory: 54,
    disk: 61,
    network: { upload: 42.5, download: 118.3 },
    uptime: 86400 * 2 + 3600 * 9 + 60 * 14,
    timestamp: Date.now(),
  });
  useEffect(() => {
    const id = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(5, Math.min(90, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 4)),
        disk: Math.max(50, Math.min(85, prev.disk + (Math.random() - 0.5) * 1)),
        network: {
          upload: Math.max(5, prev.network.upload + (Math.random() - 0.5) * 20),
          download: Math.max(10, prev.network.download + (Math.random() - 0.5) * 40),
        },
        uptime: prev.uptime + 1,
        timestamp: Date.now(),
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return metrics;
};

export const useMockBuildStatus = () => {
  const [buildStatus, setBuildStatus] = useState<BuildStatus>({
    id: generateSecureId(),
    name: 'HIPBridge Conversion Pipeline — v2.3.1',
    status: 'building',
    progress: 58,
    startTime: Date.now() - 72000,
    steps: [
      { id: generateSecureId(), name: 'Code Analysis & API Discovery', status: 'success', progress: 100, duration: 6200, startTime: Date.now() - 72000, endTime: Date.now() - 65800 },
      { id: generateSecureId(), name: 'hipify-clang Transformation', status: 'success', progress: 100, duration: 18400, startTime: Date.now() - 65800, endTime: Date.now() - 47400 },
      { id: generateSecureId(), name: 'HIP Header Substitution', status: 'success', progress: 100, duration: 3100, startTime: Date.now() - 47400, endTime: Date.now() - 44300 },
      { id: generateSecureId(), name: 'CMake Build System Patch', status: 'success', progress: 100, duration: 2800, startTime: Date.now() - 44300, endTime: Date.now() - 41500 },
      { id: generateSecureId(), name: 'ROCm Compilation (Linux)', status: 'running', progress: 62, duration: 0, startTime: Date.now() - 41500, error: undefined },
      { id: generateSecureId(), name: 'Windows HIP SDK Compilation', status: 'pending', progress: 0, duration: 0, startTime: 0 },
      { id: generateSecureId(), name: 'Runtime Correctness Check', status: 'pending', progress: 0, duration: 0, startTime: 0 },
      { id: generateSecureId(), name: 'Performance Regression Validation', status: 'pending', progress: 0, duration: 0, startTime: 0 },
    ],
  });

  useEffect(() => {
    const id = setInterval(() => {
      setBuildStatus(prev => {
        const newProgress = Math.min(100, prev.progress + (Math.random() * 1.2));
        return {
          ...prev,
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : 'building',
          steps: prev.steps.map((s, i) => {
            if (s.status === 'running') {
              const p = Math.min(100, s.progress + (Math.random() * 2.5));
              return { ...s, progress: p, status: p >= 100 ? 'success' as const : 'running' as const, duration: p >= 100 ? Date.now() - s.startTime : 0 };
            }
            if (s.status === 'pending') {
              const prevStep = prev.steps[i - 1];
              if (prevStep && prevStep.status === 'success') {
                return { ...s, status: 'running' as const, startTime: Date.now() };
              }
            }
            return s;
          }),
        };
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return buildStatus;
};

export const useMockLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: generateSecureId(), timestamp: Date.now() - 72000, level: 'info',    category: 'Pipeline',     message: 'Orion v1.0 initializing — open source CUDA→HIP migration monitor...', source: 'Orchestrator' },
    { id: generateSecureId(), timestamp: Date.now() - 70000, level: 'info',    category: 'Analysis',     message: 'Scanning source tree: 214 .cu files, 38 .cuh headers', source: 'ApiScanner' },
    { id: generateSecureId(), timestamp: Date.now() - 68500, level: 'info',    category: 'Analysis',     message: 'Discovered 1,042 CUDA API calls across 214 source files', source: 'ApiScanner' },
    { id: generateSecureId(), timestamp: Date.now() - 66000, level: 'warn',    category: 'Analysis',     message: 'cudaStreamAttachMemAsync — no direct HIP equivalent (Linux-only workaround available)', source: 'ApiScanner' },
    { id: generateSecureId(), timestamp: Date.now() - 65800, level: 'success', category: 'Analysis',     message: 'Code analysis complete. 94.2% APIs have HIP equivalents', source: 'ApiScanner' },
    { id: generateSecureId(), timestamp: Date.now() - 65700, level: 'info',    category: 'hipify',       message: 'Running hipify-clang on 214 files (parallel workers: 8)', source: 'hipify-clang' },
    { id: generateSecureId(), timestamp: Date.now() - 58000, level: 'warn',    category: 'hipify',       message: 'src/kernels/fft_kernel.cu:142 — cudaFuncSetCacheConfig not available on Windows HIP SDK', source: 'hipify-clang' },
    { id: generateSecureId(), timestamp: Date.now() - 55000, level: 'error',   category: 'hipify',       message: 'src/memory/unified_mem.cu:87 — cudaMemAdvise: UNSUPPORTED on Windows HIP SDK', source: 'hipify-clang' },
    { id: generateSecureId(), timestamp: Date.now() - 52000, level: 'warn',    category: 'hipify',       message: 'src/ops/sparse.cu:310 — cusparseSpMM → hipSparseSpMM: partial — alpha/beta scaling differs', source: 'hipify-clang' },
    { id: generateSecureId(), timestamp: Date.now() - 48000, level: 'info',    category: 'hipify',       message: 'hipify-clang completed. 209/214 files converted cleanly', source: 'hipify-clang' },
    { id: generateSecureId(), timestamp: Date.now() - 47400, level: 'info',    category: 'Headers',      message: 'Substituting HIP headers: cuda_runtime.h → hip/hip_runtime.h', source: 'HeaderPatch' },
    { id: generateSecureId(), timestamp: Date.now() - 46000, level: 'info',    category: 'Headers',      message: 'cublas_v2.h → rocblas/rocblas.h — 23 call sites updated', source: 'HeaderPatch' },
    { id: generateSecureId(), timestamp: Date.now() - 44500, level: 'success', category: 'Headers',      message: 'HIP header substitution complete', source: 'HeaderPatch' },
    { id: generateSecureId(), timestamp: Date.now() - 44300, level: 'info',    category: 'CMake',        message: 'Patching CMakeLists.txt — replacing FindCUDA with FindHIP', source: 'BuildPatch' },
    { id: generateSecureId(), timestamp: Date.now() - 43200, level: 'warn',    category: 'CMake',        message: 'CMAKE_CUDA_ARCHITECTURES has no HIP equivalent — mapped to GPU_TARGETS (gfx1100)', source: 'BuildPatch' },
    { id: generateSecureId(), timestamp: Date.now() - 41500, level: 'success', category: 'CMake',        message: 'CMake build system patch applied', source: 'BuildPatch' },
    { id: generateSecureId(), timestamp: Date.now() - 41400, level: 'info',    category: 'Compile',      message: 'ROCm compilation started — target: gfx1100 (RX 7900 XTX)', source: 'hipcc' },
    { id: generateSecureId(), timestamp: Date.now() - 38000, level: 'warn',    category: 'Compile',      message: 'src/ops/attention.hip:201 — __shfl_sync not available, using __shfl (deprecated fallback)', source: 'hipcc' },
    { id: generateSecureId(), timestamp: Date.now() - 32000, level: 'error',   category: 'Compile',      message: 'src/kernels/cooperative.hip:55 — hipLaunchCooperativeKernelMultiDevice: unsupported on gfx1100', source: 'hipcc' },
    { id: generateSecureId(), timestamp: Date.now() - 28000, level: 'info',    category: 'Compile',      message: 'Compiling module 47/98: tensor_ops.hip', source: 'hipcc' },
  ]);

  useEffect(() => {
    const pool: Array<{ level: LogEntry['level']; category: string; message: string }> = [
      { level: 'info',    category: 'Compile',   message: 'Compiling module — tensor_reduce.hip' },
      { level: 'warn',    category: 'Compile',   message: 'hipDeviceSynchronize inside kernel loop — performance risk (P2)' },
      { level: 'error',   category: 'Compile',   message: 'src/nn/conv.hip:88 — __half2 intrinsic missing on gfx1030 target' },
      { level: 'info',    category: 'Compile',   message: 'Module compiled successfully: math_utils.hip' },
      { level: 'warn',    category: 'Runtime',   message: 'hipPeekAtLastError: hipErrorInvalidDevice during stream sync' },
      { level: 'info',    category: 'Compile',   message: 'Linking HIP objects into libhipbridge.so' },
      { level: 'success', category: 'Compile',   message: 'Compilation unit passed: memory_pool.hip (3.2s)' },
      { level: 'warn',    category: 'Compat',    message: 'cudaEventRecord with flags — partial: hipEventRecord ignores flags on Windows HIP SDK' },
    ];
    const id = setInterval(() => {
      const entry = pool[Math.floor(Math.random() * pool.length)];
      setLogs(prev => [
        ...prev.slice(-60),
        { id: generateSecureId(), timestamp: Date.now(), level: entry.level, category: entry.category, message: entry.message, source: 'hipcc' },
      ]);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return logs;
};

// ─────────────────────────────────────────────────────────────────────────────
// HIPBridge-specific hooks
// ─────────────────────────────────────────────────────────────────────────────

export const useMockConversionStats = (): ConversionStats => {
  const [stats, setStats] = useState<ConversionStats>({
    totalFiles: 214,
    convertedFiles: 209,
    totalApis: 1042,
    mappedApis: 982,
    partialApis: 31,
    unsupportedApis: 12,
    buildErrors: 3,
    buildWarnings: 18,
    portabilityScore: 87,
  });
  useEffect(() => {
    const id = setInterval(() => {
      setStats(prev => ({
        ...prev,
        portabilityScore: Math.max(80, Math.min(95, prev.portabilityScore + (Math.random() - 0.48) * 0.4)),
        buildWarnings: Math.max(10, Math.min(30, prev.buildWarnings + (Math.random() > 0.8 ? 1 : 0))),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return stats;
};

export const useMockApiTable = (): ApiEntry[] => [
  { id: '1', cudaApi: 'cudaMalloc',                   hipEquiv: 'hipMalloc',                    status: 'mapped',       platform: 'both',    },
  { id: '2', cudaApi: 'cudaFree',                     hipEquiv: 'hipFree',                      status: 'mapped',       platform: 'both',    },
  { id: '3', cudaApi: 'cudaMemcpy',                   hipEquiv: 'hipMemcpy',                    status: 'mapped',       platform: 'both',    },
  { id: '4', cudaApi: 'cudaStreamCreate',             hipEquiv: 'hipStreamCreate',              status: 'mapped',       platform: 'both',    },
  { id: '5', cudaApi: 'cudaStreamDestroy',            hipEquiv: 'hipStreamDestroy',             status: 'mapped',       platform: 'both',    },
  { id: '6', cudaApi: 'cudaEventCreate',              hipEquiv: 'hipEventCreate',               status: 'mapped',       platform: 'both',    },
  { id: '7', cudaApi: 'cudaEventRecord',              hipEquiv: 'hipEventRecord',               status: 'partial',      platform: 'both',    note: 'Flags ignored on Windows HIP SDK' },
  { id: '8', cudaApi: 'cudaFuncSetCacheConfig',       hipEquiv: 'hipFuncSetCacheConfig',        status: 'partial',      platform: 'linux',   note: 'Not available on Windows HIP SDK' },
  { id: '9', cudaApi: 'cudaMemAdvise',                hipEquiv: '—',                            status: 'unsupported',  platform: 'none',    note: 'No equivalent on Windows HIP SDK' },
  { id: '10',cudaApi: 'cudaStreamAttachMemAsync',     hipEquiv: '—',                            status: 'unsupported',  platform: 'none',    note: 'Linux-only workaround via hipMemPrefetchAsync' },
  { id: '11',cudaApi: 'cudaLaunchCooperativeKernel',  hipEquiv: 'hipLaunchCooperativeKernel',   status: 'partial',      platform: 'linux',   note: 'Multi-device variant unsupported on gfx1100' },
  { id: '12',cudaApi: 'cublasSgemm',                  hipEquiv: 'rocblas_sgemm',                status: 'mapped',       platform: 'linux',   note: 'Windows: hipBLAS (different header)' },
  { id: '13',cudaApi: 'cufftExecC2C',                 hipEquiv: 'hipfftExecC2C',                status: 'mapped',       platform: 'both',    },
  { id: '14',cudaApi: 'cusparseSpMM',                 hipEquiv: 'hipSparseSpMM',                status: 'partial',      platform: 'linux',   note: 'alpha/beta scaling semantics differ' },
  { id: '15',cudaApi: '__shfl_sync',                  hipEquiv: '__shfl',                       status: 'partial',      platform: 'both',    note: 'mask arg dropped; deprecated on newer HIP' },
  { id: '16',cudaApi: 'cudaDeviceGetAttribute',       hipEquiv: 'hipDeviceGetAttribute',        status: 'mapped',       platform: 'both',    },
  { id: '17',cudaApi: 'cudaOccupancyMaxBlockSizeByVariableSharedMem', hipEquiv: '—', status: 'unsupported', platform: 'none', note: 'No HIP equivalent — manual tuning required' },
  { id: '18',cudaApi: 'nvJPEG (nvjpegCreateSimple)',  hipEquiv: '—',                            status: 'unsupported',  platform: 'none',    note: 'No HIP/ROCm equivalent library available' },
];

export const useMockRegressionData = (): RegressionMetric[] => {
  const [data, setData] = useState<RegressionMetric[]>([
    { name: 'Matrix Multiply (4096²)', cudaValue: 12.4,   hipValue: 13.1,   unit: 'ms',     delta: 5.6,   status: 'ok' },
    { name: 'FFT 1D (N=2²⁴)',          cudaValue: 8.7,    hipValue: 9.2,    unit: 'ms',     delta: 5.7,   status: 'ok' },
    { name: 'Mem Bandwidth',            cudaValue: 912.0,  hipValue: 878.4,  unit: 'GB/s',   delta: -3.7,  status: 'ok' },
    { name: 'Kernel Launch Overhead',   cudaValue: 4.2,    hipValue: 6.8,    unit: 'μs',     delta: 61.9,  status: 'warn' },
    { name: 'Sparse SpMV',              cudaValue: 3.1,    hipValue: 4.7,    unit: 'ms',     delta: 51.6,  status: 'warn' },
    { name: 'Conv2D Forward',           cudaValue: 22.3,   hipValue: 24.1,   unit: 'ms',     delta: 8.1,   status: 'ok' },
    { name: 'AllReduce (NCCL/RCCL)',    cudaValue: 18.5,   hipValue: 31.2,   unit: 'ms',     delta: 68.6,  status: 'fail' },
    { name: 'Correctness (L2 error)',   cudaValue: 0.0,    hipValue: 0.0003, unit: 'ΔL2',    delta: 100.0, status: 'warn' },
    { name: 'Peak FLOPS Util',          cudaValue: 84.2,   hipValue: 79.6,   unit: '%',      delta: -5.5,  status: 'ok' },
  ]);
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => prev.map(m => ({
        ...m,
        hipValue: parseFloat((m.hipValue * (1 + (Math.random() - 0.5) * 0.04)).toFixed(m.unit === 'ΔL2' ? 4 : 1)),
      })));
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return data;
};

