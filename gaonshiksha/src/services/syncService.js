const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const syncService = {
  // Queue a change for background synchronization
  async enqueue(type, payload) {
    const queueItem = {
      type,
      payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
      retryCount: 0
    };
    const id = await db.syncQueue.add(queueItem);
    return id;
  },

  // Get count of pending items in queue
  async getPendingCount() {
    return await db.syncQueue.where({ status: 'pending' }).count();
  },

  // Trigger synchronization to the backend API
  async syncNow(isSimulatedOffline = false) {
    if (isSimulatedOffline || !navigator.onLine) {
      return {
        success: false,
        message: 'Device is currently offline. Changes are saved locally on this device.',
        syncedCount: 0
      };
    }

    try {
      const pendingItems = await db.syncQueue.where({ status: 'pending' }).toArray();
      if (pendingItems.length === 0) {
        return {
          success: true,
          message: 'All data is already in sync with the server.',
          syncedCount: 0
        };
      }

      // Send batch to backend
      const response = await fetch(`${API_BASE_URL}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: pendingItems })
      });

      if (!response.ok) {
        throw new Error(`Sync server responded with status ${response.status}`);
      }

      const result = await response.json();

      // Mark synced items in Dexie
      const itemIds = pendingItems.map(item => item.id);
      await db.syncQueue.where('id').anyOf(itemIds).delete();

      // Mark certificates & applications as synced
      for (const item of pendingItems) {
        if (item.type === 'CERTIFICATE_ISSUED') {
          await db.certificates.update(item.payload.id, { synced: true });
        } else if (item.type === 'JOB_APPLICATION') {
          if (item.payload.appId) {
            await db.applications.update(item.payload.appId, { synced: true });
          }
        }
      }

      return {
        success: true,
        message: `Successfully synchronized ${pendingItems.length} records to Kopargaon server!`,
        syncedCount: pendingItems.length,
        serverData: result
      };
    } catch (error) {
      console.warn('Sync failed (offline or server unreachable):', error.message);
      return {
        success: false,
        message: `Offline mode: ${error.message}. Records remain safely preserved locally.`,
        syncedCount: 0
      };
    }
  },

  // Pull latest updates from backend
  async pullUpdates() {
    if (!navigator.onLine) return;
    try {
      const coursesRes = await fetch(`${API_BASE_URL}/api/courses`);
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        if (Array.isArray(courses) && courses.length > 0) {
          await db.courses.bulkPut(courses);
        }
      }

      const oppRes = await fetch(`${API_BASE_URL}/api/opportunities`);
      if (oppRes.ok) {
        const opps = await oppRes.json();
        if (Array.isArray(opps) && opps.length > 0) {
          await db.opportunities.bulkPut(opps);
        }
      }
    } catch (err) {
      // Ignore network failures gracefully in offline mode
      console.log('Background pull skipped: device offline');
    }
  }
};
