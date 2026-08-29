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
  const [activeView, setActiveView] = useState('courses'); // login, courses, course-detail, lesson, quiz, certificates, opportunities, admin
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('sathi_user');
    return saved ? JSON.parse(saved) : null;
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
      
      // Ensure routing to login if no user
      if (!userProfile) {
        setActiveView('login');
      }
    }
    init();

    const handleOnline = () => {
      setIsOnline(true);
      if (!simulatedOffline) {
        triggerSync(true); // silent auto-sync
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic auto-sync (every 60 seconds)
    const syncInterval = setInterval(() => {
      if (navigator.onLine && !simulatedOffline) {
        triggerSync(true);
      }
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
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

  // Auth methods
  const login = async (username, password) => {
    const user = await db.users.where({ username }).first();
    if (user && user.password === password) { // Plaintext for offline MVP as discussed
      setUserProfile(user);
      localStorage.setItem('sathi_user', JSON.stringify(user));
      setActiveView(user.role === 'teacher' ? 'admin' : 'courses');
      return { success: true };
    }
    return { success: false, message: lang === 'mr' ? 'चुकीचे युझरनेम किंवा पासवर्ड' : 'Invalid username or password' };
  };

  const signup = async (userData) => {
    const existing = await db.users.where({ username: userData.username }).first();
    if (existing) {
      return { success: false, message: lang === 'mr' ? 'हे युझरनेम आधीच वापरले आहे' : 'Username already exists' };
    }
    
    // Save locally
    const id = await db.users.add(userData);
    const newUser = { ...userData, id };
    
    // Queue for sync
    await syncService.enqueue('NEW_USER', newUser);
    
    // Auto-login
    setUserProfile(newUser);
    localStorage.setItem('sathi_user', JSON.stringify(newUser));
    setActiveView(newUser.role === 'teacher' ? 'admin' : 'courses');
    return { success: true };
  };

  const logout = () => {
    setUserProfile(null);
    localStorage.removeItem('sathi_user');
    setActiveView('login');
  };

  // Sync trigger
  const triggerSync = async (silent = false) => {
    if (syncStatus === 'syncing') return;
    
    if (!silent) {
      setSyncStatus('syncing');
      setSyncMessage(lang === 'mr' ? 'सिंक करत आहे...' : 'Syncing...');
    }

    const result = await syncService.syncNow(simulatedOffline);
    if (result.success && result.syncedCount > 0) {
      setSyncStatus('synced');
      setSyncMessage(lang === 'mr' ? 'सिंक झाले!' : 'Synced!');
      await refreshData();
    } else if (!result.success && !silent) {
      setSyncStatus('error');
      setSyncMessage(result.message);
    } else if (result.success && result.syncedCount === 0 && !silent) {
      setSyncStatus('synced');
      setSyncMessage(lang === 'mr' ? 'आधीच सिंक आहे' : 'Already in sync');
    }

    if (!silent || (result.success && result.syncedCount > 0)) {
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    }
  };

  // Download entire course pack for offline storage
  const downloadFullPack = async () => {
    setIsPackDownloaded(true);
    await db.settings.put({ key: 'fullPackDownloaded', value: true });
    // Also cache static assets in CacheStorage if available
    if ('caches' in window) {
      try {
        const cache = await caches.open('sathi-pack-v1');
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
        login,
        signup,
        logout,
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
