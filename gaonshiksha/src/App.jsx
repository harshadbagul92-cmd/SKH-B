import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LanguageSelectView from './views/LanguageSelectView';
import AuthView from './views/AuthView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OfflineBanner from './components/OfflineBanner';
import CoursesView from './views/CoursesView';
import ExamNotificationsView from './views/ExamNotificationsView';
import LessonView from './views/LessonView';
import QuizView from './views/QuizView';
import CertificateView from './views/CertificateView';
import OpportunitiesView from './views/OpportunitiesView';
import AdminView from './views/AdminView';
import ProfileView from './views/ProfileView';
import ChatbotWidget from './components/ChatbotWidget';
import {
  BookOpen,
  Award,
  Briefcase,
  User,
  Landmark
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

  // 2. Auth Flow: Centered Stacked Card Layout matching reference
  if (!currentUser) {
    return <AuthView />;
  }

  // 3. Authenticated Dashboard Views
  const renderActiveView = () => {
    switch (activeView) {
      case 'courses':
        return <CoursesView />;
      case 'exams':
        return <ExamNotificationsView />;
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
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-sans selection:bg-gold-400 selection:text-navy-950">
      
      {/* Desktop Left Sidebar Navigation */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        
        {/* Top Header Controls */}
        <Header />

        {/* Offline Status & Reassurance Banner */}
        <OfflineBanner />

        {/* View Component Render */}
        <main className="flex-1 py-4 sm:py-6">
          {renderActiveView()}
        </main>

        {/* Floating AI Chatbot Assistant Widget at Side of UI */}
        <ChatbotWidget />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 hidden sm:block">
          Invictus Learning Academy © 2026 • Empowering Class 10th Scholars & Exam Aspirants Offline
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {userProfile && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveView('courses')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
              activeView === 'courses' || activeView === 'lesson' || activeView === 'quiz'
                ? 'text-brand-600'
                : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>{t('nav.courses')}</span>
          </button>

          <button
            onClick={() => setActiveView('exams')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
              activeView === 'exams' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Landmark className="w-4 h-4 mb-0.5 text-gold-600" />
            <span>{t('nav.exams')}</span>
          </button>

          <button
            onClick={() => setActiveView('certificates')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
              activeView === 'certificates' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Award className="w-4 h-4 mb-0.5" />
            <span>{t('nav.certificates')}</span>
          </button>

          <button
            onClick={() => setActiveView('opportunities')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
              activeView === 'opportunities' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Briefcase className="w-4 h-4 mb-0.5" />
            <span>{t('nav.opportunities')}</span>
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
              activeView === 'profile' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>{t('nav.profile') || 'Profile'}</span>
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
