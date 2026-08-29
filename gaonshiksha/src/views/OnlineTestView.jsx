import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import testData from '../data/class10Test.json';
import {
  FileQuestion,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Lock,
  Download,
  AlertOctagon,
  Eye,
  BookOpen
} from 'lucide-react';

export default function OnlineTestView() {
  const { lang, tObj, currentUser, setActiveView } = useApp();

  const userId = currentUser?.email || 'guest_student';
  const ATTEMPT_STORAGE_KEY = `invictus_test_attempt_${userId}_${testData.testId}`;
  const VIOLATION_STORAGE_KEY = `invictus_test_violations_${userId}_${testData.testId}`;

  // Test Lifecycle States: 'intro' | 'in_progress' | 'completed' | 'blocked'
  const [testState, setTestState] = useState('intro');
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(testData.durationMinutes * 60);
  
  // Anti-Cheating & Proctoring States
  const [violationsCount, setViolationsCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  const [showToast, setShowToast] = useState('');

  const timerRef = useRef(null);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3500);
  };

  // Check on mount if test was already attempted or blocked
  useEffect(() => {
    const existingAttempt = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (existingAttempt) {
      try {
        const parsed = JSON.parse(existingAttempt);
        setSavedResult(parsed);
        if (parsed.status === 'BLOCKED') {
          setTestState('blocked');
        } else {
          setTestState('completed');
        }
        return;
      } catch (e) {
        console.error('Error parsing attempt:', e);
      }
    }
  }, [ATTEMPT_STORAGE_KEY]);

  // Anti-Cheating Tab Switch & Window Blur Detection
  useEffect(() => {
    if (testState !== 'in_progress') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolationDetected('Tab switched / minimized');
      }
    };

    const handleWindowBlur = () => {
      // Blur can fire when clicking inside iframe or window loss
      handleViolationDetected('Window focus lost / application exited');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [testState, violationsCount]);

  // Handle Proctoring Violation
  const handleViolationDetected = (reason) => {
    if (testState !== 'in_progress') return;

    const nextCount = violationsCount + 1;
    setViolationsCount(nextCount);

    if (nextCount === 1) {
      // First violation: High-urgency warning
      setShowWarningModal(true);
    } else if (nextCount >= 2) {
      // Second violation: Permanently block attempt
      handleBlockTest(reason);
    }
  };

  // Permanently Block Test
  const handleBlockTest = (reason) => {
    clearInterval(timerRef.current);
    const blockedRecord = {
      testId: testData.testId,
      userId: userId,
      userName: currentUser?.name || 'Student',
      userEmail: currentUser?.email || '',
      status: 'BLOCKED',
      reason: reason || 'Multiple Tab Switching / Focus Loss Detected during Examination',
      timestamp: new Date().toISOString(),
      score: 0,
      totalMarks: testData.totalMarks,
      passed: false
    };

    localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(blockedRecord));
    setSavedResult(blockedRecord);
    setTestState('blocked');
    setShowWarningModal(false);
  };

  // Timer countdown
  useEffect(() => {
    if (testState === 'in_progress') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [testState]);

  const handleStartTest = () => {
    // Check again to strictly enforce single attempt
    const existing = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (existing) {
      triggerToast('You have already utilized your 1 allowed attempt for this test.');
      return;
    }

    setTestState('in_progress');
    setTimeLeft(testData.durationMinutes * 60);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setViolationsCount(0);
  };

  const handleSelectOption = (questionId, optionKey) => {
    if (testState !== 'in_progress') return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleClearAnswer = (questionId) => {
    setAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleAutoSubmitOnTimeout = () => {
    triggerToast('Time is up! Submitting test automatically...');
    calculateAndSaveResult();
  };

  const calculateAndSaveResult = () => {
    clearInterval(timerRef.current);
    let correctCount = 0;

    testData.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const passed = correctCount >= testData.passingMarks;
    const timeSpentSeconds = (testData.durationMinutes * 60) - timeLeft;

    const resultRecord = {
      testId: testData.testId,
      userId: userId,
      userName: currentUser?.name || 'Student',
      userEmail: currentUser?.email || '',
      status: 'COMPLETED',
      score: correctCount,
      totalMarks: testData.totalMarks,
      percentage: Math.round((correctCount / testData.totalMarks) * 100),
      passed,
      timeSpentSeconds,
      answers,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(resultRecord));
    setSavedResult(resultRecord);
    setTestState('completed');
    setShowSubmitModal(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = testData.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  const handleDownloadScorecard = () => {
    if (!savedResult) return;
    const report = `INVICTUS LEARNING ACADEMY - OFFICIAL EXAMINATION SCORECARD\n` +
      `Test: ${tObj(testData.title)}\n` +
      `Student Name: ${savedResult.userName}\n` +
      `User ID: ${savedResult.userEmail || savedResult.userId}\n` +
      `Score: ${savedResult.score} / ${savedResult.totalMarks} (${savedResult.percentage || 0}%)\n` +
      `Result Status: ${savedResult.passed ? 'PASSED (उत्तीर्ण)' : 'NEEDS IMPROVEMENT'}\n` +
      `Date & Time: ${new Date(savedResult.timestamp).toLocaleString()}\n\n` +
      `QUESTION BREAKDOWN:\n` +
      testData.questions.map((q, idx) => {
        const studentAns = (savedResult.answers && savedResult.answers[q.id]) || 'Not Attempted';
        const isCorrect = studentAns === q.correctAnswer;
        return `Q${idx + 1}. ${q.question}\nYour Answer: ${studentAns} | Correct: ${q.correctAnswer} (${isCorrect ? 'CORRECT' : 'INCORRECT'})\nExplanation: ${q.explanation}\n`;
      }).join('\n----------------------------------------\n\n') +
      `\nVerified by Invictus Anti-Cheat Online Examination System`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invictus_Class10_Test_Scorecard_${userId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(lang === 'mr' ? 'गुणपत्रिका डाउनलोड झाली!' : 'Scorecard downloaded successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-gold-500 text-navy-950 font-black text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border-2 border-navy-950">
          <CheckCircle2 className="w-4 h-4 text-navy-950" />
          <span>{showToast}</span>
        </div>
      )}

      {/* ========================================================
          STATE 1: INTRO / INSTRUCTIONS & INTEGRITY AGREEMENT
         ======================================================== */}
      {testState === 'intro' && (
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden animate-fadeIn">
          
          {/* Header Banner */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 border-b border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-mono">
                Class 10 SSC Curriculum
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded font-mono">
                Strictly 1 Attempt Allowed
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {tObj(testData.title)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {tObj(testData.description)}
            </p>
          </div>

          {/* Rules & Examination Parameters Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Questions</span>
                <span className="text-base font-black text-[#0F172A]">{testData.totalMarks} MCQs</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Duration</span>
                <span className="text-base font-black text-brand-700">{testData.durationMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Passing Marks</span>
                <span className="text-base font-black text-[#0F172A]">{testData.passingMarks} / {testData.totalMarks}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Attempt Limit</span>
                <span className="text-base font-black text-rose-600">1 Single Attempt</span>
              </div>
            </div>

            {/* Test Sections Breakdown */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                Trilingual Test Sections
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {testData.sections.map((sec, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-brand-800 block">
                      {tObj(sec.name)}
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {sec.topic}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-Cheating & Proctoring Warning Notice */}
            <div className="bg-rose-50 border-2 border-rose-300 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-900 font-black text-xs sm:text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Active Anti-Cheating & Tab-Switching Rules</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-800 font-medium pl-6 list-disc">
                <li><b>Single Attempt Only:</b> Once submitted or disqualified, this test cannot be restarted.</li>
                <li><b>No Tab Switching:</b> If you switch to another browser tab or minimize the window, you will receive <b>Warning 1</b>.</li>
                <li><b>Permanent Disqualification (2nd Switch):</b> Switching tabs a second time will immediately <b>BLOCK your test ID</b> and record a zero score with malpractice flag.</li>
                <li><b>Radio Buttons:</b> Select one option (A, B, C, D) for each question before final submission.</li>
              </ul>
            </div>

            {/* Candidate Verification */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Registered Candidate</span>
                <span className="font-black text-[#0F172A] text-sm">{currentUser?.name || 'Student'}</span>
                <span className="text-slate-500 block text-[11px]">ID: {currentUser?.email || 'student@invictus.edu'}</span>
              </div>
              <span className="bg-white border border-blue-200 text-brand-800 px-3 py-1 rounded-lg font-bold">
                10th Standard
              </span>
            </div>

            {/* Start Test Action */}
            <button
              onClick={handleStartTest}
              className="w-full py-4 px-6 bg-[#0A192F] hover:bg-brand-600 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-brand-400 cursor-pointer"
            >
              <span>{lang === 'mr' ? 'परीक्षा सुरू करा (Start Online Test) →' : 'Start Online Test →'}</span>
              <Sparkles className="w-4 h-4 text-gold-400" />
            </button>

          </div>
        </div>
      )}

      {/* ========================================================
          STATE 2: ACTIVE PROCTORED EXAMINATION SCREEN
         ======================================================== */}
      {testState === 'in_progress' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Top Bar: Proctor Status, Timer, Progress */}
          <div className="bg-[#0A192F] text-white p-4 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30">
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-gold-400 font-bold border border-brand-400">
                <FileQuestion className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gold-400 block tracking-wider">
                  Live Online Examination
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  Question {currentQuestionIndex + 1} of {testData.questions.length}
                </span>
              </div>
            </div>

            {/* Real-time Countdown Timer */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border font-mono font-black text-xs sm:text-sm ${
                timeLeft < 180
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                  : 'bg-slate-900 text-gold-400 border-slate-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Anti-cheat status pill */}
              <div className="hidden sm:flex items-center space-x-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Proctored Session</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow cursor-pointer border border-emerald-400"
              >
                Submit Test
              </button>
            </div>

          </div>

          {/* Question Grid / Number Navigator Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center space-x-1.5">
              {testData.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = answers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#0A192F] text-white border-slate-900 shadow-xs ring-2 ring-gold-400'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] font-bold text-slate-500 shrink-0">
              <span className="text-emerald-700 font-black">{answeredCount}</span>/{testData.questions.length} Attempted
            </div>
          </div>

          {/* Active Question & Radio Buttons Container */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-6">
            
            {/* Question Header & Section Tag */}
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-brand-800 px-2.5 py-0.5 rounded-md border border-blue-200 font-mono">
                  {currentQ.sectionId === 'sec-marathi' ? 'भाग १ — मराठी' : currentQ.sectionId === 'sec-hindi' ? 'भाग २ — हिंदी' : 'Part 3 — English'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Marks: 1.0
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">
                Q{currentQuestionIndex + 1}. {currentQ.question}
              </h2>
            </div>

            {/* Radio Button Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.key;

                return (
                  <label
                    key={opt.key}
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-3.5 cursor-pointer select-none ${
                      isSelected
                        ? 'border-brand-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {/* Native Radio Button with Custom Indicator */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <input
                        type="radio"
                        name={`question_${currentQ.id}`}
                        checked={isSelected}
                        onChange={() => handleSelectOption(currentQ.id, opt.key)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-400 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    {/* Option Letter Tag */}
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 font-mono ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {opt.key}
                    </span>

                    {/* Option Text */}
                    <span className={`text-xs sm:text-sm font-semibold flex-1 ${
                      isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                    }`}>
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Bottom Question Controls (Clear, Prev, Next) */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              
              <button
                type="button"
                onClick={() => handleClearAnswer(currentQ.id)}
                disabled={!answers[currentQ.id]}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 disabled:opacity-30 transition-colors cursor-pointer"
              >
                Clear Response
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 border border-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < testData.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(testData.questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-[#0A192F] hover:bg-brand-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 shadow border border-slate-700"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer flex items-center space-x-1 shadow-md border border-emerald-400"
                  >
                    <span>Finish & Submit →</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          STATE 3: COMPLETED RESULT & DETAILED SCORECARD
         ======================================================== */}
      {testState === 'completed' && savedResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Result Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden">
            
            <div className={`p-6 sm:p-8 text-white text-center space-y-3 ${
              savedResult.passed ? 'bg-[#0077FF]' : 'bg-[#0F172A]'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white text-[#0077FF] flex items-center justify-center text-3xl font-black shadow-lg border-2 border-gold-500">
                {savedResult.passed ? '🏆' : '📋'}
              </div>
              <div className="inline-block bg-gold-500 text-navy-950 font-black text-xs px-3 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Official Result Recorded
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {savedResult.passed ? 'Congratulations! Test Passed' : 'Test Completed'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto font-medium">
                Candidate: <b>{savedResult.userName}</b> ({savedResult.userEmail || userId})
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Your Score</span>
                  <span className="text-xl font-black text-brand-700">{savedResult.score} / {savedResult.totalMarks}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Percentage</span>
                  <span className="text-xl font-black text-[#0F172A]">{savedResult.percentage || Math.round((savedResult.score / savedResult.totalMarks) * 100)}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Result Status</span>
                  <span className={`text-base font-black ${savedResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {savedResult.passed ? 'PASSED (उत्तीर्ण)' : 'NEEDS PRACTICE'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Attempt Status</span>
                  <span className="text-base font-black text-slate-700">1 of 1 Used (Locked)</span>
                </div>
              </div>

              {/* Locked Notice */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                  <Lock className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>Single attempt limit enforced. This attempt is finalized and registered in your profile.</span>
                </div>
                <button
                  onClick={handleDownloadScorecard}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 border border-brand-400 shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-gold-400" />
                  <span>Download Scorecard</span>
                </button>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
                  Detailed Question Analysis & Answer Key
                </h3>

                {testData.questions.map((q, idx) => {
                  const studentAns = (savedResult.answers && savedResult.answers[q.id]);
                  const isCorrect = studentAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border-2 space-y-3 ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center text-white ${
                            isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                            {q.sectionId === 'sec-marathi' ? 'मराठी' : q.sectionId === 'sec-hindi' ? 'हिंदी' : 'English'}
                          </span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map(opt => (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-xl border ${
                              opt.key === q.correctAnswer
                                ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950 font-bold'
                                : opt.key === studentAns
                                ? 'bg-rose-100/80 border-rose-300 text-rose-950 font-bold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-mono font-black mr-1">{opt.key})</span> {opt.text}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                          <b>स्पष्टीकरण / Explanation:</b> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          STATE 4: BLOCKED & DISQUALIFIED FOR TAB SWITCHING
         ======================================================== */}
      {testState === 'blocked' && (
        <div className="bg-white rounded-3xl border-2 border-rose-400 shadow-2xl overflow-hidden animate-fadeIn">
          
          <div className="bg-rose-950 text-white p-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-rose-400">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <div className="inline-block bg-rose-600 text-white font-black text-xs px-3.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              Violation Enforced
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-rose-100">
              Test Disqualified & Access Blocked
            </h1>
            <p className="text-xs sm:text-sm text-rose-200 max-w-lg mx-auto font-medium">
              Malpractice detected: Candidate switched tabs or exited the examination window multiple times.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-slate-800">
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 space-y-2 text-xs">
              <h3 className="font-black text-rose-900 uppercase tracking-wider">
                Proctoring Violation Report
              </h3>
              <p className="text-rose-800">
                • <b>Candidate ID:</b> {savedResult?.userEmail || userId}<br />
                • <b>Candidate Name:</b> {savedResult?.userName || currentUser?.name || 'Student'}<br />
                • <b>Reason:</b> {savedResult?.reason || 'Multiple Window Blur / Tab Switching Violations'}<br />
                • <b>Disqualification Timestamp:</b> {savedResult?.timestamp ? new Date(savedResult.timestamp).toLocaleString() : new Date().toLocaleString()}<br />
                • <b>Score Assigned:</b> 0 / 10 (DISQUALIFIED)
              </p>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              As per the single attempt policy and anti-cheating regulations, this test cannot be retaken by this student ID. Please contact your mentor or teacher if you believe this was an error.
            </p>

            <button
              onClick={() => setActiveView('courses')}
              className="w-full py-3.5 px-6 bg-[#0A192F] hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer text-center"
            >
              Return to Courses & E-Textbooks
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          MODAL: WARNING 1 (TAB SWITCH DETECTED)
         ======================================================== */}
      {showWarningModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden p-6 sm:p-7 space-y-4">
            
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded font-mono">
                Warning 1 of 2
              </span>
              <h2 className="text-lg font-black text-[#0F172A]">
                Tab Switching / Window Blur Detected!
              </h2>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                You navigated away from the exam screen. Under strict examination rules, leaving the test window is not permitted.
              </p>
            </div>

            <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-800 font-bold">
              ⚠️ Final Warning: If you switch tabs or leave this window one more time, your test will be <b>IMMEDIATELY BLOCKED & DISQUALIFIED</b>.
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              I Understand — Return to Exam
            </button>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CONFIRM SUBMISSION
         ======================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden p-6 sm:p-7 space-y-4">
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-black text-[#0F172A]">
                Submit Your Examination?
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                You have answered <b>{answeredCount} of {testData.questions.length}</b> questions.
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800 font-semibold text-center">
              ⚠️ You only have 1 single attempt. Once submitted, your score will be locked permanently.
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-300"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={calculateAndSaveResult}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer border border-emerald-400"
              >
                Confirm & Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
