'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
    } else if (user.role === 'ADMIN') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/employee/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm w-full p-8 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30 animate-pulse">
          <Shield className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">EMS Enterprise</h2>
          <p className="text-xs text-slate-400">Verifying session & initializing workspace...</p>
        </div>
        <div className="w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin mx-auto pt-2" />
      </div>
    </div>
  );
}
