'use client';

import React from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { CalendarDays } from 'lucide-react';

export default function EmployeeCalendarPage() {
  const { holidays } = useAttendance();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" /> Holiday Calendar
        </h1>
        <p className="text-xs text-slate-500">Official company holidays and upcoming calendar events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((h) => (
          <div key={h.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {h.type}
              </span>
              <span className="text-xs font-mono font-semibold text-blue-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {h.date}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{h.title}</h3>
            <p className="text-xs text-slate-500">{h.description || 'Official company holiday.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
