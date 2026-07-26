'use client';

import React, { useState } from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { UserCheck, Users, FileText, Search, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAttendancePage() {
  const { allEmployees, attendanceHistory, leaveRequests } = useAttendance();

  const [activeTab, setActiveTab] = useState<'LIVE' | 'LEAVES' | 'HISTORY'>('LIVE');
  const [searchTerm, setSearchTerm] = useState('');

  // Active employees list
  const activeEmployees = allEmployees.filter((emp) => emp.status === 'ACTIVE' && emp.role === 'EMPLOYEE');

  // Filter active employees by search
  const filteredActiveEmployees = activeEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Leave requests for active employees
  const activeUserLeaveRequests = leaveRequests.filter((leave) => {
    const isForActiveUser = activeEmployees.some(
      (emp) => emp.id === leave.userId || emp.employeeId === leave.userEmployeeId
    );
    const matchesSearch =
      leave.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.userEmployeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return isForActiveUser && matchesSearch;
  });

  // Calculate live statistics
  const presentCount = attendanceHistory.filter((item) =>
    activeEmployees.some((emp) => emp.id === item.userId || emp.employeeId === item.userEmployeeId)
  ).length;

  const activeLeavesCount = leaveRequests.filter(
    (l) =>
      l.status === 'APPROVED' &&
      activeEmployees.some((emp) => emp.id === l.userId || emp.employeeId === l.userEmployeeId)
  ).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" /> Attendance & Active User Monitor
        </h1>
        <p className="text-xs text-slate-500">
          Monitor real-time shift check-ins, active user attendance records, and live leave applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Active Staff Accounts</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeEmployees.length}</div>
          <div className="text-[11px] text-slate-500">Registered active employees</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Present Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{presentCount}</div>
          <div className="text-[11px] text-slate-500">Active users checked in</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Active Users On Leave</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{activeLeavesCount}</div>
          <div className="text-[11px] text-slate-500">Approved leave status</div>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'LIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Active Staff Live Status
          </button>
          <button
            onClick={() => setActiveTab('LEAVES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'LEAVES'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Active User Leave Records
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'HISTORY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Attendance Log History
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employee..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tab Content 1: Active Staff Live Status */}
      {activeTab === 'LIVE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department & Designation</th>
                  <th className="px-4 py-3">Today Check-In</th>
                  <th className="px-4 py-3">Work Duration</th>
                  <th className="px-4 py-3">Today Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActiveEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                      No active employee records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredActiveEmployees.map((emp) => {
                    const todayRecord = attendanceHistory.find(
                      (att) => att.userId === emp.id || att.userEmployeeId === emp.employeeId
                    );

                    const isOnLeave = leaveRequests.some(
                      (l) =>
                        (l.userId === emp.id || l.userEmployeeId === emp.employeeId) &&
                        l.status === 'APPROVED'
                    );

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div>{emp.name}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{emp.email}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-blue-600 font-semibold">{emp.employeeId}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-900 font-medium">{emp.designation}</div>
                          <div className="text-[11px] text-slate-500">{emp.department}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {todayRecord?.checkInTime
                            ? new Date(todayRecord.checkInTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-emerald-600">
                          {todayRecord
                            ? `${Math.floor(todayRecord.totalWorkMinutes / 60)}h ${todayRecord.totalWorkMinutes % 60}m`
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {todayRecord ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              PRESENT TODAY
                            </span>
                          ) : isOnLeave ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                              ON APPROVED LEAVE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              NOT CHECKED IN
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Active User Leave Records */}
      {activeTab === 'LEAVES' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Active Employee</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total Days</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeUserLeaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                      No leave records found for active employees.
                    </td>
                  </tr>
                ) : (
                  activeUserLeaveRequests.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>{l.userName}</div>
                        <div className="text-[11px] text-blue-600 font-mono font-normal">{l.userEmployeeId}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">{l.leaveType}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {l.startDate} to {l.endDate}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{l.totalDays} Days</td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{l.reason}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : l.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Attendance Log History */}
      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Check-In</th>
                  <th className="px-4 py-3">Check-Out</th>
                  <th className="px-4 py-3">Work Time</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.userName}</td>
                    <td className="px-4 py-3 font-mono text-blue-600">{item.userEmployeeId}</td>
                    <td className="px-4 py-3 text-slate-600">{item.date}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {Math.floor(item.totalWorkMinutes / 60)}h {item.totalWorkMinutes % 60}m
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
