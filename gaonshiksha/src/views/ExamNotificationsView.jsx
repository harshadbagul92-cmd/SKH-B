import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  Shield,
  Search,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  GraduationCap,
  Users,
  Award,
  Filter,
  X,
  Zap,
  Info
} from 'lucide-react';

export default function ExamNotificationsView() {
  const { lang, t, tObj, allGovExams } = useApp();

  const [selectedTier, setSelectedTier] = useState('all'); // 'all', 'central', 'state'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalExam, setActiveModalExam] = useState(null);
  const [showToast, setShowToast] = useState('');

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const categoriesList = [
    { id: 'all', label: { mr: 'सर्व प्रवर्ग', hi: 'सभी श्रेणियां', en: 'All Categories' } },
    { id: 'upsc', label: { mr: 'UPSC केंद्रीय सेवा', hi: 'UPSC सेवा', en: 'UPSC Central' } },
    { id: 'mpsc', label: { mr: 'MPSC राज्यसेवा', hi: 'MPSC सेवा', en: 'MPSC Services' } },
    { id: 'ssc', label: { mr: 'SSC (CGL/CHSL/MTS)', hi: 'SSC भर्ती', en: 'SSC Central' } },
    { id: 'railways', label: { mr: 'रेल्वे भरती (RRB)', hi: 'रेलवे (RRB)', en: 'Railways RRB' } },
    { id: 'banking', label: { mr: 'बँक भरती (IBPS/SBI)', hi: 'बैंकिंग (IBPS/SBI)', en: 'Banking IBPS/SBI' } },
    { id: 'defence', label: { mr: 'संरक्षण दल (NDA/CDS/CAPF)', hi: 'रक्षा बल (NDA/CDS)', en: 'Defence Forces' } },
    { id: 'police', label: { mr: 'महाराष्ट्र पोलीस', hi: 'महाराष्ट्र पुलिस', en: 'Maharashtra Police' } },
    { id: 'state', label: { mr: 'जि.प., आरोग्य व शिक्षण', hi: 'ZP, स्वास्थ्य एवं TET', en: 'ZP, Health & TET' } },
    { id: 'revenue', label: { mr: 'भारतीय डाक (GDS)', hi: 'भारतीय डाक (GDS)', en: 'India Post GDS' } }
  ];

  // Filtering Logic
  const filteredExams = allGovExams.filter((exam) => {
    if (selectedTier !== 'all' && exam.tier !== selectedTier) return false;
    if (selectedCategory !== 'all' && exam.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const examName = (tObj(exam.examName) || '').toLowerCase();
      const dept = (tObj(exam.department) || '').toLowerCase();
      const elig = (tObj(exam.eligibility) || '').toLowerCase();
      const examDate = (exam.examDate || '').toLowerCase();
      return examName.includes(q) || dept.includes(q) || elig.includes(q) || examDate.includes(q);
    }
    return true;
  });

  const getStatusBadge = (exam) => {
    if (exam.statusNote) {
      return (
        <span className="inline-flex items-center space-x-1 bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-navy-950 animate-ping mr-0.5" />
          {exam.statusNote}
        </span>
      );
    }

    switch (exam.status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-950 animate-ping mr-0.5" />
            {t('exams.active_badge') || 'Active'}
          </span>
        );
      case 'closing_soon':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Clock className="w-3 h-3 text-rose-600" />
            <span>{t('exams.closing_soon') || 'Closing Soon'}</span>
          </span>
        );
      case 'upcoming':
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-100 text-brand-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Calendar className="w-3 h-3 text-brand-600" />
            <span>{t('exams.upcoming_badge') || 'Upcoming'}</span>
          </span>
        );
    }
  };

  const handleDownloadSyllabus = (exam) => {
    const syllabusText = `INVICTUS LEARNING - OFFICIAL EXAM NOTIFICATION & SYLLABUS\n\nExam: ${tObj(exam.examName)}\nDepartment: ${tObj(exam.department)}\nEligibility: ${tObj(exam.eligibility)}\nApplication Dates: ${exam.startDate} to ${exam.endDate}\nExam Date / Cycle: ${exam.examDate}\nStatus / Cycle: ${exam.statusNote || exam.status}\nOfficial Portal: ${exam.applyUrl}\n\nSTAGES & EXAMINATION PATTERN:\n` +
      (exam.stages || []).map(st => `\n--------------------------------\n${tObj(st.name)}\nDetails: ${tObj(st.details)}\n`).join('\n') +
      `\n\nOFFICIAL HIGHLIGHTS:\n` +
      (exam.highlights || []).map(h => `• ${h}`).join('\n') +
      `\n\nVerified by Invictus Learning Academy (Offline-First Hub)`;

    const blob = new Blob([syllabusText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam.id}_syllabus_2026.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast(lang === 'mr' ? 'अभ्यासक्रम व सूचना डाउनलोड झाली!' : 'Exam notification & syllabus saved offline!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gold-500 text-navy-950 text-xs font-black px-4 py-2 rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-navy-950" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono">
              Central & Maharashtra Recruitments 2026
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
            {t('exams.title') || 'Government Exam Notifications 2026'}
          </h1>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            {t('exams.subtitle') || 'Comprehensive tracking for UPSC, MPSC, SSC, Railways, Banking, Police & State recruitments'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-gold-600" />
            <span>{allGovExams.length} Official Verified Notices</span>
          </span>
        </div>
      </div>

      {/* 2-Tier Sub-Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs space-y-4">
        
        {/* Tier 1: Central vs State Government Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-300 self-start">
            <button
              onClick={() => {
                setSelectedTier('all');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedTier === 'all'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              {t('exams.tab_all') || 'All Exams'} ({allGovExams.length})
            </button>
            <button
              onClick={() => {
                setSelectedTier('central');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedTier === 'central'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              <Landmark className="w-4 h-4 text-gold-400" />
              <span>{t('exams.tab_central') || 'Central Govt'} (24)</span>
            </button>
            <button
              onClick={() => {
                setSelectedTier('state');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedTier === 'state'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              <Building className="w-4 h-4 text-gold-400" />
              <span>{t('exams.tab_state') || 'Maharashtra State'} (12)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('exams.search_placeholder') || 'Search by exam, department or qualification...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
            />
          </div>
        </div>

        {/* Tier 2: Category Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-t border-slate-200 pt-3 scrollbar-none">
          {categoriesList.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
                  isCatActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs ring-2 ring-blue-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                {cat.label[lang] || cat.label.en}
              </button>
            );
          })}
        </div>

      </div>

      {/* Exam Notification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          return (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:border-brand-500"
            >
              <div>
                {/* Header */}
                <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-brand-800 px-2.5 py-0.5 rounded-md border border-blue-200 font-mono">
                        {tObj(exam.categoryLabel)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">
                        {exam.totalPosts}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-snug pt-1">
                      {tObj(exam.examName)}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-semibold flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{tObj(exam.department)}</span>
                    </p>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-5 py-2 bg-[#0A192F] text-white flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    <span className="font-bold text-[11px] text-slate-200 line-clamp-1">
                      Exam: {exam.examDate || '2026 Schedule'}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(exam)}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 text-xs text-slate-700">
                  
                  {/* Eligibility */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                    <div className="font-black text-[#0F172A] flex items-center space-x-1.5 text-[10px] uppercase tracking-wider">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-700" />
                      <span>{t('exams.eligibility') || 'Eligibility'}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-xs font-medium line-clamp-2">
                      {tObj(exam.eligibility)}
                    </p>
                  </div>

                  {/* Dates & Age Limit */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-brand-700" />
                        <span>Apply Dates</span>
                      </span>
                      <div className="font-bold text-slate-900 text-[11px]">
                        {exam.startDate} - {exam.endDate}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                        <Users className="w-3 h-3 text-gold-600" />
                        <span>Age Limit</span>
                      </span>
                      <div className="font-bold text-slate-900 text-[11px] truncate">
                        {tObj(exam.ageLimit)}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveModalExam(exam)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-[#0A192F] hover:bg-brand-700 text-white font-black text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer border border-slate-700"
                >
                  <FileText className="w-3.5 h-3.5 text-gold-400" />
                  <span>View Details & Syllabus</span>
                </button>

                <button
                  onClick={() => handleDownloadSyllabus(exam)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                  title="Save Notification & Syllabus Offline"
                >
                  <Download className="w-4 h-4 text-slate-700" />
                </button>

                <a
                  href={exam.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer border border-brand-400"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Syllabus & Notice Modal */}
      {activeModalExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white p-5 flex items-start justify-between border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded-md font-mono">
                  {tObj(activeModalExam.categoryLabel)}
                </span>
                <h2 className="text-base sm:text-lg font-black leading-snug text-white">
                  {tObj(activeModalExam.examName)}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  {tObj(activeModalExam.department)}
                </p>
              </div>
              <button
                onClick={() => setActiveModalExam(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Apply Dates</span>
                  <span className="font-bold text-slate-900">{activeModalExam.startDate} - {activeModalExam.endDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Exam Date</span>
                  <span className="font-bold text-brand-700">{activeModalExam.examDate || '2026 Schedule'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Application Fee</span>
                  <span className="font-bold text-slate-900">{tObj(activeModalExam.applicationFee)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Official Portal</span>
                  <span className="font-bold text-brand-800 truncate block">{activeModalExam.portalName}</span>
                </div>
              </div>

              {/* Eligibility */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-1">
                <h4 className="font-black text-brand-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-700" />
                  <span>Educational Qualification & Eligibility</span>
                </h4>
                <p className="text-slate-800 text-xs font-medium leading-relaxed">
                  {tObj(activeModalExam.eligibility)}
                </p>
                <div className="pt-1 text-[11px] text-slate-600 font-semibold">
                  Age Limit: {tObj(activeModalExam.ageLimit)}
                </div>
              </div>

              {/* Exam Stages & Pattern */}
              <div>
                <h4 className="font-black text-[#0F172A] text-sm mb-3">
                  Examination Stages & Pattern
                </h4>
                <div className="space-y-3">
                  {(activeModalExam.stages || []).map((stage, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A] text-xs">
                          {idx + 1}. {tObj(stage.name)}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed font-medium">
                        {tObj(stage.details || stage.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              {activeModalExam.highlights && activeModalExam.highlights.length > 0 && (
                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <h4 className="font-black text-[#0F172A] text-xs uppercase tracking-wider">
                    Important Instructions & Career Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {activeModalExam.highlights.map((item, hi) => (
                      <li key={hi} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDownloadSyllabus(activeModalExam)}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-black cursor-pointer"
              >
                <Download className="w-4 h-4 text-gold-600" />
                <span>Save Offline</span>
              </button>

              <a
                href={activeModalExam.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-600 hover:bg-brand-500 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm border border-brand-400"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
