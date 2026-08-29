import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, Download, CheckCircle, Database } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, lang, t, isPackDownloaded, downloadFullPack } = useApp();

  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          
          <div className="flex items-center space-x-2 text-slate-800">
            {!isOnline ? (
              <span className="flex items-center text-amber-800 font-semibold">
                <WifiOff className="w-4 h-4 mr-1 text-amber-700 shrink-0" />
                {t('app.offline_banner')}
              </span>
            ) : (
              <span className="flex items-center text-slate-700">
                <Database className="w-4 h-4 mr-1 text-emerald-600 shrink-0" />
                {lang === 'mr'
                  ? 'स्थानिक डेटाबेस: सर्व धडे आणि प्रश्नमंजुषा तुमच्या उपकरणावर उपलब्ध आहेत.'
                  : 'Local IndexedDB Active: All learning materials stored directly on this device.'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {isPackDownloaded ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {t('home.pack_downloaded')}
              </span>
            ) : (
              <button
                onClick={downloadFullPack}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                {t('home.download_pack')}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
