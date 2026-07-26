'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  CalendarDays,
  UserCheck,
  User as UserIcon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  const adminNavItems = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Employees', href: '/admin/employees', icon: Users },
    { name: 'Attendance Monitor', href: '/admin/attendance', icon: UserCheck },
    { name: 'Company Holidays', href: '/admin/holidays', icon: CalendarDays },
    { name: 'Leave Requests', href: '/admin/leaves', icon: FileText },
    { name: 'My Profile', href: '/admin/profile', icon: UserIcon },
  ];

  const employeeNavItems = [
    { name: 'Punch & Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Attendance History', href: '/employee/attendance', icon: Clock },
    { name: 'Holiday Calendar', href: '/employee/calendar', icon: Calendar },
    { name: 'Apply For Leave', href: '/employee/leaves', icon: FileText },
    { name: 'My Profile', href: '/employee/profile', icon: UserIcon },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-57px)] p-3 hidden md:flex flex-col justify-between">
      <div className="space-y-4">
        {/* Role Banner */}
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal</div>
          <div className="text-xs font-bold text-slate-800">
            {isAdmin ? 'Admin Portal' : 'Employee Workspace'}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
