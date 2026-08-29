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

  // Session Language Selected flag
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
  
  // Navigation & View State: courses, exams, lesson, quiz, certificates, opportunities, profile, admin
  const [activeView, setActiveView] = useState('courses');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  
  // E-Textbook State
  const [allTextbooks, setAllTextbooks] = useState([]);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  const [textbookInitialMode, setTextbookInitialMode] = useState('ebook');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('all');

  // Government Exams State
  const [allGovExams, setAllGovExams] = useState([]);
  const [selectedGovExam, setSelectedGovExam] = useState(null);

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
      setAllCourses(courses || []);

      const textbooks = await db.textbooks.toArray();
      setAllTextbooks(textbooks || []);

      const exams = await db.govExams.toArray();
      setAllGovExams(exams || []);

      const progressArr = await db.progress.toArray();
      const pMap = {};
      progressArr.forEach((p) => {
        pMap[p.courseId] = p;
      });
      setUserProgressMap(pMap);

      const certs = await db.certificates.toArray();
      setCertificatesList(certs || []);

      const apps = await db.applications.toArray();
      setApplicationsList(apps || []);

      // If user is logged in, refresh latest user profile from DB
      if (currentUser?.email) {
        const latestUser = await db.users.get(currentUser.email);
        if (latestUser) {
          setCurrentUser(latestUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(latestUser));
        }
      }
    } catch (err) {
      console.error('Error refreshing local data:', err);
    }
  };

  // Translation helpers
  const translations = lang === 'en' ? enTranslations : lang === 'hi' ? hiTranslations : mrTranslations;

  const t = (keyPath, params = {}) => {
    const keys = keyPath.split('.');
    let val = translations;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        // Fallback to English
        let fallback = enTranslations;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return keyPath;
          }
        }
        val = fallback;
        break;
      }
    }

    if (typeof val === 'string') {
      let str = val;
      Object.keys(params).forEach((paramKey) => {
        str = str.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
      });
      return str;
    }
    return val || keyPath;
  };

  const tObj = (multilangObj) => {
    if (!multilangObj) return '';
    if (typeof multilangObj === 'string') return multilangObj;
    return multilangObj[lang] || multilangObj['mr'] || multilangObj['en'] || Object.values(multilangObj)[0] || '';
  };

  // Offline Simulator Toggle
  const toggleOfflineSimulation = async () => {
    const nextVal = !simulatedOffline;
    setSimulatedOffline(nextVal);
    await db.settings.put({ key: 'simulatedOffline', value: nextVal });
    setIsOnline(!nextVal && navigator.onLine);
  };

  // Manual Trigger Sync
  const triggerSync = async () => {
    if (!isOnline || simulatedOffline) {
      setSyncStatus('error');
      setSyncMessage(
        lang === 'mr'
          ? 'इंटरनेट बंद आहे. इंटरनेट सुरू झाल्यावर माहिती सिंक होईल.'
          : lang === 'hi'
          ? 'इंटरनेट बंद है। कनेक्ट होने पर डेटा सिंक होगा।'
          : 'Network offline. Will automatically sync when connection returns.'
      );
      setTimeout(() => setSyncMessage(''), 4000);
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage(
      lang === 'mr'
        ? 'सर्व्हरशी माहिती सिंक होत आहे...'
        : lang === 'hi'
        ? 'सर्वर से डेटा सिंक हो रहा है...'
        : 'Syncing local progress with central server...'
    );

    try {
      const res = await syncService.syncAll();
      await refreshData();
      setSyncStatus('synced');
      setSyncMessage(res.serverMessage || (
        lang === 'mr' ? 'सर्व माहिती यशस्वीरित्या सिंक झाली!' : lang === 'hi' ? 'डेटा सफलतापूर्वक सिंक हुआ!' : 'All records synced successfully!'
      ));
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 4000);
    } catch (err) {
      setSyncStatus('error');
      setSyncMessage(
        lang === 'mr' ? 'सिंक करताना अडचण आली.' : lang === 'hi' ? 'सिंक में त्रुटि हुई।' : 'Sync encountered an error.'
      );
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 4000);
    }
  };

  // Authentication Handlers
  const signup = async (userData) => {
    try {
      if (!userData || !userData.email) {
        return { success: false, message: 'Email address is required.' };
      }

      const cleanEmail = userData.email.trim().toLowerCase();
      const newUser = {
        name: (userData.name || 'Scholar').trim(),
        email: cleanEmail,
        password: userData.password || 'password123',
        mobile: (userData.mobile || '9876543210').replace(/\D/g, ''),
        grade: userData.grade || '10th',
        city: (userData.city || 'Kopargaon').trim(),
        role: userData.role || 'student',
        category: userData.role === 'mentor' ? 'mentor' : 'general',
        targetGoal: userData.role === 'mentor' ? 'mentor' : 'police',
        createdAt: new Date().toISOString()
      };

      await db.users.put(newUser);
      await syncService.queueUserProfileUpdate(newUser);

      setCurrentUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setActiveView(newUser.role === 'mentor' || newUser.role === 'teacher' ? 'admin' : 'courses');
      return { success: true, user: newUser };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: err.message || 'Signup error' };
    }
  };

  const login = async (identifierOrObj, password) => {
    try {
      let email = '';
      let pwd = '';
      let name = '';
      let role = 'student';
      let mobile = '9876543210';
      let city = 'Kopargaon';
      let grade = '10th';
      let category = 'general';

      if (typeof identifierOrObj === 'object' && identifierOrObj !== null) {
        email = (identifierOrObj.email || '').trim().toLowerCase();
        pwd = identifierOrObj.password || password || 'password123';
        name = identifierOrObj.name || (email.includes('@') ? email.split('@')[0] : 'Scholar');
        role = identifierOrObj.role || 'student';
        mobile = identifierOrObj.mobile || '9876543210';
        city = identifierOrObj.city || 'Kopargaon';
        grade = identifierOrObj.grade || '10th';
        category = identifierOrObj.category || (role === 'mentor' ? 'mentor' : 'general');
      } else if (typeof identifierOrObj === 'string') {
        email = identifierOrObj.trim().toLowerCase();
        pwd = password || 'password123';
        name = email.includes('@') ? email.split('@')[0] : 'Scholar';
      }

      if (!email) {
        return { success: false, message: 'Please provide a valid Gmail ID / Email.' };
      }

      const allUsers = await db.users.toArray();
      let user = allUsers.find(
        (u) => (u.email && u.email.toLowerCase() === email) || (u.mobile && u.mobile === email.replace(/\D/g, ''))
      );

      if (!user) {
        // Automatically register user locally for seamless offline access
        user = {
          name: name || 'Vikas Tambade',
          email: email,
          password: pwd,
          mobile: mobile,
          grade: grade,
          city: city,
          role: role,
          category: category,
          targetGoal: role === 'mentor' ? 'mentor' : 'police',
          createdAt: new Date().toISOString()
        };
        await db.users.put(user);
        await syncService.queueUserProfileUpdate(user);
      } else {
        if (role && user.role !== role) {
          user.role = role;
          user.category = category;
          await db.users.put(user);
        }
      }

      setCurrentUser(user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setActiveView(user.role === 'mentor' || user.role === 'teacher' ? 'admin' : 'courses');
      return { success: true, user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.message || 'Authentication error' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setActiveView('courses');
  };

  const updateUserProfile = async (updatedData) => {
    if (!currentUser) return false;
    try {
      const merged = { ...currentUser, ...updatedData };
      await db.users.put(merged);
      setCurrentUser(merged);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(merged));
      await syncService.queueUserProfileUpdate(merged);
      return true;
    } catch (e) {
      console.error('Error updating profile:', e);
      return false;
    }
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'student' ? 'teacher' : 'student';
    updateUserProfile({ role: newRole });
    setActiveView(newRole === 'teacher' ? 'admin' : 'courses');
  };

  // Complete offline download simulation
  const downloadFullPack = async () => {
    await db.settings.put({ key: 'fullPackDownloaded', value: true });
    setIsPackDownloaded(true);
  };

  // E-Textbook Actions
  const openTextbook = (textbook, mode = 'ebook') => {
    setSelectedTextbook(textbook);
    setTextbookInitialMode(mode);
  };

  const closeTextbook = () => {
    setSelectedTextbook(null);
    setTextbookInitialMode('ebook');
  };

  // Record Lesson Completion
  const markLessonComplete = async (courseId, lessonId) => {
    try {
      const current = userProgressMap[courseId] || {
        courseId,
        completedLessonIds: [],
        isCompleted: false,
        updatedAt: new Date().toISOString()
      };

      const setIds = new Set(current.completedLessonIds || []);
      setIds.add(lessonId);
      const updatedList = Array.from(setIds);

      const course = allCourses.find((c) => c.id === courseId);
      const isFinished = course && course.lessons && updatedList.length >= course.lessons.length;

      const newProgress = {
        ...current,
        courseId,
        completedLessonIds: updatedList,
        isCompleted: isFinished,
        updatedAt: new Date().toISOString()
      };

      await db.progress.put(newProgress);
      await refreshData();
      return true;
    } catch (e) {
      console.error('Error marking lesson complete:', e);
      return false;
    }
  };

  // Record Quiz Result & Certificate
  const recordQuizResult = async (courseId, score, totalQuestions, passed, grade = 'A') => {
    try {
      const course = allCourses.find((c) => c.id === courseId);
      const courseTitle = course ? tObj(course.title) : 'Vocational Course';

      await db.quizAttempts.add({
        courseId,
        score,
        totalQuestions,
        passed,
        timestamp: new Date().toISOString()
      });

      if (passed) {
        const studentName = currentUser?.name || 'Vikas Tambade';
        const village = currentUser?.city || 'Kopargaon';
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const verificationCode = `IL-${village.substring(0, 3).toUpperCase()}-2026-${randNum}`;

        const cert = {
          id: `cert-${Date.now()}`,
          verificationCode,
          courseId,
          studentName,
          village,
          courseTitle,
          score: `${score}/${totalQuestions} (${Math.round((score / totalQuestions) * 100)}%)`,
          grade: `${grade} (उत्कृष्ट)`,
          issueDate: new Date().toLocaleDateString('mr-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          synced: false
        };

        await db.certificates.put(cert);
        await syncService.queueCertificate(cert);
        await refreshData();
        return cert;
      }
      return null;
    } catch (e) {
      console.error('Error recording quiz result:', e);
      return null;
    }
  };

  // Apply to opportunity
  const applyToOpportunity = async (opportunity, phone, notes) => {
    try {
      const studentName = currentUser?.name || 'Student';
      const village = currentUser?.city || 'Kopargaon';

      const appRecord = {
        appId: `app-${Date.now()}`,
        oppId: opportunity.id,
        oppTitle: tObj(opportunity.title),
        organization: tObj(opportunity.organization),
        studentName,
        village,
        phone: phone || currentUser?.mobile || '',
        notes: notes || '',
        synced: false,
        timestamp: new Date().toISOString()
      };

      await db.applications.add(appRecord);
      await syncService.queueApplication(appRecord);
      await refreshData();
      return true;
    } catch (e) {
      console.error('Error applying to job:', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        hasSelectedSessionLang,
        setHasSelectedSessionLang,
        t,
        tObj,
        currentUser,
        userProfile: currentUser,
        signup,
        login,
        logout,
        updateUserProfile,
        toggleRole,
        isOnline: isOnline && !simulatedOffline,
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
        allCourses,
        allTextbooks,
        allGovExams,
        selectedTextbook,
        textbookInitialMode,
        openTextbook,
        closeTextbook,
        activeSubjectFilter,
        setActiveSubjectFilter,
        selectedGovExam,
        setSelectedGovExam,
        userProgressMap,
        certificatesList,
        applicationsList,
        isPackDownloaded,
        downloadFullPack,
        markLessonComplete,
        recordQuizResult,
        applyToOpportunity,
        refreshData
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
