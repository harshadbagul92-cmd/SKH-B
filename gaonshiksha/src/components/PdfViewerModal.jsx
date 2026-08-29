import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  BookOpen,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function PdfViewerModal({ textbook, onClose }) {
  const { lang, tObj } = useApp();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!textbook) return null;

  const pdfUrl = textbook.pdfUrl || '/docs/textbooks/1002030024.pdf';
  const chapters = textbook.chapters || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      <div className={`w-full bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800 transition-all ${
        isFullscreen ? 'h-full max-w-none' : 'max-w-6xl h-[94vh]'
      }`}>
        
        {/* Top Control Header Bar */}
        <div className="bg-[#000083] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800">
          
          {/* Left: Title & Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#002EAF] flex items-center justify-center text-[#FFEB01] font-bold border border-[#FFEB01]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                {tObj(textbook.title)} - PDF Textbook Reader
              </h2>
              <p className="text-[10px] text-[#FFEB01] font-bold">
                {textbook.standard || '10th'} • {textbook.badge || 'Maharashtra State Board'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs text-slate-300 space-x-1">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] font-bold text-[#FFEB01]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer hidden md:flex"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Direct Open in New Tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 bg-[#002EAF] hover:bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow cursor-pointer border border-[#FFEB01]/40"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFEB01]" />
              <span>{lang === 'mr' ? 'नवीन टॅबमध्ये पहा' : 'Open in New Tab'}</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/80 hover:text-rose-200 text-slate-300 transition-colors cursor-pointer"
              title="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* PDF Document Viewing Body */}
        <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          
          {/* Embedded Viewer iFrame with Zoom transform */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto p-1">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title={tObj(textbook.title)}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full h-full border-none bg-slate-900 rounded-lg shadow-inner transition-transform duration-200"
            />
          </div>

          {/* Bottom Bar Indicator */}
          <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-2 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[#FFEB01]" />
              <span>
                {lang === 'mr'
                  ? `एकूण ${chapters.length} अध्याय उपलब्ध आहेत`
                  : lang === 'hi'
                  ? `कुल ${chapters.length} अध्याय उपलब्ध हैं`
                  : `Total ${chapters.length} Chapters Available`}
              </span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              PDF Source: <code className="text-[#FFEB01] font-mono">{pdfUrl}</code>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
