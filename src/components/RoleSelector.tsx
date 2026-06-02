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
      case 'ADMIN': return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'ADVISER': return <UserCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case 'PANELIST': return <Award className="w-3.5 h-3.5 text-amber-500" />;
      default: return <GraduationCap className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'ADVISER': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'PANELIST': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
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

        {/* Simulator controls - replaced user selector with read-only badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-850 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 shadow-inner">
            <div className="w-5 h-5 bg-[#1b4e80] text-slate-100 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm select-none">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[12px] leading-none text-slate-100">{currentUser.name}</span>
              <span className="text-[9px] text-slate-400 font-medium tracking-wide">Logged-in Account</span>
            </div>
            <div className="h-5 w-[1px] bg-slate-800 mx-1.5" />
            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold flex items-center gap-1 uppercase select-none ${getRoleBadgeColor(currentUser.role)}`}>
              {getRoleIcon(currentUser.role)}
              <span>{currentUser.role}</span>
            </span>
          </div>

          <button
            onClick={onResetDb}
            disabled={isResetting}
            title="Reset system database state to defaults"
            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg px-3 py-1.5 transition-all duration-150 flex items-center gap-1.5 text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
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
