'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Edit3, Check, X, Mail, BadgeCheck, Building2, Briefcase, Calendar, Phone } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || 'Engineering');
  const [designation, setDesignation] = useState(user?.designation || 'Software Specialist');
  const [phone, setPhone] = useState('+(555) 019-2834');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setMessage({ type: 'error', text: 'Name must be at least 2 characters long' });
      return;
    }

    setIsSubmitting(true);
    const res = await updateProfile({
      name: name.trim(),
      department,
      designation,
      phone,
    });
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Profile details updated successfully!' });
      setIsEditingName(false);
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update profile details' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-md border-2 border-white/20">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                    : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono flex items-center gap-2 justify-center sm:justify-start">
              <span>ID: <strong className="text-white">{user.employeeId}</strong></span>
              <span>•</span>
              <span>{user.email}</span>
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> {user.department || 'Engineering'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" /> {user.designation || 'Software Specialist'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Information & Editable Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal & Account Information</h2>
            <p className="text-xs text-slate-500">View and update your display name and contact preferences</p>
          </div>

          {!isEditingName && (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Editable Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Display Name <span className="text-blue-600">*</span>
              </label>
              {isEditingName ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-blue-500 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900">
                  {user.name}
                </div>
              )}
            </div>

            {/* Readonly Work Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email Address</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Readonly Employee Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Employee ID Code</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-blue-700">
                {user.employeeId}
              </div>
            </div>

            {/* Readonly Account Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Portal Access Level</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>{user.role} Portal</span>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
              {isEditingName ? (
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  {user.department || 'Engineering'}
                </div>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation Title</label>
              {isEditingName ? (
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  {user.designation || 'Software Specialist'}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone</label>
              {isEditingName ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{phone}</span>
                </div>
              )}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Joining Date</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.joiningDate || '2024-01-01'}</span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          {isEditingName && (
            <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditingName(false);
                  setName(user.name);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileView;
