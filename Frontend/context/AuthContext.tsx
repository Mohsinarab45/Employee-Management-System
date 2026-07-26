'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { INITIAL_USERS } from '@/services/mockData';
import { apiClient } from '@/services/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; email: string; password: string; role: UserRole; department?: string; designation?: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (profileData: { name: string; phone?: string; department?: string; designation?: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  // Fast Instant Load Session
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const savedUser = localStorage.getItem('ems_user');
      const savedToken = localStorage.getItem('ems_token');

      if (savedUser) {
        try {
          if (isMounted) setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('ems_user');
        }
      }

      // Unblock loading state immediately if we have cached user details
      if (isMounted) setIsLoading(false);

      // Background session validation
      if (savedToken) {
        try {
          const res = await apiClient.get<any>('/auth/me');
          if (res && res.user && isMounted) {
            const loggedInUser: User = {
              id: res.user._id || res.user.id,
              employeeId: res.user.employeeId,
              name: res.user.name,
              email: res.user.email,
              role: res.user.role,
              department: res.user.department,
              designation: res.user.designation,
              joiningDate: res.user.joiningDate ? new Date(res.user.joiningDate).toISOString().split('T')[0] : '2024-01-01',
              status: res.user.status || 'ACTIVE',
            };
            setUser(loggedInUser);
            localStorage.setItem('ems_user', JSON.stringify(loggedInUser));
          }
        } catch {
          // Keep current saved user if backend is offline or slow
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, role: UserRole, password: string = 'password123'): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const data = await apiClient.post<any>('/auth/login', { email: cleanEmail, password, role });
      if (data && data.token && data.user) {
        const loggedInUser: User = {
          id: data.user.id || data.user._id,
          employeeId: data.user.employeeId,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          department: data.user.department,
          designation: data.user.designation,
          joiningDate: data.user.joiningDate ? new Date(data.user.joiningDate).toISOString().split('T')[0] : '2024-01-01',
          status: data.user.status || 'ACTIVE',
        };
        setUser(loggedInUser);
        localStorage.setItem('ems_token', data.token);
        localStorage.setItem('ems_user', JSON.stringify(loggedInUser));
        setIsLoading(false);
        return { success: true, message: 'Login successful' };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      // Local demo fallback
      const existing = INITIAL_USERS.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.role === role
      );
      if (existing) {
        setUser(existing);
        localStorage.setItem('ems_user', JSON.stringify(existing));
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: msg };
    }

    setIsLoading(false);
    return { success: false, message: 'Authentication failed' };
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
    designation?: string;
    phone?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload = {
        ...userData,
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
      };
      const res = await apiClient.post<any>('/auth/register', payload);
      if (res && res.success !== false) {
        return { success: true, message: res.message || 'Account registered successfully' };
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
    return { success: false, message: 'Registration failed' };
  };

  const logout = () => {
    setIsSigningOut(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ems_logging_out', 'true');
      localStorage.removeItem('ems_user');
      localStorage.removeItem('ems_token');
    }
    setTimeout(() => {
      setUser(null);
      setIsSigningOut(false);
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }, 600);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; resetToken?: string }> => {
    try {
      const res = await apiClient.post<any>('/auth/forgot-password', { email });
      return {
        success: true,
        message: res.message || 'Password reset link sent to your email.',
        resetToken: res.resetToken,
      };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to process request.' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.post<any>('/auth/reset-password', { token, newPassword });
      return { success: true, message: res.message || 'Password reset successfully!' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Invalid or expired token.' };
    }
  };

  const updateProfile = async (profileData: { name: string; phone?: string; department?: string; designation?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.put<any>('/auth/profile', profileData);
      if (res && res.user) {
        const updatedUser: User = {
          id: res.user.id || res.user._id,
          employeeId: res.user.employeeId,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          department: res.user.department,
          designation: res.user.designation,
          joiningDate: res.user.joiningDate ? new Date(res.user.joiningDate).toISOString().split('T')[0] : '2024-01-01',
          status: res.user.status || 'ACTIVE',
        };
        setUser(updatedUser);
        localStorage.setItem('ems_user', JSON.stringify(updatedUser));
        return { success: true, message: res.message || 'Profile updated successfully' };
      }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to update profile.' };
    }

    // Local fallback update if offline
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('ems_user', JSON.stringify(updatedUser));
      return { success: true, message: 'Profile updated locally' };
    }

    return { success: false, message: 'Failed to update profile' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {isSigningOut && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200 text-center max-w-sm w-full space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Signing Out</h3>
              <p className="text-xs text-slate-500">Clearing active session & returning to login portal...</p>
            </div>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
