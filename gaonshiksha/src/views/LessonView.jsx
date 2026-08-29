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

  // Convert raw markdown string to formatted blocks
  const renderContent = (contentStr) => {
    if (!contentStr) return null;
    const lines = contentStr.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-black text-slate-900 mt-6 mb-3 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
            <span>{line.replace('### ', '')}</span>
          </h3>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-700 ml-4 mb-2 list-disc leading-relaxed">
            <span dangerouslySetInnerHTML={{
              __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-orange-100 text-brand-800 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
            }} />
          </li>
        );
      } else if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      } else {
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
            <span dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-orange-100 text-brand-800 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
            }} />
          </p>
        );
      }
    });
  };

  const lessonTitle = tObj(lesson.title);
  const lessonContent = tObj(lesson.content);
  const takeaways = lesson.keyTakeaways ? (lesson.keyTakeaways[lang] || lesson.keyTakeaways.hi || lesson.keyTakeaways.mr || lesson.keyTakeaways.en || []) : [];
  const practicalTip = lesson.practicalTip ? tObj(lesson.practicalTip) : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('courses')}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('course.back_to_courses')}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span>{tObj(course.title)}</span>
          <span>•</span>
          <span className="text-brand-600 bg-orange-100 px-2 py-0.5 rounded-full">
            {t('lesson.lesson_number', { number: selectedLessonIndex + 1 })} / {course.lessons.length}
          </span>
        </div>
      </div>

      {/* Main Lesson Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Lesson Title Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>{t('lesson.lesson_number', { number: selectedLessonIndex + 1 })}</span>
            {isLessonDone && (
              <span className="text-emerald-400 ml-2 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {t('lesson.completed_tag')}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
            {lessonTitle}
          </h1>
        </div>

        {/* Lesson Body */}
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
          <div className="text-slate-800 bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-100">
            {renderContent(lessonContent)}
          </div>

          {/* Key Takeaways Section */}
          {takeaways && takeaways.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-amber-800 font-black text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('lesson.key_takeaways')}</span>
              </div>
              <ul className="space-y-1.5">
                {takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Field Tip */}
          {practicalTip && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-900 mb-1">
                  {t('lesson.practical_tip')}
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
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('lesson.prev_lesson')}</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isLessonDone && (
              <button
                onClick={handleMarkComplete}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('lesson.mark_completed')}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-black shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <span>{isLastLesson ? t('lesson.take_quiz') : t('lesson.next_lesson')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
