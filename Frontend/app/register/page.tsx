'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerSchema } from '@/lib/validators';
import { Shield, Mail, Lock, UserCheck, KeyRound, ArrowRight, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/employee/dashboard');
      }
    }
  }, [user, router]);

  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        text: `Account created successfully for ${cleanEmail}! Redirecting to login...`,
      });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      setServerMessage({ type: 'error', text: res.message || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm relative">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Create New Account</h1>
          <p className="text-xs text-slate-500 mt-1">Register for EMS Portal Access</p>
        </div>

        {/* Role Selection */}
        <div className="flex items-center justify-between gap-2 mb-4 px-1">
          <span className="text-xs font-semibold text-slate-500">Select Role:</span>
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
            className={`my-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
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
            <div className="flex-1">{serverMessage.text}</div>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-3">
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
            className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-3 shadow-xs disabled:opacity-60"
          >
            {isSubmitting ? 'Registering Account...' : 'Register Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
              <LogIn className="w-3 h-3" /> Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
