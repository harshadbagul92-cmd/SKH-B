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

      // Generate Unique Verification Code: GS-KPG-2026-XXXX
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = `GS-KPG-2026-${randomSuffix}`;
      setGeneratedCertCode(code);

      const grade = correctCount === 5 ? 'A+ (उत्कृष्ट)' : correctCount === 4 ? 'A (प्रथम श्रेणी)' : 'B (उत्तीर्ण)';

      const certRecord = {
        id: `cert-${course.id}-${Date.now()}`,
        verificationCode: code,
        courseId: course.id,
        courseTitle: course.title,
        studentName: userProfile.name,
        village: userProfile.village,
        score: `${correctCount}/${questions.length} (${(correctCount/questions.length)*100}%)`,
        grade,
        issueDate: new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        synced: false
      };

      await db.certificates.put(certRecord);

      // Queue for backend sync
      await syncService.enqueue('CERTIFICATE_ISSUED', certRecord);
      await syncService.enqueue('QUIZ_RESULT', {
        courseId: course.id,
        score: correctCount,
        studentName: userProfile.name,
        passed: true,
        verificationCode: code,
        timestamp: new Date().toISOString()
      });

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

  const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveView('courses')}
          className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('course.back_to_courses')}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 bg-orange-100 px-3 py-1 rounded-full">
            {course.title[lang] || course.title.mr}
          </span>
        </div>
      </div>

      {/* Quiz Introduction / Result Banner */}
      {!submitted ? (
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-2">
          <div className="flex items-center space-x-2 text-orange-200 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{t('quiz.title')}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black">
            {course.title[lang] || course.title.mr} - {lang === 'mr' ? 'अंतिम चाचणी' : 'Final Assessment'}
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 font-medium">
            {t('quiz.instruction')}
          </p>
        </div>
      ) : (
        <div
          className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 ${
            passed
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'
              : 'bg-gradient-to-r from-rose-600 to-amber-600'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                <Sparkles className="w-4 h-4" />
                <span>{passed ? (lang === 'mr' ? 'उत्तीर्ण!' : 'PASSED!') : (lang === 'mr' ? 'पुनः प्रयत्न' : 'TRY AGAIN')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                {passed ? t('quiz.passed') : t('quiz.failed')}
              </h2>
              <p className="text-sm font-semibold opacity-90">
                {t('quiz.score')}: <span className="text-xl font-black underline">{score} / {questions.length}</span> ({Math.round((score / questions.length) * 100)}%)
              </p>
              {passed && generatedCertCode && (
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{t('certificate.verification_id')}: {generatedCertCode}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {passed ? (
                <button
                  onClick={() => setActiveView('certificates')}
                  className="flex items-center space-x-2 bg-white text-emerald-800 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:bg-emerald-50 transition-transform active:scale-95"
                >
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>{t('quiz.claim_cert')}</span>
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 bg-white text-rose-800 font-black text-sm px-5 py-3 rounded-2xl shadow hover:bg-rose-50 transition-transform active:scale-95"
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
                    {q.question[lang] || q.question.mr}
                  </h3>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {lang === 'mr' ? 'बरोबर' : 'Correct'}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        {lang === 'mr' ? 'चूक' : 'Incorrect'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(q.options[lang] || q.options.mr).map((opt, oIdx) => {
                  const isChosen = selectedOption === oIdx;
                  const isRightAnswer = q.correctIndex === oIdx;

                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-orange-50/60';
                  if (submitted) {
                    if (isRightAnswer) {
                      btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-400';
                    } else if (isChosen && !isRightAnswer) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isChosen) {
                    btnStyle = 'bg-orange-100 border-brand-500 text-brand-950 font-bold ring-2 ring-orange-300';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      disabled={submitted}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {submitted && isRightAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              {submitted && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-700 bg-white/80 p-3 rounded-2xl">
                  <span className="font-bold text-slate-900 flex items-center space-x-1 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                    <span>{t('quiz.explanation')}:</span>
                  </span>
                  <p className="leading-relaxed">
                    {q.explanation[lang] || q.explanation.mr}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!submitted && (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm sticky bottom-4 z-10">
          <div className="text-xs text-slate-600 font-semibold">
            {Object.keys(selectedAnswers).length} / {questions.length} {lang === 'mr' ? 'उत्तरे निवडली' : 'answered'}
          </div>

          <button
            onClick={handleSubmitQuiz}
            disabled={!allAnswered}
            className={`flex items-center space-x-2 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all ${
              allAnswered
                ? 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
