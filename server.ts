import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  User, 
  Project, 
  DocumentVersion, 
  Comment, 
  DefenseSchedule, 
  Evaluation, 
  Notification, 
  Announcement,
  UserRole
} from "./src/types";

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "server-db.json");

// Helper function to seed or read the JSON database
interface DB {
  users: User[];
  projects: Project[];
  documents: DocumentVersion[];
  comments: Comment[];
  schedules: DefenseSchedule[];
  evaluations: Evaluation[];
  notifications: Notification[];
  announcements: Announcement[];
}

const DEFAULT_DB: DB = {
  users: [
    { id: "u-stud-1", email: "benok@university.edu", name: "benok", role: "STUDENT", createdAt: new Date().toISOString() },
    { id: "u-stud-2", email: "roni@university.edu", name: "roni", role: "STUDENT", createdAt: new Date().toISOString() },
    { id: "u-stud-3", email: "erick@university.edu", name: "erick", role: "STUDENT", createdAt: new Date().toISOString() },
    { id: "u-adv-1", email: "mr.adviser@university.edu", name: "mr.adviser", role: "ADVISER", createdAt: new Date().toISOString() },
    { id: "u-adv-2", email: "mr.adviser-sec@university.edu", name: "mr.adviser", role: "ADVISER", createdAt: new Date().toISOString() },
    { id: "u-pan-1", email: "mr.panel@university.edu", name: "mr. panel", role: "PANELIST", createdAt: new Date().toISOString() },
    { id: "u-pan-2", email: "mrs.panel@university.edu", name: "mrs. panel", role: "PANELIST", createdAt: new Date().toISOString() },
    { id: "u-adm-1", email: "eljames.pogi@university.edu", name: "eljames pogi", role: "ADMIN", createdAt: new Date().toISOString() }
  ],
  projects: [
    {
      id: "p-iot-energy",
      title: "Smart Campus IoT Energy Management System",
      abstract: "This project presents an energy monitoring and control system designed to audit power usage across university premises. Using wireless smart relays and a real-time web dashboard, our prototype optimizes HVAC schedule management, resulting in up to 15% lower auxiliary power costs in pilot classrooms.",
      course: "BS Computer Science",
      status: "DEVELOPMENT",
      adviserId: "u-adv-1",
      adviserName: "mr.adviser",
      members: ["benok"],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "p-crop-yield",
      title: "AI-Powered Crop Disease Diagnosis & Yield Prediction",
      abstract: "An agricultural platform integrating computer vision models and neural regression networks to identify pathogenic lesions on Solanum lycopersicum (tomato) leaves. It provides predictive modeling of yield metrics using local historical ambient temperatures and precipitation profiles.",
      course: "BS Information Technology",
      status: "DEFENSE",
      adviserId: "u-adv-2",
      adviserName: "mr.adviser",
      members: ["roni"],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "p-blockchain-cert",
      title: "Blockchain-Based Academic Credential Verification System",
      abstract: "A decentralized ledger application architecture designed to counter fraudulent academic certifications. Built using Solidity smart contracts, the system establishes a secure audit trail of undergraduate transcripts and diplomas from initial issue to employer validation.",
      course: "BS Computer Engineering",
      status: "PROPOSAL",
      adviserId: "u-adv-1",
      adviserName: "mr.adviser",
      members: ["erick"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  documents: [
    {
      id: "doc-iot-ch1-v10",
      projectId: "p-iot-energy",
      title: "Introduction and Problem Statement Draft",
      chapter: 1,
      version: "v1.0",
      status: "APPROVED",
      fileUrl: "#",
      fileSize: "1.2 MB",
      uploadedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "benok"
    },
    {
      id: "doc-iot-ch2-v10",
      projectId: "p-iot-energy",
      title: "Literature Review and Technical Architecture",
      chapter: 2,
      version: "v1.0",
      status: "REVISION_REQUESTED",
      fileUrl: "#",
      fileSize: "2.8 MB",
      uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "benok"
    },
    {
      id: "doc-iot-ch2-v11",
      projectId: "p-iot-energy",
      title: "Literature Review and Technical Architecture - Revised",
      chapter: 2,
      version: "v1.1",
      status: "PENDING",
      fileUrl: "#",
      fileSize: "3.1 MB",
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "benok"
    },
    {
      id: "doc-crop-ch1-ch5",
      projectId: "p-crop-yield",
      title: "Full Finished Project Manuscript Chapters 1-5",
      chapter: 5,
      version: "v1.0",
      status: "APPROVED",
      fileUrl: "#",
      fileSize: "14.5 MB",
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "roni"
    }
  ],
  comments: [
    {
      id: "c-1",
      documentId: "doc-iot-ch2-v10",
      projectId: "p-iot-energy",
      userId: "u-adv-1",
      userName: "mr.adviser",
      userRole: "ADVISER",
      content: "Please expand on the IoT MQTT latency protocols of section 2.3. The evaluation is missing comparative analysis with alternative lightweight message brokers like CoAP.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "c-2",
      documentId: "doc-iot-ch2-v11",
      projectId: "p-iot-energy",
      userId: "u-stud-1",
      userName: "benok",
      userRole: "STUDENT",
      content: "Thanks mr.adviser, we updated section 2.3 with CoAP comparisons and structured MQTT routing efficiency tables.",
      createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "c-3",
      documentId: "doc-crop-ch1-ch5",
      projectId: "p-crop-yield",
      userId: "u-adv-2",
      userName: "mr.adviser",
      userRole: "ADVISER",
      content: "Extremely detailed manuscript. The computer vision pipeline is thoroughly validated. Ready for public final oral defense board evaluation.",
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  schedules: [
    {
      id: "s-1",
      projectId: "p-crop-yield",
      projectTitle: "AI-Powered Crop Disease Diagnosis & Yield Prediction",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "10:00 AM - 12:00 PM",
      venue: "CS Engineering Laboratory Hall B",
      panelistIds: ["u-pan-1", "u-pan-2"],
      panelistNames: ["mr. panel", "mrs. panel"]
    }
  ],
  evaluations: [
    {
      id: "e-1",
      projectId: "p-crop-yield",
      projectTitle: "AI-Powered Crop Disease Diagnosis & Yield Prediction",
      panelistId: "u-pan-1",
      panelistName: "mr. panel",
      scoreContent: 24,
      scorePresent: 23,
      scoreTechnical: 25,
      scoreQA: 23,
      totalScore: 95,
      remarks: "The computer vision results are stellar and have exceptional local relevance. The student demonstrated strong confidence during pilot tests.",
      verdict: "Passed",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  notifications: [
    {
      id: "n-1",
      userId: "u-stud-1",
      title: "Document Revision Requested",
      message: "mr.adviser requested revisions on Chapter 2 - v1.0 of your energy project.",
      isRead: false,
      linkUrl: "p-iot-energy",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "n-2",
      userId: "u-adv-1",
      title: "New Document Draft Submitted",
      message: "Group 'Smart Campus IoT Energy Management System' uploaded Chapter 2 - v1.1. Review draft.",
      isRead: false,
      linkUrl: "p-iot-energy",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  announcements: [
    {
      id: "a-1",
      title: "Capstone Manuscript Submission Deadline - First Sem 2026",
      content: "All groups scheduled for final capstone oral defense must complete their Chapter 1-5 draft submissions on or before June 15, 2026. Late documents will result in deferred defenses until the following academic cycle. Please acquire approval signatures from your respective designated Advisers before submitting.",
      author: "Office of the Dean, School of Computing",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Check and read from JSON file, otherwise initialize and write DEFAULT_DB
function readDatabase(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file", error);
  }
  
  // Write default db if not exists
  writeDatabase(DEFAULT_DB);
  return DEFAULT_DB;
}

function writeDatabase(db: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database file", error);
  }
}

// REST APIs
app.get("/api/db", (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// Reset API to original seed state
app.post("/api/db/reset", (req, res) => {
  writeDatabase(DEFAULT_DB);
  res.json({ success: true, db: DEFAULT_DB });
});

// Notifications APIS
app.post("/api/notifications/read-all", (req, res) => {
  const { userId } = req.body;
  const db = readDatabase();
  db.notifications = db.notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n);
  writeDatabase(db);
  res.json({ success: true, notifications: db.notifications.filter(n => n.userId === userId) });
});

// Project endpoints
app.post("/api/projects", (req, res) => {
  const { title, abstract, course, members, userId, userName } = req.body;
  const db = readDatabase();
  
  const newProject: Project = {
    id: "p-" + Math.random().toString(36).substr(2, 9),
    title,
    abstract,
    course,
    status: "PROPOSAL",
    members,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.projects.push(newProject);

  // Link advisor if default assigned
  // For demonstration, assign u-adv-1 by default
  newProject.adviserId = "u-adv-1";
  newProject.adviserName = "Dr. Evelyn Vance";

  // Add system notifications
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: "u-adv-1",
    title: "New Capstone Project Proposal",
    message: `A new project "${title}" was proposed by ${userName && userName !== "Anonymous" ? userName : "Group Students"}. Check and assign.`,
    isRead: false,
    linkUrl: newProject.id,
    createdAt: new Date().toISOString()
  });

  writeDatabase(db);
  res.json({ success: true, project: newProject });
});

// Update group members (Student Edit)
app.patch("/api/projects/:id/members", (req, res) => {
  const { id } = req.params;
  const { members } = req.body;
  const db = readDatabase();
  
  const projectIdx = db.projects.findIndex(p => p.id === id);
  if (projectIdx !== -1) {
    db.projects[projectIdx].members = members;
    db.projects[projectIdx].updatedAt = new Date().toISOString();
    writeDatabase(db);
    res.json({ success: true, project: db.projects[projectIdx] });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Update project status / info (Admin or Adviser edit)
app.patch("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { status, adviserId, title, abstract } = req.body;
  const db = readDatabase();
  
  const projectIdx = db.projects.findIndex(p => p.id === id);
  if (projectIdx !== -1) {
    const proj = db.projects[projectIdx];
    if (status) proj.status = status;
    if (title) proj.title = title;
    if (abstract) proj.abstract = abstract;
    if (adviserId) {
      proj.adviserId = adviserId;
      const adv = db.users.find(u => u.id === adviserId);
      proj.adviserName = adv ? adv.name : "Assigned Adviser";
    }
    proj.updatedAt = new Date().toISOString();
    
    // Notify authors
    const projectMembers = proj.members;
    db.users.filter(u => u.role === "STUDENT" && projectMembers.includes(u.name)).forEach(student => {
      db.notifications.push({
        id: "n-" + Math.random().toString(36).substr(2, 9),
        userId: student.id,
        title: "Project Metadata Updated",
        message: `Your project "${proj.title}" status is now ${proj.status}.`,
        isRead: false,
        linkUrl: proj.id,
        createdAt: new Date().toISOString()
      });
    });

    writeDatabase(db);
    res.json({ success: true, project: proj });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Upload chapters endpoint with auto versioning tracker!
app.post("/api/documents/upload", (req, res) => {
  const { projectId, title, chapter, uploadedBy } = req.body;
  const db = readDatabase();

  const project = db.projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  // Auto versioning algorithm:
  // Find current documents with same chapter in this project
  const existingDocInChapter = db.documents
    .filter(d => d.projectId === projectId && d.chapter === Number(chapter))
    .sort((a,b) => b.uploadedAt.localeCompare(a.uploadedAt));
  
  let nextVersion = "v1.0";
  if (existingDocInChapter.length > 0) {
    const latestDoc = existingDocInChapter[0];
    const latestVersionNum = parseFloat(latestDoc.version.replace("v", ""));
    nextVersion = "v" + (latestVersionNum + 0.1).toFixed(1);
  }

  const newDoc: DocumentVersion = {
    id: "doc-" + Math.random().toString(36).substr(2, 9),
    projectId,
    title,
    chapter: Number(chapter),
    version: nextVersion,
    status: "PENDING",
    fileUrl: "#", // Simulated storage sandbox URL
    fileSize: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
    uploadedAt: new Date().toISOString(),
    uploadedBy: uploadedBy || "Student Member"
  };

  db.documents.push(newDoc);

  // Auto transition project status if completing specific milestones
  // E.g., if finalizing chapter 5 draft, move project to DEFENSE readiness
  if (Number(chapter) === 5) {
    project.status = "FINAL_MANUSCRIPT";
    project.updatedAt = new Date().toISOString();
  } else if (project.status === "PROPOSAL") {
    project.status = "DEVELOPMENT";
    project.updatedAt = new Date().toISOString();
  }

  // Notify advisor
  if (project.adviserId) {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: project.adviserId,
      title: "New Draft Submitted",
      message: `Group "${project.title}" uploaded Chapter ${chapter} - ${nextVersion}. Review submission and leave comments.`,
      isRead: false,
      linkUrl: project.id,
      createdAt: new Date().toISOString()
    });
  }

  writeDatabase(db);
  res.json({ success: true, document: newDoc });
});

// Approve or Request revision for document draft
app.post("/api/documents/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, advisorName } = req.body; // APPROVED or REVISION_REQUESTED
  const db = readDatabase();

  const docIdx = db.documents.findIndex(d => d.id === id);
  if (docIdx !== -1) {
    db.documents[docIdx].status = status;
    const doc = db.documents[docIdx];
    
    // Get project
    const project = db.projects.find(p => p.id === doc.projectId);
    if (project) {
      // Create notification to student members
      const projectMembers = project.members;
      db.users.filter(u => u.role === "STUDENT" && projectMembers.includes(u.name)).forEach(student => {
        db.notifications.push({
          id: "n-" + Math.random().toString(36).substr(2, 9),
          userId: student.id,
          title: status === "APPROVED" ? "Chapter Approved!" : "Revision Highlighted",
          message: `${advisorName || "Your Adviser"} has marked Chapter ${doc.chapter} draft (${doc.version}) as: ${status}.`,
          isRead: false,
          linkUrl: project.id,
          createdAt: new Date().toISOString()
        });
      });
    }

    writeDatabase(db);
    res.json({ success: true, document: doc });
  } else {
    res.status(404).json({ error: "Document not found" });
  }
});

// Post a comment
app.post("/api/comments", (req, res) => {
  const { documentId, projectId, userId, userName, userRole, content } = req.body;
  const db = readDatabase();

  const newComment: Comment = {
    id: "c-" + Math.random().toString(36).substr(2, 9),
    documentId,
    projectId,
    userId,
    userName,
    userRole,
    content,
    createdAt: new Date().toISOString()
  };

  db.comments.push(newComment);

  // Trigger real-time like notification if student gets adviser/panel comment
  if (userRole !== "STUDENT") {
    let notifyProjId = projectId;
    if (documentId) {
      const doc = db.documents.find(d => d.id === documentId);
      if (doc) notifyProjId = doc.projectId;
    }

    if (notifyProjId) {
      const p = db.projects.find(proj => proj.id === notifyProjId);
      if (p) {
        db.users.filter(u => u.role === "STUDENT" && p.members.includes(u.name)).forEach(student => {
          db.notifications.push({
            id: "n-" + Math.random().toString(36).substr(2, 9),
            userId: student.id,
            title: `Feedback from ${userRole}`,
            message: `${userName} left comments on your files: "${content.substring(0, 50)}..."`,
            isRead: false,
            linkUrl: p.id,
            createdAt: new Date().toISOString()
          });
        });
      }
    }
  }

  writeDatabase(db);
  res.json({ success: true, comment: newComment });
});

// Admin schedules oral defense board
app.post("/api/schedules", (req, res) => {
  const { projectId, date, time, venue, panelistIds } = req.body;
  const db = readDatabase();

  const project = db.projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  // Map panelist names
  const panelistNames = panelistIds.map((id: string) => {
    const user = db.users.find(u => u.id === id);
    return user ? user.name : "Panelist Member";
  });

  const newSchedule: DefenseSchedule = {
    id: "s-" + Math.random().toString(36).substr(2, 9),
    projectId,
    projectTitle: project.title,
    date,
    time,
    venue,
    panelistIds,
    panelistNames
  };

  db.schedules.push(newSchedule);

  // Transition project status to DEFENSE
  project.status = "DEFENSE";

  // Notify students and adviser
  const projectMembers = project.members;
  db.users.filter(u => (u.role === "STUDENT" && projectMembers.includes(u.name)) || (project.adviserId && u.id === project.adviserId)).forEach(user => {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      title: "Defense Schedule Released!",
      message: `Your final capstone oral defense schedule has been booked for ${date} at ${time} inside ${venue}.`,
      isRead: false,
      linkUrl: project.id,
      createdAt: new Date().toISOString()
    });
  });

  // Notify panelists
  panelistIds.forEach((pId: string) => {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: pId,
      title: "New Panel Appointment",
      message: `You are assigned to evaluate "${project.title}" oral defense on ${date}, ${time}.`,
      isRead: false,
      linkUrl: project.id,
      createdAt: new Date().toISOString()
    });
  });

  writeDatabase(db);
  res.json({ success: true, schedule: newSchedule });
});

// Panelist digital evaluation score grading submission
app.post("/api/evaluations", (req, res) => {
  const {
    projectId,
    panelistId,
    panelistName,
    scoreContent,
    scorePresent,
    scoreTechnical,
    scoreQA,
    remarks,
    verdict
  } = req.body;

  const db = readDatabase();
  const project = db.projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const sContent = Number(scoreContent) || 0;
  const sPresent = Number(scorePresent) || 0;
  const sTechnical = Number(scoreTechnical) || 0;
  const sQA = Number(scoreQA) || 0;
  const totalScore = sContent + sPresent + sTechnical + sQA;

  const newEval: Evaluation = {
    id: "e-" + Math.random().toString(36).substr(2, 9),
    projectId,
    projectTitle: project.title,
    panelistId,
    panelistName,
    scoreContent: sContent,
    scorePresent: sPresent,
    scoreTechnical: sTechnical,
    scoreQA: sQA,
    totalScore,
    remarks,
    verdict,
    createdAt: new Date().toISOString()
  };

  // Upsert evaluation (prevent duplicates)
  const existingIdx = db.evaluations.findIndex(e => e.projectId === projectId && e.panelistId === panelistId);
  if (existingIdx !== -1) {
    db.evaluations[existingIdx] = newEval;
  } else {
    db.evaluations.push(newEval);
  }

  // Check if we have evaluations from panel members to officially complete the project
  const relevantSchedule = db.schedules.find(s => s.projectId === projectId);
  if (relevantSchedule) {
    const totalAssignedPanelists = relevantSchedule.panelistIds.length;
    const currentEvaluations = db.evaluations.filter(e => e.projectId === projectId);

    if (currentEvaluations.length >= totalAssignedPanelists) {
      // Calculate consolidated final verdict
      // If there's at least one passing verdict and average score is above threshold, move to Completed
      const passedEvals = currentEvaluations.filter(e => e.verdict === "Passed" || e.verdict === "Passed with Revisions");
      if (passedEvals.length >= Math.ceil(totalAssignedPanelists / 2)) {
        project.status = "COMPLETED";
        project.updatedAt = new Date().toISOString();

        // Notify students
        db.users.filter(u => u.role === "STUDENT" && project.members.includes(u.name)).forEach(student => {
          db.notifications.push({
            id: "n-" + Math.random().toString(36).substr(2, 9),
            userId: student.id,
            title: "Capstone Completed!",
            message: `Congratulations! Your board has officially marked your thesis as Completed with average score: ${(currentEvaluations.reduce((acc,curr)=>acc+curr.totalScore,0)/totalAssignedPanelists).toFixed(1)}.`,
            isRead: false,
            linkUrl: project.id,
            createdAt: new Date().toISOString()
          });
        });
      }
    }
  }

  // Notify Student
  db.users.filter(u => u.role === "STUDENT" && project.members.includes(u.name)).forEach(student => {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: student.id,
      title: "New Panel Score Submitted",
      message: `Panelist ${panelistName} graded your oral defense. Verdict: ${verdict} (Score: ${totalScore}).`,
      isRead: false,
      linkUrl: project.id,
      createdAt: new Date().toISOString()
    });
  });

  writeDatabase(db);
  res.json({ success: true, evaluation: newEval });
});

// Admin User CRUD Operations
app.post("/api/users", (req, res) => {
  const { name, email, role } = req.body;
  const db = readDatabase();

  const newUser: User = {
    id: "u-custom-" + Math.random().toString(36).substr(2, 9),
    email,
    name,
    role: role as UserRole,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDatabase(db);
  res.json({ success: true, user: newUser });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.users = db.users.filter(u => u.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// Admin Announcements Post
app.post("/api/announcements", (req, res) => {
  const { title, content, author } = req.body;
  const db = readDatabase();

  const newAnnouncement: Announcement = {
    id: "a-" + Math.random().toString(36).substr(2, 9),
    title,
    content,
    author: author || "Super Admin",
    createdAt: new Date().toISOString()
  };

  db.announcements.push(newAnnouncement);

  // Notify everyone in the system
  db.users.forEach(u => {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: u.id,
      title: "New Administrative Announcement",
      message: `${title}: ${content.substring(0, 40)}...`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  });

  writeDatabase(db);
  res.json({ success: true, announcement: newAnnouncement });
});

app.delete("/api/announcements/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.announcements = db.announcements.filter(a => a.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});


// Vite middleware integration
async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running successfully on port ${PORT}`);
  });
}

startServer();
