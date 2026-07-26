'use client';

import React, { useState } from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { holidaySchema } from '@/lib/validators';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';

export default function AdminHolidaysPage() {
  const { holidays, addHoliday, deleteHoliday } = useAttendance();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'NATIONAL' | 'COMPANY' | 'OPTIONAL'>('NATIONAL');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = holidaySchema.safeParse({ title, date, description, type });
    if (!res.success) {
      setError(res.error.issues[0].message);
      return;
    }

    addHoliday({ title, date, description, type });
    setShowModal(false);
    setTitle('');
    setDate('');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" /> Holiday Manager
          </h1>
          <p className="text-xs text-slate-500">Configure company holidays and calendar events</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Holiday Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((h) => (
          <div key={h.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {h.type}
              </span>
              <button
                onClick={() => deleteHoliday(h.id)}
                title="Remove Holiday"
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-900">{h.title}</h3>
            <p className="text-xs text-slate-500">{h.description}</p>
            <div className="text-xs font-mono font-semibold text-blue-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 w-fit">
              Date: {h.date}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" /> Post New Company Holiday
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Holiday Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Labor Day"
                  className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="NATIONAL">National</option>
                    <option value="COMPANY">Company</option>
                    <option value="OPTIONAL">Optional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm"
                >
                  Publish Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
