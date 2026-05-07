'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, Loader2, GitMerge, CheckCircle, XCircle, Activity, Shield, Clock, ArrowRight, Github, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { format } from 'date-fns';

interface Stats {
  totalPipelines: number;
  successCount: number;
  failedCount: number;
  runningCount: number;
  draftCount: number;
  securityScans: number;
  successRate: number;
  recentPipelines: any[];
}

const statCards = [
  { key: 'totalPipelines', label: 'Total Pipelines', icon: GitMerge, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { key: 'successRate', label: 'Success Rate', icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', suffix: '%' },
  { key: 'runningCount', label: 'Active Runs', icon: Activity, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { key: 'securityScans', label: 'Security Scans', icon: Shield, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get('/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const { data } = await api.post('/pipelines', {
        name: `Pipeline-${Math.floor(Math.random() * 10000)}`,
        prompt,
        githubRepo: githubRepo.trim(),
        githubBranch: githubBranch.trim() || 'main',
      });
      router.push(`/pipelines/${data._id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate AI pipeline.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'success') return '#10b981';
    if (status === 'failed') return '#ef4444';
    if (status === 'running') return '#3b82f6';
    return '#64748b';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = stats ? (stats as any)[card.key] : '—';
          return (
            <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ background: card.bg }}><Icon size={20} style={{ color: card.color }} /></div>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}{card.suffix || ''}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Prompt Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
             style={{ background: 'var(--gradient-glow)' }} />

        <div className="relative z-10 text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
               style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Bot size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 gradient-text">AI Pipeline Generator</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="max-w-lg mx-auto">
            Describe your deployment needs in plain English. OpsPilot will generate and execute a secure CI/CD pipeline.
          </p>
        </div>

        {/* GitHub Repo Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 max-w-2xl mx-auto relative z-10">
          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Github size={12} /> GitHub Repository (optional)
            </label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full rounded-xl px-4 py-2.5 text-sm transition-all"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <GitBranch size={12} /> Branch
            </label>
            <input
              type="text"
              value={githubBranch}
              onChange={(e) => setGithubBranch(e.target.value)}
              placeholder="main"
              className="w-full rounded-xl px-4 py-2.5 text-sm transition-all"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-w-2xl mx-auto relative z-10">
          {[
            "Deploy my app to AWS ECS with security scanning",
            "Run SonarQube and Trivy security scan on my codebase",
            "Build and deploy my Python Flask app with Docker",
            "CI/CD pipeline for a monitoring",
          ].map((example) => (
            <button key={example} onClick={() => setPrompt(example)}
              className="text-left p-3 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01]"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }} className="text-xs">Example →</span><br />
              <span style={{ color: 'var(--text-primary)' }}>"{example}"</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto z-10">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Deploy my React app to AWS with Docker and security scans..."
            className="w-full resize-none rounded-xl p-4 pr-14 text-sm min-h-[56px] max-h-[150px] transition-all duration-200"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            rows={1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
          />
          <button type="submit" disabled={!prompt.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2.5 rounded-lg transition-all duration-200 disabled:opacity-30 btn-lift"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Send className="h-5 w-5 text-white" />}
          </button>
        </form>
        <p className="text-center text-xs mt-3 flex items-center justify-center gap-1 relative z-10" style={{ color: 'var(--text-muted)' }}>
          <Bot size={12} /> OpsPilot uses AI to generate pipelines. Always verify before production deployment.
        </p>
      </motion.div>

      {/* Recent Pipelines */}
      {stats && stats.recentPipelines.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Pipelines</h2>
            <button onClick={() => router.push('/pipelines')} className="text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--accent-blue)' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentPipelines.map((pipeline: any, i: number) => (
              <motion.div key={pipeline._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                onClick={() => router.push(`/pipelines/${pipeline._id}`)}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{pipeline.name}</h3>
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{ color: getStatusColor(pipeline.status), background: `${getStatusColor(pipeline.status)}15` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: getStatusColor(pipeline.status) }} />{pipeline.status}
                  </span>
                </div>
                <p className="text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>{pipeline.prompt}</p>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={12} />{format(new Date(pipeline.createdAt), 'MMM d, HH:mm')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
