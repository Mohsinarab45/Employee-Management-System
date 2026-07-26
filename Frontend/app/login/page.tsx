'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, registerSchema } from '@/lib/validators';
import { Shield, Lock, Mail, UserCheck, KeyRound, ArrowRight, UserPlus, LogIn, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, forgotPassword } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ems_logging_out');
    }
    if (user) {
      if (user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/employee/dashboard');
      }
    }
  }, [user, router]);

  // Mode: 'SIGN_IN' or 'SIGN_UP'
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  
  // Role: 'EMPLOYEE' or 'ADMIN'
  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [phone, setPhone] = useState('');

  // Status & Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotResetToken, setForgotResetToken] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState('');

  // Handle Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerMessage(null);

    const cleanEmail = email.trim();
    const result = loginSchema.safeParse({ email: cleanEmail, password, role });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const res = await login(cleanEmail, role, password);

    if (res.success) {
      setIsRedirecting(true);
      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } else {
      setIsSubmitting(false);
      setServerMessage({ type: 'error', text: res.message || 'Invalid email or password' });
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerMessage(null);

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    const result = registerSchema.safeParse({
      name: cleanName,
      email: cleanEmail,
      password,
      role,
      department,
      designation,
      phone,
    });

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      name: cleanName,
      email: cleanEmail,
      password,
      role,
      department,
      designation,
      phone,
    });
    setIsSubmitting(false);

    if (res.success) {
      setServerMessage({
        type: 'success',
        text: `Account created for ${cleanEmail}! Please sign in as ${role === 'ADMIN' ? 'Admin' : 'Employee'}.`,
      });
      setAuthMode('SIGN_IN');
      setEmail(cleanEmail);
      setPassword('');
    } else {
      setServerMessage({ type: 'error', text: res.message || 'Registration failed' });
    }
  };

  // Handle Forgot Password Modal Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotResetToken(null);

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address');
      return;
    }

    setForgotSubmitting(true);
    const res = await forgotPassword(forgotEmail.trim());
    setForgotSubmitting(false);

    if (res.success) {
      setForgotSuccess(res.message || `Password reset instructions sent to ${forgotEmail}`);
      if (res.resetToken) {
        setForgotResetToken(res.resetToken);
      }
    } else {
      setForgotError(res.message || 'Failed to process request');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 relative">
      {/* Dashboard Transition Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm w-full space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Authentication Verified</h3>
              <p className="text-xs text-slate-500 mt-1">Loading your workspace dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm relative">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">EMS Portal Access</h1>
          <p className="text-xs text-slate-500 mt-1">Employee Management System & Workspace</p>
        </div>

        {/* Auth Mode Toggle (Sign In vs Sign Up) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 mb-4">
          <button
            type="button"
            onClick={() => {
              setAuthMode('SIGN_IN');
              setServerMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              authMode === 'SIGN_IN' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('SIGN_UP');
              setServerMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              authMode === 'SIGN_UP' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> First Time? Sign Up
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex items-center justify-between gap-2 mb-4 px-1">
          <span className="text-xs font-semibold text-slate-500">Account Portal:</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setRole('EMPLOYEE')}
              className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors flex items-center gap-1 ${
                role === 'EMPLOYEE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-3 h-3" /> Employee
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors flex items-center gap-1 ${
                role === 'ADMIN'
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <KeyRound className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {serverMessage && (
          <div
            className={`my-4 p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-3 break-words w-full shadow-xs transition-all ${
              serverMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {serverMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-snug">{serverMessage.text}</div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === 'SIGN_IN' && (
          <form onSubmit={handleSignIn} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'ADMIN' ? 'admin@ems.com' : 'alex@ems.com'}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotEmail(email);
                    setForgotSuccess('');
                    setForgotError('');
                    setForgotResetToken(null);
                  }}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isRedirecting}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isSubmitting || isRedirecting ? 'Authenticating...' : `Sign In as ${role}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Credentials Shortcut Buttons */}
        {authMode === 'SIGN_IN' && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Demo Credentials
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGN_IN');
                  setRole('ADMIN');
                  setEmail('admin@ems.com');
                  setPassword('password123');
                  setServerMessage(null);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" /> Demo Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGN_IN');
                  setRole('EMPLOYEE');
                  setEmail('alex@ems.com');
                  setPassword('password123');
                  setServerMessage(null);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" /> Demo Employee
              </button>
            </div>
          </div>
        )}

        {/* SIGN UP FORM (First Time Users) */}
        {authMode === 'SIGN_UP' && (
          <form onSubmit={handleSignUp} className="space-y-3 mt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              {errors.name && <p className="text-xs text-rose-600 mt-0.5 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@company.com"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-xs text-rose-600 mt-0.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              {errors.password && <p className="text-xs text-rose-600 mt-0.5 font-medium">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? 'Registering Account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD MODAL DIALOG */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl border border-slate-200 shadow-xl relative space-y-4">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500">
                  Enter your email address to receive password reset instructions
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800">{forgotSuccess}</p>
                  
                  {forgotResetToken && (
                    <div className="pt-2 space-y-2">
                      <p className="text-xs text-slate-600 font-medium">Your Password Reset Link is Ready:</p>
                      <Link
                        href={`/reset-password?token=${forgotResetToken}`}
                        onClick={() => setShowForgotModal(false)}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Reset Password Now <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold mt-2"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. alex@ems.com"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {forgotError && (
                    <p className="text-xs text-rose-600 font-medium">{forgotError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotSubmitting}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs"
                    >
                      {forgotSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
