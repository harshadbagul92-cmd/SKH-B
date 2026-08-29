import Dexie from 'dexie';

export const db = new Dexie('GaonShikshaDB');

db.version(1).stores({
  courses: 'id, slug, category',
  progress: 'courseId, isCompleted, updatedAt',
  quizAttempts: '++id, courseId, passed, timestamp',
  certificates: 'id, verificationCode, courseId, studentName, issueDate, synced',
  opportunities: 'id, requiredCourseId',
  applications: '++id, oppId, studentName, timestamp, synced',
  syncQueue: '++id, type, status, createdAt',
  settings: 'key'
});

export default db;
