import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  BookOpen,
  Landmark,
  Award,
  Briefcase,
  User,
  Wifi,
  WifiOff,
  LogOut,
  Sparkles,
  ChevronRight,
  HardDrive
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeView,
    setActiveView,
    allGovExams,
    certificatesList,
    userProfile,
    isOnline,
    setIsOnline,
    lang,
    setLang,
    logout,
    t
  } = useApp();

  const navItems = [
    {
      id: 'courses',
      label: t('nav.courses') || 'Courses & E-Books',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'exams',
      label: t('nav.exams') || 'Exam Notifications',
      icon: Landmark,
      badge: `${allGovExams?.length || 6} NEW`,
      badgeColor: 'bg-gold-500 text-navy-950 font-black shadow-xs'
    },
    {
      id: 'certificates',
      label: t('nav.certificates') || 'Certificates',
      icon: Award,
      badge: certificatesList?.length > 0 ? `${certificatesList.length}` : null,
      badgeColor: 'bg-blue-500 text-white font-bold'
    },
    {
      id: 'opportunities',
      label: t('nav.opportunities') || 'Career / Job Hub',
      icon: Briefcase,
      badge: null
    },
    {
      id: 'profile',
      label: t('nav.profile') || 'My Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-[#000083] text-white min-h-screen flex flex-col justify-between border-r border-[#002EAF]/40 shrink-0 sticky top-0 h-screen z-30 select-none shadow-xl">
      
      {/* Top: Branding Header */}
      <div>
        <div className="p-5 border-b border-blue-900/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#002EAF] flex items-center justify-center text-white shadow-md border border-blue-400">
            <Shield className="w-6 h-6 text-[#FFEB01] fill-[#FFEB01]/20" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-base tracking-tight text-white">
                INVICTUS
              </span>
              <span className="text-[9px] uppercase font-black bg-[#FFEB01] text-[#000083] px-1.5 py-0.2 rounded font-mono">
                EdTech
              </span>
            </div>
            <p className="text-[10px] text-blue-200 font-semibold line-clamp-1">
              Class 10 & Govt Exam Hub
            </p>
          </div>
        </div>

        {/* User Card in Sidebar */}
        <div className="px-4 py-3 border-b border-blue-900/60 bg-[#000066] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#002EAF] text-white font-black text-xs flex items-center justify-center border border-[#FFEB01]">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-white line-clamp-1">
                {userProfile?.name || 'Student'}
              </div>
              <div className="text-[10px] text-[#FFEB01] font-bold">
                {userProfile?.grade || 'Class 10th'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('profile')}
            className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer"
            title="Profile"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-3 space-y-1.5">
          <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider font-black text-blue-300">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.id === 'courses' && activeView === 'lesson');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#002EAF] text-white shadow-md border border-[#FFEB01]/50'
                    : 'text-blue-100 hover:bg-[#002EAF]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFEB01]' : 'text-blue-300'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Language Switcher & Offline Status */}
      <div className="p-4 border-t border-slate-700 space-y-3 bg-slate-900">
        
        {/* Language Pills */}
        <div className="flex items-center justify-between bg-slate-950 p-1 rounded-xl border border-slate-700 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setLang('mr')}
            className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'mr' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            मराठी
          </button>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'hi' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'en' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Offline Simulator Switch */}
        <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
          <span className="flex items-center space-x-1.5 font-semibold">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-gold-400" />
            )}
            <span>{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
          </span>

          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`text-[10px] px-2 py-0.5 rounded-md font-black transition-all border cursor-pointer ${
              isOnline
                ? 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
                : 'bg-gold-500 text-navy-950 border-gold-400 hover:bg-gold-400'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-slate-300 hover:text-rose-300 hover:bg-rose-950/40 text-xs font-bold transition-colors border border-transparent hover:border-rose-500/30 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

      </div>

    </aside>
  );
}
