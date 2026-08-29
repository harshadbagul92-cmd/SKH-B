import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditProfileDrawer from '../components/EditProfileDrawer';
import {
  ArrowLeft,
  Settings,
  Edit3,
  User,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Briefcase,
  ChevronRight,
  HardDrive,
  Flame,
  CheckCircle2,
  Calendar,
  Zap,
  Target,
  BarChart3,
  WifiOff,
  Wifi,
  ShieldCheck,
  Landmark
} from 'lucide-react';

export default function ProfileView() {
  const {
    userProfile,
    setActiveView,
    t,
    isOnline,
    allCourses,
    allTextbooks,
    allGovExams,
    userProgressMap,
    certificatesList,
    applicationsList,
    isPackDownloaded
  } = useApp();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('week'); // 'week' | 'month' | 'quarter'

  const completedLessonsCount = Object.values(userProgressMap || {}).reduce(
    (acc, curr) => acc + (curr.completedLessonIds?.length || 0),
    0
  );

  const certificatesCount = certificatesList?.length || 0;
  const applicationsCount = applicationsList?.length || 0;

  const getMetricData = () => {
    switch (historyFilter) {
      case 'week':
        return {
          lessons: Math.min(completedLessonsCount, 8),
          quizzes: Math.min(certificatesCount, 3),
          certs: certificatesCount,
          accuracy: '94%'
        };
      case 'month':
        return {
          lessons: completedLessonsCount + 4,
          quizzes: certificatesCount + 2,
          certs: certificatesCount,
          accuracy: '91%'
        };
      case 'quarter':
      default:
        return {
          lessons: completedLessonsCount + 12,
          quizzes: certificatesCount + 5,
          certs: certificatesCount,
          accuracy: '89%'
        };
    }
  };

  const metrics = getMetricData();

  const weekDays = [
    { day: 'Mon', active: true, isToday: false },
    { day: 'Tue', active: true, isToday: false },
    { day: 'Wed', active: true, isToday: false },
    { day: 'Thu', active: true, isToday: false },
    { day: 'Fri', active: true, isToday: false },
    { day: 'Sat', active: true, isToday: true },
    { day: 'Sun', active: false, isToday: false }
  ];

  const categoryLabels = {
    general: 'General Curriculum Student',
    vocational: 'Vocational Trainee',
    certification: 'Skill Certification',
    job_seeker: 'Competitive Exam Aspirant',
    entrepreneur: 'Entrepreneurship'
  };

  const formatLastSyncedTime = () => {
    if (!userProfile?.lastSyncedAt) return 'Cached Locally';
    try {
      const d = new Date(userProfile.lastSyncedAt);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Cached Locally';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('courses')}
            className="p-2 rounded-xl text-slate-700 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center space-x-2 tracking-tight">
              <span>{t('profile.title') || 'My Profile'}</span>
            </h1>
            <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold mt-0.5">
              <span className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span className="font-bold text-slate-800">
                  {t('profile.cached_offline') || 'Offline Cached'}
                </span>
              </span>
              <span>•</span>
              <span className="text-slate-600">
                {formatLastSyncedTime()}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditDrawerOpen(true)}
          className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-900 border border-blue-200 transition-all flex items-center space-x-1.5 font-black text-xs cursor-pointer shadow-xs"
          title="Edit Profile Settings"
        >
          <Settings className="w-4 h-4 text-brand-700" />
          <span className="hidden sm:inline">{t('profile.edit_btn') || 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Summary Card (Midnight Dark Navy with High-Contrast Text & Yellow Badges) */}
      <div className="bg-[#000083] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-900">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-brand-600/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            {/* Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-[#000083] flex items-center justify-center text-2xl font-black shadow-lg shrink-0 border-2 border-[#FFEB01]">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {userProfile?.name || 'Student'}
                </h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gold-500 text-navy-950 font-mono shadow-xs">
                  {categoryLabels[userProfile?.category] || '10th Standard Student'}
                </span>
              </div>

              {/* Target / Career Goal */}
              {userProfile?.targetGoal && (
                <div className="flex items-center space-x-1.5 text-xs text-gold-400 font-bold">
                  <Target className="w-3.5 h-3.5" />
                  <span>Exam Target: {userProfile.targetGoal.toUpperCase()}</span>
                </div>
              )}

              {/* Attributes Row */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-200 font-semibold pt-1">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-4 h-4 text-gold-400" />
                  <span>{userProfile?.grade || '10th'} Standard</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>{userProfile?.city || 'Kopargaon'}</span>
                </span>
                {userProfile?.mobile && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-4 h-4 text-gold-400" />
                      <span>{userProfile.mobile}</span>
                    </span>
                  </>
                )}
                {userProfile?.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-4 h-4 text-gold-400" />
                      <span>{userProfile.email}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditDrawerOpen(true)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 text-xs font-black transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-gold-400" />
            <span>{t('profile.edit_btn') || 'Edit Profile'}</span>
          </button>

        </div>
      </div>

      {/* Two Side-by-Side Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Daily Goal Tracker */}
        <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2.5 rounded-xl bg-blue-50 text-brand-800 border border-blue-200">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">
                  Daily Study Goal
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold">
                  Target: 5 chapters / day
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-navy-950 bg-gold-500 px-2.5 py-1 rounded-full shadow-xs">
              60% Done
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-800">
              <span>3 / 5 chapters studied today</span>
              <span>3/5</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-gold-500 rounded-full transition-all duration-500"
                style={{ width: '60%' }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-600 font-semibold flex items-center justify-between border-t border-slate-200 pt-2">
            <span>2 more chapters to hit daily target.</span>
            <button
              onClick={() => setActiveView('courses')}
              className="text-brand-800 font-black hover:underline cursor-pointer"
            >
              Open E-Books →
            </button>
          </div>
        </div>

        {/* Card 2: Weekly Streak Calendar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2.5 rounded-xl bg-blue-50 text-brand-800 border border-blue-200">
                <Flame className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">
                  Study Consistency Streak
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold">
                  Regular daily learning habit
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-navy-950 bg-gold-500 px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-xs">
              <span>5 Days Streak 🔥</span>
            </span>
          </div>

          {/* Mini Calendar Grid with High Contrast */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekDays.map((wd, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  wd.isToday
                    ? 'bg-[#0A192F] text-white font-black border-slate-800 shadow-sm'
                    : wd.active
                    ? 'bg-blue-50 text-brand-900 border-blue-300 font-bold'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-black">{wd.day}</span>
                <div className="mt-1">
                  {wd.active ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${wd.isToday ? 'text-gold-400' : 'text-brand-700'}`} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-600 font-semibold flex items-center justify-between border-t border-slate-200 pt-2">
            <span>5 days active this week!</span>
            <span className="text-brand-800 font-black">Active 🔥</span>
          </div>
        </div>

      </div>

      {/* Quick Access Rows */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden divide-y divide-slate-200">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-black text-xs text-slate-800 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-700" />
          <span>Quick Access Navigation</span>
        </div>

        {/* Row 1: E-Textbooks */}
        <button
          onClick={() => setActiveView('courses')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-brand-800 group-hover:bg-[#0A192F] group-hover:text-gold-400 transition-colors border border-blue-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#0F172A] block">
                {t('nav.courses')}
              </span>
              <span className="text-[11px] text-slate-600 font-medium">
                {allTextbooks.length} Digital E-Textbooks • {allCourses.length} Skill modules
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 transition-colors" />
        </button>

        {/* Row 2: Exam Notifications */}
        <button
          onClick={() => setActiveView('exams')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-brand-800 group-hover:bg-[#0A192F] group-hover:text-gold-400 transition-colors border border-blue-200">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#0F172A] block">
                {t('nav.exams')}
              </span>
              <span className="text-[11px] text-slate-600 font-medium">
                {allGovExams.length} Central & State recruitment notices
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 transition-colors" />
        </button>

        {/* Row 3: My Certificates */}
        <button
          onClick={() => setActiveView('certificates')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-brand-800 group-hover:bg-[#0A192F] group-hover:text-gold-400 transition-colors border border-blue-200">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#0F172A] block">
                {t('nav.certificates')}
              </span>
              <span className="text-[11px] text-slate-600 font-medium">
                {certificatesCount} accredited skill certificate(s) issued
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 transition-colors" />
        </button>

        {/* Row 4: Job Applications */}
        <button
          onClick={() => setActiveView('opportunities')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-brand-800 group-hover:bg-[#0A192F] group-hover:text-gold-400 transition-colors border border-blue-200">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#0F172A] block">
                {t('nav.opportunities')}
              </span>
              <span className="text-[11px] text-slate-600 font-medium">
                {applicationsCount} local job application(s) submitted
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 transition-colors" />
        </button>
      </div>

      {/* Activity Statistics */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-700" />
            <h3 className="text-sm font-black text-[#0F172A]">
              Academic Learning Statistics
            </h3>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
            <button
              onClick={() => setHistoryFilter('week')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                historyFilter === 'week'
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              This Week
            </button>

            <button
              onClick={() => setHistoryFilter('month')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                historyFilter === 'month'
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              This Month
            </button>

            <button
              onClick={() => setHistoryFilter('quarter')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                historyFilter === 'quarter'
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              Last 3 Months
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-600 block">
              Chapters Completed
            </span>
            <span className="text-xl font-black text-[#0F172A] block">
              {metrics.lessons}
            </span>
            <span className="text-[10px] text-brand-800 font-bold block">
              ↑ 100% Offline
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-600 block">
              Quizzes Passed
            </span>
            <span className="text-xl font-black text-[#0F172A] block">
              {metrics.quizzes}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block">
              Passed ✓
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-600 block">
              Certificates Earned
            </span>
            <span className="text-xl font-black text-[#0F172A] block">
              {metrics.certs}
            </span>
            <span className="text-[10px] text-brand-800 font-bold block">
              Accredited
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-600 block">
              Avg Accuracy Rate
            </span>
            <span className="text-xl font-black text-[#0F172A] block">
              {metrics.accuracy}
            </span>
            <span className="text-[10px] text-blue-800 font-bold block">
              High Performance
            </span>
          </div>

        </div>

      </div>

      <EditProfileDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
      />

    </div>
  );
}
