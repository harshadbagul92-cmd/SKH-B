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
  ShieldCheck
} from 'lucide-react';

export default function ProfileView() {
  const {
    userProfile,
    setActiveView,
    t,
    isOnline,
    allCourses,
    userProgressMap,
    certificatesList,
    applicationsList,
    isPackDownloaded
  } = useApp();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('week'); // 'week' | 'month' | 'quarter'

  // Calculate statistics from actual user data in IndexedDB
  const completedLessonsCount = Object.values(userProgressMap || {}).reduce(
    (acc, curr) => acc + (curr.completedLessonIds?.length || 0),
    0
  );

  const certificatesCount = certificatesList?.length || 0;
  const applicationsCount = applicationsList?.length || 0;

  // Filtered metrics mock calculations based on active history filter
  const getMetricData = () => {
    switch (historyFilter) {
      case 'week':
        return {
          lessons: Math.min(completedLessonsCount, 8),
          quizzes: Math.min(certificatesCount + 2, 4),
          certs: certificatesCount,
          accuracy: '94%'
        };
      case 'month':
        return {
          lessons: Math.min(completedLessonsCount, 24),
          quizzes: Math.min(certificatesCount + 5, 12),
          certs: certificatesCount,
          accuracy: '92%'
        };
      case 'quarter':
      default:
        return {
          lessons: completedLessonsCount,
          quizzes: Math.max(certificatesCount + 8, 18),
          certs: certificatesCount,
          accuracy: '95%'
        };
    }
  };

  const metrics = getMetricData();

  // Days of week mini streak calendar
  const weekDays = [
    { day: 'Mon', active: true, isToday: false },
    { day: 'Tue', active: true, isToday: false },
    { day: 'Wed', active: true, isToday: false },
    { day: 'Thu', active: true, isToday: false },
    { day: 'Fri', active: true, isToday: false },
    { day: 'Sat', active: true, isToday: true },
    { day: 'Sun', active: false, isToday: false }
  ];

  // Helper for category display badge
  const categoryLabels = {
    general: t('profile.edit_drawer.categories.general') || 'General Student',
    vocational: t('profile.edit_drawer.categories.vocational') || 'Vocational Trainee',
    certification: t('profile.edit_drawer.categories.certification') || 'Skill Certification',
    job_seeker: t('profile.edit_drawer.categories.job_seeker') || 'Job Seeker',
    entrepreneur: t('profile.edit_drawer.categories.entrepreneur') || 'Entrepreneurship'
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('courses')}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
              <span>{t('profile.title') || 'My Profile'}</span>
            </h1>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mt-0.5">
              <span className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="w-3 h-3 text-emerald-600" />
                ) : (
                  <WifiOff className="w-3 h-3 text-rose-500" />
                )}
                <span className="font-semibold text-slate-700">
                  {t('profile.cached_offline') || 'Offline Cached'}
                </span>
              </span>
              <span>•</span>
              <span className="text-slate-500">
                {t('profile.last_synced', { time: formatLastSyncedTime() }) || `Last synced: ${formatLastSyncedTime()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Gear / Settings Edit Button */}
        <button
          onClick={() => setIsEditDrawerOpen(true)}
          className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-brand-700 border border-orange-200 transition-all flex items-center space-x-1.5 font-bold text-xs"
          title="Edit Profile Settings"
        >
          <Settings className="w-4 h-4 text-brand-600" />
          <span className="hidden sm:inline">{t('profile.edit_profile') || 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background blur circle */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-brand-600/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            {/* Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0 border-2 border-white/20">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'V'}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {userProfile?.name || 'Vikas Tambade'}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                  {categoryLabels[userProfile?.category] || 'Vocational Trainee'}
                </span>
              </div>

              {/* Target / Career Goal */}
              {userProfile?.targetGoal && (
                <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-semibold">
                  <Target className="w-3.5 h-3.5" />
                  <span>Goal: {userProfile.targetGoal}</span>
                </div>
              )}

              {/* Attributes Row */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 font-medium pt-1">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{userProfile?.grade || '12th Standard'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{userProfile?.city || 'Kopargaon'}, {userProfile?.state || 'Maharashtra'}</span>
                </span>
                {userProfile?.mobile && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userProfile.mobile}</span>
                    </span>
                  </>
                )}
                {userProfile?.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userProfile.email}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Edit Action Button */}
          <button
            onClick={() => setIsEditDrawerOpen(true)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center justify-center space-x-2 backdrop-blur-xs shrink-0"
          >
            <Edit3 className="w-4 h-4 text-orange-400" />
            <span>{t('profile.edit_profile') || 'Edit Profile'}</span>
          </button>

        </div>
      </div>

      {/* Two Side-by-Side Stat Cards (Daily Goal & Weekly Streak) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Daily Goal Tracker */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-orange-100 text-brand-700">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('profile.daily_goal') || 'Daily Learning Goal'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Target: {userProfile?.dailyGoal || 5} lessons per day
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-brand-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              60% Done
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>3 / 5 {t('profile.lessons_today') || 'lessons completed today'}</span>
              <span>3/5</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: '60%' }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Keep going! 2 more lessons to hit daily target.</span>
            <button
              onClick={() => setActiveView('courses')}
              className="text-brand-600 font-bold hover:underline"
            >
              Start Lesson →
            </button>
          </div>
        </div>

        {/* Card 2: Weekly Streak Calendar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('profile.weekly_streak') || 'Weekly Streak'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Consistency in daily learning
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center space-x-1">
              <span>{t('profile.days_streak', { count: userProfile?.streakCount || 5 }) || '5 Days Streak 🔥'}</span>
            </span>
          </div>

          {/* Mini Calendar Grid (Mon - Sun) */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekDays.map((wd, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  wd.isToday
                    ? 'bg-brand-600 text-white font-bold border-brand-700 ring-2 ring-brand-200 shadow-xs'
                    : wd.active
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{wd.day}</span>
                <div className="mt-1">
                  {wd.active ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${wd.isToday ? 'text-white' : 'text-emerald-600'}`} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>5 days active this week!</span>
            <span className="text-emerald-700 font-bold">Active 🔥</span>
          </div>
        </div>

      </div>

      {/* Quick Access Rows */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>{t('profile.quick_access') || 'Quick Access Sub-Sections'}</span>
        </div>

        {/* Row 1: My Courses */}
        <button
          onClick={() => setActiveView('courses')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-orange-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {t('profile.nav_courses') || 'My Courses & Learning Progress'}
              </span>
              <span className="text-[11px] text-slate-500">
                {allCourses.length} active courses • {completedLessonsCount} lessons finished
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
        </button>

        {/* Row 2: My Certificates */}
        <button
          onClick={() => setActiveView('certificates')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {t('profile.nav_certificates') || 'My Certificates'}
              </span>
              <span className="text-[11px] text-slate-500">
                {certificatesCount} accredited skill certificate(s) issued
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </button>

        {/* Row 3: Job Applications */}
        <button
          onClick={() => setActiveView('opportunities')}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {t('profile.nav_opportunities') || 'Job Applications'}
              </span>
              <span className="text-[11px] text-slate-500">
                {applicationsCount} local job/apprentice application(s) submitted
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Row 4: Offline Pack Status */}
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {t('profile.nav_pack') || 'Offline Content Status'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isPackDownloaded ? '100% Cached locally in IndexedDB' : 'Standard offline caching active'}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ✓ Cached
          </span>
        </div>
      </div>

      {/* History & Activity Metrics Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {t('profile.history') || 'Activity History & Stats'}
            </h3>
          </div>

          {/* Pill-Style Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setHistoryFilter('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                historyFilter === 'week'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('profile.filter_week') || 'This Week'}
            </button>

            <button
              onClick={() => setHistoryFilter('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                historyFilter === 'month'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('profile.filter_month') || 'This Month'}
            </button>

            <button
              onClick={() => setHistoryFilter('quarter')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                historyFilter === 'quarter'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('profile.filter_quarter') || 'Last 3 Months'}
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">
              {t('profile.lessons_completed') || 'Lessons Completed'}
            </span>
            <span className="text-xl font-black text-slate-900 block">
              {metrics.lessons}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block">
              ↑ 100% Offline
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">
              {t('profile.quizzes_passed') || 'Quizzes Passed'}
            </span>
            <span className="text-xl font-black text-slate-900 block">
              {metrics.quizzes}
            </span>
            <span className="text-[10px] text-purple-600 font-bold block">
              Passed ✓
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">
              {t('profile.certificates_earned') || 'Certificates Earned'}
            </span>
            <span className="text-xl font-black text-slate-900 block">
              {metrics.certs}
            </span>
            <span className="text-[10px] text-amber-600 font-bold block">
              Accredited
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">
              {t('profile.accuracy_rate') || 'Avg Accuracy Rate'}
            </span>
            <span className="text-xl font-black text-slate-900 block">
              {metrics.accuracy}
            </span>
            <span className="text-[10px] text-blue-600 font-bold block">
              High Performance
            </span>
          </div>

        </div>

      </div>

      {/* Edit Profile Drawer Component */}
      <EditProfileDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
      />

    </div>
  );
}
