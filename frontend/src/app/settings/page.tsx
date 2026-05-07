'use client';

import { Settings, Server, Key, Shield, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Settings size={24} style={{ color: '#94a3b8' }} /> Settings
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Configure your OpsPilot environment.</p>
      </motion.div>

      {/* System Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Info size={18} style={{ color: '#3b82f6' }} /> System Information
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Version', value: 'OpsPilot v2.0.0' },
            { label: 'Backend', value: 'Express.js + TypeScript' },
            { label: 'Database', value: 'MongoDB (Mongoose)' },
            { label: 'AI Engine', value: 'Google Gemini 2.5 Flash' },
            { label: 'Real-time', value: 'Socket.IO v4' },
            { label: 'Frontend', value: 'Next.js 16 + React 19' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* API Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Key size={18} style={{ color: '#f59e0b' }} /> API Configuration
        </h2>
        <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Gemini API Key</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f59e0b15', color: '#f59e0b' }}>Backend .env</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Set <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#1e293b', color: '#94a3b8' }}>GEMINI_API_KEY</code> in your backend .env file. When not set, OpsPilot uses an intelligent mock pipeline generator.
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Backend URL</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: '#10b98115', color: '#10b981' }}>http://localhost:5001</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            API base URL configured via <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#1e293b', color: '#94a3b8' }}>NEXT_PUBLIC_API_URL</code> environment variable.
          </p>
        </div>
      </motion.div>

      {/* Security Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Shield size={18} style={{ color: '#8b5cf6' }} /> DevSecOps Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'SonarQube Scanning', desc: 'Static code analysis for vulnerabilities', enabled: true },
            { name: 'Trivy Container Scan', desc: 'Docker image CVE detection', enabled: true },
            { name: 'Automated CI/CD', desc: 'AI-generated pipeline execution', enabled: true },
            { name: 'Real-time Monitoring', desc: 'Live WebSocket log streaming', enabled: true },
          ].map((feature) => (
            <div key={feature.name} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: feature.enabled ? '#10b981' : '#ef4444' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{feature.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Server Config */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Server size={18} style={{ color: '#06b6d4' }} /> Server Configuration
        </h2>
        <div className="font-mono text-[13px] p-4 rounded-lg space-y-1" style={{ background: '#0c1021', color: '#94a3b8' }}>
          <div><span style={{ color: '#64748b' }}># Backend .env</span></div>
          <div><span style={{ color: '#10b981' }}>PORT</span>=<span style={{ color: '#f59e0b' }}>5001</span></div>
          <div><span style={{ color: '#10b981' }}>FRONTEND_URL</span>=<span style={{ color: '#f59e0b' }}>http://localhost:3000</span></div>
          <div><span style={{ color: '#10b981' }}>MONGODB_URI</span>=<span style={{ color: '#f59e0b' }}>mongodb://localhost:27017/opspilot</span></div>
          <div><span style={{ color: '#10b981' }}>JWT_SECRET</span>=<span style={{ color: '#f59e0b' }}>your_secret_key</span></div>
          <div><span style={{ color: '#10b981' }}>GEMINI_API_KEY</span>=<span style={{ color: '#64748b' }}># optional</span></div>
        </div>
      </motion.div>
    </div>
  );
}
