import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TextbookReaderModal from '../components/TextbookReaderModal';
import PdfViewerModal from '../components/PdfViewerModal';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Bookmark,
  Layers,
  GraduationCap,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
  Monitor,
  Scissors
} from 'lucide-react';

export default function CoursesView() {
  const [pdfViewingTextbook, setPdfViewingTextbook] = useState(null);
  const {
    lang,
    t,
    tObj,
    allCourses,
    allTextbooks,
    userProgressMap,
    certificatesList,
    setActiveView,
    setSelectedCourseId,
    setSelectedLessonIndex,
    currentUser,
    userProfile,
    selectedTextbook,
    openTextbook,
    closeTextbook,
    activeSubjectFilter,
    setActiveSubjectFilter
  } = useApp();

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedLessonIndex(0);
    setActiveView('lesson');
  };

  const getCourseIcon = (iconName) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-white" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-white" />;
      default:
        return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  const subjectsList = [
    { id: 'all', label: t('subjects.all') || 'All Languages' },
    { id: 'marathi', label: t('subjects.marathi') || 'मराठी (Marathi)' },
    { id: 'hindi', label: t('subjects.hindi') || 'हिंदी (Hindi)' },
    { id: 'english', label: t('subjects.english') || 'English' }
  ];

  // Strictly 3 core language subjects
  const filteredTextbooks = allTextbooks.filter(tb => {
    if (activeSubjectFilter === 'all') return true;
    return tb.subject === activeSubjectFilter;
  });

  const studentGrade = userProfile?.grade || '10th';

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Digital Textbook Modal Viewer */}
      {selectedTextbook && (
        <TextbookReaderModal
          textbook={selectedTextbook}
          onClose={closeTextbook}
        />
      )}

      {/* Clean High-Contrast Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono">
              Class {studentGrade.toUpperCase()} • SSC Board Curriculum
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
            {lang === 'mr'
              ? 'इयत्ता १० वी भाषा पाठ्यपुस्तके व अभ्यासक्रम'
              : lang === 'hi'
              ? 'कक्षा १०वीं भाषा पाठ्यपुस्तकें एवं अध्ययन सामग्री'
              : 'Class 10th Core Language E-Textbooks & Curriculum'}
          </h1>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            {lang === 'mr'
              ? 'ऑफलाइन डिजिटल वाचन, संतसाहित्य, व्याकरण, शब्दसंग्रह व स्वाध्याय'
              : lang === 'hi'
              ? 'ऑफलाइन डिजिटल अध्ययन, व्याकरण, पद्य-गद्य एवं प्रश्नोत्तर'
              : 'Digital text reader with poems, summaries, grammar notes, and offline access'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Offline Ready</span>
          </span>
        </div>
      </div>

      {/* 3 Core Language Filter Pills with Sharp Contrast */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {subjectsList.map((subj) => {
          const isActive = activeSubjectFilter === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => setActiveSubjectFilter(subj.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[#000083] text-white border-[#000083] shadow-sm ring-2 ring-blue-200'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-black'
              }`}
            >
              <span>{subj.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3 CORE LANGUAGE SUBJECT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTextbooks.map((tb) => {
          const totalCh = tb.chapters ? tb.chapters.length : tb.totalChapters || 4;

          return (
            <div
              key={tb.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-300 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-brand-500"
            >
              {/* Card Header (Midnight Navy Banner with Electric Yellow Badge) */}
              <div>
                <div className="p-6 bg-[#000083] text-white relative">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                      {tb.badge || 'Maharashtra Board'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-200 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                      {totalCh} {t('course.chapters_count') || 'Chapters'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black mt-3 leading-snug text-white">
                    {tObj(tb.title)}
                  </h3>
                </div>

                {/* Card Body with High-Contrast Text */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
                    {tObj(tb.description)}
                  </p>

                  {/* Chapter Preview Drawer Index */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Curriculum Units / Chapters
                    </div>
                    {tb.chapters && tb.chapters.slice(0, 3).map((ch, idx) => (
                      <div
                        key={ch.id || idx}
                        className="flex items-center justify-between text-xs text-slate-800 py-0.5"
                      >
                        <span className="flex items-center space-x-2 line-clamp-1">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-brand-800 font-black text-[10px] flex items-center justify-center shrink-0 border border-blue-200">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900">
                            {tObj(ch.title)}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: "Open E-Textbook" and "View PDF" Action Buttons */}
              <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openTextbook(tb)}
                  className="py-3 px-3 bg-[#000083] hover:bg-[#002EAF] active:scale-[0.99] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 border border-[#FFEB01]/30 cursor-pointer group"
                >
                  <BookOpen className="w-4 h-4 text-[#FFEB01]" />
                  <span>{t('course.open_ebook') || 'Open E-Textbook'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPdfViewingTextbook(tb)}
                  className="py-3 px-3 bg-[#002EAF] hover:bg-[#00248A] active:scale-[0.99] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 border border-white/20 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#FFEB01]" />
                  <span>{lang === 'mr' ? 'PDF पहा (View PDF)' : lang === 'hi' ? 'PDF देखें' : 'View PDF'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Secondary Section: Practical Vocational Skill Modules */}
      {allCourses.length > 0 && (
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                {lang === 'mr' ? 'व्यावसायिक कौशल्य अभ्यासक्रम' : lang === 'hi' ? 'व्यावसायिक कौशल्य पाठ्यक्रम' : 'Vocational Skill Certification Modules'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold">
                {lang === 'mr' ? 'कौशल्ये शिका, चाचणी द्या आणि प्रमाणपत्र मिळवा' : 'Interactive video/audio lessons and certification'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCourses.map((course) => {
              const progress = userProgressMap[course.id] || { completedLessonIds: [] };
              const completedCount = progress.completedLessonIds ? progress.completedLessonIds.length : 0;
              const totalCourseLessons = course.lessons ? course.lessons.length : 0;
              const percent = totalCourseLessons > 0 ? Math.round((completedCount / totalCourseLessons) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                      {getCourseIcon(course.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {tObj(course.title)}
                      </h4>
                      <p className="text-[11px] text-slate-600 font-semibold line-clamp-1">
                        {totalCourseLessons} lessons • {percent}% completed
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectCourse(course.id)}
                    className="text-xs font-black text-brand-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Start →</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Viewers */}
      {selectedTextbook && (
        <TextbookReaderModal textbook={selectedTextbook} onClose={closeTextbook} />
      )}

      {pdfViewingTextbook && (
        <PdfViewerModal textbook={pdfViewingTextbook} onClose={() => setPdfViewingTextbook(null)} />
      )}

    </div>
  );
}
