# Orion — Architecture

> Open-source CUDA→HIP migration monitor &nbsp;·&nbsp; [README](README.md) · [Contributing](CONTRIBUTING.md)

## Project Structure

```
src/
├── components/
│   ├── base/              # Reusable base UI components
│   │   ├── TuiBox.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── GaugeChart.tsx
│   │   └── CodeBlock.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── TabNavigation.tsx
│   ├── tabs/              # Feature-specific tabs
│   │   ├── OverviewTab.tsx
│   │   ├── BuildStatusTab.tsx
│   │   ├── LogsTab.tsx
│   │   ├── MetricsTab.tsx
│   │   ├── GpuMonitorTab.tsx
│   │   └── SettingsTab.tsx
│   ├── TerminalUI.tsx     # Main orchestrator component
│   └── index.ts           # Centralized exports
├── config/                # Configuration
│   ├── theme.ts           # Color scheme and design tokens
│   └── constants.ts       # Application constants
├── hooks/                 # Custom React hooks
│   ├── useKeyboardNavigation.ts
│   └── useMockData.ts
├── types/                 # TypeScript types
│   ├── index.ts           # Core types
│   └── validation.ts      # Zod schemas
└── utils/                 # Utility functions
    ├── security.ts        # XSS prevention, input sanitization
    └── format.ts          # Formatting functions
```

## Key Features

### 1. Component Hierarchy
- **Base Components**: Atomic, reusable UI elements (TuiBox, ProgressBar, StatCard, etc.)
- **Layout Components**: Structure and navigation (Header, TabNavigation)
- **Tab Components**: Feature-specific implementations (Overview, Build, Logs, etc.)
- **Main Component**: Orchestrates all sub-components (TerminalUI)

### 2. Security
- **Input Sanitization**: `escapeHtml()`, `sanitizeInput()` prevent XSS attacks
- **Zod Validation**: All data structures validated with strict schemas
- **Rate Limiting**: Built-in rate limiter for API protection
- **Safe JSON Parsing**: Custom `safeJsonParse()` with error handling
- **Path Validation**: Prevents directory traversal attacks

### 3. Reusability
- **Centralized Theme**: All colors/spacing defined in `src/config/theme.ts`
- **Utility Functions**: Common formatting functions (bytes, uptime, duration, etc.)
- **Custom Hooks**: `useKeyboardNavigation`, `useMockData` encapsulate logic
- **Component Exports**: Single-file exports for easy imports

### 4. Accessibility
- ARIA labels and roles on all components
- Keyboard navigation support (arrow keys for tab switching)
- Semantic HTML elements
- Screen reader optimized

### 5. Performance
- Memoized components and data computations
- Circular log buffer to prevent memory leaks
- CSS transitions for smooth animations
- Lazy-loaded data with mock intervals

## Configuration

### Theme System (`src/config/theme.ts`)
Centralized design token system:
- **Colors**: Primary, secondary, accents, status indicators
- **Typography**: Font families and sizes
- **Spacing**: Scale from xs to 3xl
- **Transitions**: Timing functions for animations

### Constants (`src/config/constants.ts`)
- Tab configuration
- Keyboard shortcuts
- Validation regex patterns
- HTML entity mapping
- API polling intervals
- Log buffer sizes

## Type Safety

### Core Types (`src/types/index.ts`)
- `TabId`: Enum-like union type for tab selection
- `GpuStats`: GPU metrics structure
- `SystemMetrics`: System resource metrics
- `BuildStatus`: Build process state
- `LogEntry`: Log data structure

### Validation Schemas (`src/types/validation.ts`)
Zod schemas for runtime validation:
- Safe string validation with character limits
- Path validation preventing traversal attacks
- GPU stats schema with range validation
- Build status schema with state validation

## Security Measures

1. **Input Validation**
   - String length limits
   - Character whitelist validation
   - Type checking with Zod

2. **Output Encoding**
   - HTML entity escaping for all text display
   - Safe JSON parsing with error handling
   - Sanitized object serialization

3. **API Security**
   - Rate limiting with configurable limits
   - Request validation before processing
   - Error messages without sensitive data

4. **Session Security**
   - No sensitive data in state
   - Secure random ID generation
   - Cookie-safe data structures

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Grid layouts with responsive columns (`md:` breakpoints)
- Flexible sizing for all components
- Touch-friendly interactive elements

## State Management

- React hooks for local state
- Mock data hooks for realistic demo data
- Settings stored in component state
- Real-time updates via intervals

## Performance Optimizations

- `useMemo()` for expensive computations
- `useCallback()` for stable function references
- Component memoization for pure components
- CSS animations instead of JS for smoothness
- Circular buffer for logs to prevent memory growth

## Development Guide

### Adding a New Tab
1. Create component in `src/components/tabs/`
2. Import types from `src/types/`
3. Use base components for consistency
4. Add to `TerminalUI.tsx` render function
5. Export from `src/components/index.ts`

### Adding a New Base Component
1. Create in `src/components/base/`
2. Use theme tokens from `src/config/theme.ts`
3. Include ARIA attributes for accessibility
4. Export from `src/components/index.ts`

### Security Considerations
- Always use `escapeHtml()` for user-controlled text
- Validate input with `sanitizeInput()`
- Use `safeJsonParse()` for JSON parsing
- Prefer Zod validation for external data

## Testing

Mock data is provided via `useMockData` hooks:
- `useMockGpuStats()`: Simulates GPU metrics
- `useMockSystemMetrics()`: Simulates system stats
- `useMockBuildStatus()`: Simulates build progress
- `useMockLogs()`: Generates realistic logs

Replace these with real API calls in production.
