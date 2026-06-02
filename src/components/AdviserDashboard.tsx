/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, DocumentVersion, Comment, User, DocumentStatus } from '../types';
import { 
  FolderLock, 
  MessageSquare, 
  CheckCircle, 
  XSquare, 
  ExternalLink, 
  Send,
  UserCheck,
  Grid,
  FileText,
  Clock,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

interface AdviserDashboardProps {
  currentUser: User;
  projects: Project[];
  documents: DocumentVersion[];
  comments: Comment[];
  onUpdateDocumentStatus: (documentId: string, status: DocumentStatus) => void;
  onAddComment: (comm: { projectId: string; documentId?: string; content: string }) => void;
  onUpdateProjectStatus: (projectId: string, status: Project['status']) => void;
}

export default function AdviserDashboard({
  currentUser,
  projects,
  documents,
  comments,
  onUpdateDocumentStatus,
  onAddComment,
  onUpdateProjectStatus
}: AdviserDashboardProps) {
  // Find projects assigned to this Adviser
  const myProjects = projects.filter(p => p.adviserId === currentUser.id);

  // Selected project for detailed review
  const [activeProjId, setActiveProjId] = useState<string>(myProjects[0]?.id || '');

  // Select document for file drawer comment/approve simulation
  const [reviewDocId, setReviewDocId] = useState<string>('');
  const [commentVal, setCommentVal] = useState('');

  // Handle default selected project fallback
  React.useEffect(() => {
    if (myProjects.length > 0 && !activeProjId) {
      setActiveProjId(myProjects[0].id);
    }
  }, [myProjects, activeProjId]);

  const activeProject = projects.find(p => p.id === activeProjId);
  const activeDocs = activeProject ? documents.filter(d => d.projectId === activeProject.id) : [];
  const activeReviewDoc = documents.find(d => d.id === reviewDocId);
  const docComments = activeReviewDoc ? comments.filter(c => c.documentId === activeReviewDoc.id) : [];

  const handleStatusChange = (status: DocumentStatus) => {
    if (reviewDocId) {
      onUpdateDocumentStatus(reviewDocId, status);
    }
  };

  const handlePostReviewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentVal.trim() || !activeProject) return;
    onAddComment({
      projectId: activeProject.id,
      documentId: reviewDocId || undefined,
      content: commentVal
    });
    setCommentVal('');
  };

  const handleGiveDefenseApproval = () => {
    if (activeProject) {
      onUpdateProjectStatus(activeProject.id, 'DEFENSE');
    }
  };

  return (
    <div id="adviser-portal" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Side column: Cohorts List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition duration-200">
          <div className="flex items-center space-x-2 border-b pb-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900">Assigned Cohorts</h3>
          </div>

          <div className="space-y-2">
            {myProjects.length > 0 ? (
              myProjects.map((p, idx) => {
                const isActive = p.id === activeProjId;
                const pendingCount = documents.filter(d => d.projectId === p.id && d.status === 'PENDING').length;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjId(p.id);
                      setReviewDocId('');
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition duration-200 flex flex-col justify-between hover:bg-gray-50 focus:outline-none cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 bg-blue-50/10 shadow-sm font-semibold' 
                        : 'border-slate-150 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] bg-blue-100 text-blue-800 border font-extrabold px-1.5 py-0.5 rounded">
                        {p.course.replace('BS ', '')}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{p.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Members: {p.members.length}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-gray-200">
                      <span className="text-[9px] font-bold text-gray-600 capitalize">
                        Status: {p.status.toLowerCase().replace('_', ' ')}
                      </span>
                      {pendingCount > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          🔥 {pendingCount} Pending
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-4">No groups assigned to you.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main & Review column */}
      <div className="lg:col-span-3 space-y-6">
        {activeProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Project Details and Submissions */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition duration-200">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                      {activeProject.course}
                    </span>
                    <span className="text-[10px] bg-slate-50 border text-gray-500 font-semibold rounded px-1.5 py-0.5 font-mono">
                      ID: {activeProject.id}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mt-1">{activeProject.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">Authors: <span className="font-semibold text-gray-700">{activeProject.members.join(', ')}</span></p>
                </div>

                <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/50">
                  <h4 className="text-[11px] font-bold text-indigo-950 uppercase tracking-wide mb-1">Abstract Presentation</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify line-clamp-4 font-semibold">
                    {activeProject.abstract}
                  </p>
                </div>

                {/* Timeline and readiness approval */}
                <div className="flex items-center justify-between p-3.5 bg-amber-50/30 border border-amber-200/50 rounded-xl">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-amber-900">Defense Readiness Audit</h5>
                    <p className="text-[10px] text-gray-500 font-semibold">
                      {activeProject.status === 'FINAL_MANUSCRIPT' 
                        ? 'Consolidated document complete. Approve to unlock oral defense scheduling.'
                        : activeProject.status === 'DEFENSE' 
                        ? 'Defense period active. Awaiting panelist consensus.'
                        : activeProject.status === 'COMPLETED'
                        ? 'Project formally completed.'
                        : 'Awaiting remaining structural chapter manuscript drafts.'
                      }
                    </p>
                  </div>

                  {activeProject.status === 'FINAL_MANUSCRIPT' && (
                    <button 
                      onClick={handleGiveDefenseApproval}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow cursor-pointer uppercase tracking-wider transition"
                    >
                      👍 Core Approve
                    </button>
                  )}
                </div>
              </div>

              {/* Manuscript chapter checklist */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition duration-200">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Manuscript Chapter Submissions</h3>
                
                <div className="divide-y divide-gray-50">
                  {[1, 2, 3, 4, 5].map(chapterNum => {
                    const chapterDocs = activeDocs.filter(d => d.chapter === chapterNum)
                      .sort((a,b) => b.uploadedAt.localeCompare(a.uploadedAt));
                    const latestDoc = chapterDocs[0];

                    return (
                      <div key={chapterNum} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-start space-x-2.5">
                          <div className={`p-1.5 rounded ${latestDoc ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-400'}`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-bold text-gray-900">Chapter {chapterNum}</h4>
                              {latestDoc && (
                                <span className="bg-blue-50 text-blue-800 text-[8px] font-extrabold px-1 rounded">
                                  {latestDoc.version}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium truncate max-w-[180px]">
                              {latestDoc ? latestDoc.title : "Not submitted yet"}
                            </p>
                          </div>
                        </div>

                        <div>
                          {latestDoc ? (
                            <button
                              onClick={() => {
                                setReviewDocId(latestDoc.id);
                              }}
                              className={`text-[10px] font-bold rounded px-2 py-1 flex items-center gap-1 border transition cursor-pointer ${
                                reviewDocId === latestDoc.id 
                                  ? 'bg-blue-600 text-white border-blue-500' 
                                  : latestDoc.status === 'PENDING'
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <span>{latestDoc.status === 'PENDING' ? '🔔 Evaluate' : 'View File'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold uppercase italic">Awaiting</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Document Side Drawer reviewer */}
            <div className="lg:col-span-2">
              {activeReviewDoc ? (
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between h-auto hover:shadow-md transition duration-200">
                  <div className="border-b pb-3 space-y-1">
                    <span className="text-[8px] font-extrabold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded uppercase">
                      Chapter {activeReviewDoc.chapter} review tool
                    </span>
                    <h3 className="text-xs font-bold text-gray-950 mt-1 line-clamp-1">{activeReviewDoc.title}</h3>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 font-mono">
                      <span>Version: {activeReviewDoc.version}</span>
                      <span>By {activeReviewDoc.uploadedBy}</span>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">Change Status:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusChange('APPROVED')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center space-x-1 transition cursor-pointer ${
                          activeReviewDoc.status === 'APPROVED'
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm font-extrabold'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange('REVISION_REQUESTED')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center space-x-1 transition cursor-pointer ${
                          activeReviewDoc.status === 'REVISION_REQUESTED'
                            ? 'bg-rose-600 border-rose-500 text-white shadow-sm font-extrabold'
                            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <XSquare className="w-3.5 h-3.5" />
                        <span>Request Rev</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments log inside review */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">Comments history ({docComments.length}):</span>
                    
                    <div className="h-44 overflow-y-auto border border-gray-100 rounded-lg p-2 bg-gray-50/50 space-y-2 font-sans" id="comment-drawer-scroller">
                      {docComments.length > 0 ? (
                        docComments.map((c, i) => (
                          <div key={i} className="text-[11px] leading-relaxed p-2 rounded-lg bg-white border border-gray-100 shadow-sm font-medium">
                            <div className="flex items-center justify-between mb-0.5 text-[8px] font-bold text-indigo-900 border-b pb-0.5 border-gray-50">
                              <span>{c.userName} ({c.userRole})</span>
                              <span className="text-gray-400 font-mono font-normal">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-800 leading-normal">{c.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-400 italic text-center py-8">No comments linked. Leave guidelines below.</p>
                      )}
                    </div>
                  </div>

                  {/* Submission and Ping */}
                  <form onSubmit={handlePostReviewComment} className="flex items-center space-x-1 shadow-sm border rounded-lg p-1">
                    <input 
                      type="text" 
                      value={commentVal}
                      onChange={e => setCommentVal(e.target.value)}
                      placeholder="Comment text feedback..."
                      className="flex-1 px-2.5 py-1 text-xs border-none focus:outline-none focus:ring-0 text-gray-800 font-medium"
                      required
                    />
                    <button 
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-1 text-[11px] font-bold rounded-md hover:bg-blue-700 flex items-center space-x-1 duration-150 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl flex flex-col items-center justify-center text-center h-[340px]">
                  <FolderLock className="w-8 h-8 opacity-40 mb-1.5 text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">No Chapter Selected</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[150px]">Select a chapter view draft on the left to start checking and provide status changes.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl border border-slate-200/80 shadow-sm text-center text-slate-400">
            No Capstone Cohorts or assigned cohorts registered in your portfolio.
          </div>
        )}
      </div>

    </div>
  );
}
