'use client';

import { useEffect, useState, useRef } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { io as ioClient } from 'socket.io-client';

interface LogEntry {
  pipelineName?: string;
  stepType: string;
  stepLabel: string;
  message: string;
  level: string;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // Fetch historical logs
    api.get('/logs?limit=200').then(({ data }) => {
      const formatted = data.reverse().map((l: any) => ({
        pipelineName: l.pipelineId?.name || 'Unknown',
        stepType: l.stepType,
        stepLabel: l.stepLabel,
        message: l.message,
        level: l.level,
        timestamp: l.createdAt,
      }));
      setLogs(formatted);
    }).catch(console.error);

    // Connect to Socket.IO for live logs
    const socket = ioClient('http://localhost:5001');
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('logs:new', (data: LogEntry) => {
      setLogs(prev => [...prev, data]);
    });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    if (autoScroll) logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 50);
  };

  const logColor = (level: string) => {
    if (level === 'success') return '#10b981';
    if (level === 'error') return '#ef4444';
    if (level === 'warn') return '#f59e0b';
    return '#94a3b8';
  };

  const formatTime = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString('en-US', { hour12: false }); }
    catch { return ''; }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Terminal size={24} style={{ color: '#94a3b8' }} /> Execution Logs
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Real-time streaming logs from the OpsPilot Execution Engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{
            color: isConnected ? '#10b981' : '#ef4444',
            background: isConnected ? '#10b98115' : '#ef444415',
          }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: isConnected ? '#10b981' : '#ef4444' }} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button onClick={() => setLogs([])} className="p-2 rounded-lg transition-all hover:bg-red-500/10" title="Clear logs">
            <Trash2 size={16} style={{ color: '#64748b' }} />
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ background: '#0c1021', border: '1px solid var(--border-color)' }}>
        {/* Terminal header */}
        <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#111827', borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
          </div>
          <span className="text-xs font-mono ml-2" style={{ color: '#64748b' }}>opspilot-engine ~/logs</span>
          <span className="ml-auto text-xs font-mono" style={{ color: '#64748b' }}>{logs.length} entries</span>
        </div>

        {/* Log content */}
        <div ref={containerRef} onScroll={handleScroll} className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-relaxed space-y-0.5">
          {logs.length === 0 ? (
            <>
              <div style={{ color: '#64748b' }}>$ Tail -f /var/log/opspilot/engine.log</div>
              <div style={{ color: '#64748b' }}>Waiting for pipeline executions...</div>
            </>
          ) : logs.map((log, i) => (
            <div key={i} className="flex gap-2 hover:bg-white/[0.02] px-1 rounded">
              <span style={{ color: '#475569' }} className="shrink-0 select-none text-[11px] tabular-nums">{formatTime(log.timestamp)}</span>
              <span style={{ color: '#475569' }} className="shrink-0 select-none">[{log.pipelineName || log.stepType}]</span>
              <span style={{ color: logColor(log.level) }}>{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Auto-scroll toggle */}
        {!autoScroll && logs.length > 0 && (
          <button onClick={() => { setAutoScroll(true); logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
            className="mx-4 mb-3 py-1.5 rounded-lg text-xs font-medium text-center" style={{ background: '#3b82f620', color: '#3b82f6' }}>
            ↓ Scroll to latest
          </button>
        )}
      </motion.div>
    </div>
  );
}
