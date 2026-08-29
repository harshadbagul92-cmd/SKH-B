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
    return (
      justAppliedId === oppId ||
      applicationsList.some(a => a.oppId === oppId)
    );
  };

  const handleOpenApplyModal = (opp) => {
    setSelectedOppForApply(opp);
    setApplyForm({
      name: userProfile?.name || '',
      village: userProfile?.city || userProfile?.village || 'Maharashtra',
      phone: userProfile?.mobile || userProfile?.phone || '',
      notes: ''
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedOppForApply) return;

    const applicationRecord = {
      appId: `app-${Date.now()}`,
      oppId: selectedOppForApply.id,
      oppTitle: tObj(selectedOppForApply.title),
      organization: tObj(selectedOppForApply.organization),
      studentName: applyForm.name,
      village: applyForm.village,
      phone: applyForm.phone,
      notes: applyForm.notes,
      synced: false,
      timestamp: new Date().toISOString()
    };

    await db.applications.add(applicationRecord);
    await syncService.enqueue('JOB_APPLICATION', applicationRecord);

    setJustAppliedId(selectedOppForApply.id);
    setSelectedOppForApply(null);
    await refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Career & Apprenticeship Placement
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Local Career & Job Opportunities
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verified local apprenticeships, center jobs, and technical openings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
            <span>Verified Local Openings</span>
          </span>
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
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                unlocked ? 'border-slate-200 hover:border-brand-300' : 'border-slate-200/60 opacity-90'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 space-y-2.5 bg-slate-50/60">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-700 border border-blue-200 px-2.5 py-0.5 rounded-md font-mono">
                      {opp.type}
                    </span>
                    {unlocked ? (
                      <span className="text-[10px] font-bold text-navy-950 bg-gold-500 px-2.5 py-0.5 rounded-full flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-navy-950" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        <span>Course Required</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {tObj(opp.title)}
                  </h3>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{tObj(opp.organization)}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3 text-xs text-slate-700">
                  <p className="line-clamp-2 text-slate-600 leading-relaxed">
                    {tObj(opp.description)}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                        <span>Stipend / Salary:</span>
                      </span>
                      <span className="font-bold text-slate-900">{opp.stipend}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-gold-600" />
                        <span>Location:</span>
                      </span>
                      <span className="font-bold text-slate-900 line-clamp-1">{tObj(opp.location)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>Openings:</span>
                      </span>
                      <span className="font-bold text-slate-900">{opp.openings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0">
                {applied ? (
                  <div className="w-full bg-blue-50 border border-blue-200 text-brand-900 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Applied Successfully</span>
                  </div>
                ) : unlocked ? (
                  <button
                    onClick={() => handleOpenApplyModal(opp)}
                    className="w-full bg-[#0A192F] hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer border border-slate-700"
                  >
                    <span>Apply Directly</span>
                    <ArrowRight className="w-4 h-4 text-gold-400" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCourseId(opp.requiredCourseId);
                      setActiveView('lesson');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Complete Course to Unlock</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Application Modal */}
      {selectedOppForApply && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            
            <div className="bg-[#0A192F] text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded font-mono">
                  Job Application
                </span>
                <h3 className="text-base font-black mt-2 leading-snug">
                  {tObj(selectedOppForApply.title)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {tObj(selectedOppForApply.organization)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOppForApply(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={applyForm.name}
                  onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Village / City
                </label>
                <input
                  type="text"
                  required
                  value={applyForm.village}
                  onChange={(e) => setApplyForm({ ...applyForm, village: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={applyForm.phone}
                  onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cover Note / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={applyForm.notes}
                  onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                  placeholder="I have completed my certification..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedOppForApply(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 bg-[#0A192F] hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl shadow cursor-pointer border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5 text-gold-400" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
