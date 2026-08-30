import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  DollarSign,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  Sparkles,
  Send
} from 'lucide-react';

export default function RecruiterActionModal({ isOpen, onClose, innovation, initialAction = 'internship' }) {
  const { lang, t, tObj, activeCompanyUser, sendCollaborationOffer } = useApp();

  const [actionType, setActionType] = useState(initialAction);
  const [formData, setFormData] = useState({
    companyName: activeCompanyUser?.companyName || 'Mahindra Agri Solutions Ltd.',
    recruiterName: activeCompanyUser?.recruiterName || 'Dr. Ramesh Kulkarni (Head of R&D)',
    recruiterEmail: activeCompanyUser?.email || 'recruiter@mahindra-agri.com',
    roleTitle: 'IoT Embedded Systems Research Intern',
    stipend: '18000',
    sponsorshipBudget: '45000',
    duration: '3 Months (Hybrid / Onsite)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !innovation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.companyName.trim() || !formData.recruiterEmail.trim()) {
      setErrorMessage('Please provide company name and official work email.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      innovationId: innovation.id,
      studentEmail: innovation.studentEmail || innovation.studentId,
      studentName: innovation.studentName,
      companyName: formData.companyName,
      recruiterName: formData.recruiterName,
      recruiterEmail: formData.recruiterEmail,
      type: actionType,
      typeLabel:
        actionType === 'internship'
          ? `${formData.roleTitle} (₹${formData.stipend}/mo)`
          : actionType === 'sponsorship'
          ? `Prototype Grant & Sponsorship (₹${formData.sponsorshipBudget})`
          : `Industrial Project Collaboration & Mentorship`,
      stipend: actionType === 'internship' ? Number(formData.stipend) : 0,
      sponsorshipBudget: actionType === 'sponsorship' ? Number(formData.sponsorshipBudget) : 0,
      duration: formData.duration,
      message: formData.message || `We are deeply interested in your project "${tObj(innovation.title)}" and would love to collaborate.`
    };

    const res = await sendCollaborationOffer(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        lang === 'mr'
          ? 'आपला प्रस्ताव विद्यार्थ्याकडे पाठवला गेला आहे! विद्यार्थी स्वीकारताच थेट संपर्क सुरू होईल.'
          : 'Your offer has been submitted! Once the student accepts, contact channels and full IP documentation will unlock.'
      );
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setErrorMessage(res.message || 'Failed to submit offer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A192F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow-md border border-brand-400">
              <Briefcase className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Corporate Recruiter Action
                </h2>
                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Partner</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium line-clamp-1">
                Candidate: <b>{innovation.studentName}</b> • {tObj(innovation.title)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Status Alerts */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 font-bold flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Trigger Selector (3 Tabs) */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-300">
            <button
              type="button"
              onClick={() => setActionType('internship')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                actionType === 'internship'
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 font-bold'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-gold-400" />
              <span>Offer Internship / Job</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('sponsorship')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                actionType === 'sponsorship'
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 font-bold'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-gold-400" />
              <span>Sponsor Prototype</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('mentorship')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                actionType === 'mentorship'
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 font-bold'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-gold-400" />
              <span>Project Collab</span>
            </button>
          </div>

          {/* Company & Recruiter Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[10px]">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[10px]">
                Official Work Email (@company.com) *
              </label>
              <input
                type="email"
                required
                value={formData.recruiterEmail}
                onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          {/* Dynamic Action Fields based on Action Type */}
          {actionType === 'internship' && (
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-3">
              <div className="font-bold text-brand-900 text-[11px] uppercase tracking-wider">
                Internship / Employment Terms
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                    Monthly Stipend / Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-black"
                  />
                </div>
              </div>
            </div>
          )}

          {actionType === 'sponsorship' && (
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
              <div className="font-bold text-amber-950 text-[11px] uppercase tracking-wider">
                Prototype Grant & Sponsorship Terms
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                    Component & R&D Grant (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.sponsorshipBudget}
                    onChange={(e) => setFormData({ ...formData, sponsorshipBudget: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                    Engagement Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Proposal Message / Note */}
          <div>
            <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[10px]">
              Direct Message to Student Innovator
            </label>
            <textarea
              rows={3}
              placeholder="Detail your requirements, project scope, lab facility access, or interview date..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Monetization & Platform Facilitation Fee Transparency */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Platform Facilitation & Placement Ledger</span>
              <span className="bg-gold-500 text-navy-950 px-2 py-0.2 rounded text-[10px] font-mono">8% Success Fee</span>
            </div>
            <p>
              To ensure platform sustainability, an 8% facilitation fee is recorded only upon student offer acceptance and verified milestone commencement.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-black rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer border border-brand-400"
            >
              <Send className="w-3.5 h-3.5 text-gold-400" />
              <span>{isSubmitting ? 'Sending Proposal...' : 'Send Formal Offer →'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
