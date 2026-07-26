'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAttendance } from '@/context/AttendanceContext';
import { Clock } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const { user } = useAuth();
  const { attendanceHistory } = useAttendance();

  const myAttendance = attendanceHistory.filter(
    (item) => item.userId === user?.id || item.userEmployeeId === user?.employeeId
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" /> My Attendance Log
        </h1>
        <p className="text-xs text-slate-500">Daily check-in, check-out, and break breakdown history</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check-In</th>
                <th className="px-4 py-3">Check-Out</th>
                <th className="px-4 py-3">Work Duration</th>
                <th className="px-4 py-3">Break Duration</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No attendance records logged yet. Check in on the dashboard to log your shift!
                  </td>
                </tr>
              ) : (
                myAttendance.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.date}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {Math.floor(item.totalWorkMinutes / 60)}h {item.totalWorkMinutes % 60}m
                    </td>
                    <td className="px-4 py-3 text-amber-600">
                      {item.totalBreakMinutes} mins
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
