import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent Server Data File
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'server_sync_records.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadServerData() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading DB_FILE, creating fresh database');
    }
  }
  return {
    syncedItems: [],
    certificates: [
      {
        id: 'cert-sample-1',
        verificationCode: 'SATHI-KPG-2026-8419',
        studentName: 'विकास एकनाथ तांबडे (Vikas Tambade)',
        village: 'संवत्सर, कोपरगाव',
        courseTitle: 'संगणक व डिजिटल साक्षरता आणि महाऑनलाईन कौशल्ये',
        score: '5/5 (100%)',
        grade: 'A+ (उत्कृष्ट)',
        issueDate: '२९ ऑगस्ट २०२६',
        syncedAt: new Date().toISOString()
      },
      {
        id: 'cert-sample-2',
        verificationCode: 'SATHI-KPG-2026-9124',
        studentName: 'पूजा रमेश वाघमारे (Pooja Waghmare)',
        village: 'टाकळी, कोपरगाव',
        courseTitle: 'आधुनिक शिलाई, कपडे कटिंग व बुटीक व्यवसाय',
        score: '5/5 (100%)',
        grade: 'A+ (उत्कृष्ट)',
        issueDate: '२८ ऑगस्ट २०२६',
        syncedAt: new Date().toISOString()
      }
    ],
    applications: [
      {
        appId: 'app-sample-1',
        studentName: 'विकास एकनाथ तांबडे (Vikas Tambade)',
        village: 'संवत्सर, कोपरगाव',
        phone: '98220XXXXX',
        oppTitle: 'डेटा एंट्री ऑपरेटर व महा ई-सेवा सहाय्यक',
        organization: 'गोदावरी बायोरिफायनरीज् व सेतू सुविधा केंद्र, कोपरगाव',
        notes: 'मी संगणक कोर्स पूर्ण केला आहे.',
        syncedAt: new Date().toISOString()
      }
    ]
  };
}

function saveServerData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let serverDb = loadServerData();

// 1. Sync Batch Endpoint (Offline-First Sink)
app.post('/api/sync', (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Expected items array in sync payload' });
  }

  console.log(`[SYNC SERVER] Received ${items.length} records from SATHI client.`);

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
    }
  });

  saveServerData(serverDb);

  res.json({
    status: 'success',
    receivedCount: items.length,
    timestamp: new Date().toISOString(),
    serverMessage: 'All offline progress and certificates successfully committed to SATHI Server.'
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

// 3. Opportunities Endpoint
app.get('/api/opportunities', (req, res) => {
  const oppPath = path.join(__dirname, '../src/data/opportunities.json');
  if (fs.existsSync(oppPath)) {
    const opps = JSON.parse(fs.readFileSync(oppPath, 'utf8'));
    return res.json(opps);
  }
  res.json([]);
});

// 4. Admin Analytics Stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalStudents: 48,
    syncedBatches: serverDb.syncedItems.length,
    certificatesIssued: serverDb.certificates.length,
    applicationsReceived: serverDb.applications.length,
    activeRegion: 'Kopargaon & Ahmednagar Rural Division'
  });
});

// 5. Admin Submissions & Roster
app.get('/api/admin/submissions', (req, res) => {
  res.json({
    certificates: serverDb.certificates,
    applications: serverDb.applications,
    rawSyncLogs: serverDb.syncedItems.slice(-20)
  });
});

// 6. Public Certificate Verification Endpoint
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
      issuingAuthority: 'SATHI Rural Skills Academy (साथी)'
    });
  } else {
    res.status(404).json({
      valid: false,
      message: 'Certificate not found on SATHI Academy Server'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), server: 'SATHI-Node-Express-Sync-v1' });
});

app.listen(PORT, () => {
  console.log(`SATHI Sync Server running on http://localhost:${PORT}`);
});
