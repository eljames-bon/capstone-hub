/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, DocumentVersion, Comment, User, DocumentStatus, Announcement } from '../types';
import { 
  FileUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  HelpCircle, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckSquare, 
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  projects: Project[];
  documents: DocumentVersion[];
  comments: Comment[];
  announcements: Announcement[];
  onAddProject: (p: { title: string; abstract: string; course: string; members: string[] }) => void;
  onUpdateMembers: (projectId: string, members: string[]) => void;
  onUploadDocument: (doc: { projectId: string; title: string, chapter: number }) => Promise<void>;
  onAddComment: (comm: { projectId: string; documentId?: string; content: string }) => void;
}

export default function StudentDashboard({
  currentUser,
  projects,
  documents,
  comments,
  announcements,
  onAddProject,
  onUpdateMembers,
  onUploadDocument,
  onAddComment
}: StudentDashboardProps) {
  // Check if student belongs to any project (either they match member names or we match them)
  const myProject = projects.find(p => p.members.includes(currentUser.name)) || projects[0]; // fallback to first for demonstration

  // Local state for project proposal form
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalAbstract, setProposalAbstract] = useState('');
  const [proposalCourse, setProposalCourse] = useState('BS Computer Science');
  const [proposalMembers, setProposalMembers] = useState<string[]>([currentUser.name]);
  const [newMemberName, setNewMemberName] = useState('');

  // Local state for draft uploads
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadChapter, setUploadChapter] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active document selection for leaving specific comments
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [chatContent, setChatContent] = useState('');

  // Manage member edits for existing project
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [tempMembers, setTempMembers] = useState<string[]>([]);

  // Initialize temp members
  React.useEffect(() => {
    if (myProject) {
      setTempMembers(myProject.members);
    }
  }, [myProject]);

  const handleProposeProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !proposalAbstract) return;
    onAddProject({
      title: proposalTitle,
      abstract: proposalAbstract,
      course: proposalCourse,
      members: proposalMembers
    });
    // Reset
    setProposalTitle('');
    setProposalAbstract('');
    setNewMemberName('');
  };

  const handleAddMemberToProposal = () => {
    if (newMemberName.trim() && proposalMembers.length < 5) {
      setProposalMembers([...proposalMembers, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleRemoveMemberFromProposal = (idx: number) => {
    setProposalMembers(proposalMembers.filter((_, i) => i !== idx));
  };

  const handleAddMemberToProject = () => {
    if (newMemberName.trim() && tempMembers.length < 5) {
      setTempMembers([...tempMembers, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleSaveMembers = () => {
    if (myProject) {
      onUpdateMembers(myProject.id, tempMembers);
      setIsEditingMembers(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProject || !uploadTitle) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    // Simulated network progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 1000));
    clearInterval(timer);
    
    await onUploadDocument({
      projectId: myProject.id,
      title: uploadTitle,
      chapter: Number(uploadChapter)
    });

    setIsUploading(false);
    setUploadTitle('');
    setUploadProgress(0);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatContent.trim() || !myProject) return;
    onAddComment({
      projectId: myProject.id,
      documentId: selectedDocId || undefined,
      content: chatContent
    });
    setChatContent('');
  };

  // Helper arrays
  const milestones = [
    { label: 'Proposal', statusKey: 'PROPOSAL', description: 'Chapters 1-3 draft approved' },
    { label: 'Development', statusKey: 'DEVELOPMENT', description: 'Prototyping & coding phase' },
    { label: 'Final Manuscript', statusKey: 'FINAL_MANUSCRIPT', description: 'Chapters 1-5 consolidation' },
    { label: 'Defense Review', statusKey: 'DEFENSE', description: 'Oral evaluation board' },
    { label: 'Completed', statusKey: 'COMPLETED', description: 'Final signed signature' }
  ];

  const getMilestoneIndex = (status: string) => {
    return milestones.findIndex(m => m.statusKey === status);
  };

  const getDocStatusStyle = (status: DocumentStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REVISION_REQUESTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const projMilestoneIdx = myProject ? getMilestoneIndex(myProject.status) : 0;

  // Filter current project's documents
  const myDocs = myProject ? documents.filter(d => d.projectId === myProject.id) : [];

  // Filter comments for active selection
  const activeComments = myProject 
    ? comments.filter(c => selectedDocId ? c.documentId === selectedDocId : c.projectId === myProject.id && !c.documentId)
    : [];

  return (
    <div id="student-portal" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT & MID COLUMNS: Project details, submission timeline  */}
      <div className="lg:col-span-2 space-y-6">
        
        {!myProject ? (
          /* NO PROJECT: SHOW FORM */
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 hover:shadow-md transition duration-200">
            <div className="flex items-center space-x-3 text-blue-900">
              <BookOpen className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">Propose a Capstone Project</h2>
                <p className="text-xs text-gray-400">Initialize your university portfolio by submitting your group abstract.</p>
              </div>
            </div>

            <form onSubmit={handleProposeProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={proposalTitle}
                  onChange={e => setProposalTitle(e.target.value)}
                  placeholder="e.g. Adaptive Reinforcement Learning or Smart IoT..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Abstract Synopsis</label>
                <textarea 
                  rows={4}
                  value={proposalAbstract}
                  onChange={e => setProposalAbstract(e.target.value)}
                  placeholder="Provide a summary highlighting problem statement, background studies, and primary outputs..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Enrolled Course</label>
                  <select 
                    value={proposalCourse}
                    onChange={e => setProposalCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    <option>BS Computer Science</option>
                    <option>BS Information Technology</option>
                    <option>BS Computer Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Add Cohort Member Names</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddMemberToProposal}
                      className="bg-blue-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {proposalMembers.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-150">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Group List (Max 5 students)</span>
                  <div className="flex flex-wrap gap-2">
                    {proposalMembers.map((mem, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1">
                        <span>{mem}</span>
                        {mem !== currentUser.name && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveMemberFromProposal(idx)}
                            className="hover:text-red-600 font-bold ml-1.5 focus:outline-none text-[10px] cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm transition hover:shadow-sm shadow active:scale-95 cursor-pointer duration-150"
              >
                File Capstone Project Proposal
              </button>
            </form>
          </div>
        ) : (
          /* DISPLAY ACTIVE GRAD PROJECT CARDS */
          <>
            {/* Project Basic Panel */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition duration-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] text-blue-800 font-extrabold uppercase bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200 tracking-wide">
                    {myProject.course}
                  </span>
                  <h1 className="text-xl font-bold text-indigo-950 mt-1">{myProject.title}</h1>
                  <p className="text-xs text-gray-500 mt-1">Adviser: <span className="font-semibold text-gray-800">{myProject.adviserName || "Unassigned"}</span></p>
                </div>
                
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full self-start capitalize">
                  🟢 Status: {myProject.status.toLowerCase().replace('_', ' ')}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Abstract Synopsis</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify bg-gray-50 p-3 rounded-lg border border-gray-100 font-medium">
                  {myProject.abstract}
                </p>
              </div>

              {/* Members Manager */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Group Members</h4>
                  {!isEditingMembers ? (
                    <div className="flex flex-wrap gap-2">
                      {myProject.members.map((mem, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 border border-gray-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                          {mem}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tempMembers.map((mem, i) => (
                          <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center">
                            <span>{mem}</span>
                            <button 
                              type="button" 
                              onClick={() => setTempMembers(tempMembers.filter((_, idx) => idx !== i))}
                              className="ml-1.5 focus:outline-none text-rose-500 font-extrabold cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          value={newMemberName}
                          onChange={e => setNewMemberName(e.target.value)}
                          placeholder="Add student..."
                          className="px-2.5 py-1.5 border border-gray-200 rounded text-xs text-gray-800 w-44"
                        />
                        <button 
                          onClick={handleAddMemberToProject}
                          className="bg-blue-900 text-white text-xs px-2.5 rounded font-bold hover:bg-blue-800"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {!isEditingMembers ? (
                    <button 
                      onClick={() => {
                        setTempMembers(myProject.members);
                        setIsEditingMembers(true);
                      }}
                      className="text-[11px] text-blue-700 hover:text-blue-900 border border-blue-300 rounded-lg px-2.5 py-1 hover:bg-blue-50 font-bold transition duration-200 tracking-tight"
                    >
                      Manage Members
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setIsEditingMembers(false)}
                        className="text-[11px] text-gray-500 rounded px-2.5 py-1 font-semibold hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveMembers}
                        className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded px-2.5 py-1 font-bold shadow cursor-pointer transition duration-150"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Milestone Tracker Stepper */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition duration-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Capstone Milestone Progress</h3>
              <div className="relative">
                {/* Connector line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 -z-0 hidden md:block" />
                <div 
                  className="absolute top-4 left-4 h-0.5 bg-blue-600 -z-0 transition-all duration-500 hidden md:block" 
                  style={{ width: `${(projMilestoneIdx / (milestones.length - 1)) * 100}%` }}
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {milestones.map((m, idx) => {
                          const isPassed = idx <= projMilestoneIdx;
                          const isCurrent = idx === projMilestoneIdx;
                          return (
                            <div key={idx} className="flex md:flex-col items-center md:items-center text-left md:text-center space-x-3 md:space-x-0">
                              {/* Circle marker */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 font-semibold text-xs border ${
                                isPassed 
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                                  : 'bg-white border-slate-200 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-blue-100 scale-105' : ''}`}>
                                {isPassed ? <CheckSquare className="w-4 h-4 text-blue-100" /> : <span>{idx + 1}</span>}
                              </div>
                        
                        <div className="space-y-0.5 mt-1">
                          <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-blue-900 font-extrabold' : 'text-gray-700'}`}>
                            {m.label}
                          </p>
                          <p className="text-[10px] text-gray-400">{m.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chapters Submission versioning matrix */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-950">Chapters Drafts & Versioneering</h3>
                  <p className="text-[11px] text-gray-400">Chapters 1 to 5 status mapping and incremental versions.</p>
                </div>
                
                <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                  {myDocs.length} Drafts Saved
                </span>
              </div>

              {/* Table / Grid list */}
              <div className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map(chapterNum => {
                  const chapterDocs = myDocs.filter(d => d.chapter === chapterNum)
                    .sort((a,b) => b.uploadedAt.localeCompare(a.uploadedAt));
                  const latestDoc = chapterDocs[0];

                  return (
                    <div key={chapterNum} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${latestDoc?.status === "APPROVED" ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-400'}`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs font-bold text-gray-900">Chapter {chapterNum}</h4>
                            {latestDoc && (
                              <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                                {latestDoc.version}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium truncate max-w-sm">
                            {latestDoc ? latestDoc.title : "No files uploaded yet for this chapter"}
                          </p>
                          {latestDoc && (
                            <span className="text-[10px] text-gray-400 block font-mono">
                              By {latestDoc.uploadedBy} on {new Date(latestDoc.uploadedAt).toLocaleDateString()} ({latestDoc.fileSize})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end md:self-auto">
                        {latestDoc ? (
                          <>
                            <span className={`text-[10px] font-semibold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getDocStatusStyle(latestDoc.status)}`}>
                              {latestDoc.status === 'REVISION_REQUESTED' ? 'REVISIONS REQUIRED' : latestDoc.status}
                            </span>
                            
                            <button
                              onClick={() => setSelectedDocId(latestDoc.id)}
                              className={`text-[10px] font-bold rounded-lg px-2.5 py-1 flex items-center gap-1 border border-gray-200 hover:bg-gray-50 transition cursor-pointer ${
                                selectedDocId === latestDoc.id ? 'bg-blue-50 text-blue-900 border-blue-400' : 'bg-white text-gray-700'
                              }`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Feedback</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase italic">
                            Awaiting Draft
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Draft Trigger Widget */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/40 mt-3 space-y-3">
                <div className="flex items-center space-x-2 text-blue-900">
                  <FileUp className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">File Chapter Manuscript Draft</h4>
                </div>
                
                <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Target Chapter</label>
                    <select 
                      value={uploadChapter}
                      onChange={e => setUploadChapter(Number(e.target.value))}
                      className="bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full font-bold"
                    >
                      <option value={1}>Chapter 1 (Intro)</option>
                      <option value={2}>Chapter 2 (Lit Review)</option>
                      <option value={3}>Chapter 3 (Methodology)</option>
                      <option value={4}>Chapter 4 (Results)</option>
                      <option value={5}>Chapter 5 (Conclusion)</option>
                    </select>
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Draft Document Title</label>
                    <input 
                      type="text" 
                      value={uploadTitle}
                      onChange={e => setUploadTitle(e.target.value)}
                      placeholder="e.g. Theoretical framework and designs doc..."
                      className="bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full font-medium"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button 
                      type="submit"
                      disabled={isUploading || !uploadTitle}
                      className="bg-blue-600 border border-blue-500 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded w-full transition flex items-center justify-center space-x-1 uppercase cursor-pointer shadow-sm active:scale-95 duration-150"
                    >
                      <span>{isUploading ? "Uploading..." : "Upload Doc"}</span>
                    </button>
                  </div>
                </form>

                {isUploading && (
                  <div className="space-y-1 pt-1.5">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span>Analyzing file hash values...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full transition-all duration-150" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT COLUMN: Feedback Center chat panel, Announcements list */}
      <div className="space-y-6 col-span-1">
        
        {/* Active Feedback Log Box */}
        {myProject && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col h-[380px] justify-between hover:shadow-md transition duration-200">
            <div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 animate-pulse" />
                  <h3 className="text-sm font-bold text-gray-900">
                    {selectedDocId ? "Chapter Draft Comments" : "General Thesis Feedback"}
                  </h3>
                </div>
                {selectedDocId && (
                  <button 
                    onClick={() => setSelectedDocId('')}
                    className="text-[9px] bg-gray-100 border text-gray-500 rounded px-1.5 py-0.5 hover:bg-gray-200 cursor-pointer font-bold"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {selectedDocId 
                  ? `Showing feedback on Selected Chapter draft` 
                  : `Reviewing general suggestions for your group overall.`
                }
              </p>
            </div>

            {/* Comments list sandbox */}
            <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 font-sans" id="feedback-chat-scroller">
              {activeComments.length > 0 ? (
                activeComments.map((c, i) => {
                  const isMe = c.userId === currentUser.id;
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center space-x-1 mb-0.5">
                        <span className="text-[9px] font-bold text-indigo-900">{c.userName}</span>
                        <span className="text-[8px] bg-gray-100 text-gray-400 px-1 rounded-sm uppercase">{c.userRole.toLowerCase()}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl text-xs leading-relaxed max-w-[85%] font-medium ${
                        isMe 
                          ? 'bg-blue-950 text-blue-50 rounded-tr-none border border-blue-900' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-250'
                      }`}>
                        {c.content}
                      </div>
                      <span className="text-[8px] text-gray-400 mt-0.5 font-mono">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-gray-300 py-6">
                  <MessageSquare className="w-8 h-8 opacity-25 mb-1.5" />
                  <p className="text-[11px] italic font-medium">No comments posted yet</p>
                  <p className="text-[9px] text-gray-400">Post a comment below to ping your coordinator</p>
                </div>
              )}
            </div>

            {/* Comment Post Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-1 pt-2 border-t">
              <input 
                type="text" 
                value={chatContent}
                onChange={e => setChatContent(e.target.value)}
                placeholder="Ask faculty members..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium"
                required
              />
              <button 
                type="submit"
                className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* System Announcements Board */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition duration-200">
          <div className="flex items-center space-x-1.5 border-b pb-2 border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-gray-950">University Announcements</h3>
          </div>

          <div className="space-y-3.5">
            {announcements.length > 0 ? (
              announcements.map((ann, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-br from-indigo-50/40 to-blue-50/40 rounded-xl border border-indigo-100/50 space-y-1.5">
                  <h4 className="text-xs font-bold text-indigo-950 leading-snug">{ann.title}</h4>
                  <p className="text-[11px] text-gray-600 line-clamp-3 text-justify leading-relaxed font-semibold">
                    {ann.content}
                  </p>
                  <div className="flex items-center justify-between text-[8px] text-gray-400 font-bold uppercase mt-1">
                    <span>Sender: {ann.author}</span>
                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-400 italic text-center py-6">No administrative announcements released yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
