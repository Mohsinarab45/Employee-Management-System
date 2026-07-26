import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { User, Holiday, LeaveRequest, AttendanceRecord } from '@/types';

// Query Keys
export const QUERY_KEYS = {
  EMPLOYEES: ['employees'],
  HOLIDAYS: ['holidays'],
  LEAVES: ['leaves'],
  ATTENDANCE: ['attendance'],
};

// --- QUERIES ---

export const useEmployeesQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEES,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; employees: any[] }>('/admin/employees');
      return (res.employees || []).map((emp: any) => ({
        ...emp,
        id: emp.id || emp._id,
      }));
    },
    enabled,
  });
};

export const useHolidaysQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.HOLIDAYS,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; holidays: any[] }>('/holidays');
      return (res.holidays || []).map((h: any) => ({
        ...h,
        id: h.id || h._id,
      }));
    },
  });
};

export const useLeavesQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.LEAVES,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; leaves: any[] }>('/leaves/admin/all');
      return (res.leaves || []).map((l: any) => ({
        ...l,
        id: l.id || l._id,
      }));
    },
    enabled,
  });
};

export const useMyAttendanceQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; attendance: AttendanceRecord[] }>('/attendance/my-history');
      return res.attendance || [];
    },
  });
};

// --- MUTATIONS ---

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (empData: Partial<User> & { password?: string }) =>
      apiClient.post<{ success: boolean; employee: User }>('/admin/employees', empData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, empData }: { id: string; empData: Partial<User> }) =>
      apiClient.put<{ success: boolean; employee: User }>(`/admin/employees/${id}`, empData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/admin/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useCreateHolidayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (holidayData: Omit<Holiday, 'id'>) =>
      apiClient.post<{ success: boolean; holiday: Holiday }>('/holidays/admin', holidayData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLIDAYS });
    },
  });
};

export const useDeleteHolidayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/holidays/admin/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLIDAYS });
    },
  });
};

export const useApplyLeaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leaveData: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userEmployeeId' | 'status' | 'appliedDate' | 'totalDays'>) =>
      apiClient.post<{ success: boolean; leave: LeaveRequest }>('/leaves', leaveData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEAVES });
    },
  });
};

export const useUpdateLeaveStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminComment }: { id: string; status: 'APPROVED' | 'REJECTED'; adminComment?: string }) =>
      apiClient.patch<{ success: boolean; leave: LeaveRequest }>(`/leaves/admin/${id}/status`, { status, adminComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEAVES });
    },
  });
};

export const useCheckInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<{ success: boolean }>('/attendance/check-in'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ATTENDANCE });
    },
  });
};

export const useStartBreakMutation = () => {
  return useMutation({
    mutationFn: (breakType: 'LUNCH' | 'SHORT_BREAK') =>
      apiClient.post<{ success: boolean }>('/attendance/break/start', { breakType }),
  });
};

export const useEndBreakMutation = () => {
  return useMutation({
    mutationFn: () => apiClient.post<{ success: boolean }>('/attendance/break/end'),
  });
};

export const useCheckOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<{ success: boolean }>('/attendance/check-out'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ATTENDANCE });
    },
  });
};
