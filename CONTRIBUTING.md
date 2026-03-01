# Contributing to Orion

First off — **thank you for being here.** Orion is open source and driven entirely by contributors like you. Whether you're fixing a typo, adding a new tab, or wiring up a real backend — every contribution matters.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Bug Reports](#bug-reports)
  - [Feature Requests](#feature-requests)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Project Conventions](#project-conventions)
  - [Commit Messages](#commit-messages)
  - [TypeScript](#typescript)
  - [Styling](#styling)
  - [Component Patterns](#component-patterns)
- [Adding a New Tab](#adding-a-new-tab)
- [Testing](#testing)
- [Getting Help](#getting-help)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Please report unacceptable behaviour to the maintainers.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/orion.git
   cd orion
   ```
3. **Install dependencies** (requires Node.js 18+ and pnpm):
   ```bash
   pnpm install
   ```
4. **Start the dev server:**
   ```bash
   pnpm dev
   # → http://localhost:3000
   ```
5. **Create a branch** for your work:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/what-youre-fixing
   ```

---

## How to Contribute

### Bug Reports

Before opening a bug report, please search existing issues to avoid duplicates.

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- A clear, descriptive title
- Steps to reproduce (numbered)
- Expected vs actual behaviour
- Browser / OS / Node.js version
- Console errors or screenshots if applicable

### Feature Requests

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Describe:

- The problem you're trying to solve
- Your proposed solution
- Alternatives you've considered
- Whether you're willing to implement it yourself

### Pull Requests

1. Open an issue first for any non-trivial change, so we can discuss the approach before you invest time.
2. Keep PRs **focused** — one logical change per PR.
3. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely.
4. Ensure all checks pass before requesting review:
   ```bash
   pnpm tsc --noEmit   # zero TypeScript errors required
   pnpm lint           # ESLint must pass
   ```
5. Maintainers will review within a few days and may request changes.

---

## Development Setup

```bash
# Full dependency install
pnpm install

# Dev server with Turbopack (fast refresh)
pnpm dev

# Type check (must be clean before any PR)
pnpm tsc --noEmit

# Lint
pnpm lint

# Production build (confirm no build errors)
pnpm build
```

**Path aliases:**  
`@/*` resolves to both the repo root and `./src/` — so `@/components/base/TuiBox` and `@/utils/format` both work without `../../` hell.

---

## Project Conventions

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | New feature or UI panel |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, whitespace, no logic change |
| `docs` | Documentation only |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvement |

**Examples:**
```
feat(tabs): add per-file diff viewer to Conversion tab
fix(LogsTab): prevent XSS in log message rendering
docs: update CONTRIBUTING with new tab guide
chore: bump next to 16.2.0
```

### TypeScript

- **Strict mode is on.** `pnpm tsc --noEmit` must return zero errors.
- Prefer `interface` for object shapes, `type` for unions/aliases.
- Export types from the file that owns them (e.g. domain types from `useMockData.ts`).
- No `any` — use `unknown` and narrow it.

### Styling

- **Tailwind CSS v4** — use `@import 'tailwindcss'` syntax, not `@tailwind` directives.
- Inline `style` props are acceptable for dynamic/theme-driven colours (we use the `TERMINAL_THEME` token object from `src/config/theme.ts`).
- No new colours outside the `TERMINAL_THEME` palette without a discussion — the obsidian B&W aesthetic is intentional.
- Monospace font everywhere in the TUI area — `font-mono` class or `fontFamily: 'inherit'`.

### Component Patterns

- **All tab components** live in `src/components/tabs/` and receive data as props (no hooks inside tabs, except local UI state).
- **Data hooks** (`useMock*`) live in `src/hooks/useMockData.ts`. When adding real data support, add a new hook alongside the mock.
- **Base components** (`TuiBox`, `ProgressBar`, etc.) in `src/components/base/` must be generic and reusable.
- Use `TuiBox` for all panel containers — it provides the consistent box-drawing border + floating title aesthetic.
- Mark all interactive components `'use client'` at the top.

---

## Adding a New Tab

1. **Create the component** in `src/components/tabs/MyTab.tsx`:
   ```tsx
   'use client';
   import React from 'react';
   import { TuiBox } from '@/components/base/TuiBox';
   import { TERMINAL_THEME as T } from '@/config/theme';

   interface MyTabProps { /* your props */ }

   export const MyTab: React.FC<MyTabProps> = (props) => {
     return (
       <div className="flex h-full overflow-hidden p-1" style={{ backgroundColor: '#080808' }}>
         <TuiBox title="My Panel">
           {/* content */}
         </TuiBox>
       </div>
     );
   };
   ```

2. **Add the tab entry** to `src/config/constants.ts` in the `APP_CONFIG.tabs` array:
   ```typescript
   { id: 'mytab', label: 'MyTab', icon: '' },
   ```

3. **Wire up the data** — add a hook to `src/hooks/useMockData.ts` and export any new types.

4. **Register in `TerminalUI.tsx`** — add the hook call and a `case 'mytab':` in `renderTabContent()`.

5. **Export** from `src/components/index.ts`.

---

## Testing

There is no automated test suite yet — this is a great area to contribute! If you add tests, the recommended stack is:

- **Unit tests:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Type safety:** `pnpm tsc --noEmit` (already required)
- **E2E:** [Playwright](https://playwright.dev/) (not yet configured)

Until a test suite is added, please manually verify:
- The tab you changed renders without errors
- No console errors in the browser
- TypeScript check passes

---

## Getting Help

- **Open a Discussion** on GitHub for questions, ideas, or if you're unsure whether something is a bug.
- **Open an Issue** for concrete bugs or feature requests.
- For security issues, see [SECURITY.md](SECURITY.md) — **do not open a public issue for vulnerabilities.**

We're glad you're here. Happy hacking! ◆
