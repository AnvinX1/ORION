'use client';

import React, { useState, useMemo } from 'react';
import { LogEntry } from '@/types';
import { TuiBox } from '@/components/base/TuiBox';
import { TERMINAL_THEME as T } from '@/config/theme';
import { formatDateTime } from '@/utils/format';
import { sanitizeInput } from '@/utils/security';

interface LogsTabProps {
  logs: LogEntry[];
}

type LogLevel = LogEntry['level'];

const LEVEL_COLOR: Record<LogLevel, string> = {
  error:   '#ffffff',
  warn:    '#888888',
  info:    '#555555',
  debug:   '#333333',
  success: '#aaaaaa',
};

const LEVEL_PREFIX: Record<LogLevel, string> = {
  error:   'ERR',
  warn:    'WRN',
  info:    'INF',
  debug:   'DBG',
  success: ' OK',
};

export const LogsTab: React.FC<LogsTabProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    let filtered = logs;
    if (filterLevel !== 'all') filtered = filtered.filter(l => l.level === filterLevel);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      filtered = filtered.filter(l =>
        l.message.toLowerCase().includes(t) ||
        l.category.toLowerCase().includes(t) ||
        l.source.toLowerCase().includes(t)
      );
    }
    return filtered.slice().sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, filterLevel, searchTerm]);

  const counts = useMemo(() => {
    const c = { error: 0, warn: 0, info: 0, debug: 0, success: 0 };
    logs.forEach(l => { c[l.level]++ });
    return c;
  }, [logs]);

  return (
    <div
      className="flex h-full overflow-hidden p-1 gap-1"
      role="tabpanel"
      id="panel-logs"
      style={{ backgroundColor: '#080808' }}
    >
      {/* ── LEFT: filters + summary ── */}
      <div className="flex flex-col gap-2" style={{ width: '220px', minWidth: 0, flexShrink: 0 }}>

        <TuiBox title="Filter" variant="compact" padding="sm">
          <div className="space-y-1.5">
            <div>
              <div className="text-xs mb-1" style={{ color: T.colors.textTertiary }}>level</div>
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value as LogLevel | 'all')}
                className="w-full px-1 py-0.5 font-mono text-xs border"
                style={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: T.colors.textSecondary }}
              >
                <option value="all">all</option>
                <option value="error">error</option>
                <option value="warn">warn</option>
                <option value="info">info</option>
                <option value="success">success</option>
                <option value="debug">debug</option>
              </select>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: T.colors.textTertiary }}>search</div>
              <input
                type="text"
                placeholder="filter..."
                value={searchTerm}
                onChange={e => setSearchTerm(sanitizeInput(e.target.value))}
                className="w-full px-1 py-0.5 font-mono text-xs border"
                style={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: T.colors.textSecondary }}
              />
            </div>
            <div className="text-xs" style={{ color: T.colors.textTertiary }}>
              {filteredLogs.length} / {logs.length}
            </div>
          </div>
        </TuiBox>

        <TuiBox title="Summary" padding="sm">
          <div className="space-y-0.5 text-xs">
            {(['error', 'warn', 'success', 'info', 'debug'] as LogLevel[]).map(lvl => (
              <div key={lvl} className="flex justify-between">
                <span style={{ color: LEVEL_COLOR[lvl] }}>{LEVEL_PREFIX[lvl]}</span>
                <span style={{ color: T.colors.textTertiary }}>{counts[lvl]}</span>
              </div>
            ))}
          </div>
        </TuiBox>

        <TuiBox title="Categories" padding="sm">
          <div className="space-y-0.5 text-xs" style={{ color: T.colors.textTertiary }}>
            {Array.from(new Set(logs.map(l => l.category))).map(cat => (
              <div key={cat}
                className="cursor-pointer hover:text-white"
                onClick={() => setSearchTerm(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </TuiBox>

      </div>

      {/* ── RIGHT: log entries ── */}
      <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
        <TuiBox title="Diagnostic Log" subtitle="newest first" padding="sm" className="h-full overflow-y-auto">
          <div className="space-y-0 font-mono text-xs">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className="flex gap-2 py-0.5 border-b"
                style={{ borderColor: '#161616' }}
              >
                <span className="shrink-0" style={{ color: T.colors.textTertiary }}>
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="shrink-0 font-bold" style={{ color: LEVEL_COLOR[log.level] }}>
                  {LEVEL_PREFIX[log.level]}
                </span>
                <span className="shrink-0" style={{ color: '#555555' }}>
                  [{log.category}]
                </span>
                <span style={{ color: log.level === 'error' ? '#ffffff' : log.level === 'warn' ? '#999999' : T.colors.textSecondary }}>
                  {log.message}
                </span>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div style={{ color: T.colors.textTertiary }}>— no entries match filter —</div>
            )}
          </div>
        </TuiBox>
      </div>
    </div>
  );
};
