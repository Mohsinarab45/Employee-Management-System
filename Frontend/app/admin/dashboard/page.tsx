'use client';

import React from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { Users, UserCheck, Coffee, FileText, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { allEmployees, attendanceHistory, leaveRequests } = useAttendance();

  const totalStaff = allEmployees.length;
  const activeStaff = allEmployees.filter((e) => e.status === 'ACTIVE').length;
  const presentToday = attendanceHistory.length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'PENDING').length;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Admin Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage staff directory, monitor check-ins, approve leaves, and set company holidays
          </p>
        </div>

        <Link
          href="/admin/employees"
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalStaff}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{activeStaff} Active Accounts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Present Today</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{presentToday}</div>
          <div className="text-[11px] text-slate-500">Logged in today</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>On Break</span>
            <Coffee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">1</div>
          <div className="text-[11px] text-slate-500">Active lunch/tea</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Pending Leaves</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{pendingLeaves}</div>
          <div className="text-[11px] text-slate-500">Awaiting approval</div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> Staff Directory Summary
          </h2>
          <Link
            href="/admin/employees"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            View Full Table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allEmployees.slice(0, 4).map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div>{emp.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{emp.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600 font-semibold">{emp.employeeId}</td>
                  <td className="px-4 py-3 text-slate-700">{emp.department}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        emp.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
