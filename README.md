<div align="center">

```
 ██████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗
██╔═══██╗██╔══██╗██║██╔═══██╗████╗  ██║
██║   ██║██████╔╝██║██║   ██║██╔██╗ ██║
██║   ██║██╔══██╗██║██║   ██║██║╚██╗██║
╚██████╔╝██║  ██║██║╚██████╔╝██║ ╚████║
 ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

**Open-source terminal UI for CUDA → HIP/ROCm migration monitoring**

[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/orion-hip)

</div>

---

## What is Orion?

Orion is a **btop-style terminal dashboard** that gives you real-time visibility into your CUDA → HIP/ROCm porting pipeline. It surfaces portability scores, conversion progress, performance regressions, and API compatibility gaps — all in an obsidian-black monochrome TUI running inside a browser.

Built for GPU engineers, ML platform teams, and anyone migrating CUDA codebases to run on AMD hardware.

```
┌─[ Pipeline ]────────────────────────────────────────────────────────────────┐
│  Portability Score  91%  EXCELLENT                                          │
│  ────────────────────────────────────────────────────────────────────────   │
│  ✓ Code Analysis        ▶ ROCm Compile  62%    ○ Runtime Correctness        │
│  ✓ hipify-clang         ○ Windows HIP SDK      ○ Perf Regression            │
│  ✓ Header Substitution                                                      │
│  ✓ CMake Patch                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Features

| Tab | What it shows |
|-----|---------------|
| **Pipeline** | Overall portability score, 8-stage conversion pipeline, file and API coverage |
| **Conversion** | Live hipify-clang step progress, portability warnings, unsupported API remediation |
| **Diagnostics** | Filterable log stream with level/category/search, annotated conversion errors |
| **Regression** | CUDA vs HIP benchmark delta table — pass/warn/fail with Δ% per benchmark |
| **API Compat** | Full CUDA → HIP API mapping matrix: ✓ mapped / ⚠ partial / ✗ unsupported |
| **Config** | Pipeline settings: GPU targets, hipify-clang flags, thresholds, platform selection |

**Aesthetic:**
- Obsidian black background (`#080808`) — zero eye strain for long sessions
- Box-drawing characters, block-char progress bars (`████░░░`)
- Monospace font (JetBrains Mono / Fira Code), purely monochrome palette
- Inspired by [btop](https://github.com/aristocratos/btop)

---

## Quick Start

**Requirements:** Node.js 18+, pnpm (or npm/yarn)

```bash
# Clone
git clone https://github.com/orion-hip/orion.git
cd orion

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
pnpm build && pnpm start

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint
```

---

## Project Structure

```
orion/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Entry page
│   ├── terminal-client.tsx     # Client boundary wrapper
│   └── globals.css             # Global styles (obsidian theme)
├── src/
│   ├── components/
│   │   ├── base/               # TuiBox, ProgressBar, StatCard, ...
│   │   ├── layout/             # Header, TabNavigation
│   │   ├── tabs/               # One file per tab (Pipeline, Conversion, ...)
│   │   └── TerminalUI.tsx      # Root orchestrator
│   ├── config/
│   │   ├── theme.ts            # Color tokens (B&W palette)
│   │   └── constants.ts        # Tab definitions, keyboard shortcuts
│   ├── hooks/
│   │   ├── useMockData.ts      # All mock data hooks + domain types
│   │   └── useKeyboardNavigation.ts
│   ├── types/
│   │   ├── index.ts            # Shared TypeScript types
│   │   └── validation.ts       # Zod schemas for input validation
│   └── utils/
│       ├── format.ts           # Date/number formatters
│       └── security.ts         # XSS/injection prevention utilities
├── components/ui/              # shadcn/ui primitives (untouched)
├── public/                     # Static assets
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
└── SECURITY.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v4 |
| Validation | Zod 3 |
| UI Primitives | shadcn/ui + Radix UI |
| Font | JetBrains Mono, Fira Code |
| Runtime | React 19 |

---

## Connecting Real Data

Orion ships with mock data so you can run it out of the box. To plug in a real pipeline:

1. **Replace mock hooks** in `src/hooks/useMockData.ts` with API calls to your build system / hipify runner.
2. **Implement a backend** (REST or WebSocket) that streams:
   - Conversion pipeline step events
   - `hipify-clang` stdout/stderr log lines
   - Benchmark results (CUDA baseline vs HIP run times)
   - API audit output from a static analyser
3. **Update `ConversionStats`, `RegressionMetric`, `ApiEntry`** types in `src/hooks/useMockData.ts` if your schema differs.

There is no backend in this repo — it is intentionally a pure frontend so you can wire it to whatever build infra you already have.

---

## Contributing

Orion is **open source and welcomes contributions of all sizes** — from typo fixes to new tab panels.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

In short:

```bash
# Fork → clone → branch
git checkout -b feat/my-improvement

# Make changes, then
pnpm tsc --noEmit   # must pass
pnpm lint           # must pass

# Commit with conventional commits
git commit -m "feat: add NVCC flag parser to Config tab"

# Open a pull request
```

---

## Roadmap

- [ ] WebSocket backend adapter for live pipeline streaming
- [ ] Export portability report as JSON / HTML
- [ ] Dark/dim theme toggle (current: obsidian only)
- [ ] Per-file conversion diff viewer
- [ ] ROCm SMI live GPU metrics integration
- [ ] CI badge integration (GitHub Actions / GitLab CI)
- [ ] Docker image (`docker run orion-hip/orion`)

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Made with ◆ by open source contributors &nbsp;·&nbsp; **Welcome aboard.**

</div>
