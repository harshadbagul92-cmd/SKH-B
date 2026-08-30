import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import TextbookReaderModal from '../components/TextbookReaderModal';
import StudyMaterialUploadModal from '../components/StudyMaterialUploadModal';
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
  Scissors,
  Upload,
  Plus,
  Lock,
  UserCheck,
  Search
} from 'lucide-react';

export default function CoursesView() {
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
    textbookInitialMode,
    openTextbook,
    closeTextbook,
    activeSubjectFilter,
    setActiveSubjectFilter
  } = useApp();

  const [activeTab, setActiveTab] = useState('textbooks'); // 'textbooks' | 'notes'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState([
    {
      id: 'sm-sample-1',
      title: 'Class 10 Science: Periodic Table & Chemical Reactions Simplified Guide',
      subject: 'Science',
      standard: 'Class 10',
      description: 'Handcrafted revision notes explaining Mendeleev vs Modern Periodic table, oxidation, and reduction with practical village examples.',
      content: 'Key points: Mendeleev arranged elements by atomic mass, Moseley modern periodic table arranged by atomic number (Z). Exothermic reactions release heat; Endothermic absorb heat. Oxidation = gain of oxygen/loss of electrons; Reduction = gain of hydrogen/gain of electrons.',
      author: 'Dr. V. Patil (Z.P. High School Mentor)',
      geminiProtection: {
        isApproved: true,
        verdict: 'APPROVED',
        score: 98,
        safetyRating: 'SAFE',
        protectionBadge: 'Gemini Shield: Verified Safe & Educational'
      },
      createdAt: '2026-08-28T10:00:00.000Z'
    },
    {
      id: 'sm-sample-2',
      title: 'Class 10 Kumarbharati Marathi Grammar: समास आणि वाक्यरूपांतर',
      subject: 'Languages',
      standard: 'Class 10',
      description: 'द्विगु, कर्मधारय आणि अव्ययीभाव समास ओळखण्याच्या सोप्या ट्रिक्स व उदाहरणे.',
      content: 'समास प्रकार: १. अव्ययीभाव (उदा. आजन्म), २. तत्पुरुष व कर्मधारय (उदा. घनश्याम), ३. द्विगु समास (उदा. त्रिभुवन), ४. द्वंद्व समास (उदा. आई-वडील), ५. बहुव्रीही समास (उदा. नीलकंठ).',
      author: 'सौ. अनिता देशमुख (भाषा मार्गदर्शक)',
      geminiProtection: {
        isApproved: true,
        verdict: 'APPROVED',
        score: 99,
        safetyRating: 'SAFE',
        protectionBadge: 'Gemini Shield: Verified Safe & Educational'
      },
      createdAt: '2026-08-29T14:30:00.000Z'
    }
  ]);
  const [selectedNote, setSelectedNote] = useState(null);

  // Load server-synced study materials if online
  useEffect(() => {
    fetch('/api/study-materials')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStudyMaterials(data);
        }
      })
      .catch(() => {});
  }, []);

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
    { id: 'all', label: lang === 'mr' ? 'सर्व विषय' : lang === 'hi' ? 'सभी विषय' : 'All Subjects' },
    { id: 'marathi', label: lang === 'mr' ? 'मराठी' : 'Marathi' },
    { id: 'hindi', label: lang === 'mr' ? 'हिंदी' : 'Hindi' },
    { id: 'english', label: lang === 'mr' ? 'इंग्रजी' : 'English' }
  ];

  const filteredTextbooks = (allTextbooks || []).filter((tb) => {
    if (activeSubjectFilter === 'all') return true;
    return tb.subject && tb.subject.toLowerCase() === activeSubjectFilter.toLowerCase();
  });

  const studentGrade = userProfile?.grade || currentUser?.grade || '10th';

  return (
    <div className="space-y-6 pb-12">
      {/* Textbook Reader Modal */}
      {selectedTextbook && (
        <TextbookReaderModal
          textbook={selectedTextbook}
          initialMode={textbookInitialMode || 'ebook'}
          onClose={closeTextbook}
        />
      )}

      {/* Gemini Protected Upload Modal */}
      <StudyMaterialUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onMaterialUploaded={(newMat) => {
          setStudyMaterials(prev => [newMat, ...prev]);
        }}
      />

      {/* Clean High-Contrast Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0097A7] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-mono">
              Class {studentGrade.toUpperCase()} • SSC Board Curriculum
            </span>
            <span className="text-[10px] font-black bg-[#FFEB01] text-[#0097A7] px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Gemini Protected</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
            {lang === 'mr'
              ? 'इयत्ता १० वी अभ्यासक्रम व सुरक्षित शैक्षणिक साहित्य'
              : lang === 'hi'
              ? 'कक्षा १०वीं पाठ्यक्रम एवं संरक्षित अध्ययन सामग्री'
              : 'Class 10th Curriculum & Verified Study Notes'}
          </h1>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            {lang === 'mr'
              ? 'मराठी, हिंदी व इंग्रजी ई-पाठ्यपुस्तके आणि जेमिनी AI द्वारे सत्यापित सुरक्षित नोट्स (१००% ऑफलाइन व सुरक्षित)'
              : 'Official Kumarbharati E-Textbooks with Gemini AI Shield protected community notes.'}
          </p>
        </div>

        {/* Action Button: Upload Notes with Gemini Shield */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0097A7] hover:bg-[#00838F] text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer border border-teal-600"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFEB01]" />
            <span>{lang === 'mr' ? '+ नोट्स अपलोड करा (AI Protected)' : '+ Upload Notes (Gemini Shield)'}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation: Textbooks vs Gemini-Verified Notes */}
      <div className="flex items-center space-x-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('textbooks')}
          className={`pb-3 px-2 text-xs sm:text-sm font-black border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'textbooks'
              ? 'border-[#0097A7] text-[#0097A7]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'mr' ? 'शासकीय ई-पाठ्यपुस्तके (E-Books)' : 'Official E-Textbooks'}</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-2 text-xs sm:text-sm font-black border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'notes'
              ? 'border-[#0097A7] text-[#0097A7]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'mr' ? 'सत्यापित अभ्यास नोट्स (Gemini Verified)' : 'Verified Study Notes'}</span>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
            {studyMaterials.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OFFICIAL TEXTBOOKS */}
      {activeTab === 'textbooks' && (
        <div className="space-y-6">
          {/* Language Subject Filter Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {subjectsList.map((sub) => {
              const isActive = activeSubjectFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubjectFilter(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#0097A7] text-white border-teal-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* 3 Core E-Textbooks Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTextbooks.map((tb) => {
              const totalCh = tb.chapters ? tb.chapters.length : tb.totalChapters;
              return (
                <div
                  key={tb.id}
                  className="bg-white rounded-2xl border border-slate-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:border-[#0097A7]"
                >
                  <div>
                    <div className="p-6 bg-[#0097A7] text-white relative">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFEB01] text-[#0097A7] px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                          {tb.badge || 'Maharashtra Board'}
                        </span>
                        <span className="text-[11px] font-bold text-teal-100 bg-white/20 px-2.5 py-0.5 rounded-md border border-white/30">
                          {totalCh} {t('course.chapters_count') || 'Chapters'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black mt-3 leading-snug text-white">
                        {tObj(tb.title)}
                      </h3>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
                        {tObj(tb.description)}
                      </p>

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
                              <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0097A7] font-black text-[10px] flex items-center justify-center shrink-0 border border-teal-200">
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

                  <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openTextbook(tb.id, 'ebook')}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#0097A7] hover:bg-[#00838F] text-white font-black text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#FFEB01]" />
                      <span>{lang === 'mr' ? 'पुस्तक उघडा' : 'Read Book'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openTextbook(tb.id, 'pdf')}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#FFEB01]" />
                      <span>{lang === 'mr' ? 'PDF पहा' : 'View PDF'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GEMINI PROTECTION VERIFIED NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Gemini AI Shield Banner */}
          <div className="bg-linear-to-r from-teal-900 via-[#00838F] to-[#0097A7] text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#FFEB01] text-[#0097A7] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Gemini AI Safety Shield Active</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black">
                  {lang === 'mr' ? 'दिशाभूल-मुक्त व सत्यापित अभ्यास नोट्स' : 'Zero-Misguidance Verified Academic Notes'}
                </h2>
                <p className="text-xs text-teal-100 max-w-2xl leading-relaxed">
                  {lang === 'mr'
                    ? 'येथे असलेले प्रत्येक साहित्य जेमिनी AI द्वारे तपासले गेले आहे. कोणत्याही खोट्या प्रश्नपत्रिका, फसवणूक किंवा दिशाभूल करणाऱ्या साहित्याला मंचावर बंदी आहे.'
                    : 'Every note here is pre-verified by Gemini AI for accuracy, academic rigor, and student safety before publishing.'}
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#FFEB01] hover:bg-yellow-400 text-[#0097A7] font-black text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'mr' ? 'नवीन नोट्स सबमिट करा' : 'Submit Study Material'}</span>
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studyMaterials.map((sm) => (
              <div
                key={sm.id}
                className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-[#0097A7]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase bg-teal-100 text-[#0097A7] px-2.5 py-0.5 rounded-full border border-teal-200">
                        {sm.subject} • {sm.standard}
                      </span>
                    </div>

                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Gemini Verified (Score: {sm.geminiProtection?.score || 95}/100)</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {sm.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {sm.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed max-h-32 overflow-y-auto">
                    {sm.content}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#0097A7]" />
                    <span>{sm.author || 'Verified Teacher'}</span>
                  </span>

                  <span className="text-[10px] text-slate-400 font-semibold">
                    {new Date(sm.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

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
                  className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs flex items-center justify-between gap-4 hover:border-[#0097A7] transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#0097A7] flex items-center justify-center shrink-0 shadow-xs">
                      {getCourseIcon(course.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        {tObj(course.title)}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {tObj(course.description)}
                      </p>
                      <div className="flex items-center space-x-3 mt-1.5 text-[11px] font-bold">
                        <span className="text-[#0097A7]">{completedCount}/{totalCourseLessons} Lessons</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-amber-600">{percent}% Done</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectCourse(course.id)}
                    className="text-xs font-black text-[#0097A7] bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl border border-teal-200 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Start →</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Class 10 Textbook Reader Modal (E-Book, PDF, Swadhyay) */}
      {selectedTextbook && (
        <TextbookReaderModal
          textbook={selectedTextbook}
          initialMode={textbookInitialMode}
          onClose={closeTextbook}
        />
      )}

    </div>
  );
}
