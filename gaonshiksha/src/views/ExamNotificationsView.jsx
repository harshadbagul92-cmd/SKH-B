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
    { id: 'police', label: { mr: 'पोलीस भरती', hi: 'पुलिस भर्ती', en: 'Police Recruitment' } },
    { id: 'mpsc', label: { mr: 'MPSC राज्यसेवा', hi: 'MPSC सेवा', en: 'MPSC Services' } },
    { id: 'revenue', label: { mr: 'तलाठी / महसूल', hi: 'पटवारी / राजस्व', en: 'Talathi & Revenue' } },
    { id: 'ssc', label: { mr: 'SSC (CGL/CHSL)', hi: 'SSC भर्ती', en: 'SSC Central' } },
    { id: 'railways', label: { mr: 'रेल्वे भरती (RRB)', hi: 'रेलवे (RRB)', en: 'Railways RRB' } },
    { id: 'banking', label: { mr: 'बँक भरती (IBPS/SBI)', hi: 'बैंकिंग (IBPS/SBI)', en: 'Banking IBPS' } },
    { id: 'defence', label: { mr: 'संरक्षण दल (NDA/CDS)', hi: 'रक्षा बल (NDA/CDS)', en: 'Defence Forces' } }
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
      return examName.includes(q) || dept.includes(q) || elig.includes(q);
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-950 animate-ping mr-0.5" />
            {t('exams.active_badge')}
          </span>
        );
      case 'closing_soon':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Clock className="w-3 h-3 text-rose-600" />
            <span>{t('exams.closing_soon')}</span>
          </span>
        );
      case 'upcoming':
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-100 text-brand-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Calendar className="w-3 h-3 text-brand-600" />
            <span>{t('exams.upcoming_badge')}</span>
          </span>
        );
    }
  };

  const handleDownloadSyllabus = (exam) => {
    const syllabusText = `INVICTUS LEARNING - OFFICIAL EXAM SYLLABUS\n\nExam: ${tObj(exam.examName)}\nDepartment: ${tObj(exam.department)}\nEligibility: ${tObj(exam.eligibility)}\nApplication Dates: ${exam.startDate} to ${exam.endDate}\nOfficial Portal: ${exam.applyUrl}\n\nSTAGES & EXAMINATION PATTERN:\n` +
      (exam.stages || []).map(st => `\n--------------------------------\n${tObj(st.name)} (Marks: ${st.marks || 'N/A'}, Duration: ${st.duration || 'N/A'})\nTopics: ${(st.topics || []).join(', ')}\n`).join('\n');

    const blob = new Blob([syllabusText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam.id}_syllabus.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast(lang === 'mr' ? 'अभ्यासक्रम डाउनलोड झाला!' : 'Syllabus notes downloaded!');
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
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Recruitment Alerts 2026
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {t('exams.title')}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('exams.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-gold-600" />
            <span>Official Verified Portals</span>
          </span>
        </div>
      </div>

      {/* 2-Tier Sub-Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Tier 1: Central vs State Government Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start">
            <button
              onClick={() => {
                setSelectedTier('all');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedTier === 'all'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('exams.tab_all')}
            </button>
            <button
              onClick={() => {
                setSelectedTier('central');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedTier === 'central'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Landmark className="w-4 h-4 text-gold-400" />
              <span>{t('exams.tab_central')}</span>
            </button>
            <button
              onClick={() => {
                setSelectedTier('state');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedTier === 'state'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4 text-gold-400" />
              <span>{t('exams.tab_state')}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('exams.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-600 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 font-medium transition-all focus:outline-none"
            />
          </div>
        </div>

        {/* Tier 2: Category Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {categoriesList.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isCatActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
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
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-brand-300"
            >
              <div>
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/60">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-700 px-2.5 py-0.5 rounded-md border border-blue-200 font-mono">
                        {tObj(exam.categoryLabel)}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {exam.totalPosts}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug pt-1">
                      {tObj(exam.examName)}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tObj(exam.department)}</span>
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(exam.status)}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 text-xs text-slate-700">
                  
                  {/* Eligibility */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                      <span>{t('exams.eligibility')}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {tObj(exam.eligibility)}
                    </p>
                  </div>

                  {/* Dates & Age Limit */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-teal-600" />
                        <span>{t('exams.application_window')}</span>
                      </span>
                      <div className="font-bold text-slate-800 text-[11px]">
                        {exam.startDate} - {exam.endDate}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                        <Users className="w-3 h-3 text-purple-600" />
                        <span>{t('exams.age_limit')}</span>
                      </span>
                      <div className="font-bold text-slate-800 text-[11px] truncate">
                        {tObj(exam.ageLimit)}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveModalExam(exam)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t('exams.view_syllabus')}</span>
                </button>

                <button
                  onClick={() => handleDownloadSyllabus(exam)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  title="Download Syllabus"
                >
                  <Download className="w-4 h-4" />
                </button>

                <a
                  href={exam.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>{t('exams.apply_online')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Syllabus Modal */}
      {activeModalExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            
            <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded-md font-mono">
                  {tObj(activeModalExam.categoryLabel)}
                </span>
                <h2 className="text-base sm:text-lg font-black leading-snug">
                  {tObj(activeModalExam.examName)}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalExam(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('exams.fee')}</span>
                  <span className="font-bold text-slate-900">{tObj(activeModalExam.applicationFee)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('exams.official_portal')}</span>
                  <span className="font-bold text-brand-700 truncate block">{activeModalExam.portalName}</span>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm mb-3">
                  {t('exams.syllabus_modal_title')}
                </h4>
                <div className="space-y-3">
                  {(activeModalExam.stages || []).map((stage, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {idx + 1}. {tObj(stage.name)}
                        </span>
                        {stage.marks && (
                          <span className="text-[10px] font-bold bg-blue-100 text-brand-700 px-2 py-0.5 rounded">
                            {stage.marks} Marks
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs">{tObj(stage.description)}</p>
                      {stage.topics && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {stage.topics.map((top, ti) => (
                            <span key={ti} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                              {top}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDownloadSyllabus(activeModalExam)}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <Download className="w-4 h-4 text-gold-600" />
                <span>Save Offline</span>
              </button>

              <a
                href={activeModalExam.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <span>{t('exams.apply_online')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
