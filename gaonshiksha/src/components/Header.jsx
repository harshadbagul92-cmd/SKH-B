import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  FileQuestion,
  Landmark,
  Award,
  Briefcase,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const {
    lang,
    setLang,
    t,
    isOnline,
    setIsOnline,
    pendingSyncCount,
    syncStatus,
    syncMessage,
    triggerSync,
    activeView,
    setActiveView,
    userProfile,
    allGovExams,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' }
  ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  const navItems = [
    { id: 'courses', label: t('nav.courses') || 'Courses & E-Books', icon: BookOpen },
    { id: 'test', label: lang === 'mr' ? 'ऑनलाइन परीक्षा' : lang === 'hi' ? 'ऑनलाइन परीक्षा' : 'Online Test', icon: FileQuestion, badge: 'NEW' },
    { id: 'exams', label: t('nav.exams') || 'Exam Notifications', icon: Landmark, badge: `${allGovExams?.length || 36}` },
    { id: 'certificates', label: t('nav.certificates') || 'Certificates', icon: Award },
    { id: 'opportunities', label: t('nav.opportunities') || 'Career / Job Hub', icon: Briefcase },
    { id: 'profile', label: t('nav.profile') || 'My Profile', icon: User }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      
      {/* Top Banner for Sync Status */}
      {syncMessage && (
        <div
          className={`py-1.5 px-4 text-center text-xs font-semibold transition-all ${
            syncStatus === 'synced'
              ? 'bg-emerald-600 text-white'
              : syncStatus === 'syncing'
              ? 'bg-brand-600 text-white animate-pulse'
              : 'bg-amber-600 text-white'
          }`}
        >
          <span>{syncMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Mobile Left: Branding & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
                <Shield className="w-5 h-5 text-gold-400 fill-gold-400/20" />
              </div>
              <span className="font-black text-base tracking-tight text-[#000083]">
                INVICTUS
              </span>
            </div>
          </div>

          {/* Desktop Left: Breadcrumb / Active Screen Title */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
              <span className="text-[#002EAF]">Invictus Learning</span>
              <span>/</span>
              <span className="text-[#000083] capitalize">
                {activeView === 'courses' ? t('nav.courses') : activeView === 'exams' ? t('nav.exams') : activeView === 'certificates' ? t('nav.certificates') : activeView === 'opportunities' ? t('nav.opportunities') : t('nav.profile')}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Sync Button (if pending changes) */}
            {pendingSyncCount > 0 && (
              <button
                onClick={triggerSync}
                className="flex items-center space-x-1 text-xs font-bold bg-[#FFEB01]/20 text-[#000083] border border-[#FFEB01] px-3 py-1.5 rounded-xl hover:bg-[#FFEB01]/30 transition-colors"
                title="Sync offline changes"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#002EAF]" />
                <span>Sync ({pendingSyncCount})</span>
              </button>
            )}

            {/* Offline Status Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#002EAF]" />
                <span>{currentLangObj.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-50 transition-colors ${
                        lang === l.code ? 'text-[#002EAF] font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <span className="text-[#002EAF]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <button
              onClick={() => setActiveView('profile')}
              className="flex items-center space-x-2 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#000083] text-[#FFEB01] font-black text-xs flex items-center justify-center">
                {userProfile?.name?.charAt(0) || 'V'}
              </div>
              <span className="text-xs font-bold text-[#000083] hidden sm:inline max-w-[120px] truncate">
                {userProfile?.name || 'Student'}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-fadeIn shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500 text-navy-950 font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
