'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, Clock, Loader2, XCircle, ArrowLeft, RotateCcw, Trash2, FileBarChart, Github, GitBranch, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { io as ioClient, Socket } from 'socket.io-client';
import ReportModal from '@/components/ReportModal';

interface LogEntry { stepIndex: number; stepType: string; stepLabel: string; message: string; level: string; timestamp: string; }

// Step types that generate reports
const REPORT_STEP_TYPES = ['sonarqube_scan', 'snyk_scan', 'trivy_scan', 'docker_build', 'npm_install', 'pytest_run', 'aws_ecs_deploy', 'aws_ec2_deploy'];

export default function PipelineDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pipeline, setPipeline] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [stepsWithReports, setStepsWithReports] = useState<Set<number>>(new Set());
  const [reportModal, setReportModal] = useState<{ stepIndex: number; stepType: string } | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [pipeRes, logRes, reportRes] = await Promise.all([
          api.get(`/pipelines/${id}`),
          api.get(`/logs/pipeline/${id}`),
          api.get(`/reports/${id}`),
        ]);
        setPipeline(pipeRes.data);
        setLogs(logRes.data);
        if (pipeRes.data.status === 'success') {
          const allSteps = new Set<number>();
          pipeRes.data.nodes.forEach((_: any, i: number) => allSteps.add(i));
          setCompletedSteps(allSteps);
        }
        // Mark steps that have reports
        if (reportRes.data && reportRes.data.length > 0) {
          const rSet = new Set<number>();
          reportRes.data.forEach((r: any) => rSet.add(r.stepIndex));
          setStepsWithReports(rSet);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();

    const socket = ioClient('http://localhost:5001');
    socketRef.current = socket;
    socket.emit('pipeline:join', id);

    socket.on('pipeline:status', (d: any) => {
      setPipeline((prev: any) => prev ? { ...prev, status: d.status } : prev);
      if (d.status === 'success') {
        setPipeline((prev: any) => {
          if (prev) {
            const allSteps = new Set<number>();
            prev.nodes.forEach((_: any, i: number) => allSteps.add(i));
            setCompletedSteps(allSteps);
          }
          return prev;
        });
      }
    });
    socket.on('pipeline:log', (d: LogEntry) => { setLogs(prev => [...prev, d]); });
    socket.on('pipeline:stepStart', (d: any) => { setActiveStep(d.stepIndex); });
    socket.on('pipeline:stepComplete', (d: any) => {
      setCompletedSteps(prev => new Set(prev).add(d.stepIndex));
      if (d.hasReport) {
        setStepsWithReports(prev => new Set(prev).add(d.stepIndex));
      }
    });
    socket.on('pipeline:reportReady', (d: any) => {
      setStepsWithReports(prev => new Set(prev).add(d.stepIndex));
    });

    return () => { socket.emit('pipeline:leave', id); socket.disconnect(); };
  }, [id]);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const handleRerun = async () => {
    try {
      setLogs([]); setCompletedSteps(new Set()); setActiveStep(-1); setStepsWithReports(new Set());
      const { data } = await api.post(`/pipelines/${id}/rerun`);
      setPipeline(data);
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this pipeline?')) return;
    try { await api.delete(`/pipelines/${id}`); router.push('/pipelines'); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const statusColor = (s: string) => s === 'success' ? '#10b981' : s === 'failed' ? '#ef4444' : s === 'running' ? '#3b82f6' : '#64748b';
  const logColor = (l: string) => l === 'success' ? '#10b981' : l === 'error' ? '#ef4444' : l === 'warn' ? '#f59e0b' : '#94a3b8';

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin" style={{ color: '#3b82f6' }} /></div>;
  if (!pipeline) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Pipeline not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.push('/pipelines')} className="flex items-center gap-1 text-sm mb-3 hover:gap-2 transition-all" style={{ color: '#3b82f6' }}>
          <ArrowLeft size={14} /> Back to Pipelines
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{pipeline.name}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Prompt: "{pipeline.prompt}"</p>
            {pipeline.githubRepo && (
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <Github size={12} /> {pipeline.githubRepo}
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <GitBranch size={12} /> {pipeline.githubBranch || 'main'}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {pipeline.status === 'success' && (
              <a href={`http://localhost:5001/live/${pipeline._id}/`} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 btn-lift"
                 style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 4px 14px 0 rgba(16,185,129,0.39)' }}>
                🚀 View Live App <ExternalLink size={14} />
              </a>
            )}
            <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold capitalize" style={{ color: statusColor(pipeline.status), background: `${statusColor(pipeline.status)}15`, border: `1px solid ${statusColor(pipeline.status)}30` }}>
              {pipeline.status === 'success' && <CheckCircle size={16} />}
              {pipeline.status === 'running' && <Loader2 size={16} className="animate-spin" />}
              {pipeline.status === 'failed' && <XCircle size={16} />}
              {pipeline.status === 'draft' && <Clock size={16} />}
              {pipeline.status}
            </span>
            <button onClick={handleRerun} disabled={pipeline.status === 'running'} className="p-2.5 rounded-xl transition-all disabled:opacity-30 hover:bg-blue-500/10" title="Re-run">
              <RotateCcw size={18} style={{ color: '#3b82f6' }} />
            </button>
            <button onClick={handleDelete} disabled={pipeline.status === 'running'} className="p-2.5 rounded-xl transition-all disabled:opacity-30 hover:bg-red-500/10" title="Delete">
              <Trash2 size={18} style={{ color: '#ef4444' }} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Steps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Pipeline Workflow</h2>
        <div className="flex flex-col gap-1">
          {pipeline.nodes.map((node: any, i: number) => {
            const isCompleted = completedSteps.has(i);
            const isActive = activeStep === i && pipeline.status === 'running';
            const hasReport = stepsWithReports.has(i);
            const canHaveReport = REPORT_STEP_TYPES.includes(node.type);
            return (
              <div key={node.id}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all" style={{
                    background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                  }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: isCompleted ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(59,130,246,0.15)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${isCompleted ? '#10b98130' : isActive ? '#3b82f630' : '#64748b20'}`,
                  }}>
                    {isCompleted ? <CheckCircle size={20} style={{ color: '#10b981' }} /> :
                     isActive ? <Loader2 size={20} className="animate-spin" style={{ color: '#3b82f6' }} /> :
                     <span className="text-sm font-bold" style={{ color: '#64748b' }}>{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#64748b' }}>
                      Step {i + 1} • {node.type}
                    </span>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{node.data?.label || node.type}</p>
                  </div>
                  {/* View Report Button */}
                  {isCompleted && hasReport && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setReportModal({ stepIndex: i, stepType: node.type })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 btn-lift"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}
                    >
                      <FileBarChart size={14} /> View Report
                    </motion.button>
                  )}
                  {isCompleted && canHaveReport && !hasReport && (
                    <span className="text-[10px] px-2 py-1 rounded-lg" style={{ color: 'var(--text-muted)', background: 'var(--bg-input)' }}>
                      Generating...
                    </span>
                  )}
                  {isActive && <div className="w-2 h-2 rounded-full pulse-running" style={{ background: '#3b82f6' }} />}
                </motion.div>
                {i < pipeline.nodes.length - 1 && <div className="ml-[1.7rem] w-0.5 h-3 rounded-full" style={{ background: isCompleted ? '#10b98140' : '#64748b20' }} />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Live Logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl overflow-hidden" style={{ background: '#0c1021', border: '1px solid var(--border-color)' }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#111827', borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
          </div>
          <span className="text-xs font-mono ml-2" style={{ color: '#64748b' }}>execution-logs — {pipeline.name}</span>
          {pipeline.status === 'running' && <span className="ml-auto text-xs px-2 py-0.5 rounded-full animate-pulse" style={{ color: '#3b82f6', background: '#3b82f615' }}>● LIVE</span>}
        </div>
        <div className="p-4 max-h-80 overflow-y-auto font-mono text-[13px] leading-relaxed space-y-1">
          {logs.length === 0 ? (
            <div style={{ color: '#64748b' }}>Waiting for execution logs...</div>
          ) : logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span style={{ color: '#64748b' }} className="shrink-0 select-none">[{log.stepType}]</span>
              <span style={{ color: logColor(log.level) }}>{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </motion.div>

      {/* Report Modal */}
      {reportModal && (
        <ReportModal
          pipelineId={id as string}
          stepIndex={reportModal.stepIndex}
          stepType={reportModal.stepType}
          onClose={() => setReportModal(null)}
        />
      )}
    </div>
  );
}
