import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Zap,
  Layers,
  UserCheck
} from 'lucide-react';

export default function LanguageSelectView() {
  const { lang, setLang, setHasSelectedSessionLang, currentUser, t } = useApp();
  const [selected, setSelected] = useState(lang || 'mr');

  const languages = [
    {
      id: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      tagline: 'मातृभाषेत शालेय अभ्यासक्रम व शासकीय भरती',
      greeting: 'इन्व्हिक्टस लर्निंगमध्ये आपले स्वागत आहे',
      badge: 'स्थानिक बोली व सोपे धडे',
      icon: '🚩',
      accentColor: 'from-blue-900 to-navy-950',
      borderActive: 'border-gold-500 ring-2 ring-gold-500/40 bg-slate-900'
    },
    {
      id: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      tagline: 'राष्ट्रभाषा, सामान्य अध्ययन एवं प्रतियोगी परीक्षा',
      greeting: 'इन्विक्टस लर्निंग में आपका स्वागत है',
      badge: 'अखिल भारतीय भाषा',
      icon: '🇮🇳',
      accentColor: 'from-blue-900 to-navy-950',
      borderActive: 'border-gold-500 ring-2 ring-gold-500/40 bg-slate-900'
    },
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      tagline: 'Global Communication & Academic Curriculum',
      greeting: 'Welcome to Invictus Learning',
      badge: 'SSC / NCERT Standard',
      icon: '🇬🇧',
      accentColor: 'from-blue-900 to-navy-950',
      borderActive: 'border-gold-500 ring-2 ring-gold-500/40 bg-slate-900'
    }
  ];

  const handleSelect = (langId) => {
    setSelected(langId);
    setLang(langId);
  };

  const handleContinue = () => {
    setLang(selected);
    setHasSelectedSessionLang(true);
  };

  return (
    <div className="min-h-screen bg-[#0097A7] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-[#FFEB01] selection:text-[#0097A7]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="max-w-4xl mx-auto w-full pt-4 sm:pt-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center space-x-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-800 mb-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow border border-brand-400/30">
            <Shield className="w-6 h-6 text-gold-400 fill-gold-400/20" />
          </div>
          <div className="text-left">
            <span className="text-lg font-black tracking-tight text-white">
              INVICTUS LEARNING
            </span>
            <span className="block text-[10px] text-gold-400 font-bold uppercase tracking-wider">
              Bridging Talent with Real-World Challenges
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-2 mb-2">
          {selected === 'mr'
            ? 'आपली पसंतीची भाषा निवडा'
            : selected === 'hi'
            ? 'अपनी पसंदीदा भाषा चुनें'
            : 'Select Your Preferred Study Language'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
          {selected === 'mr'
            ? 'सर्व ई-पाठ्यपुस्तके, नोट्स आणि परीक्षा सूचना आपल्या भाषेत उपलब्ध आहेत.'
            : selected === 'hi'
            ? 'सभी ई-पाठ्यपुस्तकें, नोट्स और परीक्षा सूचनाएं आपकी भाषा में उपलब्ध हैं।'
            : 'Access all Class 10th e-textbooks, revision notes, and exam alerts in your language.'}
        </p>

        {currentUser && (
          <div className="mt-3 inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3.5 py-1 rounded-full text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {selected === 'mr'
                ? `लॉगिन केलेले विद्यार्थी: ${currentUser.name}`
                : selected === 'hi'
                ? `लॉग इन छात्र: ${currentUser.name}`
                : `Logged in as: ${currentUser.name}`}
            </span>
          </div>
        )}
      </div>

      {/* Language Selection Grid */}
      <div className="max-w-4xl mx-auto w-full py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {languages.map((l) => {
            const isSelected = selected === l.id;
            return (
              <div
                key={l.id}
                onClick={() => handleSelect(l.id)}
                className={`group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-200 flex flex-col justify-between overflow-hidden border ${
                  isSelected
                    ? `${l.borderActive} shadow-2xl scale-102`
                    : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl shadow-sm">{l.icon}</span>
                    {isSelected ? (
                      <span className="flex items-center space-x-1 bg-gold-500 text-navy-950 font-black text-[11px] px-3 py-1 rounded-full animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700/60">
                        {l.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-2">
                      <span>{l.nativeName}</span>
                      <span className="text-xs font-semibold text-slate-400">({l.name})</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      {l.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <div className={`p-3 rounded-2xl text-xs font-semibold border ${
                    isSelected
                      ? 'bg-slate-950 border-slate-800 text-gold-400'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                  }`}>
                    <span className="italic block truncate">"{l.greeting}"</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Continue Action & Reassurance Badges */}
      <div className="max-w-2xl mx-auto w-full pb-6 text-center space-y-4 relative z-10">
        <button
          onClick={handleContinue}
          className="w-full bg-[#1D4ED8] hover:bg-[#2563EB] active:bg-[#1E40AF] text-white font-black text-base sm:text-lg py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3 cursor-pointer group border border-blue-400/30"
        >
          <span>
            {selected === 'mr' ? 'अभ्यास सुरू करा →' : selected === 'hi' ? 'अध्ययन शुरू करें →' : 'Continue to Dashboard →'}
          </span>
          <ArrowRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 font-semibold pt-1">
          <span className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-gold-400" />
            <span>100% Offline Capable</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Trilingual Interface</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Internet Needed</span>
          </span>
        </div>
      </div>
    </div>
  );
}
