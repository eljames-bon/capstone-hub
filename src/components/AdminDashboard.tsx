/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, User, DefenseSchedule, Announcement, UserRole } from '../types';
import { 
  Users, 
  MapPin, 
  Plus, 
  Trash2, 
  Calendar, 
  Megaphone, 
  FolderEdit, 
  Grid,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  GraduationCap
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  projects: Project[];
  schedules: DefenseSchedule[];
  announcements: Announcement[];
  onCreateUser: (user: { name: string; email: string; role: string }) => void;
  onDeleteUser: (id: string) => void;
  onUpdateProject: (id: string, data: Partial<Project>) => void;
  onCreateSchedule: (sched: { projectId: string; date: string; time: string; venue: string; panelistIds: string[] }) => void;
  onCreateAnnouncement: (ann: { title: string; content: string }) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export default function AdminDashboard({
  currentUser,
  users,
  projects,
  schedules,
  announcements,
  onCreateUser,
  onDeleteUser,
  onUpdateProject,
  onCreateSchedule,
  onCreateAnnouncement,
  onDeleteAnnouncement
}: AdminDashboardProps) {
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'USERS' | 'SCHEDULING' | 'COHORTS' | 'ANNOUNCEMENTS'>('USERS');

  // Form states: New User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('STUDENT');

  // Form states: New Schedule
  const [schedProjId, setSchedProjId] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('09:00 AM - 11:00 AM');
  const [schedVenue, setSchedVenue] = useState('Conference Hall A');
  const [schedPanelist1, setSchedPanelist1] = useState('');
  const [schedPanelist2, setSchedPanelist2] = useState('');

  // Form states: New Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Editing Adviser assignment
  const [editProjId, setEditProjId] = useState<string>('');
  const [selectedAdviserId, setSelectedAdviserId] = useState<string>('');

  const advisers = users.filter(u => u.role === 'ADVISER');
  const panelists = users.filter(u => u.role === 'PANELIST');

  // Form submissions
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    onCreateUser({ name: newUserName, email: newUserEmail, role: newUserRole });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('STUDENT');
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedProjId || !schedDate || !schedPanelist1 || !schedPanelist2) return;
    onCreateSchedule({
      projectId: schedProjId,
      date: schedDate,
      time: schedTime,
      venue: schedVenue,
      panelistIds: [schedPanelist1, schedPanelist2]
    });
    // Reset
    setSchedProjId('');
    setSchedDate('');
    setSchedPanelist1('');
    setSchedPanelist2('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    onCreateAnnouncement({ title: annTitle, content: annContent });
    setAnnTitle('');
    setAnnContent('');
  };

  const handleSaveAdviserChange = (projId: string) => {
    if (selectedAdviserId) {
      onUpdateProject(projId, { adviserId: selectedAdviserId });
      setEditProjId('');
    }
  };

  return (
    <div id="admin-management-system" className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0 hover:shadow-md transition duration-200">
      
      {/* Top Controller Tab headers */}
      <div className="bg-slate-50/80 border-b border-slate-150 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>University Core Registrar Management Console</span>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {[
            { id: 'USERS', name: 'User Management', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'SCHEDULING', name: 'Defense Scheduling', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'COHORTS', name: 'Thesis Assignments', icon: <FolderEdit className="w-3.5 h-3.5" /> },
            { id: 'ANNOUNCEMENTS', name: 'Bulletins / Alerts', icon: <Megaphone className="w-3.5 h-3.5" /> }
          ].map(tab => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-bold transition duration-150 cursor-pointer ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: USERS */}
        {activeTab === 'USERS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create form */}
            <div className="col-span-1 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-900" />
                <span>Onboard New User Access</span>
              </h3>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Full Human Name</label>
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Pendragon"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Official Institutional Email</label>
                  <input 
                    type="email" 
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    placeholder="e.g. arthur@university.edu"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Assigned Domain Role</label>
                  <select 
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-bold"
                  >
                    <option value="STUDENT">Student Member</option>
                    <option value="ADVISER">Adviser (Faculty)</option>
                    <option value="PANELIST">Panelist (Oral Jury)</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 border border-blue-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider hover:bg-blue-700 cursor-pointer shadow transition-all active:scale-95 duration-150"
                >
                  Onboard Account
                </button>
              </form>
            </div>

            {/* Account directory table */}
            <div className="col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Account Directory Registry</h3>
              
              <div className="border rounded-xl spill-x overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="p-3">User Name</th>
                      <th className="p-3">Contact Email</th>
                      <th className="p-3">Assigned Role</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => {
                      const getRoleBadge = (role: UserRole) => {
                        switch (role) {
                          case 'ADMIN': return 'bg-rose-100 text-rose-800 border-rose-200';
                          case 'ADVISER': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          case 'PANELIST': return 'bg-amber-100 text-amber-800 border-amber-200';
                          default: return 'bg-blue-100 text-blue-800 border-blue-200';
                        }
                      };

                      return (
                        <tr key={u.id} className="hover:bg-gray-50/50 font-medium">
                          <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                          <td className="p-3 font-mono text-gray-500">{u.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getRoleBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {u.id !== currentUser.id && (
                              <button 
                                onClick={() => onDeleteUser(u.id)}
                                title="Remove Onboarded User"
                                className="text-rose-600 hover:text-rose-900 p-1 hover:bg-rose-50 rounded transition max-w-max cursor-pointer inline-flex items-center"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULING */}
        {activeTab === 'SCHEDULING' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Schedule form */}
            <div className="col-span-1 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                <Calendar className="w-4 h-4 text-blue-900" />
                <span>Book Defense Schedule</span>
              </h3>

              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Select Study Cohort</label>
                  <select 
                    value={schedProjId}
                    onChange={e => setSchedProjId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                    required
                  >
                    <option value="">-- Choose project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Date</label>
                    <input 
                      type="date" 
                      value={schedDate}
                      onChange={e => setSchedDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Time Block</label>
                    <input 
                      type="text" 
                      value={schedTime}
                      onChange={e => setSchedTime(e.target.value)}
                      placeholder="e.g. 10:00 AM - 12:00 PM"
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Venue / Physical / Virtual Lab</label>
                  <input 
                    type="text" 
                    value={schedVenue}
                    onChange={e => setSchedVenue(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Primary Panelist</label>
                    <select 
                      value={schedPanelist1}
                      onChange={e => setSchedPanelist1(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800"
                      required
                    >
                      <option value="">-- Option 1 --</option>
                      {panelists.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Secondary Panelist</label>
                    <select 
                      value={schedPanelist2}
                      onChange={e => setSchedPanelist2(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800"
                      required
                    >
                      <option value="">-- Option 2 --</option>
                      {panelists.filter(p => p.id !== schedPanelist1).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 border border-blue-500 text-white font-bold py-2 rounded-lg text-xs uppercase hover:bg-blue-700 cursor-pointer shadow transition-all active:scale-95 duration-150"
                >
                  Publish Schedule
                </button>
              </form>
            </div>

            {/* Active Schedule bookings */}
            <div className="col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Scheduled Oral Thesis Board Sessions</h3>

              <div className="grid grid-cols-1 gap-3">
                {schedules.length > 0 ? (
                  schedules.map(sch => (
                    <div key={sch.id} className="p-4 bg-indigo-50/50 border border-indigo-150/40 rounded-xl space-y-2.5 flex items-start justify-between">
                      <div className="space-y-1.5 pr-2.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[8px] font-extrabold uppercase bg-indigo-200 text-indigo-900 px-1 py-0.2 rounded border border-indigo-350">
                            Session Locked
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold font-mono">ID: {sch.id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 leading-snug">{sch.projectTitle}</h4>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500 font-medium">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {sch.date} at {sch.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {sch.venue}</span>
                        </div>

                        <div className="pt-2 border-t border-indigo-100">
                          <span className="text-[9px] font-bold text-indigo-950 uppercase block">Board Jury Panelists:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {sch.panelistNames.map((name, i) => (
                              <span key={i} className="bg-white border border-indigo-250/50 text-[10px] font-semibold text-indigo-800 px-2 py-0.5 rounded shadow-sm">
                                ⚖️ {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-10 border border-dashed rounded-xl">No active defense configurations posted.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: COHORTS Thesis status */}
        {activeTab === 'COHORTS' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-widest mb-1.5">Registered Academic Capstones</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => {
                const isEditing = p.id === editProjId;
                return (
                  <div key={p.id} className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-blue-100 text-blue-900 border font-extrabold px-1.5 rounded uppercase">
                          {p.course}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                          {p.status.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{p.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">Cohort list: {p.members.join(', ')}</p>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between gap-1 border-dashed">
                      <div className="text-[10px]">
                        <span className="text-gray-400 uppercase font-bold text-[8px] block">Project Adviser:</span>
                        {isEditing ? (
                          <div className="flex space-x-1.5 mt-1">
                            <select 
                              value={selectedAdviserId}
                              onChange={e => setSelectedAdviserId(e.target.value)}
                              className="bg-white border text-xs text-gray-800 p-1 rounded font-semibold focus:outline-none"
                            >
                              <option value="">-- Reassign --</option>
                              {advisers.map(adv => (
                                <option key={adv.id} value={adv.id}>{adv.name}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleSaveAdviserChange(p.id)}
                              className="bg-emerald-600 text-white text-[10px] font-bold px-2 rounded hover:bg-emerald-700"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditProjId('')}
                              className="text-gray-400 text-xs px-1 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-indigo-950 font-sans">{p.adviserName || "🚨 Unassigned Faculty"}</span>
                        )}
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditProjId(p.id);
                            setSelectedAdviserId(p.adviserId || '');
                          }}
                          className="border text-[10px] text-blue-900 border-blue-200 bg-blue-50/20 px-2 py-1 rounded hover:bg-blue-50 font-extrabold cursor-pointer h-max"
                        >
                          Assign Adviser
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Announcement form */}
            <div className="col-span-1 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>Publish New Bulletin Alert</span>
              </h3>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-605 uppercase mb-1">Advisory Title</label>
                  <input 
                    type="text" 
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    placeholder="e.g. Schedule Oral Board Updates..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-605 uppercase mb-1">Context</label>
                  <textarea 
                    rows={4}
                    value={annContent}
                    onChange={e => setAnnContent(e.target.value)}
                    placeholder="Input detailed university announcements text..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 border border-blue-500 text-white font-bold py-2 rounded-lg text-xs uppercase hover:bg-blue-700 cursor-pointer shadow transition-all active:scale-95 duration-150"
                >
                  Broadcast Bulletin
                </button>
              </form>
            </div>

            {/* List announcements */}
            <div className="col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Active Broadcast Bulletins</h3>

              <div className="space-y-3">
                {announcements.length > 0 ? (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-4 border rounded-xl bg-white shadow-sm space-y-2 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 text-indigo-950 font-bold">
                          <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded">System Alert</span>
                          <h4 className="text-xs leading-snug">{ann.title}</h4>
                        </div>
                        <p className="text-[11px] text-gray-600 text-justify font-semibold">{ann.content}</p>
                        
                        <div className="flex items-center justify-between text-[8px] text-gray-400 font-bold pt-1 uppercase">
                          <span>Department: {ann.author}</span>
                          <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                        title="Remove Broadcast Bulletin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-10">No active broadcast bulletins currently posted.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
