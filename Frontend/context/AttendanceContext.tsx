'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AttendanceRecord,
  PunchState,
  BreakRecord,
  Holiday,
  LeaveRequest,
  User,
} from '@/types';
import {
  INITIAL_ATTENDANCE,
  INITIAL_HOLIDAYS,
  INITIAL_LEAVES,
  INITIAL_USERS,
} from '@/services/mockData';
import { useAuth } from './AuthContext';
import {
  useEmployeesQuery,
  useHolidaysQuery,
  useLeavesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
  useApplyLeaveMutation,
  useUpdateLeaveStatusMutation,
  useCheckInMutation,
  useStartBreakMutation,
  useEndBreakMutation,
  useCheckOutMutation,
} from '@/hooks/useEmsQueries';

interface AttendanceContextType {
  currentTime: Date;
  punchState: PunchState;
  checkInTime: string | null;
  checkOutTime: string | null;
  activeBreak: BreakRecord | null;
  elapsedSeconds: number;
  totalBreakSeconds: number;
  attendanceHistory: AttendanceRecord[];
  allEmployees: User[];
  holidays: Holiday[];
  leaveRequests: LeaveRequest[];
  
  // Actions
  handleCheckIn: () => void;
  handleStartBreak: (type: 'LUNCH' | 'SHORT_BREAK') => void;
  handleEndBreak: () => void;
  handleCheckOut: () => void;
  addEmployee: (emp: Omit<User, 'id' | 'employeeId'> & { password?: string }) => void;
  updateEmployee: (id: string, emp: Partial<User>) => void;
  deleteEmployee: (id: string) => void;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  deleteHoliday: (id: string) => void;
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userEmployeeId' | 'status' | 'appliedDate' | 'totalDays'>) => void;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'REJECTED', adminComment?: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Live real-time system clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Daily Punch State
  const [punchState, setPunchState] = useState<PunchState>('NOT_CHECKED_IN');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [activeBreak, setActiveBreak] = useState<BreakRecord | null>(null);
  
  // Elapsed Timers
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState<number>(0);

  // TanStack Query Integrations
  const isTokenPresent = typeof window !== 'undefined' && !!localStorage.getItem('ems_token');
  const isAdmin = user?.role === 'ADMIN' && isTokenPresent;

  const { data: fetchedEmployees } = useEmployeesQuery(isAdmin);
  const { data: fetchedHolidays } = useHolidaysQuery();
  const { data: fetchedLeaves } = useLeavesQuery(isAdmin);

  // TanStack Mutations
  const createEmpMutation = useCreateEmployeeMutation();
  const updateEmpMutation = useUpdateEmployeeMutation();
  const deleteEmpMutation = useDeleteEmployeeMutation();
  const createHolidayMutation = useCreateHolidayMutation();
  const deleteHolidayMutation = useDeleteHolidayMutation();
  const applyLeaveMutation = useApplyLeaveMutation();
  const updateLeaveStatusMutation = useUpdateLeaveStatusMutation();
  const checkInMutation = useCheckInMutation();
  const startBreakMutation = useStartBreakMutation();
  const endBreakMutation = useEndBreakMutation();
  const checkOutMutation = useCheckOutMutation();

  // State Collections with TanStack Query Data fallback to Mock
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [allEmployees, setAllEmployees] = useState<User[]>(INITIAL_USERS);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVES);

  useEffect(() => {
    if (fetchedEmployees && fetchedEmployees.length) setAllEmployees(fetchedEmployees);
  }, [fetchedEmployees]);

  useEffect(() => {
    if (fetchedHolidays && fetchedHolidays.length) setHolidays(fetchedHolidays);
  }, [fetchedHolidays]);

  useEffect(() => {
    if (fetchedLeaves && fetchedLeaves.length) setLeaveRequests(fetchedLeaves);
  }, [fetchedLeaves]);

  // Ticking Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Work & Break Timers effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (punchState === 'WORKING') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (punchState === 'ON_LUNCH_BREAK' || punchState === 'ON_SHORT_BREAK') {
      interval = setInterval(() => {
        setTotalBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [punchState]);

  // Check-In handler
  const handleCheckIn = () => {
    const nowIso = new Date().toISOString();
    setCheckInTime(nowIso);
    setPunchState('WORKING');
    setElapsedSeconds(0);
    checkInMutation.mutate();
  };

  // Start Break handler
  const handleStartBreak = (type: 'LUNCH' | 'SHORT_BREAK') => {
    const nowIso = new Date().toISOString();
    const newBreak: BreakRecord = {
      id: `brk_${Date.now()}`,
      type,
      startTime: nowIso,
      durationMinutes: 0,
    };
    setActiveBreak(newBreak);
    setPunchState(type === 'LUNCH' ? 'ON_LUNCH_BREAK' : 'ON_SHORT_BREAK');
    startBreakMutation.mutate(type);
  };

  // End Break handler
  const handleEndBreak = () => {
    setActiveBreak(null);
    setPunchState('WORKING');
    endBreakMutation.mutate();
  };

  // Check-Out handler
  const handleCheckOut = () => {
    const nowIso = new Date().toISOString();
    setCheckOutTime(nowIso);
    setPunchState('CHECKED_OUT');

    if (user) {
      const todayIso = new Date().toISOString().split('T')[0];
      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userEmployeeId: user.employeeId,
        date: todayIso,
        checkInTime: checkInTime || nowIso,
        checkOutTime: nowIso,
        totalWorkMinutes: Math.floor(elapsedSeconds / 60),
        totalBreakMinutes: Math.floor(totalBreakSeconds / 60),
        status: 'PRESENT',
        breaks: activeBreak ? [activeBreak] : [],
      };
      setAttendanceHistory((prev) => [newRecord, ...prev]);
    }
    checkOutMutation.mutate();
  };

  // Admin: Add Employee
  const addEmployee = (emp: Omit<User, 'id' | 'employeeId'> & { password?: string }) => {
    const newId = `usr_${Date.now()}`;
    const empCode = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp: User = {
      ...emp,
      id: newId,
      employeeId: empCode,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    };
    setAllEmployees((prev) => [newEmp, ...prev]);
    INITIAL_USERS.unshift(newEmp);
    createEmpMutation.mutate({ ...emp, password: emp.password || 'password123' });
  };

  // Admin: Update Employee
  const updateEmployee = (id: string, empData: Partial<User>) => {
    setAllEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...empData } : emp))
    );
    updateEmpMutation.mutate({ id, empData });
  };

  // Admin: Delete Employee & Cascade Purge State
  const deleteEmployee = (id: string) => {
    setAllEmployees((prev) =>
      prev.filter((emp) => emp.id !== id && (emp as any)._id !== id)
    );
    setLeaveRequests((prev) =>
      prev.filter((l) => l.userId !== id && (l as any).user !== id)
    );
    setAttendanceHistory((prev) =>
      prev.filter((att) => att.userId !== id && (att as any).user !== id)
    );
    deleteEmpMutation.mutate(id);
  };

  // Admin: Add Holiday
  const addHoliday = (h: Omit<Holiday, 'id'>) => {
    const newH: Holiday = { ...h, id: `hol_${Date.now()}` };
    setHolidays((prev) => [...prev, newH]);
    createHolidayMutation.mutate(h);
  };

  // Admin: Delete Holiday
  const deleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    deleteHolidayMutation.mutate(id);
  };

  // Employee: Apply Leave
  const applyLeave = (
    leave: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userEmployeeId' | 'status' | 'appliedDate' | 'totalDays'>
  ) => {
    if (!user) return;
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequest = {
      ...leave,
      id: `lve_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmployeeId: user.employeeId,
      totalDays,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);
    applyLeaveMutation.mutate(leave);
  };

  // Admin: Update Leave Status
  const updateLeaveStatus = (id: string, status: 'APPROVED' | 'REJECTED', adminComment?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id || (l as any)._id === id ? { ...l, status, adminComment } : l))
    );
    updateLeaveStatusMutation.mutate({ id, status, adminComment });
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentTime,
        punchState,
        checkInTime,
        checkOutTime,
        activeBreak,
        elapsedSeconds,
        totalBreakSeconds,
        attendanceHistory,
        allEmployees,
        holidays,
        leaveRequests,
        handleCheckIn,
        handleStartBreak,
        handleEndBreak,
        handleCheckOut,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addHoliday,
        deleteHoliday,
        applyLeave,
        updateLeaveStatus,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
