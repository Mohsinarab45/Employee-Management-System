'use client';

import React, { useState } from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import { employeeCreateSchema } from '@/lib/validators';
import { Users, Plus, Search, Filter, Trash2 } from 'lucide-react';

export default function AdminEmployeesPage() {
  const { allEmployees, addEmployee, deleteEmployee } = useAttendance();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [isCustomDesignation, setIsCustomDesignation] = useState(false);
  const [joiningDate, setJoiningDate] = useState('2026-07-25');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Default & Dynamic Designations List
  const defaultDesignations = [
    'Software Engineer',
    'Senior Frontend Engineer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Lead Designer',
    'Product Manager',
    'HR Director',
    'HR Specialist',
    'QA Engineer',
    'DevOps Engineer',
    'Data Analyst',
    'System Administrator',
  ];

  const uniqueExistingDesignations = Array.from(
    new Set(allEmployees.map((e) => e.designation).filter(Boolean))
  );

  const availableDesignations = Array.from(
    new Set([...defaultDesignations, ...uniqueExistingDesignations])
  );

  const filteredEmployees = allEmployees.filter((emp) => {
    const isEmployee = emp.role === 'EMPLOYEE';
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return isEmployee && matchesSearch && matchesDept;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = employeeCreateSchema.safeParse({
      name,
      email,
      password,
      role,
      department,
      designation,
      joiningDate,
      phone,
    });

    if (!res.success) {
      setError(res.error.issues[0].message);
      return;
    }

    addEmployee({
      name,
      email,
      password,
      role,
      department,
      designation,
      joiningDate,
      phone,
      status: 'ACTIVE',
    });

    setShowModal(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Employee Directory
          </h1>
          <p className="text-xs text-slate-500">View, register, or deactivate employee profiles</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or code..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>
      </div>

      {/* Main Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Department & Designation</th>
                <th className="px-4 py-3">Joining Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div>{emp.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{emp.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600 font-semibold">{emp.employeeId}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900 font-medium">{emp.designation}</div>
                    <div className="text-[11px] text-slate-500">{emp.department}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{emp.joiningDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      title="Deactivate Account"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" /> Register New Employee
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@ems.com"
                  className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set employee password (min 6 characters)"
                  className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <select
                  value={isCustomDesignation ? 'CUSTOM' : designation}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomDesignation(true);
                      setDesignation('');
                    } else {
                      setIsCustomDesignation(false);
                      setDesignation(e.target.value);
                    }
                  }}
                  className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  {availableDesignations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Add Custom Designation...</option>
                </select>

                {isCustomDesignation && (
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Type custom designation title..."
                    className="w-full mt-1.5 py-1.5 px-3 bg-slate-50 border border-blue-400 rounded-lg text-xs text-slate-900"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
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
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
