import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  HelpCircle,
  Share2,
  Search,
  PenTool,
  Check,
  RotateCcw,
  BookMarked,
  Info
} from 'lucide-react';

export default function TextbookReaderModal({ textbook, initialMode = 'ebook', onClose }) {
  const { lang, t, tObj } = useApp();

  const [activeTab, setActiveTab] = useState(initialMode); // 'ebook', 'pdf', 'swadhyay'
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState('text-base'); // text-sm, text-base, text-lg
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookmarkedChapters, setBookmarkedChapters] = useState([]);
  const [showToast, setShowToast] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // PDF Mode State
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!textbook) return null;

  const chapters = textbook.chapters || [];
  const currentChapter = chapters[selectedChapterIndex] || chapters[0];
  const totalPages = textbook.totalChapters ? textbook.totalChapters * 6 + 12 : 128;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleToggleBookmark = (chapId) => {
    if (bookmarkedChapters.includes(chapId)) {
      setBookmarkedChapters(prev => prev.filter(id => id !== chapId));
      triggerToast(lang === 'mr' ? 'बुकमार्क काढले' : lang === 'hi' ? 'बुकमार्क हटाया गया' : 'Bookmark removed');
    } else {
      setBookmarkedChapters(prev => [...prev, chapId]);
      triggerToast(lang === 'mr' ? 'धडा बुकमार्क केला!' : lang === 'hi' ? 'अध्याय बुकमार्क किया!' : 'Chapter bookmarked!');
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      triggerToast('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      triggerToast(lang === 'mr' ? 'ऑडिओ थांबवला' : 'Audio stopped');
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${tObj(currentChapter.title)}. ${currentChapter.author ? 'लेखक: ' + currentChapter.author : ''}. ${tObj(currentChapter.summary)}. ${tObj(currentChapter.content)}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.lang = textbook.subject === 'english' ? 'en-US' : textbook.subject === 'hindi' ? 'hi-IN' : 'mr-IN';
      
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      triggerToast(lang === 'mr' ? 'ऑडिओ वाचन सुरू झाले...' : 'Audio reading started...');
    }
  };

  const handleDownloadNotes = () => {
    const chapterData = chapters.map(ch => 
      `====================================\n${tObj(ch.title)}\n${ch.author ? 'Author: ' + ch.author : ''}\n====================================\n\nSUMMARY:\n${tObj(ch.summary)}\n\nCONTENT / POEM:\n${tObj(ch.content)}\n\nKEY CONCEPTS:\n${(ch.keyPoints || []).map(k => '• ' + k).join('\n')}\n\n`
    ).join('\n\n');

    const blob = new Blob([
      `INVICTUS LEARNING ACADEMY - OFFICIAL DIGITAL TEXTBOOK\n` +
      `Subject: ${tObj(textbook.title)}\n` +
      `Standard: ${textbook.standard || '10th'}\n` +
      `Board: Maharashtra State Bureau of Textbook Production, Pune\n` +
      `Date: ${new Date().toLocaleDateString()}\n\n` +
      chapterData
    ], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invictus_${textbook.subject}_Std10_Complete_Textbook_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(lang === 'mr' ? 'संपूर्ण पाठ्यपुस्तक नोट्स सेव्ह झाल्या!' : 'Full textbook notes saved offline!');
  };

  const filteredChapters = chapters.filter(ch => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (tObj(ch.title) || '').toLowerCase();
    const author = (ch.author || '').toLowerCase();
    const summary = (tObj(ch.summary) || '').toLowerCase();
    return title.includes(q) || author.includes(q) || summary.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-gold-500 text-navy-950 font-black text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border-2 border-navy-950">
          <CheckCircle2 className="w-4 h-4 text-navy-950" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Main Reader Window Container */}
      <div className={`w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 transition-all ${
        isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-6xl h-[94vh]'
      }`}>
        
        {/* 1. Top Header Bar (Deep Navy with Mode Switcher Tabs) */}
        <header className="bg-[#0A192F] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 shadow-sm">
          
          {/* Left: Book Title & Chapter Drawer Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 lg:hidden transition-colors cursor-pointer border border-slate-700"
              title="Toggle Table of Contents"
            >
              <List className="w-4 h-4 text-gold-400" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow border border-brand-400">
                <BookOpen className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black tracking-tight text-white line-clamp-1">
                  {tObj(textbook.title)}
                </h2>
                <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                  Class 10th • {textbook.badge || 'SSC Board Pune'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Interactive Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700 p-1 rounded-2xl text-xs font-black shadow-inner">
            <button
              onClick={() => setActiveTab('ebook')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'ebook'
                  ? 'bg-brand-600 text-white shadow-sm border border-brand-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'mr' ? 'ई-पाठ्यपुस्तक' : lang === 'hi' ? 'ई-पाठ्यपुस्तक' : 'E-Textbook'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-brand-600 text-white shadow-sm border border-brand-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'mr' ? 'PDF व्ह्यूअर' : lang === 'hi' ? 'PDF व्यूअर' : 'PDF Viewer'}</span>
            </button>

            <button
              onClick={() => setActiveTab('swadhyay')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'swadhyay'
                  ? 'bg-brand-600 text-white shadow-sm border border-brand-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'mr' ? 'स्वाध्याय व भाषाभ्यास' : lang === 'hi' ? 'स्वाध्याय एवं व्याकरण' : 'Exercises'}</span>
            </button>
          </div>

          {/* Right: Quick Tools (Speech, Font, Notes, Fullscreen, Close) */}
          <div className="flex items-center space-x-2">
            
            {/* Audio Speech Narration */}
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-1 text-xs font-bold ${
                isPlayingAudio
                  ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-sm animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Listen to Audio Narration"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold-400" />}
              <span className="hidden md:inline">{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Font Size Adjuster (for ebook mode) */}
            {activeTab === 'ebook' && (
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs text-slate-300">
                <button
                  onClick={() => setFontSize('text-sm')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'text-sm' ? 'bg-gold-500 text-navy-950 font-black' : 'hover:text-white'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('text-base')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'text-base' ? 'bg-gold-500 text-navy-950 font-black' : 'hover:text-white'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('text-lg')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'text-lg' ? 'bg-gold-500 text-navy-950 font-black' : 'hover:text-white'}`}
                >
                  A+
                </button>
              </div>
            )}

            {/* Bookmark Chapter */}
            <button
              onClick={() => handleToggleBookmark(currentChapter?.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                bookmarkedChapters.includes(currentChapter?.id)
                  ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Bookmark Chapter"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedChapters.includes(currentChapter?.id) ? 'fill-current text-navy-950' : 'text-gold-400'}`} />
            </button>

            {/* Download Full Notes */}
            <button
              onClick={handleDownloadNotes}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Save Textbook Offline"
            >
              <Download className="w-4 h-4 text-gold-400" />
            </button>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer hidden md:block"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-rose-500 shadow-sm"
              title="Close Textbook Viewer"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* 2. Reader Body Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* ========================================================
              SIDEBAR: CHAPTER / UNIT TABLE OF CONTENTS
             ======================================================== */}
          <aside className={`w-72 sm:w-80 bg-slate-50 border-r border-slate-300 flex flex-col shrink-0 lg:static absolute inset-y-0 left-0 z-30 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}>
            
            {/* Search within Textbook */}
            <div className="p-3 bg-white border-b border-slate-200 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'mr' ? 'धडा किंवा कविता शोधा...' : 'Search chapters or topics...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredChapters.map((ch, idx) => {
                const originalIndex = chapters.findIndex(c => c.id === ch.id);
                const isSelected = selectedChapterIndex === originalIndex;
                const isBookmarked = bookmarkedChapters.includes(ch.id);

                return (
                  <button
                    key={ch.id || idx}
                    onClick={() => {
                      setSelectedChapterIndex(originalIndex);
                      setCurrentPage(originalIndex * 4 + 1);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-start space-x-3 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0A192F] text-white shadow-md border-slate-800'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected ? 'bg-gold-500 text-navy-950 font-black' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ch.chapterNumber || idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-snug line-clamp-1">
                        {tObj(ch.title)}
                      </div>
                      {ch.author && (
                        <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {ch.author}
                        </p>
                      )}
                      {(ch.unit || ch.part) && (
                        <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                          isSelected ? 'bg-blue-900 text-blue-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ch.unit || ch.part}
                        </span>
                      )}
                    </div>

                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 text-gold-400 fill-current shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>{chapters.length} Lessons / Poems</span>
              <span className="text-[10px] text-brand-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-mono">
                100% Offline
              </span>
            </div>

          </aside>

          {/* ========================================================
              MAIN DISPLAY PANEL: 3 TABS (EBOOK / PDF / SWADHYAY)
             ======================================================== */}
          <main className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* ----------------------------------------------------
                TAB 1: INTERACTIVE E-TEXTBOOK VIEW
               ---------------------------------------------------- */}
            {activeTab === 'ebook' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Chapter Banner */}
                <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded font-mono">
                        {currentChapter?.unit || currentChapter?.part || `Chapter ${selectedChapterIndex + 1}`}
                      </span>
                      {currentChapter?.author && (
                        <span className="text-xs font-bold text-slate-600">
                          {currentChapter.author}
                        </span>
                      )}
                    </div>
                    <h1 className="text-lg sm:text-xl font-black text-[#0F172A] leading-tight">
                      {tObj(currentChapter?.title)}
                    </h1>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      disabled={selectedChapterIndex === 0}
                      onClick={() => setSelectedChapterIndex(prev => Math.max(0, prev - 1))}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                      title="Previous Chapter"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={selectedChapterIndex === chapters.length - 1}
                      onClick={() => setSelectedChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                      title="Next Chapter"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chapter Reading Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
                  
                  {/* Summary Callout Card */}
                  {currentChapter?.summary && (
                    <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-brand-800 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                        <span>{lang === 'mr' ? 'पाठाचा / कवितेचा सारांश व परिचय' : 'Chapter Summary & Core Meaning'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {tObj(currentChapter.summary)}
                      </p>
                    </div>
                  )}

                  {/* Main Verse / Text Content */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Official Text Content</span>
                      <span className="text-[10px] font-mono text-brand-700 bg-blue-50 px-2 py-0.5 rounded">Balbharati Std 10</span>
                    </div>

                    <div className={`${fontSize} text-[#0F172A] font-serif leading-relaxed whitespace-pre-line`}>
                      {tObj(currentChapter?.content)}
                    </div>
                  </div>

                  {/* Vocabulary / Shabdarth (शब्दार्थ) */}
                  {currentChapter?.vocabulary && currentChapter.vocabulary.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                      <div className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
                        <BookMarked className="w-4 h-4 text-brand-700" />
                        <span>{lang === 'mr' ? 'शब्दार्थ व कठीण शब्द (Vocabulary)' : 'Word Meanings & Glossary'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentChapter.vocabulary.map((voc, vi) => (
                          <div key={vi} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="font-bold text-brand-800">{voc.word}</span> : <span className="text-slate-700">{voc.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Highlights / Learning Points */}
                  {currentChapter?.keyPoints && currentChapter.keyPoints.length > 0 && (
                    <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-2">
                      <div className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-gold-600" />
                        <span>Key Learning Points & Takeaways</span>
                      </div>
                      <ul className="space-y-1.5">
                        {currentChapter.keyPoints.map((kp, ki) => (
                          <li key={ki} className="flex items-start space-x-2 text-xs text-slate-800 font-medium">
                            <span className="text-gold-600 font-bold">•</span>
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Navigation to Next / Previous at bottom */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <button
                      disabled={selectedChapterIndex === 0}
                      onClick={() => setSelectedChapterIndex(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Lesson</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('swadhyay')}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black shadow transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <PenTool className="w-3.5 h-3.5 text-gold-400" />
                      <span>{lang === 'mr' ? 'या पाठाचा स्वाध्याय सोडवा →' : 'Solve Exercises →'}</span>
                    </button>

                    <button
                      disabled={selectedChapterIndex === chapters.length - 1}
                      onClick={() => setSelectedChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 2: OFFICIAL DIGITIZED PDF VIEWER
               ---------------------------------------------------- */}
            {activeTab === 'pdf' && (
              <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
                
                {/* PDF Toolbar Controls */}
                <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 text-xs shrink-0">
                  
                  {/* Page Navigation */}
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      Page <span className="text-gold-400">{currentPage}</span> of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 space-x-2">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                      className="text-slate-300 hover:text-white cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] font-bold text-gold-400">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                      className="text-slate-300 hover:text-white cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Document Status */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Official Digitized Textbook</span>
                    </span>
                  </div>

                </div>

                {/* PDF High-Fidelity Book Page Renderer */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 p-8 sm:p-12 space-y-6 transition-transform duration-200"
                  >
                    {/* Header of Simulated Book Page */}
                    <div className="border-b-2 border-slate-800 pb-3 flex items-center justify-between text-xs text-slate-500 font-serif">
                      <span className="font-bold text-slate-800">{tObj(textbook.title)}</span>
                      <span className="font-mono font-bold">Page {currentPage}</span>
                    </div>

                    {/* Page Content depending on Current Page */}
                    {currentPage === 1 ? (
                      <div className="text-center py-10 space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#0A192F] text-white flex items-center justify-center shadow-lg border-2 border-gold-500">
                          <BookOpen className="w-10 h-10 text-gold-400" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">
                          {tObj(textbook.title)}
                        </h1>
                        <p className="text-sm font-bold text-slate-600">
                          {textbook.standard || 'इयत्ता १० वी'} • महाराष्ट्र राज्य पाठ्यपुस्तक निर्मिती व अभ्यासक्रम संशोधन मंडळ, पुणे
                        </p>
                        <div className="pt-4 inline-flex items-center space-x-2 text-xs font-bold text-brand-800 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-brand-600" />
                          <span>Maharashtra State Bureau of Textbook Production</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 font-serif text-slate-900 leading-relaxed">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">
                            {currentChapter?.unit || currentChapter?.part || `Chapter ${selectedChapterIndex + 1}`}
                          </span>
                          <h2 className="text-lg font-black text-[#0F172A]">
                            {tObj(currentChapter?.title)}
                          </h2>
                          {currentChapter?.author && (
                            <p className="text-xs text-slate-600 font-semibold">{currentChapter.author}</p>
                          )}
                        </div>

                        <div className="text-sm whitespace-pre-line leading-relaxed pt-2">
                          {tObj(currentChapter?.content)}
                        </div>

                        {currentChapter?.vocabulary && (
                          <div className="pt-4 border-t border-slate-200 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">शब्दार्थ व टिपा</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {currentChapter.vocabulary.map((voc, vi) => (
                                <div key={vi} className="bg-slate-50 p-2 rounded border border-slate-200">
                                  <b>{voc.word}</b>: {voc.meaning}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer of Book Page */}
                    <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-serif">
                      <span>महाराष्ट्र राज्य पाठ्यपुस्तक मंडळ (Balbharati)</span>
                      <span>{currentPage}</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ----------------------------------------------------
                TAB 3: SWADHYAY & EXERCISES (स्वाध्याय व भाषाभ्यास)
               ---------------------------------------------------- */}
            {activeTab === 'swadhyay' && (
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
                
                <div className="p-5 bg-gradient-to-r from-blue-900 to-[#0A192F] text-white rounded-2xl shadow-md space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-mono">
                      {lang === 'mr' ? 'स्वाध्याय व सराव कृती' : 'Interactive Swadhyay & Exercises'}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black">
                    {tObj(currentChapter?.title)} - {lang === 'mr' ? 'अभ्यास प्रश्न' : 'Practice Questions'}
                  </h2>
                </div>

                {/* Chapter Exercises List */}
                <div className="space-y-4">
                  {(currentChapter?.swadhyay || [
                    "पाठाचा मुख्य संदेश किंवा मध्यवर्ती कल्पना तुमच्या शब्दांत स्पष्ट करा.",
                    "खालील मुद्द्यांच्या आधारे आकृती पूर्ण करा आणि सराव करा.",
                    "पाठात आलेल्या कठीण शब्दांचे अर्थ व वाक्प्रचार वहीत लिहा."
                  ]).map((question, qi) => (
                    <div key={qi} className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {qi + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {question}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Student Workspace Textarea */}
                      <div className="pl-9 space-y-2">
                        <textarea
                          placeholder={lang === 'mr' ? 'आपले उत्तर किंवा सोडवलेले मुद्दे येथे लिहा...' : 'Type your notes or response here...'}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-brand-600 focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none transition-colors h-20"
                        />
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => triggerToast(lang === 'mr' ? 'उत्तर सेव्ह झाले!' : 'Response saved locally!')}
                            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            Save Answer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* General Language Study & Grammar Box */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-300 space-y-3">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <span>{lang === 'mr' ? 'भाषाभ्यास व व्याकरण विभाग' : 'Language Study & Grammar Corner'}</span>
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {textbook.subject === 'marathi'
                      ? 'समास (तत्पुरुष, द्वंद्व, द्विगु, कर्मधारय), अलंकार (अनुप्रास, यमक, उपमा, रूपक), शब्दसिद्धी (उपसर्गघटित, प्रत्ययघटित, अभ्यस्त), वाक्प्रचार व म्हणी.'
                      : textbook.subject === 'hindi'
                      ? 'कारक एवं कारक चिह्न, काल परिवर्तन, संधि और प्रकार, समास, छंद (दोहा, चौपाई, सोरठा), अलंकार, वाक्य शुद्धीकरण।'
                      : 'Parts of Speech, Figures of Speech (Simile, Metaphor, Alliteration), Word Building (Reduplication, Blending, Clipping, Acronyms), Degrees of Comparison.'}
                  </p>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}
