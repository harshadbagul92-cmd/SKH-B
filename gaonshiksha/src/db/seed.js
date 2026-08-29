import { db } from './index';
import coursesData from '../data/courses.json';
import opportunitiesData from '../data/opportunities.json';

export async function initializeLocalDB() {
  try {
    const coursesCount = await db.courses.count();
    if (coursesCount === 0) {
      await db.courses.bulkPut(coursesData);
      console.log('Seeded initial courses into Dexie IndexedDB');
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
          grade: '12th',
          city: 'संवत्सर, कोपरगाव (Kopargaon)',
          role: 'student',
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
