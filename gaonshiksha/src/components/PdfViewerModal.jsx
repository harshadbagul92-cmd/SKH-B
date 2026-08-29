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
  ExternalLink
} from 'lucide-react';

export default function PdfViewerModal({ textbook, onClose }) {
  const { lang, tObj } = useApp();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!textbook) return null;

  const pdfUrl = textbook.pdfUrl || '/docs/textbooks/1002030024.pdf';
  const chapters = textbook.chapters || [];

  return (
    <div className="fixed inset-0 z-50 bg-sky-950/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      <div className={`w-full bg-sky-50 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-sky-300 transition-all ${
        isFullscreen ? 'h-full max-w-none' : 'max-w-6xl h-[94vh]'
      }`}>
        
        {/* Top Control Header Bar (Light Blue Theme) */}
        <div className="bg-sky-600 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-sky-500 shadow-sm">
          
          {/* Left: Title & Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-700 flex items-center justify-center text-[#FFEB01] font-bold border border-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                {tObj(textbook.title)} - E-Textbook PDF Viewer
              </h2>
              <p className="text-[10px] text-[#FFEB01] font-extrabold tracking-wide">
                {textbook.standard || '10th'} Standard • {textbook.badge || 'Maharashtra State Board'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-sky-700 border border-sky-500 rounded-xl p-1 text-xs text-white space-x-1">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 rounded hover:bg-sky-800 text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] font-bold text-[#FFEB01]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1 rounded hover:bg-sky-800 text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white transition-colors cursor-pointer hidden md:flex border border-sky-500"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Direct Open in New Tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 bg-[#002EAF] hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow cursor-pointer border border-[#FFEB01]/40"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFEB01]" />
              <span>{lang === 'mr' ? 'नवीन टॅबमध्ये पहा' : lang === 'hi' ? 'नए टैब में देखें' : 'Open in New Tab'}</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-sky-700 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-sky-500"
              title="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* PDF Document Viewing Body (Light Blue Theme) */}
        <div className="flex-1 bg-sky-100/50 flex flex-col relative overflow-hidden">
          
          {/* Embedded Viewer iFrame with Zoom transform */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto p-1.5">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title={tObj(textbook.title)}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full h-full border border-sky-200 bg-white rounded-xl shadow-md transition-transform duration-200"
            />
          </div>

          {/* Bottom Bar Indicator (Light Blue) */}
          <div className="bg-sky-100 border-t border-sky-200 px-4 py-2 flex items-center justify-between text-xs text-sky-950 font-semibold">
            <span className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-sky-700" />
              <span>
                {lang === 'mr'
                  ? `एकूण ${chapters.length} अध्याय उपलब्ध आहेत`
                  : lang === 'hi'
                  ? `कुल ${chapters.length} अध्याय उपलब्ध हैं`
                  : `Total ${chapters.length} Chapters Available`}
              </span>
            </span>
            <span className="text-[11px] font-bold text-sky-800">
              PDF Path: <code className="text-sky-900 bg-sky-200/80 px-2 py-0.5 rounded font-mono">{pdfUrl}</code>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
