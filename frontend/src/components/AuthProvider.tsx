'use client';

import Sidebar from '@/components/Sidebar';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="sm:ml-64 min-h-screen" style={{ background: '#0a0e1a' }}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </>
  );
}
