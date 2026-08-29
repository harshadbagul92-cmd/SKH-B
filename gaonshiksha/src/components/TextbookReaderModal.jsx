import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark,
  FileText,
  Sparkles,
  CheckCircle2,
  List,
  Layers,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Share2
} from 'lucide-react';

export default function TextbookReaderModal({ textbook, onClose }) {
  const { lang, t, tObj } = useApp();

  const chapters = textbook?.chapters || [];
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState('text-base'); // text-sm, text-base, text-lg
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookmarkedChapters, setBookmarkedChapters] = useState([]);
  const [showToast, setShowToast] = useState('');

  if (!textbook) return null;

  const currentChapter = chapters[selectedChapterIndex] || chapters[0];

  const handleToggleBookmark = (chapId) => {
    if (bookmarkedChapters.includes(chapId)) {
      setBookmarkedChapters(prev => prev.filter(id => id !== chapId));
      triggerToast(lang === 'mr' ? 'बुकमार्क काढले' : lang === 'hi' ? 'बुकमार्क हटाया गया' : 'Bookmark removed');
    } else {
      setBookmarkedChapters(prev => [...prev, chapId]);
      triggerToast(lang === 'mr' ? 'धडा बुकमार्क केला!' : lang === 'hi' ? 'अध्याय बुकमार्क किया!' : 'Chapter bookmarked!');
    }
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleDownloadPdf = () => {
    const chapterData = chapters.map(ch => 
      `====================================\n${tObj(ch.title)}\n====================================\n\n${tObj(ch.summary)}\n\n${tObj(ch.content)}\n\n`
    ).join('\n\n');

    const blob = new Blob([
      `INVICTUS LEARNING - DIGITAL TEXTBOOK\nSubject: ${tObj(textbook.title)}\nStandard: ${textbook.standard}\nDate: ${new Date().toLocaleDateString()}\n\n` + chapterData
    ], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invictus_${textbook.subject}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(lang === 'mr' ? 'नोट्स यशस्वीरित्या सेव्ह केल्या!' : 'Notes saved for offline reading!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-gold-500 text-navy-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl animate-bounce">
          {showToast}
        </div>
      )}

      {/* Main Reader Window Container */}
      <div className="w-full max-w-6xl h-[92vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Top Header Controls Bar (Deep Navy) */}
        <div className="bg-[#0A192F] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 lg:hidden transition-colors"
              title="Toggle Chapters"
            >
              <List className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-gold-400 font-bold shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white line-clamp-1">
                  {tObj(textbook.title)}
                </h2>
                <p className="text-[10px] text-gold-400 font-medium">
                  {textbook.standard} Standard • {textbook.badge}
                </p>
              </div>
            </div>
          </div>

          {/* Center/Right: Reader Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-300">
              <button
                onClick={() => setFontSize('text-sm')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'text-sm' ? 'bg-gold-500 text-navy-950 font-bold' : 'hover:text-white'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('text-base')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'text-base' ? 'bg-gold-500 text-navy-950 font-bold' : 'hover:text-white'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('text-lg')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'text-lg' ? 'bg-gold-500 text-navy-950 font-bold' : 'hover:text-white'}`}
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => handleToggleBookmark(currentChapter?.id)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                bookmarkedChapters.includes(currentChapter?.id)
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Bookmark Chapter"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedChapters.includes(currentChapter?.id) ? 'fill-current' : ''}`} />
            </button>

            {/* Download Notes button */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow cursor-pointer border border-brand-400/30"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden md:inline">{t('reader.download_notes') || 'Download Notes'}</span>
            </button>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
              title={t('reader.close') || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body Grid (Sidebar + Content Viewer) */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Chapter Drawer / Table of Contents */}
          <aside className={`w-72 sm:w-80 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 lg:static absolute inset-y-0 left-0 z-30 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}>
            <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>{t('reader.chapters') || 'Chapters & Index'}</span>
              </span>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {chapters.length} Chapters
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {chapters.map((ch, idx) => {
                const isSelected = selectedChapterIndex === idx;
                const isBookmarked = bookmarkedChapters.includes(ch.id);
                return (
                  <button
                    key={ch.id || idx}
                    onClick={() => {
                      setSelectedChapterIndex(idx);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A192F] text-white shadow-sm font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/70'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected ? 'bg-gold-500 text-navy-950 font-black' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ch.chapterNumber || idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs leading-snug truncate">
                        {tObj(ch.title)}
                      </div>
                      <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tObj(ch.summary)}
                      </p>
                    </div>
                    {isBookmarked && (
                      <Bookmark className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-gold-400 fill-current' : 'text-gold-600 fill-current'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Chapter Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-8 space-y-6">
            
            {/* Chapter Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center space-x-1.5 bg-blue-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'mr' ? `धडा क्रमांक ${currentChapter?.chapterNumber || 1}` : lang === 'hi' ? `अध्याय क्रमांक ${currentChapter?.chapterNumber || 1}` : `Chapter ${currentChapter?.chapterNumber || 1}`}
                  </span>
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {textbook.standard} • {tObj(textbook.title)}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {tObj(currentChapter?.title)}
              </h1>

              {currentChapter?.summary && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">
                    {lang === 'mr' ? 'प्रस्तावना व सारांश: ' : lang === 'hi' ? 'अध्याय सारांश: ' : 'Summary: '}
                  </strong>
                  {tObj(currentChapter.summary)}
                </div>
              )}
            </div>

            {/* Formatted Reading Content */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className={`prose prose-slate max-w-none ${fontSize} text-slate-800 leading-relaxed whitespace-pre-line`}>
                {tObj(currentChapter?.content)}
              </div>
            </div>

            {/* Key Takeaways & Revision Box */}
            {currentChapter?.keyPoints && currentChapter.keyPoints.length > 0 && (
              <div className="bg-gradient-to-r from-slate-900 to-navy-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center space-x-2 text-gold-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Revision & Key Takeaways</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {currentChapter.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation Footer (Prev / Next Chapter) */}
            <div className="flex items-center justify-between pt-2 pb-6">
              <button
                onClick={() => setSelectedChapterIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedChapterIndex === 0}
                className="flex items-center space-x-2 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'mr' ? 'मागील धडा' : lang === 'hi' ? 'पिछला अध्याय' : 'Previous Chapter'}</span>
              </button>

              <span className="text-xs font-bold text-slate-500">
                {selectedChapterIndex + 1} / {chapters.length}
              </span>

              <button
                onClick={() => setSelectedChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                disabled={selectedChapterIndex === chapters.length - 1}
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>{lang === 'mr' ? 'पुढील धडा' : lang === 'hi' ? 'अगला अध्याय' : 'Next Chapter'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
}
