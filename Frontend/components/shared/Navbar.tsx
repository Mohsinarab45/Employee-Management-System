'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAttendance } from '@/context/AttendanceContext';
import { Clock, LogOut, Shield, Menu, X, LayoutDashboard, Clock3, FileText, Calendar, Users, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTime } = useAttendance();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const navLinks = user?.role === 'ADMIN'
    ? [
        { label: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Employee Roster', href: '/admin/employees', icon: Users },
        { label: 'Leave Queue', href: '/admin/leaves', icon: FileText },
        { label: 'Holidays', href: '/admin/holidays', icon: Calendar },
        { label: 'My Profile', href: '/admin/profile', icon: UserIcon },
      ]
    : [
        { label: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
        { label: 'My Attendance', href: '/employee/attendance', icon: Clock3 },
        { label: 'My Leaves', href: '/employee/leaves', icon: FileText },
        { label: 'Company Holidays', href: '/employee/holidays', icon: Calendar },
        { label: 'My Profile', href: '/employee/profile', icon: UserIcon },
      ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">EMS Workspace</span>
            </div>
          </Link>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-none">{user.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="text-[11px] text-slate-500">{user.employeeId}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Drawer Menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden pt-3 mt-3 border-t border-slate-200 space-y-1.5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-2 py-1 mb-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono font-bold text-slate-900">{formattedTime}</span>
            </span>
            <span className="text-slate-500">{formattedDate}</span>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
