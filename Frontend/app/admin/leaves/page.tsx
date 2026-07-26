'use client';

import React, { useState } from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { LeaveRequest } from '@/types';
import { FileText, Check, X, Search, Filter, Clock, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export default function AdminLeavesPage() {
  const { allEmployees, leaveRequests, updateLeaveStatus } = useAttendance();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'NO_REQUEST'>('ALL');

  // Filter to active employees from Manage Employee module
  const activeEmployees = allEmployees.filter(
    (e) => e.status === 'ACTIVE' && e.role === 'EMPLOYEE'
  );

  // Build list matching every active employee in Manage Employee module
  const activeEmployeeLeaveRecords: (LeaveRequest & { department?: string; designation?: string })[] = [];

  activeEmployees.forEach((emp) => {
    const empLeaves = leaveRequests.filter(
      (l) => l.userId === emp.id || l.userEmployeeId === emp.employeeId
    );

    if (empLeaves.length > 0) {
      empLeaves.forEach((l) => {
        activeEmployeeLeaveRecords.push({
          ...l,
          userName: emp.name,
          userEmployeeId: emp.employeeId,
          department: emp.department,
          designation: emp.designation,
        });
      });
    } else {
      activeEmployeeLeaveRecords.push({
        id: `no_lve_${emp.id}`,
        userId: emp.id,
        userName: emp.name,
        userEmployeeId: emp.employeeId,
        department: emp.department,
        designation: emp.designation,
        leaveType: 'N/A',
        startDate: '-',
        endDate: '-',
        totalDays: 0,
        reason: 'No leave request submitted',
        status: 'NO_REQUEST',
        appliedDate: '-',
      });
    }
  });

  const filteredLeaves = activeEmployeeLeaveRecords.filter((l) => {
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesSearch =
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userEmployeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.department && l.department.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate statistics for active employees
  const totalActiveStaff = activeEmployees.length;
  const pendingCount = activeEmployeeLeaveRecords.filter((l) => l.status === 'PENDING').length;
  const approvedCount = activeEmployeeLeaveRecords.filter((l) => l.status === 'APPROVED').length;
  const noRequestCount = activeEmployeeLeaveRecords.filter((l) => l.status === 'NO_REQUEST').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Employee Leave Status & Applications
        </h1>
        <p className="text-xs text-slate-500">
          Leave status directory for all active staff members in the Manage Employee module
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Active Staff</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalActiveStaff}</div>
          <div className="text-[11px] text-slate-500">Employees in directory</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-600 text-xs font-semibold uppercase">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-slate-500">Applications awaiting action</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold uppercase">
            <span>Approved Leaves</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{approvedCount}</div>
          <div className="text-[11px] text-slate-500">Approved leave status</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>No Request Submitted</span>
            <MinusCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-600">{noRequestCount}</div>
          <div className="text-[11px] text-slate-500">Working without active leave</div>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, employee code, or department..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Active Employees & Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Declined</option>
            <option value="NO_REQUEST">No Request Submitted</option>
          </select>
        </div>
      </div>

      {/* Main Leave Status Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Active Employee</th>
                <th className="px-4 py-3">Department & Designation</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No active employee records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((l) => {
                  const targetId = l.id || (l as any)._id;
                  return (
                    <tr key={targetId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>{l.userName}</div>
                        <div className="text-[11px] text-blue-600 font-mono font-normal">{l.userEmployeeId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900 font-medium">{l.designation || 'Staff'}</div>
                        <div className="text-[11px] text-slate-500">{l.department || 'General'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {l.leaveType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {l.startDate === '-' ? '-' : `${l.startDate} to ${l.endDate}`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {l.totalDays > 0 ? `${l.totalDays} Days` : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={l.reason}>
                        {l.reason}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : l.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : l.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {l.status === 'NO_REQUEST' ? 'NO REQUEST' : l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        {l.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => updateLeaveStatus(targetId, 'APPROVED', 'Approved by Admin')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(targetId, 'REJECTED', 'Declined by Admin')}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-300 font-bold text-xs inline-flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Decline
                            </button>
                          </>
                        ) : l.status === 'NO_REQUEST' ? (
                          <span className="text-[11px] text-slate-400 italic">No Action Needed</span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Reviewed</span>
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
    </div>
  );
}
