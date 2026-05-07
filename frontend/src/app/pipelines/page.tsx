'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { format } from 'date-fns';
import { GitMerge, Clock, CheckCircle, XCircle, Loader2, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io as ioClient } from 'socket.io-client';

interface Pipeline {
  _id: string;
  name: string;
  prompt: string;
  status: string;
  nodes: any[];
  createdAt: string;
}

const getStatusColor = (s: string) => {
  if (s === 'success') return '#10b981';
  if (s === 'failed') return '#ef4444';
  if (s === 'running') return '#3b82f6';
  return '#64748b';
};

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/pipelines').then(({ data }) => setPipelines(data)).catch(console.error).finally(() => setIsLoading(false));
    const socket = ioClient('http://localhost:5001');
    socket.on('pipeline:globalUpdate', (d: any) => {
      setPipelines(prev => prev.map(p => p._id === d.pipelineId ? { ...p, status: d.status } : p));
    });
    return () => { socket.disconnect(); };
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Delete this pipeline?')) return;
    try { await api.delete(`/pipelines/${id}`); setPipelines(prev => prev.filter(p => p._id !== id)); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <GitMerge size={24} style={{ color: '#3b82f6' }} /> Pipelines
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Manage your AI-generated CI/CD pipelines.</p>
        </div>
        <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white btn-lift" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <Plus size={16} /> New Pipeline
        </button>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" style={{ color: '#3b82f6' }} /></div>
      ) : pipelines.length === 0 ? (
        <div className="rounded-xl p-16 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <GitMerge size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No pipelines yet. Create one from the Dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {pipelines.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] group relative"
                style={{ background: 'var(--bg-card)', border: `1px solid ${p.status === 'running' ? '#3b82f6' : 'var(--border-color)'}` }}
                onClick={() => router.push(`/pipelines/${p._id}`)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full capitalize font-medium" style={{ color: getStatusColor(p.status), background: `${getStatusColor(p.status)}15` }}>
                    {p.status === 'success' && <CheckCircle size={14} />}
                    {p.status === 'failed' && <XCircle size={14} />}
                    {p.status === 'running' && <Loader2 size={14} className="animate-spin" />}
                    {p.status === 'draft' && <Clock size={14} />}
                    {p.status}
                  </span>
                  <button onClick={(e) => handleDelete(e, p._id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:bg-red-500/10"><Trash2 size={14} style={{ color: '#ef4444' }} /></button>
                </div>
                <h3 className="font-semibold text-base mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.prompt}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.nodes?.length || 0} steps</span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><Clock size={12} />{format(new Date(p.createdAt), 'MMM d, HH:mm')}</span>
                </div>
                {p.status === 'running' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden">
                    <motion.div className="h-full w-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)' }} animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
