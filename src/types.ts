/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'STUDENT' | 'ADVISER' | 'PANELIST' | 'ADMIN';

export type ProjectStatus = 'PROPOSAL' | 'DEVELOPMENT' | 'FINAL_MANUSCRIPT' | 'DEFENSE' | 'COMPLETED';

export type DocumentStatus = 'PENDING' | 'REVISION_REQUESTED' | 'APPROVED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  course: string;
  idNumber: string;
  projectId?: string;
}

export interface AdviserProfile {
  id: string;
  userId: string;
  department: string;
  maxGroups: number;
  user?: User;
}

export interface PanelistProfile {
  id: string;
  userId: string;
  department: string;
  user?: User;
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  course: string;
  status: ProjectStatus;
  adviserId?: string; // Reference to AdviserProfile.id
  adviserName?: string; // Denormalized for display ease
  members: string[]; // List of student names or student profile names
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  projectId: string;
  title: string;
  chapter: number; // 1 to 5
  version: string; // e.g. "v1.0"
  status: DocumentStatus;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  documentId?: string; // Optional if general project comment
  projectId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface DefenseSchedule {
  id: string;
  projectId: string;
  projectTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM" or "10:00 AM - 12:00 PM"
  venue: string;
  panelistIds: string[]; // List of PanelistProfile.id
  panelistNames: string[]; // List of panelist names
}

export interface Evaluation {
  id: string;
  projectId: string;
  projectTitle: string;
  panelistId: string;
  panelistName: string;
  scoreContent: number; // Weight 25
  scorePresent: number; // Weight 25
  scoreTechnical: number; // Weight 25
  scoreQA: number; // Weight 25
  totalScore: number; // Out of 100
  remarks: string;
  verdict: 'Passed' | 'Passed with Revisions' | 'Re-Defense';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}
