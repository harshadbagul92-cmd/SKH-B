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

    // Default Profile
    const profileSetting = await db.settings.get('userProfile');
    if (!profileSetting) {
      await db.settings.put({
        key: 'userProfile',
        value: {
          name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
          village: 'संवत्सर, तालुका कोपरगाव (Sanvatsar, Kopargaon)',
          phone: '98220XXXXX',
          preferredLang: 'mr',
          role: 'student'
        }
      });
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
