'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GitMerge, FileText, Settings, Activity, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipelines', label: 'Pipelines', icon: GitMerge },
  { href: '/logs', label: 'Execution Logs', icon: FileText },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
           style={{
             background: 'linear-gradient(180deg, #0f1629 0%, #0a0e1a 100%)',
             borderRight: '1px solid rgba(42, 49, 80, 0.5)',
           }}>
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Ops</span>
              <span className="text-white">Pilot</span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#64748b' }}>
              DevSecOps AI
            </p>
          </div>
        </Link>
        
        {/* Menu */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#f1f5f9' : '#94a3b8',
                  background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-[18px] w-[18px] transition-colors duration-200" 
                      style={{ color: isActive ? '#3b82f6' : '#64748b' }} />
                <span className="ml-3">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full"
                       style={{ background: '#3b82f6', boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Version Info */}
        <div className="px-3 py-3 rounded-xl" style={{ background: 'rgba(26, 31, 53, 0.5)', border: '1px solid rgba(42, 49, 80, 0.5)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)' }} />
            <span className="text-xs" style={{ color: '#94a3b8' }}>System Online</span>
          </div>
          <p className="text-[10px] mt-1" style={{ color: '#64748b' }}>OpsPilot v2.0 • AI Engine Ready</p>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
