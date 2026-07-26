'use client';

import React from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { Clock } from 'lucide-react';

interface SystemClockProps {
  className?: string;
  showIcon?: boolean;
}

export const SystemClock: React.FC<SystemClockProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { currentTime } = useAttendance();

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

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium ${className}`}
    >
      {showIcon && <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
      <span className="font-mono font-bold text-slate-900">{formattedTime}</span>
      <span className="text-slate-400">|</span>
      <span>{formattedDate}</span>
    </div>
  );
};

export default SystemClock;
