import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { db } from '../db';
import { syncService } from '../services/syncService';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function QuizView() {
  const {
    lang,
    t,
    tObj,
    allCourses,
    selectedCourseId,
    setActiveView,
    userProfile,
    refreshData
  } = useApp();

  const course = allCourses.find(c => c.id === selectedCourseId) || allCourses[0];
  const questions = course?.quiz?.questions || [];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [generatedCertCode, setGeneratedCertCode] = useState(null);

  if (!course || questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">No quiz questions available for this course.</p>
        <button onClick={() => setActiveView('courses')} className="mt-4 text-brand-600 font-bold">
          {t('course.back_to_courses')}
        </button>
      </div>
    );
  }

  const handleSelectOption = (questionId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const isPass = correctCount >= 3; // 3 out of 5 = 60%
    setScore(correctCount);
    setPassed(isPass);
    setSubmitted(true);

    // Save Attempt to Dexie
    await db.quizAttempts.add({
      courseId: course.id,
      score: correctCount,
      total: questions.length,
      passed: isPass,
      timestamp: new Date().toISOString()
    });

    if (isPass) {
      // Confetti Animation
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti triggered');
      }

      // Generate Verifiable Certificate
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const certCode = `IL-CERT-${new Date().getFullYear()}-${randomCode}`;
      setGeneratedCertCode(certCode);

      const existingCert = await db.certificates.where('courseId').equals(course.id).first();
      if (!existingCert) {
        const certRecord = {
          id: `cert-${Date.now()}`,
          verificationCode: certCode,
          courseId: course.id,
          courseTitle: tObj(course.title),
          studentName: userProfile.name,
          village: userProfile.city || userProfile.village || 'Maharashtra',
          score: `${correctCount}/${questions.length} (${Math.round((correctCount / questions.length) * 100)}%)`,
          grade: correctCount === 5 ? 'A+ (उत्कृष्ट / Outstanding)' : correctCount === 4 ? 'A (विशेष योग्यता / Distinction)' : 'B+ (उत्तीर्ण / Passed)',
          issueDate: new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          synced: false,
          createdAt: new Date().toISOString()
        };

        await db.certificates.put(certRecord);

        // Queue certificate for offline sync
        await syncService.enqueue('CERTIFICATE_ISSUED', certRecord);
      }

      await refreshData();
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setPassed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('lesson')}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'mr' ? 'धड्याकडे परत जा' : lang === 'hi' ? 'पाठ पर वापस जाएं' : 'Back to Lesson'}</span>
        </button>

        <div className="text-xs font-bold text-slate-500">
          <span>{tObj(course.title)}</span>
        </div>
      </div>

      {/* Quiz Header Card */}
      <div className="bg-gradient-to-r from-brand-700 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/20">
          <Award className="w-4 h-4 text-amber-300" />
          <span>{t('quiz.title')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          {tObj(course.title)}
        </h1>
        <p className="text-xs sm:text-sm text-orange-100 font-medium leading-relaxed">
          {t('quiz.instruction')}
        </p>
      </div>

      {/* Result Card (if submitted) */}
      {submitted && (
        <div
          className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all animate-fadeIn ${
            passed
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
              : 'bg-gradient-to-r from-rose-600 to-red-700'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{passed ? t('quiz.passed') : t('quiz.failed')}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black">
                {t('quiz.score')}: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
              {passed && generatedCertCode && (
                <div className="text-xs font-mono bg-black/20 px-3 py-1.5 rounded-xl border border-white/20 inline-block">
                  {t('certificate.verification_id')}: {generatedCertCode}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {passed ? (
                <button
                  onClick={() => setActiveView('certificates')}
                  className="flex items-center space-x-2 bg-white text-emerald-800 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:bg-emerald-50 transition-transform active:scale-95 cursor-pointer"
                >
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>{t('quiz.claim_cert')}</span>
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 bg-white text-rose-800 font-black text-sm px-5 py-3 rounded-2xl shadow hover:bg-rose-50 transition-transform active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('quiz.retry')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200/90 shadow-sm'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-orange-100 text-brand-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {tObj(q.question)}
                  </h3>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {lang === 'mr' ? 'बरोबर' : lang === 'hi' ? 'सही' : 'Correct'}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        {lang === 'mr' ? 'चूक' : lang === 'hi' ? 'गलत' : 'Incorrect'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5 ml-0 sm:ml-10">
                {q.options.map((opt, optIndex) => {
                  const isThisSelected = selectedOption === optIndex;
                  const isThisTheCorrectAnswer = submitted && optIndex === q.correctIndex;
                  const isThisWrongSelected = submitted && isThisSelected && !isCorrect;

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
                        isThisTheCorrectAnswer
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : isThisWrongSelected
                          ? 'bg-rose-100 border-rose-400 text-rose-900 line-through'
                          : isThisSelected
                          ? 'bg-orange-50 border-brand-500 text-brand-900 font-bold ring-2 ring-brand-500/20'
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                            isThisSelected
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-slate-300 text-slate-500 bg-white'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                        <span>{tObj(opt)}</span>
                      </div>

                      {submitted && isThisTheCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (after submission) */}
              {submitted && q.explanation && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 bg-white/80 p-3 rounded-xl ml-0 sm:ml-10">
                  <span className="font-bold text-slate-800">{t('quiz.explanation')}: </span>
                  <span>{tObj(q.explanation)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            <span>
              {Object.keys(selectedAnswers).length} / {questions.length}{' '}
              {lang === 'mr' ? 'प्रश्नांची उत्तरे दिली' : lang === 'hi' ? 'प्रश्नों के उत्तर दिए' : 'questions answered'}
            </span>
          </div>

          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-transform active:scale-95 ${
              Object.keys(selectedAnswers).length === questions.length
                ? 'bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
            }`}
          >
            <span>{t('quiz.submit')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
