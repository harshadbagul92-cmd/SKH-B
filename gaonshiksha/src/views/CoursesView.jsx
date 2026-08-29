import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  ArrowRight,
  Monitor,
  Scissors,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';

export default function CoursesView() {
  const {
    lang,
    t,
    allCourses,
    userProgressMap,
    certificatesList,
    setActiveView,
    setSelectedCourseId,
    setSelectedLessonIndex,
    isPackDownloaded,
    downloadFullPack
  } = useApp();

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedLessonIndex(0);
    setActiveView('lesson');
  };

  const getCourseIcon = (iconName) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-white" />;
      case 'Scissors':
        return <Scissors className="w-6 h-6 sm:w-8 sm:h-8 text-white" />;
      default:
        return <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />;
    }
  };

  const totalLessons = allCourses.reduce((sum, c) => sum + (c.lessons ? c.lessons.length : 0), 0);
  let totalCompletedLessons = 0;
  Object.values(userProgressMap).forEach(p => {
    if (p.completedLessonIds) totalCompletedLessons += p.completedLessonIds.length;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-orange-600 to-amber-600 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide text-orange-100 border border-white/20">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'mr' ? 'कोपरगाव व अहमदनगर ग्रामीण भाग' : 'Kopargaon & Ahmednagar Rural Division'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('home.hero_title')}
          </h1>

          <p className="text-sm sm:text-base text-orange-100 font-medium leading-relaxed">
            {t('home.hero_desc')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isPackDownloaded ? (
              <button
                onClick={downloadFullPack}
                className="flex items-center space-x-2 bg-white hover:bg-orange-50 text-brand-700 font-black text-sm px-5 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <Download className="w-4 h-4 text-brand-600" />
                <span>{t('home.download_pack')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{t('home.pack_downloaded')}</span>
              </div>
            )}

            <button
              onClick={() => setActiveView('opportunities')}
              className="flex items-center space-x-2 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold text-sm px-5 py-3 rounded-xl border border-white/30 transition-colors"
            >
              <span>{lang === 'mr' ? 'स्थानिक रोजगार संधी पहा' : 'View Local Job Board'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-brand-600 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{allCourses.length}</div>
            <div className="text-xs text-slate-500 font-semibold">{t('home.stats_courses')}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalCompletedLessons} / {totalLessons}</div>
            <div className="text-xs text-slate-500 font-semibold">{t('home.stats_completed')}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{certificatesList.length}</div>
            <div className="text-xs text-slate-500 font-semibold">{t('home.stats_certificates')}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">१००%</div>
            <div className="text-xs text-slate-500 font-semibold">
              {lang === 'mr' ? 'ऑफलाइन कार्यक्षमता' : 'Offline Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Courses List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('course.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {lang === 'mr'
                ? 'गावात रोजगारासाठी लागणारी व्यावहारिक कौशल्ये शिका आणि प्रमाणपत्र मिळवा'
                : 'Master practical vocational skills tailored for rural employment'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allCourses.map((course) => {
            const progress = userProgressMap[course.id] || { completedLessonIds: [] };
            const completedCount = progress.completedLessonIds ? progress.completedLessonIds.length : 0;
            const totalCourseLessons = course.lessons ? course.lessons.length : 0;
            const percent = totalCourseLessons > 0 ? Math.round((completedCount / totalCourseLessons) * 100) : 0;
            const isFinished = percent === 100;
            const hasCert = certificatesList.some(c => c.courseId === course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Gradient */}
                  <div className={`p-6 bg-gradient-to-r ${course.color || 'from-orange-600 to-amber-600'} text-white relative`}>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                        {getCourseIcon(course.icon)}
                      </div>
                      <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {course.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black mt-4 leading-snug">
                      {course.title[lang] || course.title.mr}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {course.description[lang] || course.description.mr}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{t('course.progress')}</span>
                        <span>{percent}% ({completedCount}/{totalCourseLessons} {lang === 'mr' ? 'धडे' : 'lessons'})</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Lesson checklist preview */}
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 space-y-2">
                      {course.lessons.map((lesson, idx) => {
                        const isDone = progress.completedLessonIds?.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between text-xs text-slate-700 py-0.5"
                          >
                            <span className="flex items-center space-x-2">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500">
                                  {idx + 1}
                                </div>
                              )}
                              <span className={isDone ? 'line-through text-slate-400' : 'font-medium'}>
                                {lesson.title[lang] || lesson.title.mr}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleSelectCourse(course.id)}
                    className="w-full sm:flex-1 flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <span>
                      {completedCount === 0
                        ? t('course.start_course')
                        : isFinished
                        ? (lang === 'mr' ? 'पुन्हा उजळणी करा' : 'Review Course')
                        : t('course.continue_course')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {isFinished && (
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setActiveView('quiz');
                      }}
                      className={`w-full sm:w-auto flex items-center justify-center space-x-1.5 text-sm font-bold py-3 px-4 rounded-xl border transition-colors ${
                        hasCert
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>{hasCert ? t('course.certificate_unlocked') : t('course.quiz_ready')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why GaonShiksha Grid */}
      <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-6 text-center">
          {lang === 'mr' ? 'साथी (SATHI) ॲपची वैशिष्ट्ये (Rural-First Architecture)' : 'Designed for Rural India - SATHI Features'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-200 text-brand-700 flex items-center justify-center font-black">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{t('home.features_offline_title')}</h4>
            <p className="text-xs text-slate-600">{t('home.features_offline_desc')}</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-700 flex items-center justify-center font-black">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{t('home.features_lang_title')}</h4>
            <p className="text-xs text-slate-600">{t('home.features_lang_desc')}</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-700 flex items-center justify-center font-black">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{t('home.features_cert_title')}</h4>
            <p className="text-xs text-slate-600">{t('home.features_cert_desc')}</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-200 text-blue-700 flex items-center justify-center font-black">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{t('home.features_jobs_title')}</h4>
            <p className="text-xs text-slate-600">{t('home.features_jobs_desc')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
