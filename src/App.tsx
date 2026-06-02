/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Project, 
  DocumentVersion, 
  Comment, 
  DefenseSchedule, 
  Evaluation, 
  Notification, 
  Announcement,
  DocumentStatus,
  UserRole
} from './types';

// Custom portal views
import RoleSelector from './components/RoleSelector';
import StudentDashboard from './components/StudentDashboard';
import AdviserDashboard from './components/AdviserDashboard';
import PanelistDashboard from './components/PanelistDashboard';
import AdminDashboard from './components/AdminDashboard';
import StatsGrid from './components/StatsGrid';
import LoginPortal from './components/LoginPortal';

// Motion animations
import { motion, AnimatePresence } from 'motion/react';

// Icons
import { 
  Bell, 
  Flame, 
  ChevronDown, 
  Layers, 
  GraduationCap, 
  UserCheck, 
  Award, 
  ShieldAlert, 
  Check, 
  RefreshCw, 
  Info, 
  X,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  // DB States
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<DocumentVersion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [schedules, setSchedules] = useState<DefenseSchedule[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Simulation parameters
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showKPIAnalytics, setShowKPIAnalytics] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch full state from backend Express instance
  const loadDatabaseState = async () => {
    try {
      const res = await fetch("/api/db");
      if (!res.ok) throw new Error("Backend offline");
      const db = await res.json();
      
      setUsers(db.users || []);
      setProjects(db.projects || []);
      setDocuments(db.documents || []);
      setComments(db.comments || []);
      setSchedules(db.schedules || []);
      setEvaluations(db.evaluations || []);
      setNotifications(db.notifications || []);
      setAnnouncements(db.announcements || []);

      // If current user is not established yet, lock first Student benok (u-stud-1)
      if (!currentUser && db.users?.length > 0) {
        const student = db.users.find((u: User) => u.id === 'u-stud-1') || db.users[0];
        setCurrentUser(student);
      }
      setLoading(false);
    } catch (err) {
      console.error("Database loading exception", err);
      // Wait and retry
      setErrorCount(prev => prev + 1);
      setTimeout(loadDatabaseState, 2000);
    }
  };

  useEffect(() => {
    loadDatabaseState();
  }, []);

  // Show a simulation toast alert
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // State mutation wrappers that post to Express server to persist changes
  const handleResetDb = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/db/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        // Update local states
        setUsers(data.db.users);
        setProjects(data.db.projects);
        setDocuments(data.db.documents);
        setComments(data.db.comments);
        setSchedules(data.db.schedules);
        setEvaluations(data.db.evaluations);
        setNotifications(data.db.notifications);
        setAnnouncements(data.db.announcements);
        
        // Relock benok (u-stud-1) as current active simulation account
        const student = data.db.users.find((u: User) => u.id === 'u-stud-1');
        if (student) setCurrentUser(student);

        triggerToast("🎉 System state reset to university baseline standards successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleUserChange = (newUser: User) => {
    setCurrentUser(newUser);
    triggerToast(`💻 Simulating session as: ${newUser.name} (${newUser.role})`);
    setShowNotifications(false);
  };

  const handleAddProject = async (proj: { title: string; abstract: string; course: string; members: string[] }) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...proj,
          userId: currentUser?.id,
          userName: currentUser?.name
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("🚀 Your new Capstone proposal is filed! mr.adviser assigned as adviser.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateMembers = async (projectId: string, members: string[]) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("👥 Cohort group list synced successfully on server.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadDocument = async (doc: { projectId: string; title: string, chapter: number }) => {
    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...doc,
          uploadedBy: currentUser?.name
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast(`📁 Chapter ${doc.chapter} draft uploaded! Evaluator notified for revision review.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDocumentStatus = async (documentId: string, status: DocumentStatus) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          advisorName: currentUser?.name
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast(`📌 Submission draft marked as: ${status}. Author members notified.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, status: Project['status']) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast(`🛡️ Project state updated to ${status}. Readiness approved.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (comm: { projectId: string; documentId?: string; content: string }) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...comm,
          userId: currentUser?.id,
          userName: currentUser?.name,
          userRole: currentUser?.role
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("✍️ Feedback comment pinned. Notify alerts dispatched.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSchedule = async (sched: { projectId: string; date: string; time: string; venue: string; panelistIds: string[] }) => {
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sched)
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("📅 Public defense scheduling successfully published and panelists assigned.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProjectMetadata = async (projectId: string, metadata: Partial<Project>) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata)
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("📁 Project details updated successfully of core registrar.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitEvaluation = async (evalData: {
    projectId: string;
    panelistId: string;
    panelistName: string;
    scoreContent: number;
    scorePresent: number;
    scoreTechnical: number;
    scoreQA: number;
    remarks: string;
    verdict: Evaluation['verdict'];
  }) => {
    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evalData)
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast(`🏅 Evaluation lock score submitted! Collective consensus verdict: ${evalData.verdict}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateUser = async (user: { name: string; email: string; role: string }) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast(`👤 Onboarded entry account: ${user.name} established in domain.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("👤 Account deleted of registrar directory.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAnnouncement = async (ann: { title: string; content: string }) => {
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ann,
          author: currentUser?.name
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("📢 New advisory announcement broadcasted of standard alerts.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadDatabaseState();
        triggerToast("📢 Broadcast bulletin archived.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationsAsRead = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (res.ok) {
        await loadDatabaseState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Render proper role-based module views
  const renderDashboardByRole = () => {
    if (!currentUser) return null;
    
    switch (currentUser.role) {
      case 'STUDENT':
        return (
          <StudentDashboard
            currentUser={currentUser}
            projects={projects}
            documents={documents}
            comments={comments}
            announcements={announcements}
            onAddProject={handleAddProject}
            onUpdateMembers={handleUpdateMembers}
            onUploadDocument={handleUploadDocument}
            onAddComment={handleAddComment}
          />
        );
      case 'ADVISER':
        return (
          <AdviserDashboard
            currentUser={currentUser}
            projects={projects}
            documents={documents}
            comments={comments}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            onAddComment={handleAddComment}
            onUpdateProjectStatus={handleUpdateProjectStatus}
          />
        );
      case 'PANELIST':
        return (
          <PanelistDashboard
            currentUser={currentUser}
            projects={projects}
            documents={documents}
            schedules={schedules}
            evaluations={evaluations}
            onSubmitEvaluation={handleSubmitEvaluation}
          />
        );
      case 'ADMIN':
        return (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            projects={projects}
            schedules={schedules}
            announcements={announcements}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateProject={handleUpdateProjectMetadata}
            onCreateSchedule={handleCreateSchedule}
            onCreateAnnouncement={handleCreateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );
      default:
        return null;
    }
  };

  const getRoleHeaderStyle = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'border-l-4 border-rose-500 bg-white';
      case 'ADVISER': return 'border-l-4 border-emerald-500 bg-white';
      case 'PANELIST': return 'border-l-4 border-amber-500 bg-white';
      default: return 'border-l-4 border-blue-500 bg-white';
    }
  };

  const unreadNotifications = currentUser 
    ? notifications.filter(n => n.userId === currentUser.id && !n.isRead)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-gray-500 font-sans">
        <RefreshCw className="w-8 h-8 text-blue-900 animate-spin mb-4" />
        <h2 className="text-sm font-bold text-gray-800">Booting CapstoneHub Full-Stack Database Engine...</h2>
        <p className="text-xs text-gray-400 mt-1">Establishing JSON schema maps of academic cohorts</p>
        {errorCount > 0 && (
          <p className="text-[10px] text-amber-600 font-semibold mt-3">Connection retry attempts: {errorCount}. Keeping dev host bound...</p>
        )}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPortal 
        users={users} 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          triggerToast(`🔒 Authenticated as ${user.name} (${user.role}). Redirecting...`);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      
      {/* Top simulator switcher */}
      <RoleSelector 
        users={users} 
        currentUser={currentUser!} 
        onUserChange={handleUserChange}
        onResetDb={handleResetDb}
        isResetting={isResetting}
        onLogout={() => {
          setIsLoggedIn(false);
          triggerToast("👋 Ended session. Securely logged out of OMSC Academic Portal.");
        }}
      />

      {/* Main navigation, greetings, and dynamic content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-6 space-y-6">
        
        {/* Active Header Greeting & Notification Tray */}
        <div className={`p-5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm ${currentUser ? getRoleHeaderStyle(currentUser.role) : ''}`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm uppercase">
              {currentUser?.name.substring(0, 2)}
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wide text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ⭐ {currentUser?.role} MODE
              </span>
              <h2 className="text-base font-bold text-gray-900 leading-none">
                Welcome back, {currentUser?.name}!
              </h2>
              <p className="text-xs text-gray-400 font-medium">Session contact: {currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto relative">
            
            {/* Quick Analytics toggle */}
            <button
              onClick={() => setShowKPIAnalytics(!showKPIAnalytics)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition duration-150 cursor-pointer shadow-sm"
              id="kpi-panel-toggle"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showKPIAnalytics ? "Hide Analytics" : "Show Analytics"}</span>
            </button>

            {/* Bell icon with alert counter */}
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadNotifications.length > 0) {
                  handleMarkNotificationsAsRead();
                }
              }}
              className="relative p-2 rounded-full border border-gray-200 hover:bg-gray-50 focus:outline-none transition cursor-pointer"
              id="bell-icon-notif"
            >
              <Bell className="w-4.5 h-4.5 text-gray-600" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold ring-2 ring-white">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Tray */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-11 bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-72 z-50 space-y-3 font-sans"
                  id="notifications-tray-dropdown"
                >
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="text-xs font-bold text-indigo-950">Dispatched Notifications</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2.5 pr-0.5">
                    {currentUser && notifications.filter(n => n.userId === currentUser.id).length > 0 ? (
                      notifications
                        .filter(n => n.userId === currentUser.id)
                        .sort((a,b) => b.createdAt.localeCompare(a.createdAt))
                        .map((not, idx) => (
                          <div key={idx} className={`p-2.5 rounded-lg border text-[11px] leading-snug space-y-1 font-medium ${
                            not.isRead ? 'bg-gray-50 border-gray-150 text-gray-500' : 'bg-blue-50/50 border-blue-200 text-blue-950 font-semibold'
                          }`}>
                            <div className="flex justify-between items-start font-bold">
                              <span>{not.title}</span>
                              {!not.isRead && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1 shrink-0" />}
                            </div>
                            <p className="text-gray-600 leading-normal">{not.message}</p>
                            <span className="text-[8px] text-gray-400 block font-mono">{new Date(not.createdAt).toLocaleTimeString()}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-gray-400 italic text-center py-4">No recent notification dispatches.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Analytics Board Dashboard */}
        <AnimatePresence>
          {showKPIAnalytics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <StatsGrid 
                projects={projects}
                documents={documents}
                evaluations={evaluations}
                users={users}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main active role based panel */}
        <div id="active-functional-panel" className="transition-all duration-300">
          {renderDashboardByRole()}
        </div>

      </div>

      {/* Footer system indicators */}
      <footer id="system-metadata-footer" className="bg-white border-t border-slate-200/60 py-5 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2.5 text-gray-450 font-semibold uppercase tracking-wider">
          <span>CapstoneHub • Academic Dissertation Platform © 2026</span>
          <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-sm">
            <span className="text-emerald-500 animate-pulse">●</span>
            <span className="font-bold">SIMULATION PERSISTENCE ENABLED</span>
          </div>
        </div>
      </footer>

      {/* Floating Interactive Toast feedback component */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-slate-755 text-white py-3 px-5 rounded-2xl shadow-2xl z-50 flex items-center space-x-3.5 font-sans max-w-sm"
            id="simulation-alert-toast"
          >
            <div className="p-1 bg-blue-900/40 rounded border border-blue-500 text-blue-400 shrink-0">
              <Info className="w-4 h-4 animate-spin-slow" />
            </div>
            <p className="text-xs font-semibold leading-relaxed leading-snug">{toastMessage}</p>
            <button 
              onClick={() => setToastMessage(null)}
              className="hover:text-amber-500 font-extrabold focus:outline-none cursor-pointer text-gray-400 pl-1"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
