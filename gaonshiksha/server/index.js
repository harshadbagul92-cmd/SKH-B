import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  checkIntegrity,
  backupDatabase,
  restoreFromBackup,
  onAppStart,
  saveServerData,
  listBackups,
  MAX_BACKUPS
} from './dbManager.js';
import {
  askGeminiChat,
  verifyAndModerateStudyMaterial
} from './geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Har app start pe check karo & initialize database
let serverDb = onAppStart();

// Ensure studyMaterials array exists in database
if (!serverDb.studyMaterials) {
  serverDb.studyMaterials = [
    {
      id: 'sm-sample-1',
      title: 'Class 10 Science: Periodic Table & Chemical Reactions Simplified Guide',
      subject: 'Science',
      standard: 'Class 10',
      description: 'Handcrafted revision notes explaining Mendeleev vs Modern Periodic table, oxidation, and reduction with practical village examples.',
      content: 'Chapter 1 & 2 comprehensive summary with solved board questions.',
      author: 'Dr. V. Patil (Z.P. High School Mentor)',
      geminiProtection: {
        isApproved: true,
        verdict: 'APPROVED',
        score: 98,
        safetyRating: 'SAFE',
        protectionBadge: 'Gemini Shield: Verified Safe & Educational',
        moderatedBy: 'Gemini-1.5-Flash-Shield',
        timestamp: new Date().toISOString()
      },
      createdAt: '2026-08-28T10:00:00.000Z'
    }
  ];
  saveServerData(serverDb);
}

// Setup daily periodic backup (every 24 hours)
setInterval(() => {
  console.log('[SCHEDULED BACKUP] Running scheduled 24h database backup...');
  backupDatabase(serverDb);
}, 24 * 60 * 60 * 1000);

// --- GEMINI AI & PROTECTION SHIELD ROUTES ---

// 1. Intelligent Gemini AI Chatbot Route (with fallback)
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, lang } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message string is required' });
  }

  const result = await askGeminiChat({ message, history, lang: lang || 'mr' });
  res.json(result);
});

// 2. Gemini Protection Shield Pre-check Route
app.post('/api/ai/moderate', async (req, res) => {
  const material = req.body;
  if (!material || !material.title || (!material.content && !material.description)) {
    return res.status(400).json({ error: 'Title and content/description are required for verification' });
  }

  console.log(`[GEMINI SHIELD] Scanning material: "${material.title}" submitted by ${material.author || 'Anonymous'}...`);
  const moderationResult = await verifyAndModerateStudyMaterial(material);
  console.log(`[GEMINI SHIELD VERDICT] ${moderationResult.verdict} (Score: ${moderationResult.score}/100)`);

  res.json(moderationResult);
});

// 3. Upload Study Material (Protected by Gemini AI Shield)
app.post('/api/study-materials/upload', async (req, res) => {
  const { title, subject, standard, description, content, author, role } = req.body;

  if (!title || (!description && !content)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid Title and Content/Description.'
    });
  }

  // Mandatory Gemini Protection Scan before accepting upload
  const moderation = await verifyAndModerateStudyMaterial({
    title,
    subject,
    standard,
    description,
    content,
    author
  });

  if (!moderation.isApproved || moderation.verdict === 'REJECTED') {
    return res.status(422).json({
      success: false,
      blocked: true,
      error: 'Upload Blocked by Gemini Protection Shield: Content violates student safety or academic guidelines.',
      moderation
    });
  }

  const newMaterial = {
    id: `sm-${Date.now()}`,
    title: title.trim(),
    subject: subject || 'General Education',
    standard: standard || 'General',
    description: description ? description.trim() : '',
    content: content ? content.trim() : '',
    author: author ? author.trim() : 'Verified Educator',
    role: role || 'Mentor',
    geminiProtection: moderation,
    createdAt: new Date().toISOString()
  };

  if (!serverDb.studyMaterials) serverDb.studyMaterials = [];
  serverDb.studyMaterials.unshift(newMaterial);
  saveServerData(serverDb);

  res.status(201).json({
    success: true,
    message: 'Study material successfully verified and published by Gemini Protection Shield!',
    material: newMaterial,
    moderation
  });
});

// 4. List All Verified Study Materials
app.get('/api/study-materials', (req, res) => {
  const materials = serverDb.studyMaterials || [];
  res.json(materials);
});

// --- CORE SYNC & DATA ROUTES ---

// 1. Sync Batch Endpoint (Offline-First Sink with Auto-Backup)
app.post('/api/sync', (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Expected items array in sync payload' });
  }

  console.log(`[SYNC SERVER] Received ${items.length} records from Invictus Learning client.`);

  items.forEach(item => {
    serverDb.syncedItems.push({
      ...item,
      serverReceivedAt: new Date().toISOString()
    });

    if (item.type === 'CERTIFICATE_ISSUED' && item.payload) {
      const exists = serverDb.certificates.find(c => c.verificationCode === item.payload.verificationCode);
      if (!exists) {
        serverDb.certificates.push({
          ...item.payload,
          syncedAt: new Date().toISOString()
        });
      }
    } else if (item.type === 'JOB_APPLICATION' && item.payload) {
      serverDb.applications.push({
        ...item.payload,
        syncedAt: new Date().toISOString()
      });
    } else if (item.type === 'USER_PROFILE_UPDATE' && item.payload) {
      if (!serverDb.userProfiles) serverDb.userProfiles = [];
      const idx = serverDb.userProfiles.findIndex(u => u.email === item.payload.email);
      const updatedProfile = {
        ...item.payload,
        syncedAt: new Date().toISOString()
      };
      if (idx >= 0) {
        serverDb.userProfiles[idx] = updatedProfile;
      } else {
        serverDb.userProfiles.push(updatedProfile);
      }
    }
  });

  // 3. Auto-backup — har successful write ke baad
  saveServerData(serverDb);

  res.json({
    status: 'success',
    receivedCount: items.length,
    timestamp: new Date().toISOString(),
    serverMessage: 'All offline progress, certificates, and exam data committed and backed up on Invictus Learning Server.'
  });
});

// 2. Courses Endpoint
app.get('/api/courses', (req, res) => {
  const coursesPath = path.join(__dirname, '../src/data/courses.json');
  if (fs.existsSync(coursesPath)) {
    const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    return res.json(courses);
  }
  res.json([]);
});

// 3. Textbooks Endpoint
app.get('/api/textbooks', (req, res) => {
  const tbPath = path.join(__dirname, '../src/data/textbooks.json');
  if (fs.existsSync(tbPath)) {
    const textbooks = JSON.parse(fs.readFileSync(tbPath, 'utf8'));
    return res.json(textbooks);
  }
  res.json([]);
});

// 4. Government Exams Endpoint
app.get('/api/exams', (req, res) => {
  const examsPath = path.join(__dirname, '../src/data/govExams.json');
  if (fs.existsSync(examsPath)) {
    const exams = JSON.parse(fs.readFileSync(examsPath, 'utf8'));
    return res.json(exams);
  }
  res.json([]);
});

// 5. Opportunities Endpoint
app.get('/api/opportunities', (req, res) => {
  const oppPath = path.join(__dirname, '../src/data/opportunities.json');
  if (fs.existsSync(oppPath)) {
    const opps = JSON.parse(fs.readFileSync(oppPath, 'utf8'));
    return res.json(opps);
  }
  res.json([]);
});

// 6. Admin Analytics Stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalStudents: 48,
    syncedBatches: serverDb.syncedItems.length,
    certificatesIssued: serverDb.certificates.length,
    applicationsReceived: serverDb.applications.length,
    studyMaterialsVerified: (serverDb.studyMaterials || []).length,
    activeRegion: 'Invictus Academic Division'
  });
});

// 7. Admin Submissions & Roster
app.get('/api/admin/submissions', (req, res) => {
  res.json({
    certificates: serverDb.certificates,
    applications: serverDb.applications,
    studyMaterials: serverDb.studyMaterials || [],
    rawSyncLogs: serverDb.syncedItems.slice(-20)
  });
});

// 8. Database Integrity Check Endpoint
app.get('/api/admin/db/integrity', (req, res) => {
  const status = checkIntegrity();
  res.json({
    status: status.ok ? 'healthy' : 'corrupted',
    ...status
  });
});

// 9. Manual DB Backup Endpoint
app.post('/api/admin/db/backup', (req, res) => {
  const result = backupDatabase(serverDb);
  res.json({
    message: result.success ? 'Backup generated successfully' : 'Backup failed',
    ...result,
    backups: listBackups()
  });
});

// 10. Manual DB Restore Endpoint
app.post('/api/admin/db/restore', (req, res) => {
  const result = restoreFromBackup();
  serverDb = result.data;
  res.json({
    message: 'Database restored from backup successfully',
    restoredFrom: result.restoredFrom,
    integrity: checkIntegrity(serverDb)
  });
});

// 11. List All Backups Endpoint
app.get('/api/admin/db/backups', (req, res) => {
  res.json({
    maxBackupsConfigured: MAX_BACKUPS,
    backups: listBackups()
  });
});

// 12. Public Certificate Verification Endpoint
app.get('/api/verify/:code', (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const cert = serverDb.certificates.find(c => c.verificationCode?.toUpperCase() === code);

  if (cert) {
    res.json({
      valid: true,
      verificationCode: cert.verificationCode,
      studentName: cert.studentName,
      village: cert.village,
      courseTitle: cert.courseTitle,
      grade: cert.grade,
      score: cert.score,
      issueDate: cert.issueDate,
      issuingAuthority: 'Invictus Learning Academy (इन्व्हिक्टस)'
    });
  } else {
    res.status(404).json({
      valid: false,
      message: 'Certificate not found on Invictus Learning Server'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const dbHealth = checkIntegrity();
  res.json({
    status: 'ok',
    dbHealth: dbHealth.ok ? 'healthy' : 'corrupted',
    geminiProtectionActive: true,
    time: new Date().toISOString(),
    server: 'Invictus-Learning-Sync-Server-v2'
  });
});

app.listen(PORT, () => {
  console.log(`Invictus Learning Sync Server running on http://localhost:${PORT}`);
  console.log(`Gemini AI & Protection Shield activated on /api/ai/chat and /api/study-materials/upload`);
});
