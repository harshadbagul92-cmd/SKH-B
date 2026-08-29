import React from 'react';
import { useApp } from '../context/AppContext';
import AudioNarration from '../components/AudioNarration';
import DiagramViewer from '../components/DiagramViewer';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Award,
  Lightbulb,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function LessonView() {
  const {
    lang,
    t,
    tObj,
    allCourses,
    selectedCourseId,
    selectedLessonIndex,
    setSelectedLessonIndex,
    setActiveView,
    userProgressMap,
    markLessonComplete
  } = useApp();

  const course = allCourses.find(c => c.id === selectedCourseId) || allCourses[0];
  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Course not found.</p>
        <button onClick={() => setActiveView('courses')} className="mt-4 text-brand-600 font-bold">
          {t('course.back_to_courses')}
        </button>
      </div>
    );
  }

  const lesson = course.lessons[selectedLessonIndex] || course.lessons[0];
  const progress = userProgressMap[course.id] || { completedLessonIds: [] };
  const isLessonDone = progress.completedLessonIds?.includes(lesson.id);
  const isLastLesson = selectedLessonIndex === course.lessons.length - 1;

  const handleMarkComplete = async () => {
    await markLessonComplete(course.id, lesson.id);
  };

  const handleNext = async () => {
    await markLessonComplete(course.id, lesson.id);
    if (!isLastLesson) {
      setSelectedLessonIndex(selectedLessonIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveView('quiz');
    }
  };

  const handlePrev = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonIndex(selectedLessonIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = (contentStr) => {
    if (!contentStr) return null;
    const lines = contentStr.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-black text-[#0A192F] mt-4 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-xs sm:text-sm font-bold text-brand-700 mt-3 mb-1 uppercase tracking-wider">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-700 ml-4 list-disc leading-relaxed my-1">
            {trimmed.replace('- ', '')}
          </li>
        );
      }
      if (trimmed.match(/^\d+\.\s/)) {
        return (
          <div key={idx} className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed my-1 ml-1">
            {trimmed}
          </div>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1.5 font-normal">
          {trimmed}
        </p>
      );
    });
  };

  const lessonContent = tObj(lesson.content);
  const takeaways = lesson.keyTakeaways ? (lesson.keyTakeaways[lang] || lesson.keyTakeaways.en || []) : [];
  const practicalTip = lesson.practicalTip ? (lesson.practicalTip[lang] || lesson.practicalTip.en) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 space-y-6">
      
      {/* Top Breadcrumb & Progress Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('courses')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('course.back_to_courses')}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span>{tObj(course.title)}</span>
          <span>•</span>
          <span className="text-brand-700">
            {selectedLessonIndex + 1} / {course.lessons.length}
          </span>
        </div>
      </div>

      {/* Main Lesson Container Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header Banner (Deep Navy) */}
        <div className="bg-[#0A192F] text-white p-6 sm:p-8">
          <div className="inline-flex items-center space-x-2 bg-slate-800 text-gold-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-slate-700">
            <BookOpen className="w-4 h-4" />
            <span>{tObj(course.title)}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black leading-tight">
            {tObj(lesson.title)}
          </h1>

          {isLessonDone && (
            <div className="mt-3 inline-flex items-center space-x-1.5 bg-gold-500 text-navy-950 px-3 py-1 rounded-full text-xs font-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lesson Completed</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Audio Player Component */}
          {lesson.audioScript && (
            <AudioNarration script={lesson.audioScript} />
          )}

          {/* Interactive SVG Diagram Viewer */}
          {lesson.diagram && (
            <DiagramViewer diagramKey={lesson.diagram} />
          )}

          {/* Formatted Markdown Content */}
          <div className="text-slate-800 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80">
            {renderContent(lessonContent)}
          </div>

          {/* Key Takeaways Section */}
          {takeaways && takeaways.length > 0 && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-brand-900 font-black text-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Key Takeaways</span>
              </div>
              <ul className="space-y-1.5">
                {takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800">
                    <CheckCircle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Field Tip */}
          {practicalTip && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Practical Tip
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {practicalTip}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            onClick={handlePrev}
            disabled={selectedLessonIndex === 0}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
              selectedLessonIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isLessonDone && (
              <button
                onClick={handleMarkComplete}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Mark Completed</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#0A192F] hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-black shadow-md transition-transform active:scale-95 cursor-pointer border border-slate-700"
            >
              <span>{isLastLesson ? 'Take Exam / Quiz' : 'Next Lesson'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
