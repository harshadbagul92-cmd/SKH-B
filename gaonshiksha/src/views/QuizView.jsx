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
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti triggered');
      }

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
          grade: correctCount === 5 ? 'A+ (Outstanding)' : correctCount === 4 ? 'A (Distinction)' : 'B+ (Passed)',
          issueDate: new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          synced: false,
          createdAt: new Date().toISOString()
        };

        await db.certificates.put(certRecord);
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
    <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 space-y-6">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('lesson')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lesson</span>
        </button>

        <div className="text-xs font-bold text-slate-500">
          <span>{tObj(course.title)}</span>
        </div>
      </div>

      {/* Quiz Header Card (Deep Navy) */}
      <div className="bg-[#0A192F] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 bg-slate-800 text-gold-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-slate-700">
          <Award className="w-4 h-4 text-gold-400" />
          <span>Certification Examination</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight mb-2">
          {tObj(course.title)}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          {lang === 'mr'
            ? 'सर्व ५ प्रश्नांची उत्तरे द्या. किमान ३ बरोबर उत्तरे दिल्यास शासकीय मान्यताप्राप्त प्रमाणपत्र अनलॉक होईल.'
            : lang === 'hi'
            ? 'सभी ५ प्रश्नों के उत्तर दें। न्यूनतम ३ सही उत्तर देने पर डिजिटल प्रमाणपत्र प्राप्त होगा।'
            : 'Answer all 5 questions. Score at least 3/5 (60%) to unlock your certified digital credential.'}
        </p>
      </div>

      {/* Result Card (if submitted) */}
      {submitted && (
        <div
          className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all animate-fadeIn ${
            passed
              ? 'bg-[#0A192F] border-2 border-gold-500'
              : 'bg-slate-900 border border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold">
                {passed ? <CheckCircle2 className="w-4 h-4 text-gold-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span className={passed ? 'text-gold-400 font-black' : 'text-rose-300'}>
                  {passed ? 'Congratulations! You Passed' : 'Please Try Again'}
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-black">
                Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
              {passed && generatedCertCode && (
                <div className="text-xs font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/20 inline-block text-gold-400">
                  Verification Code: {generatedCertCode}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {passed ? (
                <button
                  onClick={() => setActiveView('certificates')}
                  className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View Certificate</span>
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20'
                    : 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-xl bg-[#0A192F] text-gold-400 text-xs font-black flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {tObj(q.question)}
                  </h3>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isThisCorrect = submitted && optIdx === q.correctIndex;
                  const isThisWrongSelected = submitted && isSelected && !isCorrect;

                  let optionStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isSelected && !submitted) {
                    optionStyle = 'bg-blue-50 text-brand-900 border-brand-500 ring-2 ring-brand-400/30 font-bold';
                  } else if (submitted) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-emerald-100 text-emerald-900 border-emerald-500 font-bold';
                    } else if (isThisWrongSelected) {
                      optionStyle = 'bg-rose-100 text-rose-900 border-rose-500 font-semibold';
                    } else {
                      optionStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{tObj(opt)}</span>
                      </div>

                      {isThisCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded">
                          Correct Answer
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {submitted && q.explanation && (
                <div className="mt-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-brand-950 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5 text-brand-700">
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>Explanation:</span>
                  </div>
                  <p className="leading-relaxed">{tObj(q.explanation)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="pt-4 pb-8">
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center space-x-2 shadow-lg ${
              Object.keys(selectedAnswers).length === questions.length
                ? 'bg-[#0A192F] hover:bg-brand-700 active:scale-98 text-white cursor-pointer border border-slate-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {Object.keys(selectedAnswers).length === questions.length
                ? 'Submit Examination'
                : `Please answer all questions (${Object.keys(selectedAnswers).length}/${questions.length})`}
            </span>
            <ArrowRight className="w-5 h-5 text-gold-400" />
          </button>
        </div>
      )}

    </div>
  );
}
