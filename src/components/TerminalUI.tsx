'use client';

import React, { useState, useCallback } from 'react';
import type { TabItem } from '@/components/layout/TabNavigation';
import { Header } from '@/components/layout/Header';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { BuildStatusTab } from '@/components/tabs/BuildStatusTab';
import { LogsTab } from '@/components/tabs/LogsTab';
import { MetricsTab } from '@/components/tabs/MetricsTab';
import { GpuMonitorTab } from '@/components/tabs/GpuMonitorTab';
import { SettingsTab } from '@/components/tabs/SettingsTab';
import { TERMINAL_THEME } from '@/config/theme';
import { APP_CONFIG } from '@/config/constants';
import { useMockGpuStats, useMockSystemMetrics, useMockBuildStatus, useMockLogs, useMockConversionStats, useMockApiTable, useMockRegressionData } from '@/hooks/useMockData';

export const TerminalUI: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('overview');

  const gpuStats = useMockGpuStats();
  const systemMetrics = useMockSystemMetrics();
  const buildStatus = useMockBuildStatus();
  const logs = useMockLogs();
  const conversionStats = useMockConversionStats();
  const apiTable = useMockApiTable();
  const regressionData = useMockRegressionData();

  const tabs: TabItem[] = APP_CONFIG.tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
  }));

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const renderTabContent = () => {
    switch (activeTabId) {
      case 'overview':
        return <OverviewTab conversionStats={conversionStats} buildStatus={buildStatus} />;
      case 'build':
        return <BuildStatusTab buildStatus={buildStatus} />;
      case 'logs':
        return <LogsTab logs={logs} />;
      case 'metrics':
        return <MetricsTab regressionData={regressionData} />;
      case 'gpu':
        return <GpuMonitorTab apiTable={apiTable} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab conversionStats={conversionStats} buildStatus={buildStatus} />;
    }
  };

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#0d1117', fontFamily: '"JetBrains Mono","Fira Code",monospace' }}
    >
      <Header
        title="Orion"
        statusIndicator={{
          status: buildStatus.status === 'building' ? 'busy' : 'online',
          label: buildStatus.status.toUpperCase(),
        }}
        showTimestamp
      />

      <TabNavigation
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
      />

      {/* open-source welcome bar */}
      <div
        className="font-mono text-xs px-3 py-0.5 select-none shrink-0"
        style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1e1e1e', color: '#333333', letterSpacing: '0.04em' }}
      >
        ◆ welcome to <span style={{ color: '#666666' }}>orion</span> — open source CUDA→HIP migration monitor &nbsp;·&nbsp; contributions welcome at <span style={{ color: '#555555' }}>github.com/orion-hip</span>
      </div>

      <main
        className="flex-1 overflow-hidden"
        style={{ backgroundColor: '#0d1117' }}
        role="main"
      >
        {renderTabContent()}
      </main>

      <footer
        className="font-mono text-xs px-2 py-0.5 flex justify-between items-center select-none shrink-0"
        style={{
          backgroundColor: '#0d1117',
          borderTop: `1px solid #4a5568`,
          color: TERMINAL_THEME.colors.textTertiary,
        }}
      >
        <span>
          {gpuStats.length} GPU{gpuStats.length !== 1 ? 's' : ''} ·{' '}
          CPU{' '}
          <span style={{ color: systemMetrics.cpu > 80 ? TERMINAL_THEME.colors.status.error : TERMINAL_THEME.colors.accent.lime }}>
            {Math.round(systemMetrics.cpu)}%
          </span>{' '}
          · MEM{' '}
          <span style={{ color: systemMetrics.memory > 80 ? TERMINAL_THEME.colors.status.error : TERMINAL_THEME.colors.accent.cyan }}>
            {Math.round(systemMetrics.memory)}%
          </span>
        </span>
        <span style={{ color: '#444444' }}>★ open source · welcome, contributor · orion v1.0 · q quit</span>
      </footer>
    </div>
  );
};
