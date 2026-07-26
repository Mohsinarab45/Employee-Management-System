export type UserRole = 'ADMIN' | 'EMPLOYEE';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  joiningDate: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  phone?: string;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE';

export type PunchState = 'NOT_CHECKED_IN' | 'WORKING' | 'ON_LUNCH_BREAK' | 'ON_SHORT_BREAK' | 'CHECKED_OUT';

export interface BreakRecord {
  id: string;
  type: 'LUNCH' | 'SHORT_BREAK';
  startTime: string;
  endTime?: string;
  durationMinutes: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userEmployeeId: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string;
  checkOutTime?: string;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  status: AttendanceStatus;
  breaks: BreakRecord[];
}

export type HolidayType = 'NATIONAL' | 'COMPANY' | 'OPTIONAL';

export interface Holiday {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  type: HolidayType;
}

export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID' | 'N/A';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NO_REQUEST';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userEmployeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  adminComment?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
