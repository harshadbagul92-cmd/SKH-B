import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  UserCheck,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function Header() {
  const {
    lang,
    toggleLanguage,
    t,
    isOnline,
    simulatedOffline,
    toggleOfflineSimulation,
    pendingSyncCount,
    syncStatus,
    syncMessage,
    triggerSync,
    activeView,
    setActiveView,
    userProfile,
    toggleRole
  } = useApp();

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      {/* Top Banner for Sync Notification */}
      {syncMessage && (
        <div
          className={`py-1.5 px-4 text-center text-xs font-semibold transition-all ${
            syncStatus === 'synced'
              ? 'bg-emerald-600 text-white'
              : syncStatus === 'error'
              ? 'bg-amber-600 text-white'
              : 'bg-orange-600 text-white animate-pulse'
          }`}
        >
          {syncMessage}
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Platform Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveView(userProfile.role === 'teacher' ? 'admin' : 'courses')}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {lang === 'mr' ? 'ग्रामशिक्षा' : 'GaonShiksha'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-brand-700 px-2 py-0.5 rounded-full border border-orange-200">
                  {lang === 'mr' ? 'कोपरगाव' : 'Kopargaon'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {lang === 'mr' ? 'ऑफलाइन ग्रामीण कौशल्य व रोजगार मंच' : 'Offline Rural Learning & Skill Academy'}
              </p>
            </div>
          </div>

          {/* Controls & Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Network Indicator & Judge Simulation Toggle */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleOfflineSimulation}
                title={lang === 'mr' ? 'परीक्षकांसाठी: इंटरनेट सुरू/बंद करून तपासा' : 'For Judges: Toggle simulated offline/online'}
                className={`flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 ring-2 ring-rose-300/50'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline">{t('app.online_badge')}</span>
                    <span className="md:hidden">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <span className="hidden md:inline">{t('app.offline_badge')}</span>
                    <span className="md:hidden">Offline</span>
                  </>
                )}
                <span className="text-[10px] bg-white/80 px-1 py-0.2 rounded border text-slate-600 font-normal">
                  {simulatedOffline ? (lang === 'mr' ? 'सिम्युलेटेड' : 'Simulated') : (lang === 'mr' ? 'लाईव्ह' : 'Live')}
                </span>
              </button>
            </div>

            {/* Sync Now Button */}
            <button
              onClick={triggerSync}
              disabled={syncStatus === 'syncing'}
              className="relative flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-brand-700 border border-orange-200 transition-colors"
              title={lang === 'mr' ? 'सर्व्हरशी माहिती सिंक करा' : 'Sync local data with server'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-brand-600' : ''}`} />
              <span className="hidden sm:inline">{t('app.sync_now')}</span>
              {pendingSyncCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-brand-600 rounded-full animate-bounce">
                  {pendingSyncCount}
                </span>
              )}
            </button>

            {/* Language Toggle (Marathi / English) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-sm"
              title="भाषा बदला / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span className="tracking-wide">
                {lang === 'mr' ? 'मराठी ➔ EN' : 'English ➔ मराठी'}
              </span>
            </button>

            {/* Role Switcher (Student / Teacher) */}
            <button
              onClick={toggleRole}
              className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                userProfile.role === 'teacher'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                  : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {userProfile.role === 'teacher' ? t('app.role_teacher') : t('app.role_student')}
              </span>
            </button>

          </div>
        </div>

        {/* Navigation Tabs */}
        {userProfile.role === 'student' && (
          <nav className="flex space-x-2 sm:space-x-4 border-t border-slate-100 py-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveView('courses')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeView === 'courses' || activeView === 'course-detail' || activeView === 'lesson' || activeView === 'quiz'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('nav.courses')}</span>
            </button>

            <button
              onClick={() => setActiveView('certificates')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeView === 'certificates'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{t('nav.certificates')}</span>
            </button>

            <button
              onClick={() => setActiveView('opportunities')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeView === 'opportunities'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('nav.opportunities')}</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
