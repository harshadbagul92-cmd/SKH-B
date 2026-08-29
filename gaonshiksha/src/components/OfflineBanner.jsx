import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, Download, CheckCircle, Database } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, lang, t, isPackDownloaded, downloadFullPack } = useApp();

  return (
    <div className="bg-slate-100/90 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center space-x-2 text-slate-800">
            {!isOnline ? (
              <span className="flex items-center text-navy-950 font-bold bg-gold-500/20 text-gold-700 px-2 py-0.5 rounded-md border border-gold-500/30">
                <WifiOff className="w-4 h-4 mr-1 text-gold-600 shrink-0" />
                <span>Offline Learning Active</span>
              </span>
            ) : (
              <span className="flex items-center text-slate-700 font-medium">
                <Database className="w-4 h-4 mr-1.5 text-brand-600 shrink-0" />
                {lang === 'mr'
                  ? 'स्थानिक डेटाबेस सक्रिय: सर्व पाठ्यपुस्तके, धडे व परीक्षा थेट तुमच्या उपकरणावर जतन आहेत.'
                  : lang === 'hi'
                  ? 'स्थानीय डेटाबेस सक्रिय: सभी ई-पुस्तकें, अध्याय एवं सूचनाएं आपके उपकरण पर सुरक्षित हैं।'
                  : 'Local IndexedDB Active: All textbooks, lessons, and exam notices are saved offline on this device.'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {isPackDownloaded ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-800 border border-blue-200">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-brand-600" />
                <span>Offline Database Cached</span>
              </span>
            ) : (
              <button
                onClick={downloadFullPack}
                className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-[#0A192F] hover:bg-brand-700 text-white shadow-xs transition-transform active:scale-95 cursor-pointer border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 mr-1 text-gold-400" />
                <span>Save All Offline</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
