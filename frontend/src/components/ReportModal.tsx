'use client';

import { useEffect, useState } from 'react';
import { X, Shield, AlertTriangle, AlertCircle, Info, CheckCircle, FileText, Package, Server, Bug, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface ReportModalProps {
  pipelineId: string;
  stepIndex: number;
  stepType: string;
  onClose: () => void;
}

const severityConfig: Record<string, { color: string; bg: string; icon: any }> = {
  critical: { color: '#ef4444', bg: '#ef444415', icon: AlertCircle },
  high: { color: '#f97316', bg: '#f9731615', icon: AlertTriangle },
  medium: { color: '#f59e0b', bg: '#f59e0b15', icon: AlertTriangle },
  low: { color: '#3b82f6', bg: '#3b82f615', icon: Info },
  info: { color: '#64748b', bg: '#64748b15', icon: Info },
};

const reportLabels: Record<string, { title: string; icon: any }> = {
  sonarqube: { title: 'SonarQube Analysis Report', icon: Code },
  trivy: { title: 'Trivy Vulnerability Report', icon: Shield },
  snyk: { title: 'Snyk Dependency Report', icon: Bug },
  docker_build: { title: 'Docker Build Report', icon: Package },
  npm_audit: { title: 'NPM Dependency Audit', icon: Bug },
  test_coverage: { title: 'Test Coverage Report', icon: CheckCircle },
  deployment: { title: 'Deployment Report', icon: Server },
};

export default function ReportModal({ pipelineId, stepIndex, stepType, onClose }: ReportModalProps) {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/reports/${pipelineId}/${stepIndex}`)
      .then(({ data }) => setReport(data))
      .catch(() => setReport(null))
      .finally(() => setIsLoading(false));
  }, [pipelineId, stepIndex]);

  const label = reportLabels[report?.reportType] || { title: 'Step Report', icon: FileText };
  const ReportIcon = label.icon;

  const statusColor = (s: string) => s === 'passed' ? '#10b981' : s === 'failed' ? '#ef4444' : '#f59e0b';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                <ReportIcon size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{label.title}</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Step {stepIndex + 1} • {stepType}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-all">
              <X size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 rounded-full" style={{ borderColor: 'var(--border-color)', borderTopColor: '#3b82f6' }} />
            </div>
          ) : !report ? (
            <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No report available for this step.</div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Summary Bar */}
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold uppercase" style={{ color: statusColor(report.summary.status), background: `${statusColor(report.summary.status)}15` }}>
                  {report.summary.status}
                </span>
                {report.summary.totalFindings > 0 && (
                  <div className="flex items-center gap-3 ml-auto">
                    {report.summary.critical > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#ef4444', background: '#ef444415' }}>{report.summary.critical} Critical</span>}
                    {report.summary.high > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#f97316', background: '#f9731615' }}>{report.summary.high} High</span>}
                    {report.summary.medium > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#f59e0b', background: '#f59e0b15' }}>{report.summary.medium} Medium</span>}
                    {report.summary.low > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#3b82f6', background: '#3b82f615' }}>{report.summary.low} Low</span>}
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              {report.metrics && (
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(report.metrics).filter(([, v]) => typeof v !== 'object').map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{String(value)}</p>
                      </div>
                    ))}
                    {/* Coverage sub-object for test reports */}
                    {report.metrics.coverage && typeof report.metrics.coverage === 'object' && Object.entries(report.metrics.coverage).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{key} Coverage</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold" style={{ color: '#10b981' }}>{String(value)}%</p>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                            <div className="h-full rounded-full" style={{ width: `${value}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings Table */}
              {report.findings && report.findings.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Findings ({report.findings.length})
                  </h3>
                  <div className="space-y-2">
                    {report.findings.map((finding: any, i: number) => {
                      const sev = severityConfig[finding.severity] || severityConfig.info;
                      const SevIcon = sev.icon;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                          className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded-lg mt-0.5" style={{ background: sev.bg }}>
                              <SevIcon size={14} style={{ color: sev.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: sev.color, background: sev.bg }}>
                                  {finding.severity}
                                </span>
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{finding.title}</span>
                              </div>
                              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{finding.description}</p>
                              <div className="flex flex-wrap gap-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                {finding.file && <span>📄 {finding.file}{finding.line ? `:${finding.line}` : ''}</span>}
                                {finding.package && <span>📦 {finding.package}</span>}
                                {finding.installedVersion && <span>Installed: <strong style={{ color: '#ef4444' }}>{finding.installedVersion}</strong></span>}
                                {finding.fixedVersion && <span>Fix: <strong style={{ color: '#10b981' }}>{finding.fixedVersion}</strong></span>}
                                {finding.cveId && <span style={{ color: '#f59e0b' }}>{finding.cveId}</span>}
                                {finding.rule && <span style={{ color: '#8b5cf6' }}>{finding.rule}</span>}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
