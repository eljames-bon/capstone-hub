/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, UserRole } from '../types';
import { UserCheck, ShieldAlert, Award, GraduationCap, RefreshCw, LogOut } from 'lucide-react';

interface RoleSelectorProps {
  users: User[];
  currentUser: User;
  onUserChange: (user: User) => void;
  onResetDb: () => void;
  isResetting: boolean;
  onLogout: () => void;
}

export default function RoleSelector({ 
  users, 
  currentUser, 
  onUserChange, 
  onResetDb,
  isResetting,
  onLogout
}: RoleSelectorProps) {
  // Group users by role for organized dropdown/selection
  const students = users.filter(u => u.role === 'STUDENT');
  const advisers = users.filter(u => u.role === 'ADVISER');
  const panelists = users.filter(u => u.role === 'PANELIST');
  const admins = users.filter(u => u.role === 'ADMIN');

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'ADVISER': return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'PANELIST': return <Award className="w-4 h-4 text-amber-600" />;
      default: return <GraduationCap className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'ADVISER': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PANELIST': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div id="role-selector-container" className="bg-[#0f172a] text-slate-100 shadow-lg px-4 py-3 md:px-6 relative z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Branding & Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 text-white p-1.5 rounded-lg border border-slate-700 font-bold tracking-tight text-lg shadow-sm flex items-center gap-1.5">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold font-sans">
              CH
            </div>
            <span className="pr-1 text-sm font-bold tracking-tight">CapstoneHub</span>
          </div>
          <div className="hidden lg:block text-xs text-slate-400 border-l border-slate-850 pl-3">
            <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-semibold uppercase tracking-wider text-blue-400">
              ⚡ PLATFORM PROTOCOL
            </span>
          </div>
        </div>

        {/* Simulator controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 min-w-max">
            <span>Current Role Session:</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getRoleBadgeColor(currentUser.role)}`}>
              {currentUser.role}
            </span>
          </div>

          <div className="relative inline-block">
            <select
              value={currentUser.id}
              onChange={(e) => {
                const targetUser = users.find(u => u.id === e.target.value);
                if (targetUser) onUserChange(targetUser);
              }}
              className="bg-slate-900 text-slate-50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer pr-8 hover:bg-slate-850 transition duration-150 w-64 shadow-md"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              id="role-switch-dropdown"
            >
              <optgroup label="👑 EXECUTIVE/ADMIN" className="bg-slate-900 text-slate-300">
                {admins.map(u => (
                  <option key={u.id} value={u.id}>👑 {u.name} (Dean/Admin)</option>
                ))}
              </optgroup>
              <optgroup label="🎓 ADVISERS (FACULTY)" className="bg-slate-900 text-slate-300">
                {advisers.map(u => (
                  <option key={u.id} value={u.id}>👨‍🏫 {u.name}</option>
                ))}
              </optgroup>
              <optgroup label="🎖️ PANELIST MEMBERS" className="bg-slate-900 text-slate-300">
                {panelists.map(u => (
                  <option key={u.id} value={u.id}>⚖️ {u.name}</option>
                ))}
              </optgroup>
              <optgroup label="👦 STUDENTS" className="bg-slate-900 text-slate-300">
                {students.map(u => (
                  <option key={u.id} value={u.id}>📝 {u.name} ({u.name === 'benok' ? 'Group 1' : u.name === 'roni' ? 'Group 2' : u.name === 'erick' ? 'Group 3' : 'Group Spark'})</option>
                ))}
              </optgroup>
            </select>
            {/* Visual indicator custom arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          <button
            onClick={onResetDb}
            disabled={isResetting}
            title="Reset system database state to defaults"
            className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 rounded-lg px-3 py-1.5 transition-all duration-150 flex items-center gap-1.5 text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
            id="reset-db-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? "Re-seeding..." : "Reset Data"}</span>
          </button>

          <button
            onClick={onLogout}
            title="Log out of session"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 transition-all duration-150 flex items-center gap-1.5 text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
            id="session-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-450" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
