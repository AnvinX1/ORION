# Quick Start Guide

## 🚀 Getting Started

The Terminal UI is fully built and ready to use! The development server will start automatically in preview.

### First Time Setup
1. Code is auto-generated with all dependencies
2. Preview will automatically load at your localhost
3. The app is fully functional with mock data

## 📚 Navigation

### Keyboard Controls
- **Arrow Left/Right**: Navigate between tabs
- **ESC**: Quit application (closes panel)
- **Tab**: Focus next element
- **Enter/Space**: Activate buttons and controls

### Mouse Controls
- Click tabs to switch views
- Click buttons and form controls
- Scroll within panels for more content

## 🗂️ Folder Organization

```
src/
├── components/     - All UI components (reusable)
├── config/         - Theme, constants, configuration
├── hooks/          - Custom React hooks
├── types/          - TypeScript type definitions
└── utils/          - Utility functions (formatting, security)

app/
├── layout.tsx      - Root layout wrapper
├── page.tsx        - Main entry point
└── globals.css     - Global styles & theme
```

## 🎨 Tabs Overview

### 1. **Overview** (📊)
- System health dashboard
- GPU status overview
- Resource allocation charts
- Network activity

### 2. **Build Status** (🔨)
- Migration build progress
- Step-by-step tracking
- Build timeline
- Error reporting

### 3. **Logs** (📝)
- Real-time system logs
- Filterable by level/category
- Search functionality
- Color-coded severity

### 4. **Metrics** (📈)
- Advanced analytics
- GPU memory analysis
- Thermal performance
- Power consumption tracking

### 5. **GPU Monitor** (🖥️)
- Detailed GPU stats
- Memory utilization
- Temperature tracking
- Power usage per GPU

### 6. **Settings** (⚙️)
- Display preferences
- Refresh rate configuration
- Log level selection
- Notification settings

## 🔧 Key Components

### Base Components (Reusable)
- **TuiBox**: Container with border and title
- **ProgressBar**: Linear progress visualization
- **StatCard**: Metric display card
- **StatusBadge**: Status indicator
- **GaugeChart**: Circular progress gauge
- **CodeBlock**: Code viewer with syntax

### Layout Components
- **Header**: Top banner with status
- **TabNavigation**: Tab bar interface

## 💾 File Structure Guide

### Adding a New Tab
1. Create `src/components/tabs/NewTab.tsx`
2. Import types and base components
3. Add to `TerminalUI.tsx` render switch
4. Export from `src/components/index.ts`

### Adding a New Base Component
1. Create `src/components/base/NewComponent.tsx`
2. Use theme tokens from `src/config/theme.ts`
3. Include ARIA attributes
4. Export from `src/components/index.ts`

### Using Theme
```typescript
import { TERMINAL_THEME } from '@/config/theme';

const color = TERMINAL_THEME.colors.accent.cyan;
const spacing = TERMINAL_THEME.spacing.md;
```

## 🔐 Security Features Built-In

- ✅ XSS Prevention (HTML escaping)
- ✅ Input Sanitization (remove dangerous chars)
- ✅ Type Validation (Zod schemas)
- ✅ Rate Limiting (prevent abuse)
- ✅ Path Validation (prevent traversal)
- ✅ Safe JSON Parsing (error handling)
- ✅ Secure Random IDs (crypto API)

## 📝 Using Mock Data

Mock data is auto-generated with realistic values:

```typescript
import { useMockGpuStats, useMockSystemMetrics } from '@/hooks/useMockData';

const gpuStats = useMockGpuStats(); // Updates every 2s
const systemMetrics = useMockSystemMetrics(); // Updates every 1s
```

Replace with real API calls in production.

## 🎯 Common Tasks

### Change Color Scheme
Edit `src/config/theme.ts`:
```typescript
export const TERMINAL_THEME = {
  colors: {
    accent: {
      cyan: '#00d4ff', // Change this
    },
    // ...
  },
};
```

### Add New Metric to Overview
1. Edit `src/components/tabs/OverviewTab.tsx`
2. Add StatCard component with new data
3. Use formatting utility from `src/utils/format.ts`

### Customize Log Levels
1. Edit `src/config/constants.ts`
2. Update log level in `APP_CONFIG`
3. Adjust colors in `LogsTab.tsx`

### Adjust Update Intervals
In `src/config/constants.ts`:
```typescript
UPDATE_INTERVALS: {
  GPU_STATS: 1000,       // Change GPU update rate
  BUILD_STATUS: 2000,    // Change build update rate
  SYSTEM_METRICS: 3000,  // Change system update rate
}
```

## 🧪 Testing

All components work with mock data by default:
- GPU stats update every 2 seconds
- System metrics update every second
- Build progress advances automatically
- Logs are generated continuously
- All settings are functional

## 📱 Responsive Design

- Works on desktop, tablet, mobile
- Grid layouts adapt to screen size
- Touch-friendly on mobile devices
- Optimized for terminal-like viewing

## ⚡ Performance

- Memoized components prevent re-renders
- CSS transitions for smooth animations
- Circular log buffer prevents memory leaks
- Efficient state management

## 🐛 Debugging

Console logging with `[v0]` prefix for tracking:
```typescript
console.log('[v0] Component mounted:', props);
```

Check browser DevTools for:
- Component renders
- State updates
- Hook calls
- Performance timeline

## 📚 Additional Resources

- `ARCHITECTURE.md`: Detailed architecture guide
- `SECURITY.md`: Security implementation details
- `PROJECT_SUMMARY.md`: Full feature overview

## 🎓 Learning Path

1. Start with `src/components/TerminalUI.tsx` - See main orchestration
2. Check `src/components/base/` - Understand atomic components
3. Look at `src/config/theme.ts` - Learn theming system
4. Study `src/utils/security.ts` - Understand security approach
5. Review type system in `src/types/` - See validation schemas

## 🚀 Next Steps

### For Development
1. Replace mock data with real API calls
2. Add authentication layer
3. Connect to real GPU monitoring
4. Implement persistent storage
5. Add more advanced analytics

### For Production
1. Set up HTTPS/SSL
2. Implement authentication & authorization
3. Add rate limiting at API level
4. Set up monitoring & logging
5. Performance optimization
6. Security audit & penetration testing

## 💡 Tips

- Use Ctrl+Shift+I to open DevTools
- Check the footer for system status
- Settings persist only in session (add localStorage if needed)
- Mock data uses realistic ranges for testing
- All components are fully keyboard accessible

## 🤝 Customization

### Adjust Theme
- Edit `src/config/theme.ts` for colors
- Edit `app/globals.css` for global styles
- Update Tailwind config for breakpoints

### Add New Statistics
1. Create type in `src/types/`
2. Add validation schema in `src/types/validation.ts`
3. Create formatting utility in `src/utils/format.ts`
4. Add StatCard in appropriate tab
5. Wire up data from mock or API

### Enhance Components
- Add props for customization
- Update TypeScript types
- Use theme tokens for colors
- Include ARIA attributes
- Test responsiveness

---

**Ready to explore? Start with the Overview tab to see the dashboard in action!**
