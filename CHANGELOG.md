# Changelog

All notable changes to Orion are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned
- WebSocket adapter for live pipeline streaming
- Per-file conversion diff viewer
- JSON/HTML portability report export
- ROCm SMI live GPU metrics integration
- Docker image

---

## [1.0.0] — 2026-03-01

### Added
- **Orion** — initial open-source release, renamed from internal prototype
- `Pipeline` tab: portability score + grade (EXCELLENT/GOOD/WARN/CRITICAL), 8-stage conversion pipeline with live progress indicators, file/API coverage panels, target platform status, remediation queue
- `Conversion` tab: step-by-step hipify-clang pipeline with timing, portability warnings list, unsupported API remediation notes (cudaMemAdvise, cudaStreamAttachMemAsync, etc.), build environment panel
- `Diagnostics` tab: filterable log stream by level (ERR/WRN/INF/DBG/OK) and category/search, per-level counts, clickable category filter
- `Regression` tab: CUDA vs HIP benchmark delta table with pass/warn/fail status, summary stats (avg Δ%, coverage score)
- `API Compat` tab: full CUDA → HIP/ROCm API mapping matrix with ✓/⚠/✗ status, platform badges (linux/windows/both/none), coverage %
- `Config` tab: pipeline configuration form — target platform, GPU targets (gfx1100/gfx1030), ROCm + HIP SDK versions, hipify-clang flags, regression thresholds, parallel workers, pipeline stage toggles
- Obsidian black (`#080808`) monochrome B&W theme — zero-colour-fatigue for long sessions
- btop-inspired TUI aesthetic: box-drawing border components (`TuiBox`), block-char progress bars (`████░░░`), numbered tabs, compact header with live clock
- `TuiBox` base component with floating `─[ Title ]` label, `style` prop support
- `ProgressBar` base component using Unicode block characters
- Compact `Header` with live-updating clock and status indicator
- Numbered `TabNavigation` (keyboard: `1`–`6`)
- Open-source welcome banner below tab navigation
- Domain type exports: `ApiEntry`, `RegressionMetric`, `ConversionStats`
- Mock data hooks: `useMockConversionStats`, `useMockApiTable`, `useMockRegressionData`
- Zod validation schemas for all input types
- XSS/injection prevention utilities (`src/utils/security.ts`)
- Full TypeScript strict-mode compliance
- README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY documentation
- GitHub issue templates (bug report, feature request) and PR template

### Changed
- Renamed project from internal codename to **Orion**
- All `v0` / `my-project` references removed
- Package name → `orion`, version → `1.0.0`
- Tab labels: Pipeline, Conversion, Diagnostics, Regression, API Compat, Config (previously GPU-monitor labels)
- AMD Radeon RX 7900 XTX / RX 7800 XT in GPU stats mock data

### Fixed
- `@/utils/security` module resolution (tsconfig paths dual-alias `./*` + `./src/*`)
- `formatDateTime` imported from correct module (`@/utils/format`)
- Duplicate component definitions removed from OverviewTab, BuildStatusTab, LogsTab
- `TuiBoxProps` missing `style` prop causing TypeScript errors
- `validation.ts` `.max()` call on Zod union type

---

## [0.1.0] — internal prototype

Initial btop-style TUI rebuild on Next.js 16 with Turbopack. Not publicly released.
