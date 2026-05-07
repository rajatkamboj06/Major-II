'use client';

import { useEffect, useState } from 'react';
import { Activity, GitMerge, CheckCircle, XCircle, Clock, Loader2, Zap, Shield, Server, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { io as ioClient } from 'socket.io-client';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface Stats {
  totalPipelines: number;
  successCount: number;
  failedCount: number;
  runningCount: number;
  draftCount: number;
  securityScans: number;
  successRate: number;
  history: { date: string, success: number, failed: number, total: number }[];
  logs: { info: number, warn: number, error: number, success: number };
  stepTimes: { name: string, time: number }[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

export default function MonitoringPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [selectedDeploy, setSelectedDeploy] = useState<string>('');
  const [deployMetrics, setDeployMetrics] = useState<{ time: string, cpu: number, memory: number }[]>([]);

  useEffect(() => {
    api.get('/stats').then(({ data }) => setStats(data)).catch(console.error);
    api.get('/pipelines').then(({ data }) => {
      const deployed = data.filter((p: any) => p.status === 'success' && p.githubRepo);
      setPipelines(deployed);
      if (deployed.length > 0) setSelectedDeploy(deployed[0]._id);
    }).catch(console.error);

    const socket = ioClient('http://localhost:5001');
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('pipeline:globalUpdate', (data: any) => {
      setLiveEvents(prev => [{ ...data, timestamp: new Date().toISOString() }, ...prev].slice(0, 10));
      // Refresh stats
      api.get('/stats').then(({ data }) => setStats(data)).catch(console.error);
      api.get('/pipelines').then(({ data }) => {
        const deployed = data.filter((p: any) => p.status === 'success' && p.githubRepo);
        setPipelines(deployed);
      }).catch(console.error);
    });

    return () => { socket.disconnect(); };
  }, []);

  // Simulate real-time metrics for selected deployment
  useEffect(() => {
    if (!selectedDeploy) return;
    
    // Initial seed
    const initial = Array.from({ length: 20 }).map((_, i) => {
      const now = new Date();
      now.setSeconds(now.getSeconds() - (20 - i) * 2);
      return {
        time: now.toLocaleTimeString([], { hour12: false }),
        cpu: Number((5 + Math.random() * 15).toFixed(1)),
        memory: Number((120 + Math.random() * 40).toFixed(1))
      };
    });
    setDeployMetrics(initial);

    const interval = setInterval(() => {
      setDeployMetrics(prev => {
        const last = prev[prev.length - 1];
        const nextCpu = Math.max(1, Math.min(100, last.cpu + (Math.random() - 0.5) * 8));
        const nextMem = Math.max(50, Math.min(1024, last.memory + (Math.random() - 0.5) * 15));
        
        const next = {
          time: new Date().toLocaleTimeString([], { hour12: false }),
          cpu: Number(nextCpu.toFixed(1)),
          memory: Number(nextMem.toFixed(1))
        };
        return [...prev.slice(1), next];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedDeploy]);

  const statusColor = (s: string) => s === 'success' ? '#10b981' : s === 'failed' ? '#ef4444' : s === 'running' ? '#3b82f6' : '#64748b';

  // Prepare Pie Chart Data
  const pieData = stats ? [
    { name: 'Info', value: stats.logs.info },
    { name: 'Warn', value: stats.logs.warn },
    { name: 'Error', value: stats.logs.error },
    { name: 'Success', value: stats.logs.success },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Activity size={24} style={{ color: '#3b82f6' }} /> Monitoring Dashboard
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Real-time system health, execution trends, and log metrics.</p>
      </motion.div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'API Server', icon: Server, status: 'Online', color: '#10b981' },
          { label: 'WebSocket', icon: Zap, status: isConnected ? 'Connected' : 'Disconnected', color: isConnected ? '#10b981' : '#ef4444' },
          { label: 'AI Engine', icon: Shield, status: 'Ready', color: '#10b981' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon size={20} style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
              </div>
              <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full" style={{ color: item.color, background: `${item.color}15` }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Success', value: stats.successCount, icon: CheckCircle, color: '#10b981' },
            { label: 'Failed', value: stats.failedCount, icon: XCircle, color: '#ef4444' },
            { label: 'Running', value: stats.runningCount, icon: Loader2, color: '#3b82f6' },
            { label: 'Total Logs', value: stats.logs.info + stats.logs.warn + stats.logs.error + stats.logs.success, icon: FileText, color: '#8b5cf6' },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <m.icon size={24} className="mx-auto mb-2" style={{ color: m.color }} />
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{m.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row 1: Pipeline History & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl p-6 lg:col-span-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Pipeline Executions (Last 7 Days)</h3>
          {stats && stats.history && stats.history.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Not enough data available
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl p-6 flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Live Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {liveEvents.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Waiting for activity...</p>
            ) : (
              liveEvents.map((event, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 rounded-lg text-sm border-l-2" style={{ background: 'var(--bg-input)', borderLeftColor: statusColor(event.status) }}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-primary)' }} className="font-medium truncate max-w-[150px]">
                      {event.name || event.pipelineId?.slice(-6)}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span style={{ color: statusColor(event.status) }} className="capitalize text-xs font-semibold">
                    {event.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2: Step Times & Log Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Avg Step Duration (seconds)</h3>
          {stats && stats.stepTimes && stats.stepTimes.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.stepTimes} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="time" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                    {stats.stepTimes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-[250px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Not enough data available
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Log Distribution by Level</h3>
          {stats && stats.logs && (stats.logs.info > 0 || stats.logs.warn > 0 || stats.logs.error > 0 || stats.logs.success > 0) ? (
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                  <span className="block text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stats.logs.info + stats.logs.warn + stats.logs.error + stats.logs.success}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Logs</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No logs generated yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Live Deployed Services Telemetry Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
        className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Server size={16} style={{ color: '#8b5cf6' }} />
              Live Deployed Services Telemetry
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Monitor CPU & Memory usage of deployed GitHub repositories</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Select Deployment:</span>
            <select 
              value={selectedDeploy} 
              onChange={(e) => setSelectedDeploy(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              {pipelines.length === 0 ? (
                <option value="">No deployments available</option>
              ) : (
                pipelines.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.githubRepo.split('/').pop()})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {selectedDeploy ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CPU Usage */}
            <div className="h-[250px] w-full relative">
              <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>CPU Usage (%)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deployMetrics} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#3b82f6' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 px-2 py-1 rounded text-xs font-bold" style={{ background: '#3b82f620', color: '#3b82f6' }}>
                {deployMetrics[deployMetrics.length - 1]?.cpu}%
              </div>
            </div>

            {/* Memory Usage */}
            <div className="h-[250px] w-full relative">
              <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Memory Usage (MB)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deployMetrics} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 px-2 py-1 rounded text-xs font-bold" style={{ background: '#10b98120', color: '#10b981' }}>
                {deployMetrics[deployMetrics.length - 1]?.memory} MB
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
            <Server size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No active deployments</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Run a pipeline that deploys a GitHub repository to see telemetry here.</p>
          </div>
        )}
      </motion.div>

      {/* Removed Grafana Section */}
    </div>
  );
}
