import Dexie from 'dexie';

export const db = new Dexie('InvictusLearningDB');

db.version(3).stores({
  courses: 'id, slug, category',
  textbooks: 'id, subject, standard',
  govExams: 'id, tier, category, status',
  progress: 'courseId, isCompleted, updatedAt',
  quizAttempts: '++id, courseId, passed, timestamp',
  certificates: 'id, verificationCode, courseId, studentName, issueDate, synced',
  opportunities: 'id, requiredCourseId',
  applications: '++id, oppId, studentName, timestamp, synced',
  syncQueue: '++id, type, status, createdAt',
  settings: 'key',
  users: 'email, mobile, name, password, grade, city, role, category, targetGoal, country, state, pincode, preferences, lastSyncedAt, createdAt',
  innovations: 'id, studentId, studentName, domain, stage, createdAt, featured',
  collaborationOffers: 'id, innovationId, studentEmail, companyName, recruiterEmail, type, status, stipend, createdAt',
  sponsoredBounties: 'id, companyName, title, domain, bountyAmount, deadline, status',
  companies: 'email, companyName, website, gstin, industry, isVerified, createdAt'
});

export default db;
