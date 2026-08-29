import React, { createContext, useContext, useState, useEffect } from 'react';
import mrTranslations from '../locales/mr.json';
import enTranslations from '../locales/en.json';
import { db } from '../db';
import { initializeLocalDB } from '../db/seed';
import { syncService } from '../services/syncService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('mr'); // Marathi default
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [syncMessage, setSyncMessage] = useState('');
  
  // Navigation & User
  const [activeView, setActiveView] = useState('courses'); // courses, course-detail, lesson, quiz, certificates, opportunities, admin
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
    village: 'संवत्सर, तालुका कोपरगाव (Sanvatsar, Kopargaon)',
    phone: '98220XXXXX',
    role: 'student'
  });
  
  const [isPackDownloaded, setIsPackDownloaded] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [userProgressMap, setUserProgressMap] = useState({});
  const [certificatesList, setCertificatesList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);

  // Initialize DB and event listeners
  useEffect(() => {
    async function init() {
      await initializeLocalDB();
      await refreshData();
      
      const packSet = await db.settings.get('fullPackDownloaded');
      if (packSet && packSet.value) {
        setIsPackDownloaded(true);
      }

      const savedSim = await db.settings.get('simulatedOffline');
      if (savedSim) {
        setSimulatedOffline(savedSim.value);
      }
    }
    init();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update pending queue count periodically
  useEffect(() => {
    const checkPending = async () => {
      const count = await syncService.getPendingCount();
      setPendingSyncCount(count);
    };
    checkPending();
    const interval = setInterval(checkPending, 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    try {
      const courses = await db.courses.toArray();
      setAllCourses(courses);

      const progressRecords = await db.progress.toArray();
      const pMap = {};
      progressRecords.forEach(p => {
        pMap[p.courseId] = p;
      });
      setUserProgressMap(pMap);

      const certs = await db.certificates.toArray();
      setCertificatesList(certs);

      const apps = await db.applications.toArray();
      setApplicationsList(apps);

      const count = await syncService.getPendingCount();
      setPendingSyncCount(count);
    } catch (err) {
      console.error('Error refreshing local data:', err);
    }
  };

  // Translation helper function
  const t = (path, replacements = {}) => {
    const dict = lang === 'mr' ? mrTranslations : enTranslations;
    const keys = path.split('.');
    let value = dict;
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        return path;
      }
    }
    if (typeof value === 'string') {
      let text = value;
      Object.keys(replacements).forEach(r => {
        text = text.replace(new RegExp(`{{${r}}}`, 'g'), replacements[r]);
      });
      return text;
    }
    return value;
  };

  // Network simulation toggle
  const toggleOfflineSimulation = async () => {
    const nextState = !simulatedOffline;
    setSimulatedOffline(nextState);
    await db.settings.put({ key: 'simulatedOffline', value: nextState });
  };

  // Language toggle
  const toggleLanguage = () => {
    setLang(prev => (prev === 'mr' ? 'en' : 'mr'));
  };

  // Role toggle (Student vs Teacher)
  const toggleRole = () => {
    setUserProfile(prev => {
      const newRole = prev.role === 'student' ? 'teacher' : 'student';
      if (newRole === 'teacher') {
        setActiveView('admin');
      } else {
        setActiveView('courses');
      }
      return { ...prev, role: newRole };
    });
  };

  // Manual Sync trigger
  const triggerSync = async () => {
    setSyncStatus('syncing');
    setSyncMessage(lang === 'mr' ? 'कोपरगाव सर्व्हरशी संपर्क साधत आहे...' : 'Contacting Kopargaon Server...');
    
    // Simulate brief network delay for realism
    await new Promise(r => setTimeout(r, 600));

    const result = await syncService.syncNow(simulatedOffline);
    if (result.success) {
      setSyncStatus('synced');
      setSyncMessage(
        lang === 'mr'
          ? `यशस्वी! ${result.syncedCount} नोंदी कोपरगाव सर्व्हरवर सिंक झाल्या.`
          : `Success! ${result.syncedCount} records synced to Kopargaon server.`
      );
      await refreshData();
    } else {
      setSyncStatus('error');
      setSyncMessage(result.message);
    }

    setTimeout(() => {
      setSyncStatus('idle');
      setSyncMessage('');
    }, 4000);
  };

  // Download entire course pack for offline storage
  const downloadFullPack = async () => {
    setIsPackDownloaded(true);
    await db.settings.put({ key: 'fullPackDownloaded', value: true });
    // Also cache static assets in CacheStorage if available
    if ('caches' in window) {
      try {
        const cache = await caches.open('gaonshiksha-pack-v1');
        await cache.addAll(['/', '/index.html']);
      } catch (e) {
        console.log('Cache storage populated');
      }
    }
    await refreshData();
  };

  // Mark a lesson as completed
  const markLessonComplete = async (courseId, lessonId) => {
    let currentProgress = await db.progress.get(courseId);
    if (!currentProgress) {
      currentProgress = {
        courseId,
        completedLessonIds: [lessonId],
        lastActiveLessonId: lessonId,
        isCompleted: false,
        updatedAt: new Date().toISOString()
      };
    } else {
      const existing = new Set(currentProgress.completedLessonIds || []);
      existing.add(lessonId);
      currentProgress.completedLessonIds = Array.from(existing);
      currentProgress.lastActiveLessonId = lessonId;
      currentProgress.updatedAt = new Date().toISOString();
    }

    // Check if all lessons are completed
    const course = allCourses.find(c => c.id === courseId);
    if (course && currentProgress.completedLessonIds.length >= course.lessons.length) {
      currentProgress.isCompleted = true;
    }

    await db.progress.put(currentProgress);
    await syncService.enqueue('PROGRESS_UPDATE', {
      studentName: userProfile.name,
      courseId,
      lessonId,
      completedLessons: currentProgress.completedLessonIds,
      timestamp: new Date().toISOString()
    });

    await refreshData();
  };

  const effectiveOnline = isOnline && !simulatedOffline;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        isOnline: effectiveOnline,
        realNetworkOnline: isOnline,
        simulatedOffline,
        toggleOfflineSimulation,
        pendingSyncCount,
        syncStatus,
        syncMessage,
        triggerSync,
        activeView,
        setActiveView,
        selectedCourseId,
        setSelectedCourseId,
        selectedLessonIndex,
        setSelectedLessonIndex,
        userProfile,
        setUserProfile,
        toggleRole,
        isPackDownloaded,
        downloadFullPack,
        allCourses,
        userProgressMap,
        certificatesList,
        applicationsList,
        refreshData,
        markLessonComplete
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
