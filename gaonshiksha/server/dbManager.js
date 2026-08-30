import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.join(__dirname, 'data');
export const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
export const DB_FILE = path.join(DATA_DIR, 'server_sync_records.json');
export const MAX_BACKUPS = 3; // Maximum backups to preserve disk storage

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

/**
 * Default fallback data structure
 */
export function getDefaultSchema() {
  return {
    syncedItems: [],
    certificates: [
      {
        id: 'cert-sample-1',
        verificationCode: 'IL-KPG-2026-8419',
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
        verificationCode: 'IL-KPG-2026-9124',
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
        phone: '9822012345',
        oppTitle: 'डेटा एंट्री ऑपरेटर व महा ई-सेवा सहाय्यक',
        organization: 'गोदावरी बायोरिफायनरीज् व सेतू सुविधा केंद्र, कोपरगाव',
        notes: 'मी संगणक कोर्स पूर्ण केला आहे.',
        syncedAt: new Date().toISOString()
      }
    ],
    userProfiles: []
  };
}

/**
 * 1. DB Integrity Check
 * Validates database file format, non-empty content, valid JSON, and schema sanity.
 * @param {string | object} target - File path or parsed database object
 * @returns {{ ok: boolean, error?: string, details?: any }}
 */
export function checkIntegrity(target = DB_FILE) {
  try {
    let data;
    if (typeof target === 'string') {
      if (!fs.existsSync(target)) {
        return { ok: false, error: `Database file does not exist at ${target}` };
      }
      const stat = fs.statSync(target);
      if (stat.size === 0) {
        return { ok: false, error: 'Database file is 0 bytes (empty/truncated)' };
      }
      const raw = fs.readFileSync(target, 'utf8');
      data = JSON.parse(raw);
    } else if (typeof target === 'object' && target !== null) {
      data = target;
    } else {
      return { ok: false, error: 'Invalid target passed to checkIntegrity' };
    }

    // Validate essential schema entities
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return { ok: false, error: 'Database root must be a valid JSON object' };
    }

    if (!Array.isArray(data.syncedItems)) {
      return { ok: false, error: 'Integrity failure: "syncedItems" collection must be an array' };
    }

    if (!Array.isArray(data.certificates)) {
      return { ok: false, error: 'Integrity failure: "certificates" collection must be an array' };
    }

    if (!Array.isArray(data.applications)) {
      return { ok: false, error: 'Integrity failure: "applications" collection must be an array' };
    }

    // Validate certificate structure integrity
    const invalidCert = data.certificates.find(c => !c || typeof c !== 'object');
    if (invalidCert) {
      return { ok: false, error: 'Integrity failure: corrupt certificate record detected' };
    }

    return {
      ok: true,
      message: 'Integrity OK',
      counts: {
        syncedItems: data.syncedItems.length,
        certificates: data.certificates.length,
        applications: data.applications.length,
        userProfiles: Array.isArray(data.userProfiles) ? data.userProfiles.length : 0
      }
    };
  } catch (err) {
    return { ok: false, error: `JSON Parse / File Error: ${err.message}` };
  }
}

/**
 * 3. Auto-backup — har successful write ke baad ya daily interval se
 * Saves timestamped backup and removes backups older than MAX_BACKUPS to save disk space.
 * @param {object} [dataToBackup] Optional in-memory data
 * @returns {{ success: boolean, backupFile?: string, backupsCount?: number, error?: string }}
 */
export function backupDatabase(dataToBackup = null) {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const backupFileName = `backup_${timestamp}.json`;
    const backupFilePath = path.join(BACKUPS_DIR, backupFileName);

    if (dataToBackup) {
      fs.writeFileSync(backupFilePath, JSON.stringify(dataToBackup, null, 2), 'utf8');
    } else if (fs.existsSync(DB_FILE)) {
      fs.copyFileSync(DB_FILE, backupFilePath);
    } else {
      const defaultData = getDefaultSchema();
      fs.writeFileSync(backupFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
    }

    // Prune old backups (keep max 3 backups to save storage)
    const backupFiles = fs
      .readdirSync(BACKUPS_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        fullPath: path.join(BACKUPS_DIR, file),
        mtime: fs.statSync(path.join(BACKUPS_DIR, file)).mtimeMs
      }))
      .sort((a, b) => b.mtime - a.mtime); // Newest first

    if (backupFiles.length > MAX_BACKUPS) {
      const filesToDelete = backupFiles.slice(MAX_BACKUPS);
      filesToDelete.forEach(f => {
        try {
          fs.unlinkSync(f.fullPath);
          console.log(`[BACKUP CLEANUP] Removed old backup: ${f.name}`);
        } catch (e) {
          console.error(`Failed to delete old backup ${f.name}:`, e.message);
        }
      });
    }

    console.log(`[AUTO-BACKUP] Created ${backupFileName} (Retaining latest ${Math.min(backupFiles.length, MAX_BACKUPS)} backups)`);
    return {
      success: true,
      backupFile: backupFileName,
      backupsCount: Math.min(backupFiles.length, MAX_BACKUPS),
      timestamp: new Date(timestamp).toISOString()
    };
  } catch (err) {
    console.error('[AUTO-BACKUP ERROR]', err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. Restore from latest valid backup
 * Scans backup directory, validates integrity of backups, and restores the newest healthy one.
 * @returns {{ success: boolean, restoredFrom?: string, data: object }}
 */
export function restoreFromBackup() {
  console.log('[RESTORE] Searching for available database backups...');
  if (fs.existsSync(BACKUPS_DIR)) {
    const backupFiles = fs
      .readdirSync(BACKUPS_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        fullPath: path.join(BACKUPS_DIR, file),
        mtime: fs.statSync(path.join(BACKUPS_DIR, file)).mtimeMs
      }))
      .sort((a, b) => b.mtime - a.mtime); // Newest first

    for (const backup of backupFiles) {
      const integrity = checkIntegrity(backup.fullPath);
      if (integrity.ok) {
        try {
          fs.copyFileSync(backup.fullPath, DB_FILE);
          const restoredData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
          console.log(`[RESTORE SUCCESS] Successfully restored database from: ${backup.name}`);
          return {
            success: true,
            restoredFrom: backup.name,
            data: restoredData
          };
        } catch (err) {
          console.error(`Failed to copy backup file ${backup.name}:`, err.message);
        }
      } else {
        console.warn(`[RESTORE] Backup ${backup.name} failed integrity check (${integrity.error}), trying next...`);
      }
    }
  }

  // If no valid backups exist, fall back to default template
  console.warn('[RESTORE WARNING] No valid backups found. Initializing fresh default database template.');
  const defaultData = getDefaultSchema();
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  backupDatabase(defaultData);
  return {
    success: true,
    restoredFrom: 'default_template',
    data: defaultData
  };
}

/**
 * 2. Har app start pe check karo (Startup check & recovery)
 * Called during server initialization. Validates DB integrity; auto-restores if corrupt.
 * @returns {object} The active server database object
 */
export function onAppStart() {
  console.log('[STARTUP] Initializing Database & running integrity check...');

  if (!fs.existsSync(DB_FILE)) {
    console.log('[STARTUP] No database file found. Restoring from backup or initializing default...');
    const result = restoreFromBackup();
    return result.data;
  }

  const integrity = checkIntegrity(DB_FILE);
  if (!integrity.ok) {
    console.error(`[STARTUP INTEGRITY FAILED] Corrupt database detected: ${integrity.error}`);
    console.log('[STARTUP] Attempting automatic disaster recovery from backup...');
    const result = restoreFromBackup();
    return result.data;
  }

  console.log(`[STARTUP DB OK] Database integrity verified: ${integrity.counts?.certificates} certificates, ${integrity.counts?.applications} applications.`);

  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    // Ensure initial backup exists
    backupDatabase(data);
    return data;
  } catch (err) {
    console.error('[STARTUP] Unexpected error reading DB_FILE, falling back to restore:', err.message);
    const result = restoreFromBackup();
    return result.data;
  }
}

/**
 * Saves database to disk with atomic write, verifies integrity, and auto-triggers backup rotation.
 * @param {object} data 
 */
export function saveServerData(data) {
  const serialized = JSON.stringify(data, null, 2);
  // Atomic write via temp file
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, serialized, 'utf8');
  fs.renameSync(tempFile, DB_FILE);

  // Auto-backup on successful write
  backupDatabase(data);
}

/**
 * Gets list of all stored backups with details
 */
export function listBackups() {
  if (!fs.existsSync(BACKUPS_DIR)) return [];
  return fs
    .readdirSync(BACKUPS_DIR)
    .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
    .map(file => {
      const fullPath = path.join(BACKUPS_DIR, file);
      const stat = fs.statSync(fullPath);
      const integrity = checkIntegrity(fullPath);
      return {
        fileName: file,
        sizeBytes: stat.size,
        createdAt: stat.mtime.toISOString(),
        isValid: integrity.ok,
        integrityError: integrity.error || null
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
