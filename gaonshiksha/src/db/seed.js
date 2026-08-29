import { db } from './index';
import coursesData from '../data/courses.json';
import opportunitiesData from '../data/opportunities.json';
import textbooksData from '../data/textbooks.json';
import govExamsData from '../data/govExams.json';

export async function initializeLocalDB() {
  try {
    const coursesCount = await db.courses.count();
    if (coursesCount === 0) {
      await db.courses.bulkPut(coursesData);
      console.log('Seeded initial courses into Dexie IndexedDB');
    }

    const textbooksCount = await db.textbooks.count();
    if (textbooksCount === 0) {
      await db.textbooks.bulkPut(textbooksData);
      console.log('Seeded initial textbooks into Dexie IndexedDB');
    }

    const examsCount = await db.govExams.count();
    if (examsCount === 0) {
      await db.govExams.bulkPut(govExamsData);
      console.log('Seeded initial government exams into Dexie IndexedDB');
    }

    const oppCount = await db.opportunities.count();
    if (oppCount === 0) {
      await db.opportunities.bulkPut(opportunitiesData);
      console.log('Seeded initial opportunities into Dexie IndexedDB');
    }

    // Default Demo Users
    const userCount = await db.users.count();
    if (userCount === 0) {
      await db.users.bulkPut([
        {
          name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
          email: 'vikas@invictus.edu',
          password: 'password123',
          mobile: '9822012345',
          grade: '10th',
          city: 'कोपरगाव, अहिल्यानगर (Kopargaon)',
          role: 'student',
          targetGoal: 'police',
          createdAt: new Date().toISOString()
        },
        {
          name: 'प्रिया राजेश पाटिल (Priya Patil)',
          email: 'priya@invictus.edu',
          password: 'password123',
          mobile: '9876543210',
          grade: 'graduate',
          city: 'पुणे (Pune)',
          role: 'student',
          targetGoal: 'mpsc',
          createdAt: new Date().toISOString()
        }
      ]);
    }

    // Default Network Simulation Setting (online by default)
    const netSim = await db.settings.get('simulatedOffline');
    if (!netSim) {
      await db.settings.put({
        key: 'simulatedOffline',
        value: false
      });
    }
  } catch (err) {
    console.error('Failed to initialize local IndexedDB:', err);
  }
}
