/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, DocumentVersion, DefenseSchedule, Evaluation, User } from '../types';
import { 
  Award, 
  Calendar, 
  MapPin, 
  Grid,
  TrendingUp, 
  Sliders, 
  Briefcase, 
  CheckSquare, 
  Check, 
  BookOpen,
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface PanelistDashboardProps {
  currentUser: User;
  projects: Project[];
  documents: DocumentVersion[];
  schedules: DefenseSchedule[];
  evaluations: Evaluation[];
  onSubmitEvaluation: (evalData: {
    projectId: string;
    panelistId: string;
    panelistName: string;
    scoreContent: number;
    scorePresent: number;
    scoreTechnical: number;
    scoreQA: number;
    remarks: string;
    verdict: Evaluation['verdict'];
  }) => void;
}

export default function PanelistDashboard({
  currentUser,
  projects,
  documents,
  schedules,
  evaluations,
  onSubmitEvaluation
}: PanelistDashboardProps) {
  // Find defenses assigned to this Panelist
  const mySchedules = schedules.filter(s => s.panelistIds.includes(currentUser.id));

  // State
  const [selectedSchedId, setSelectedSchedId] = useState<string>(mySchedules[0]?.id || '');
  
  // Rating states (each out of 25 points)
  const [scoreContent, setScoreContent] = useState<number>(22);
  const [scorePresent, setScorePresent] = useState<number>(23);
  const [scoreTechnical, setScoreTechnical] = useState<number>(22);
  const [scoreQA, setScoreQA] = useState<number>(21);
  const [remarks, setRemarks] = useState('');
  const [verdict, setVerdict] = useState<Evaluation['verdict']>('Passed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync active schedule on load
  React.useEffect(() => {
    if (mySchedules.length > 0 && !selectedSchedId) {
      setSelectedSchedId(mySchedules[0].id);
    }
  }, [mySchedules, selectedSchedId]);

  const activeSchedule = schedules.find(s => s.id === selectedSchedId);
  const activeProj = activeSchedule ? projects.find(p => p.id === activeSchedule.projectId) : null;
  const activeManuscripts = activeProj ? documents.filter(d => d.projectId === activeProj.id) : [];
  
  // Find if panelist already submitted evaluation for this project
  const myPrevEval = activeProj 
    ? evaluations.find(e => e.projectId === activeProj.id && e.panelistId === currentUser.id)
    : null;

  // Initialize form if previous score exists
  React.useEffect(() => {
    if (myPrevEval) {
      setScoreContent(myPrevEval.scoreContent);
      setScorePresent(myPrevEval.scorePresent);
      setScoreTechnical(myPrevEval.scoreTechnical);
      setScoreQA(myPrevEval.scoreQA);
      setRemarks(myPrevEval.remarks);
      setVerdict(myPrevEval.verdict);
    } else {
      // Default baseline scores
      setScoreContent(22);
      setScorePresent(22);
      setScoreTechnical(22);
      setScoreQA(21);
      setRemarks('');
      setVerdict('Passed');
    }
  }, [myPrevEval, selectedSchedId]);

  const totalScore = scoreContent + scorePresent + scoreTechnical + scoreQA;

  const handleSubmitScoreForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProj) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitEvaluation({
        projectId: activeProj.id,
        panelistId: currentUser.id,
        panelistName: currentUser.name,
        scoreContent,
        scorePresent,
        scoreTechnical,
        scoreQA,
        remarks,
        verdict
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div id="panelist-portal" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Defense boards calendar schedule list */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition duration-200">
          <div className="flex items-center space-x-2 border-b pb-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">Your Evaluation Panel Duties</h3>
          </div>

          <div className="space-y-2">
            {mySchedules.length > 0 ? (
              mySchedules.map(s => {
                const isSelected = s.id === selectedSchedId;
                const hasEvaluated = evaluations.some(e => e.projectId === s.projectId && e.panelistId === currentUser.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSchedId(s.id)}
                    className={`w-full p-3 rounded-xl border text-left transition duration-200 flex flex-col hover:bg-gray-50 focus:outline-none cursor-pointer ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/10 shadow-sm font-semibold' 
                        : 'border-slate-150 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-indigo-50 text-indigo-800 font-extrabold border px-2 py-0.5 rounded uppercase">
                        Oral Defense Board
                      </span>
                      {hasEvaluated && (
                        <span className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Graded
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 mt-1.5 line-clamp-2 leading-snug">{s.projectTitle}</h4>
                    
                    <div className="mt-3 space-y-1 text-[10px] text-gray-500 border-t pt-2 border-dashed border-gray-200">
                      <div className="flex items-center space-x-1.5 font-bold text-indigo-950">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Date: {s.date} • {s.time}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 font-semibold text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{s.venue}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-4">You have no active oral defense duties booked.</p>
            )}
          </div>
        </div>
      </div>

      {/* MID & RIGHT: Defense Manuscripts Reviewer & Grading Form */}
      <div className="lg:col-span-2 space-y-6">
        {activeProj ? (
          <div className="space-y-6">
            
            {/* Project Summary and PDF Downloader */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition duration-200">
              <div>
                <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 border border-blue-200 font-extrabold rounded-full uppercase">
                  Active Defense Target File
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-1">{activeProj.title}</h2>
                <p className="text-xs text-gray-500">Group Authors: <span className="font-semibold text-gray-700">{activeProj.members.join(', ')}</span></p>
              </div>

              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border leading-relaxed text-justify line-clamp-3">
                <strong className="text-indigo-950 block text-[10px] uppercase font-bold tracking-wide">Project Abstract:</strong>
                {activeProj.abstract}
              </div>

              {/* Download latest file simulator */}
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-200/50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="bg-white p-1.5 rounded border shadow-sm text-rose-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-blue-900">Consolidated Manuscript</span>
                    <p className="text-xs text-gray-600 font-semibold truncate max-w-[190px]">
                      {activeManuscripts.length > 0 ? activeManuscripts[activeManuscripts.length-1].title : "Chapters_1_to_5_Submission.pdf"}
                    </p>
                  </div>
                </div>

                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloaded consolidated PDF manuscript! Size: 12.4 MB. Open and evaluate.");
                  }}
                  className="bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg shadow-sm transition flex items-center space-x-1"
                >
                  <span>⬇️ Read Manuscript</span>
                </a>
              </div>
            </div>

            {/* Digital Score Grading Sheet */}
            <form onSubmit={handleSubmitScoreForm} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                  <h3 className="text-sm font-bold text-indigo-950">Oral Defense Digital Grading Sheet</h3>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {myPrevEval ? "⚠️ Editing Pre-filed Score" : "✍️ Grading Sheet"}
                </div>
              </div>

              {/* Slider rating list */}
              <div className="space-y-4">
                
                {/* Score 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>1. Academic Content Depth & Literature (25%)</span>
                    <span className="text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">{scoreContent} / 25</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    value={scoreContent}
                    onChange={e => setScoreContent(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[9px] text-gray-400">Authenticity of study background, relevance, correct research scope, and document organization.</p>
                </div>

                {/* Score 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>2. Slide Quality & Presentation Style (25%)</span>
                    <span className="text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">{scorePresent} / 25</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    value={scorePresent}
                    onChange={e => setScorePresent(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[9px] text-gray-400">Visual slide flow clarity, student team defense coordination, timing discipline, and professional demeanor.</p>
                </div>

                {/* Score 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>3. Prototyping, Technical Build & Testing (25%)</span>
                    <span className="text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">{scoreTechnical} / 25</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    value={scoreTechnical}
                    onChange={e => setScoreTechnical(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[9px] text-gray-400">Rigor of hardware or software development steps, testing verification results, and pilot prototype viability.</p>
                </div>

                {/* Score 4 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>4. Oral Board Defense & Q&A Mastery (25%)</span>
                    <span className="text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">{scoreQA} / 25</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    value={scoreQA}
                    onChange={e => setScoreQA(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[9px] text-gray-400">Prompt responses, mastery of domain vocabulary, objective data references, and clarity in answering critiques.</p>
                </div>

              </div>

              {/* Total Score consolidation banner */}
              <div className="p-4 bg-indigo-950 text-white rounded-xl flex items-center justify-between shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-blue-300 uppercase tracking-wider font-extrabold pb-1 block">Tally Consolidated Outcome</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold tracking-tight font-mono">{totalScore}</span>
                    <span className="text-xs text-indigo-200">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-indigo-200 uppercase">Board Verdict</label>
                  <select 
                    value={verdict}
                    onChange={e => setVerdict(e.target.value as Evaluation['verdict'])}
                    className="bg-indigo-900 text-white font-bold border border-indigo-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Passed">Passed (Approved)</option>
                    <option value="Passed with Revisions">Passed with Revisions</option>
                    <option value="Re-Defense">Re-Defense Recommended</option>
                  </select>
                </div>
              </div>

              {/* Remarks/Recommendations log */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Defense Critique / Key recommendations</label>
                <textarea 
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Provide precise modifications and recommendations requested for completion..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm uppercase tracking-wider shadow transition-all duration-150 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? "Locking Grades..." : myPrevEval ? "Update Gradings & Remarks" : "Submit & Lock Digital Valuation"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border text-center text-gray-400">
            Select a defense task on the left column to evaluate manuscript and submit oral scoreboards.
          </div>
        )}
      </div>

    </div>
  );
}
