import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LanguageSelectView from './views/LanguageSelectView';
import AuthView from './views/AuthView';
import Header from './components/Header';
import OfflineBanner from './components/OfflineBanner';
import CoursesView from './views/CoursesView';
import LessonView from './views/LessonView';
import QuizView from './views/QuizView';
import CertificateView from './views/CertificateView';
import OpportunitiesView from './views/OpportunitiesView';
import AdminView from './views/AdminView';
import ProfileView from './views/ProfileView';
import {
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Zap,
  Globe,
  User
} from 'lucide-react';

function MainAppContent() {
  const {
    hasSelectedSessionLang,
    currentUser,
    activeView,
    setActiveView,
    lang,
    t,
    userProfile
  } = useApp();

  // 1. Initial Entry Point: Language Selection Screen
  if (!hasSelectedSessionLang) {
    return <LanguageSelectView />;
  }

  // 2. Auth Flow: If not logged in, show Multilingual Login & Signup Page
  if (!currentUser) {
    return <AuthView />;
  }

  // 3. Authenticated Dashboard Workflow
  const renderActiveView = () => {
    switch (activeView) {
      case 'courses':
        return <CoursesView />;
      case 'lesson':
        return <LessonView />;
      case 'quiz':
        return <QuizView />;
      case 'certificates':
        return <CertificateView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      default:
        return <CoursesView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 pb-16 sm:pb-0">
      {/* Header */}
      <Header />

      {/* Offline Status & Reassurance Banner */}
      <OfflineBanner />

      {/* Dynamic Main Body Content */}
      <main className="flex-1 py-4 sm:py-6">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-12 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black">
              IL
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                Invictus Learning • {t('app.subtitle')}
              </div>
              <p className="text-[11px] text-slate-500">
                {lang === 'mr'
                  ? 'व्यावहारिक कौशल्य, डिजिटल साक्षरता व करिअर सक्षमीकरण मंच'
                  : lang === 'hi'
                  ? 'व्यावहारिक कौशल, डिजिटल साक्षरता एवं रोजगार सशक्तिकरण मंच'
                  : 'Practical Vocational Skills, Digital Literacy & Career Empowerment'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-400 font-medium text-xs">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>PWA Offline-First (Dexie.js)</span>
            </span>
            <span className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trilingual (EN / HI / MR)</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Accredited Skill Certs</span>
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            Designed for seamless offline-enabled learning.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      {userProfile && userProfile.role === 'student' && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveView('courses')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold ${
              activeView === 'courses' || activeView === 'lesson' || activeView === 'quiz'
                ? 'text-brand-600'
                : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span>{t('nav.courses')}</span>
          </button>

          <button
            onClick={() => setActiveView('certificates')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold ${
              activeView === 'certificates' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Award className="w-5 h-5 mb-0.5" />
            <span>{t('nav.certificates')}</span>
          </button>

          <button
            onClick={() => setActiveView('opportunities')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold ${
              activeView === 'opportunities' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span>{t('nav.opportunities')}</span>
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold ${
              activeView === 'profile' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>{t('profile.title') || 'Profile'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
