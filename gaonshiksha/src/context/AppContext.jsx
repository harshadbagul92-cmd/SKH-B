import React, { createContext, useContext, useState, useEffect } from 'react';
import mrTranslations from '../locales/mr.json';
import hiTranslations from '../locales/hi.json';
import enTranslations from '../locales/en.json';
import { db } from '../db';
import { initializeLocalDB } from '../db/seed';
import { syncService } from '../services/syncService';

const AppContext = createContext();

const AUTH_STORAGE_KEY = 'invictus_auth_user';
const LANG_STORAGE_KEY = 'invictus_pref_lang';

export function AppProvider({ children }) {
  // Language state (default 'mr', 'hi', or 'en')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'mr';
  });

  // Session Language Selected flag (Always starts false on app load to show Language Selection Screen first)
  const [hasSelectedSessionLang, setHasSelectedSessionLang] = useState(false);

  // Authentication persistence state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [syncMessage, setSyncMessage] = useState('');
  
  // Navigation & View State
  const [activeView, setActiveView] = useState('courses'); // courses, course-detail, lesson, quiz, certificates, opportunities, admin
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  
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

  // Save chosen language to localStorage
  useEffect(() => {
    if (lang) {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }, [lang]);

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
    let dict = mrTranslations;
    if (lang === 'hi') dict = hiTranslations;
    else if (lang === 'en') dict = enTranslations;

    const keys = path.split('.');
    let value = dict;
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        // Fallback to English or Marathi if key is missing
        let fallbackDict = enTranslations;
        let fbVal = fallbackDict;
        for (const k of keys) {
          if (fbVal && fbVal[k] !== undefined) {
            fbVal = fbVal[k];
          } else {
            fbVal = null;
            break;
          }
        }
        if (fbVal) {
          value = fbVal;
          break;
        }
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

  // Multilingual Object field accessor helper (e.g. title: { en: '..', mr: '..', hi: '..' })
  const tObj = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      if (obj[lang]) return obj[lang];
      if (lang === 'hi') return obj.hi || obj.mr || obj.en || '';
      if (lang === 'mr') return obj.mr || obj.hi || obj.en || '';
      return obj.en || obj.mr || obj.hi || '';
    }
    return '';
  };

  // Confirm language selection on initial screen
  const confirmLanguageSelection = (selectedLang) => {
    if (selectedLang) {
      setLang(selectedLang);
      localStorage.setItem(LANG_STORAGE_KEY, selectedLang);
    }
    setHasSelectedSessionLang(true);
  };

  // Signup method
  const signup = async (studentData) => {
    try {
      const newUser = {
        name: studentData.name.trim(),
        email: studentData.email.trim().toLowerCase(),
        password: studentData.password,
        mobile: studentData.mobile.trim(),
        grade: studentData.grade,
        city: studentData.city.trim(),
        role: 'student',
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      await db.users.put(newUser);

      // Save to localStorage session
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: err.message };
    }
  };

  // Login method
  const login = async (identifier, password) => {
    try {
      const cleanId = identifier.trim().toLowerCase();
      
      // Search in Dexie users
      let user = await db.users
        .filter(u => u.email.toLowerCase() === cleanId || u.mobile === cleanId)
        .first();

      if (!user && (cleanId === 'vikas@invictus.edu' || cleanId === '9822012345')) {
        // Fallback for default demo user
        user = {
          name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
          email: 'vikas@invictus.edu',
          password: 'password123',
          mobile: '9822012345',
          grade: '12th',
          city: 'संवत्सर, कोपरगाव (Kopargaon)',
          role: 'student',
          createdAt: new Date().toISOString()
        };
        await db.users.put(user);
      }

      if (user && user.password === password) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.message };
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setHasSelectedSessionLang(false);
    setActiveView('courses');
  };

  // Network simulation toggle
  const toggleOfflineSimulation = async () => {
    const nextState = !simulatedOffline;
    setSimulatedOffline(nextState);
    await db.settings.put({ key: 'simulatedOffline', value: nextState });
  };

  // Language cycle helper
  const cycleLanguage = () => {
    setLang(prev => {
      if (prev === 'en') return 'hi';
      if (prev === 'hi') return 'mr';
      return 'en';
    });
  };

  // Role toggle (Student vs Teacher)
  const toggleRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'student' ? 'teacher' : 'student';
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    if (newRole === 'teacher') {
      setActiveView('admin');
    } else {
      setActiveView('courses');
    }
  };

  // Manual Sync trigger
  const triggerSync = async () => {
    setSyncStatus('syncing');
    setSyncMessage(
      lang === 'mr'
        ? 'सर्व्हरशी संपर्क साधत आहे...'
        : lang === 'hi'
        ? 'सर्वर से संपर्क हो रहा है...'
        : 'Contacting Invictus Sync Server...'
    );
    
    await new Promise(r => setTimeout(r, 600));

    const result = await syncService.syncNow(simulatedOffline);
    if (result.success) {
      setSyncStatus('synced');
      setSyncMessage(
        lang === 'mr'
          ? `यशस्वी! ${result.syncedCount} नोंदी सर्व्हरवर सिंक झाल्या.`
          : lang === 'hi'
          ? `सफल! ${result.syncedCount} रिकॉर्ड सर्वर पर सिंक हुए।`
          : `Success! ${result.syncedCount} records synced to server.`
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
    if ('caches' in window) {
      try {
        const cache = await caches.open('invictus-pack-v1');
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

    const course = allCourses.find(c => c.id === courseId);
    if (course && currentProgress.completedLessonIds.length >= course.lessons.length) {
      currentProgress.isCompleted = true;
    }

    await db.progress.put(currentProgress);
    await syncService.enqueue('PROGRESS_UPDATE', {
      studentName: currentUser ? currentUser.name : 'Student',
      courseId,
      lessonId,
      completedLessons: currentProgress.completedLessonIds,
      timestamp: new Date().toISOString()
    });

    await refreshData();
  };

  const updateUserProfile = async (updatedFields) => {
    try {
      const baseUser = currentUser || {
        name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
        email: 'vikas@invictus.edu',
        mobile: '9822012345',
        grade: '12th',
        city: 'संवत्सर, कोपरगाव (Kopargaon)',
        role: 'student',
        createdAt: new Date().toISOString()
      };

      const updatedUser = {
        ...baseUser,
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };

      // Save to IndexedDB
      await db.users.put(updatedUser);

      // Save to localStorage session
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // Queue for offline sync
      await syncService.enqueue('USER_PROFILE_UPDATE', updatedUser);

      // Update pending sync count
      const count = await syncService.getPendingCount();
      setPendingSyncCount(count);

      // Background sync if online
      if (isOnline && !simulatedOffline) {
        syncService.syncNow(simulatedOffline).then(async (res) => {
          if (res.success) {
            const freshCount = await syncService.getPendingCount();
            setPendingSyncCount(freshCount);
          }
        });
      }

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Failed to update user profile:', err);
      return { success: false, message: err.message };
    }
  };

  const effectiveOnline = isOnline && !simulatedOffline;

  const userProfile = currentUser || {
    name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
    email: 'vikas@invictus.edu',
    mobile: '9822012345',
    grade: '12th',
    city: 'संवत्सर, कोपरगाव (Kopargaon)',
    state: 'Maharashtra',
    country: 'India',
    pincode: '423601',
    category: 'vocational',
    targetGoal: 'Practical Skill Certification & Local Employment',
    role: 'student',
    preferences: {
      notifications: true,
      audioNarration: true,
      jobAlerts: true,
      specialAssistance: false,
      assistanceDetails: '',
      preferredJobRoles: 'Digital Assistant, Technician'
    },
    dailyGoal: 5,
    streakCount: 5,
    lastSyncedAt: new Date().toISOString()
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        cycleLanguage,
        t,
        tObj,
        hasSelectedSessionLang,
        setHasSelectedSessionLang,
        confirmLanguageSelection,
        currentUser,
        login,
        signup,
        logout,
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
        updateUserProfile,
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
