import { db } from './index';
import coursesData from '../data/courses.json';
import opportunitiesData from '../data/opportunities.json';
import textbooksData from '../data/textbooks.json';
import govExamsData from '../data/govExams.json';
import {
  initialInnovations,
  initialSponsoredBounties,
  initialCollaborationOffers,
  initialCompanies
} from './seedInnovations';

export async function initializeLocalDB() {
  try {
    const coursesCount = await db.courses.count();
    if (coursesCount === 0) {
      await db.courses.bulkPut(coursesData);
      console.log('Seeded initial courses into Dexie IndexedDB');
    }

    // Strictly seed & update Class 10th E-Textbooks
    await db.textbooks.bulkPut(textbooksData);
    // Remove any legacy non-10th textbook entries
    const valid10thIds = textbooksData.map(tb => tb.id);
    const allLocalTb = await db.textbooks.toArray();
    for (const tb of allLocalTb) {
      if (!valid10thIds.includes(tb.id)) {
        await db.textbooks.delete(tb.id);
      }
    }
    console.log('Seeded & synced Class 10th E-Textbooks into Dexie IndexedDB');

    // Always keep government exams up to date with full 2026 notifications database
    await db.govExams.bulkPut(govExamsData);

    const oppCount = await db.opportunities.count();
    if (oppCount === 0) {
      await db.opportunities.bulkPut(opportunitiesData);
      console.log('Seeded initial opportunities into Dexie IndexedDB');
    }

    // Seed Innovation Hub data
    const innovCount = await db.innovations.count();
    if (innovCount === 0) {
      await db.innovations.bulkPut(initialInnovations);
      console.log('Seeded initial student innovations');
    }

    const bountyCount = await db.sponsoredBounties.count();
    if (bountyCount === 0) {
      await db.sponsoredBounties.bulkPut(initialSponsoredBounties);
      console.log('Seeded initial sponsored problem statement bounties');
    }

    const offerCount = await db.collaborationOffers.count();
    if (offerCount === 0) {
      await db.collaborationOffers.bulkPut(initialCollaborationOffers);
      console.log('Seeded initial collaboration offers');
    }

    const compCount = await db.companies.count();
    if (compCount === 0) {
      await db.companies.bulkPut(initialCompanies);
      console.log('Seeded initial verified partner companies');
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
