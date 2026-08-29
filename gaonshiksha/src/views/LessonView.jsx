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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveView('courses')}
          className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('course.back_to_courses')}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">
            {course.title[lang] || course.title.mr}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-brand-700 bg-orange-100 px-2.5 py-1 rounded-full">
            {t('lesson.lesson_number', { number: selectedLessonIndex + 1 })} / {course.lessons.length}
          </span>
        </div>
      </div>

      {/* Lesson Stepper Header */}
      <div className="grid grid-cols-3 gap-2">
        {course.lessons.map((l, index) => {
          const isDone = progress.completedLessonIds?.includes(l.id);
          const isCurrent = index === selectedLessonIndex;
          return (
            <button
              key={l.id}
              onClick={() => setSelectedLessonIndex(index)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-brand-600 text-white border-brand-700 shadow-md ring-2 ring-orange-300'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-orange-200' : 'text-slate-500'}`}>
                  {t('lesson.lesson_number', { number: index + 1 })}
                </span>
                {isDone && <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />}
              </div>
              <div className="text-xs font-black truncate mt-1">
                {l.title[lang] || l.title.mr}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Title and Audio Narration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {lesson.title[lang] || lesson.title.mr}
            </h1>
            {isLessonDone && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                {t('lesson.completed_tag')}
              </span>
            )}
          </div>

          {/* Bilingual Audio Narration */}
          {lesson.audioScript && (
            <AudioNarration script={lesson.audioScript} />
          )}
        </div>

        {/* Embedded Vector Diagram */}
        {lesson.diagram && (
          <DiagramViewer diagramKey={lesson.diagram} />
        )}

        {/* Text Content */}
        <div className="prose prose-slate max-w-none text-slate-800">
          {renderContent(lesson.content[lang] || lesson.content.mr)}
        </div>

        {/* Key Takeaways & Practical Rural Tip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          
          {/* Key Takeaways */}
          {lesson.keyTakeaways && (
            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t('lesson.key_takeaways')}</span>
              </div>
              <ul className="space-y-1.5">
                {(lesson.keyTakeaways[lang] || lesson.keyTakeaways.mr).map((point, pIdx) => (
                  <li key={pIdx} className="text-xs text-emerald-950 flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Rural Tip */}
          {lesson.practicalTip && (
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{t('lesson.practical_tip')}</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {lesson.practicalTip[lang] || lesson.practicalTip.mr}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={handlePrev}
          disabled={selectedLessonIndex === 0}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
            selectedLessonIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('lesson.prev_lesson')}</span>
        </button>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {!isLessonDone && (
            <button
              onClick={handleMarkComplete}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t('lesson.mark_completed')}</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-transform active:scale-95"
          >
            <span>{isLastLesson ? t('lesson.take_quiz') : t('lesson.next_lesson')}</span>
            {isLastLesson ? <Award className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
}
