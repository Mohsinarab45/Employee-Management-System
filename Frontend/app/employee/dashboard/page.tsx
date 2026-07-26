'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAttendance } from '@/context/AttendanceContext';
import { Clock, Coffee, CheckCircle2, LogOut, Calendar, TrendingUp } from 'lucide-react';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const {
    currentTime,
    punchState,
    checkInTime,
    checkOutTime,
    elapsedSeconds,
    totalBreakSeconds,
    handleCheckIn,
    handleStartBreak,
    handleEndBreak,
    handleCheckOut,
    holidays,
  } = useAttendance();

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const nextHoliday = holidays[0];

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.designation} • {user?.department} Department
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-mono font-bold text-slate-900">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Punch Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Time & Attendance Punch Card
              </h2>
              <p className="text-xs text-slate-500">Record check-in, breaks, and check-out</p>
            </div>

            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                punchState === 'WORKING'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : punchState === 'ON_LUNCH_BREAK' || punchState === 'ON_SHORT_BREAK'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : punchState === 'CHECKED_OUT'
                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              State: {punchState.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            {punchState === 'NOT_CHECKED_IN' && (
              <button
                onClick={handleCheckIn}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" /> Check-In Now
              </button>
            )}

            {punchState === 'WORKING' && (
              <div className="flex flex-wrap gap-2.5 w-full justify-center">
                <button
                  onClick={() => handleStartBreak('LUNCH')}
                  className="px-4 py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Coffee className="w-4 h-4" /> Start Lunch Break
                </button>
                <button
                  onClick={() => handleStartBreak('SHORT_BREAK')}
                  className="px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Coffee className="w-4 h-4" /> Short Tea Break
                </button>
                <button
                  onClick={handleCheckOut}
                  className="px-4 py-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold text-xs flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Check-Out
                </button>
              </div>
            )}

            {(punchState === 'ON_LUNCH_BREAK' || punchState === 'ON_SHORT_BREAK') && (
              <button
                onClick={handleEndBreak}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> End Break & Resume Work
              </button>
            )}

            {punchState === 'CHECKED_OUT' && (
              <div className="text-center py-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <div className="text-sm font-bold text-slate-800">Shift Ended for Today</div>
                <p className="text-xs text-slate-500">Checked out at {new Date(checkOutTime!).toLocaleTimeString()}</p>
              </div>
            )}
          </div>

          {/* Timers */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase">Work Time</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">{formatSeconds(elapsedSeconds)}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase">Break Time</div>
              <div className="text-xl font-bold font-mono text-amber-600 mt-1">{formatSeconds(totalBreakSeconds)}</div>
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Weekly Overview
            </h3>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-600">Weekly Hours</span>
              <span className="font-bold text-slate-900">40.0 Hrs</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-600">Leave Balance</span>
              <span className="font-bold text-emerald-600">12 Days</span>
            </div>
          </div>

          {nextHoliday && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Next Holiday
              </div>
              <div className="text-sm font-bold text-slate-900">{nextHoliday.title}</div>
              <div className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit">
                {nextHoliday.date}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
