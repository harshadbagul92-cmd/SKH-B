import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db';
import { syncService } from '../services/syncService';
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Send,
  Building2,
  Phone,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export default function OpportunitiesView() {
  const {
    lang,
    t,
    tObj,
    userProgressMap,
    certificatesList,
    userProfile,
    applicationsList,
    refreshData,
    setActiveView,
    setSelectedCourseId
  } = useApp();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppForApply, setSelectedOppForApply] = useState(null);
  const [applyForm, setApplyForm] = useState({
    name: userProfile?.name || '',
    village: userProfile?.city || userProfile?.village || '',
    phone: userProfile?.mobile || userProfile?.phone || '',
    notes: ''
  });
  const [justAppliedId, setJustAppliedId] = useState(null);

  useEffect(() => {
    async function loadOpps() {
      const list = await db.opportunities.toArray();
      setOpportunities(list);
    }
    loadOpps();
  }, []);

  const isCourseCompleted = (courseId) => {
    return (
      certificatesList.some(c => c.courseId === courseId) ||
      userProgressMap[courseId]?.isCompleted === true
    );
  };

  const isAlreadyApplied = (oppId) => {
    return applicationsList.some(a => a.oppId === oppId) || justAppliedId === oppId;
  };

  const handleOpenApplyModal = (opp) => {
    setSelectedOppForApply(opp);
    setApplyForm({
      name: userProfile?.name || '',
      village: userProfile?.city || userProfile?.village || '',
      phone: userProfile?.mobile || userProfile?.phone || '',
      notes:
        lang === 'mr'
          ? 'मी हा अभ्यासक्रम पूर्ण केला असून काम करण्यास उत्सुक आहे.'
          : lang === 'hi'
          ? 'मैंने यह कौशल पाठ्यक्रम पूरा कर लिया है और कार्य करने के लिए उत्सुक हूँ।'
          : 'I have completed this skill course and eager to join.'
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedOppForApply) return;

    const newApp = {
      oppId: selectedOppForApply.id,
      oppTitle: tObj(selectedOppForApply.title),
      organization: tObj(selectedOppForApply.organization),
      studentName: applyForm.name,
      village: applyForm.village,
      phone: applyForm.phone,
      notes: applyForm.notes,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const savedId = await db.applications.add(newApp);

    // Queue for backend sync
    await syncService.enqueue('JOB_APPLICATION', {
      appId: savedId,
      ...newApp
    });

    setJustAppliedId(selectedOppForApply.id);
    setSelectedOppForApply(null);
    await refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-orange-300 border border-white/10">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Invictus Career & Opportunity Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('opportunity.title')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {t('opportunity.subtitle')}
          </p>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => {
          const unlocked = isCourseCompleted(opp.requiredCourseId);
          const applied = isAlreadyApplied(opp.id);

          return (
            <div
              key={opp.id}
              className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                unlocked ? 'border-slate-200/90' : 'border-slate-200/60 opacity-90'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-brand-700 border border-orange-200 px-2.5 py-1 rounded-full">
                      {opp.type}
                    </span>
                    {unlocked ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {t('opportunity.unlocked')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        {lang === 'mr' ? 'कोर्स पूर्ण करा' : lang === 'hi' ? 'कोर्स पूरा करें' : 'Course Required'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {tObj(opp.title)}
                  </h3>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{tObj(opp.organization)}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-3 text-xs text-slate-700">
                  <p className="line-clamp-2 text-slate-600 leading-relaxed">
                    {tObj(opp.description)}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('opportunity.stipend')}:</span>
                      </span>
                      <span className="font-bold text-slate-900">{opp.stipend}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span>{t('opportunity.location')}:</span>
                      </span>
                      <span className="font-bold text-slate-900 line-clamp-1">{tObj(opp.location)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('opportunity.openings')}:</span>
                      </span>
                      <span className="font-bold text-slate-900">{opp.openings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0">
                {applied ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('opportunity.applied')}</span>
                  </div>
                ) : unlocked ? (
                  <button
                    onClick={() => handleOpenApplyModal(opp)}
                    className="w-full bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{t('opportunity.apply_now')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCourseId(opp.requiredCourseId);
                      setActiveView('lesson');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('opportunity.locked_hint')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {selectedOppForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 relative">
            <button
              onClick={() => setSelectedOppForApply(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-brand-700 px-2.5 py-0.5 rounded-full">
                {lang === 'mr' ? 'ऑफलाइन अर्ज प्रक्रिया' : lang === 'hi' ? 'ऑफलाइन आवेदन प्रक्रिया' : 'Offline Application'}
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">
                {tObj(selectedOppForApply.title)}
              </h3>
              <p className="text-xs text-slate-500">
                {tObj(selectedOppForApply.organization)}
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'विद्यार्थ्याचे नाव' : lang === 'hi' ? 'छात्र का नाम' : 'Student Name'}
                </label>
                <input
                  type="text"
                  required
                  value={applyForm.name}
                  onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'mr' ? 'गाव / शहर' : lang === 'hi' ? 'गाँव / शहर' : 'City / Village'}
                  </label>
                  <input
                    type="text"
                    required
                    value={applyForm.village}
                    onChange={e => setApplyForm({ ...applyForm, village: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'mr' ? 'मोबाईल नंबर' : lang === 'hi' ? 'मोबाइल नंबर' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={applyForm.phone}
                    onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'अतिरिक्त माहिती / संदेश' : lang === 'hi' ? 'अतिरिक्त संदेश' : 'Candidate Note'}
                </label>
                <textarea
                  rows={2}
                  value={applyForm.notes}
                  onChange={e => setApplyForm({ ...applyForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{t('opportunity.applied_queued')}</span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOppForApply(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {lang === 'mr' ? 'रद्द करा' : lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'mr' ? 'अर्ज सबमिट करा' : lang === 'hi' ? 'आवेदन जमा करें' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
