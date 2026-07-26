'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { useAuth } from '@/context/AuthContext';

const PUBLIC_AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function AppLayoutContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(pathname);

  if (isPublicAuthRoute) {
    return <main className="min-h-screen bg-slate-100">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayoutContainer;
