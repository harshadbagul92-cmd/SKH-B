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
  ShieldCheck
} from 'lucide-react';

export default function OpportunitiesView() {
  const {
    lang,
    t,
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
    name: userProfile.name,
    village: userProfile.village,
    phone: userProfile.phone,
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
      name: userProfile.name,
      village: userProfile.village,
      phone: userProfile.phone,
      notes: lang === 'mr' ? 'मी हा अभ्यासक्रम पूर्ण केला असून काम करण्यास उत्सुक आहे.' : 'I have completed this skill course and eager to join.'
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedOppForApply) return;

    const newApp = {
      oppId: selectedOppForApply.id,
      oppTitle: selectedOppForApply.title,
      organization: selectedOppForApply.organization,
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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          <span>{lang === 'mr' ? 'स्थानिक रोजगार व अप्रेंटिस मंच' : 'Local Career Board'}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
          {t('opportunity.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t('opportunity.subtitle')}
        </p>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp) => {
          const unlocked = isCourseCompleted(opp.requiredCourseId);
          const applied = isAlreadyApplied(opp.id);

          return (
            <div
              key={opp.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                unlocked
                  ? 'border-emerald-200/90 shadow-sm hover:shadow-md ring-1 ring-emerald-100'
                  : 'border-slate-200 opacity-90'
              }`}
            >
              <div className="space-y-4">
                
                {/* Status Badge & Type */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    {opp.type}
                  </span>

                  {unlocked ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {t('opportunity.unlocked')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      <Lock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      {lang === 'mr' ? 'कोर्स पूर्ण करणे आवश्यक' : 'Course Required'}
                    </span>
                  )}
                </div>

                {/* Job Title & Organization */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {opp.title[lang] || opp.title.mr}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-brand-700 font-bold mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.organization[lang] || opp.organization.mr}</span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">{opp.stipend}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{opp.location[lang] || opp.location.mr}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{opp.openings} {lang === 'mr' ? 'जागा उपलब्ध' : 'Openings'}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{opp.deadline}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {opp.description[lang] || opp.description.mr}
                </p>

                {/* Contact Person */}
                {opp.contactPerson && (
                  <p className="text-[11px] text-slate-500 italic">
                    {lang === 'mr' ? 'संपर्क:' : 'Contact:'} {opp.contactPerson}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                {applied ? (
                  <div className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('opportunity.applied')}</span>
                  </div>
                ) : unlocked ? (
                  <button
                    onClick={() => handleOpenApplyModal(opp)}
                    className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('opportunity.apply_now')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCourseId(opp.requiredCourseId);
                      setActiveView('lesson');
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-brand-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
                  >
                    <span>
                      {lang === 'mr'
                        ? `अनलॉक करण्यासाठी '${opp.requiredCourseTitle.mr}' शिका`
                        : `Complete '${opp.requiredCourseTitle.en}' to unlock`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {selectedOppForApply && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {lang === 'mr' ? 'स्थानिक रोजगार अर्ज' : 'Offline Job Application'}
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {selectedOppForApply.title[lang] || selectedOppForApply.title.mr}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedOppForApply.organization[lang] || selectedOppForApply.organization.mr}
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'mr' ? 'विद्यार्थ्याचे नाव' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={applyForm.name}
                  onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'mr' ? 'गाव / तालुका' : 'Village / Taluka'}
                </label>
                <input
                  type="text"
                  required
                  value={applyForm.village}
                  onChange={e => setApplyForm({ ...applyForm, village: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'mr' ? 'मोबाईल नंबर' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={applyForm.phone}
                  onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'mr' ? 'संदेश / अनुभव' : 'Experience / Note'}
                </label>
                <textarea
                  rows="2"
                  value={applyForm.notes}
                  onChange={e => setApplyForm({ ...applyForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-200 text-[11px] text-brand-900">
                {t('opportunity.applied_queued')}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOppForApply(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow transition-transform active:scale-95"
                >
                  {lang === 'mr' ? 'अर्ज जमा करा (ऑफलाइन)' : 'Submit Application (Offline)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
