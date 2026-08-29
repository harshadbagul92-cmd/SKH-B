import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Zap,
  Layers,
  UserCheck
} from 'lucide-react';

export default function LanguageSelectView() {
  const { lang, setLang, confirmLanguageSelection, currentUser, t } = useApp();
  const [selected, setSelected] = useState(lang || 'en');

  const languages = [
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      tagline: 'Global & Technical Communication',
      greeting: 'Welcome to Invictus Learning',
      badge: 'International Standard',
      icon: '🇬🇧',
      accentColor: 'from-blue-600 to-indigo-700',
      borderActive: 'border-blue-500 ring-2 ring-blue-400/40 bg-blue-50/50'
    },
    {
      id: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      tagline: 'राष्ट्रभाषा एवं डिजिटल कौशल शिक्षा',
      greeting: 'इन्व्हिक्टस लर्निंग में आपका स्वागत है',
      badge: 'अखिल भारतीय भाषा',
      icon: '🇮🇳',
      accentColor: 'from-amber-600 to-orange-600',
      borderActive: 'border-orange-500 ring-2 ring-orange-400/40 bg-orange-50/50'
    },
    {
      id: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      tagline: 'मातृभाषेत शिका आणि पुढे व्हा',
      greeting: 'इन्व्हिक्टस लर्निंगमध्ये आपले स्वागत आहे',
      badge: 'स्थानिक बोली व सोपे धडे',
      icon: '🚩',
      accentColor: 'from-orange-600 to-amber-700',
      borderActive: 'border-amber-600 ring-2 ring-amber-500/40 bg-amber-50/50'
    }
  ];

  const handleSelect = (langId) => {
    setSelected(langId);
    setLang(langId);
  };

  const handleContinue = () => {
    confirmLanguageSelection(selected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="max-w-4xl mx-auto w-full pt-4 sm:pt-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 mb-4 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-lg font-black tracking-tight text-white">
              Invictus Learning
            </span>
            <span className="block text-[10px] text-orange-300 font-semibold uppercase tracking-wider">
              {t('brand.tagline_short')}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-200 mt-2 mb-3">
          {t('lang_select.title')}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
          {t('lang_select.subtitle')}
        </p>

        {currentUser && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>
              {selected === 'mr'
                ? `लॉगिन केलेले विद्यार्थी: ${currentUser.name}`
                : selected === 'hi'
                ? `लॉगिन किए गए छात्र: ${currentUser.name}`
                : `Logged in as: ${currentUser.name}`}
            </span>
          </div>
        )}
      </div>

      {/* Language Cards Grid */}
      <div className="max-w-4xl mx-auto w-full my-8 relative z-10">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold text-center mb-6">
          {t('lang_select.select_prompt')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {languages.map((item) => {
            const isChosen = selected === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border text-left ${
                  isChosen
                    ? 'bg-slate-900/90 border-brand-500 ring-2 ring-brand-500/50 shadow-2xl scale-102 -translate-y-1'
                    : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700 shadow-md hover:scale-101'
                }`}
              >
                {/* Check badge if selected */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl filter drop-shadow">{item.icon}</span>
                  {isChosen ? (
                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center text-slate-500">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 my-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {item.nativeName}
                    </span>
                    {item.name !== item.nativeName && (
                      <span className="text-xs font-bold text-slate-400">
                        ({item.name})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-orange-300/90 font-medium">
                    {item.tagline}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-400 italic bg-white/5 p-2 rounded-xl border border-white/5">
                    "{item.greeting}"
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wide text-slate-400 bg-slate-800/90 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isChosen ? 'text-brand-400' : 'text-slate-500'
                    }`}
                  >
                    {isChosen ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-10 flex flex-col items-center justify-center space-y-3">
          <button
            onClick={handleContinue}
            className="w-full max-w-md bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-black text-base sm:text-lg py-4 px-8 rounded-2xl shadow-xl shadow-brand-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-3 cursor-pointer group"
          >
            <span>{t('lang_select.continue_btn')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <p className="text-xs text-slate-400 text-center">
            {currentUser
              ? selected === 'mr'
                ? 'तुमचे सत्र सुरू आहे, थेट डॅशबोर्डवर नेले जाईल.'
                : selected === 'hi'
                ? 'आपका सत्र सक्रिय है, सीधे डैशबोर्ड पर जाएंगे।'
                : 'Active session found — routing directly to Dashboard.'
              : selected === 'mr'
              ? 'पुढील स्क्रीनवर विद्यार्थी लॉगिन किंवा मोफत नोंदणी करा.'
              : selected === 'hi'
              ? 'अगली स्क्रीन पर छात्र लॉगिन या निःशुल्क पंजीकरण करें।'
              : 'Proceed to Student Login or Free Registration.'}
          </p>
        </div>
      </div>

      {/* Bottom Footer Feature Badges */}
      <div className="max-w-4xl mx-auto w-full pt-4 pb-2 border-t border-slate-800/80 text-center relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400 font-medium">
          <span className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>100% Offline-First PWA</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Trilingual (EN / HI / MR)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Accredited Skill Certifications</span>
          </span>
        </div>
      </div>
    </div>
  );
}
