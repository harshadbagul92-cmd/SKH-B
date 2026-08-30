import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Mail,
  FileCheck,
  Briefcase,
  Sparkles
} from 'lucide-react';

export default function CompanyRegisterModal({ isOpen, onClose }) {
  const { lang, registerCompany, loginCompany, activeCompanyUser } = useApp();

  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    website: '',
    gstin: '',
    cin: '',
    industry: 'Agritech & Rural Engineering',
    hiringRoles: 'IoT Embedded Intern, Robotics Trainee, Firmware Engineer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const industryOptions = [
    'Agritech & Precision Agriculture',
    'Robotics & Hardware Manufacturing',
    'Renewable Energy & Solar Tech',
    'AI, Data Science & Software Engineering',
    'IoT & Embedded Systems',
    'Rural Development & Cleantech'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || (mode === 'register' && !formData.companyName.trim())) {
      setErrorMessage('Please provide all mandatory corporate details.');
      return;
    }

    setIsSubmitting(true);

    let res;
    if (mode === 'register') {
      res = await registerCompany({
        ...formData,
        hiringRoles: formData.hiringRoles.split(',').map(r => r.trim()).filter(Boolean)
      });
    } else {
      res = await loginCompany(formData.email, 'password123');
    }

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        mode === 'register'
          ? 'Company registered successfully with Verified Hiring Partner credentials!'
          : 'Welcome back! Recruiter discovery mode active.'
      );
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMessage(res.message || 'Authentication error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A192F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow-md border border-brand-400">
              <Building2 className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Corporate Recruiter Portal
                </h2>
                <span className="text-[10px] font-black bg-gold-500 text-navy-950 px-2 py-0.5 rounded-full font-mono">
                  Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Discover student innovators, sponsor prototypes, and hire top rural talent.
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

        {/* Form */}
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

          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-300">
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'register' ? 'bg-[#0A192F] text-white shadow' : 'text-slate-700'
              }`}
            >
              Register New Company
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'login' ? 'bg-[#0A192F] text-white shadow' : 'text-slate-700'
              }`}
            >
              Recruiter Sign In
            </button>
          </div>

          {/* Company Details */}
          {mode === 'register' && (
            <div>
              <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[10px]">
                Company / Legal Entity Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mahindra Agri Solutions Ltd."
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-600"
              />
            </div>
          )}

          {/* Official Work Email */}
          <div>
            <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[10px]">
              Official Work Email (@company.com) *
            </label>
            <input
              type="email"
              required
              placeholder="recruiter@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-600"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                    GSTIN / CIN Verification
                  </label>
                  <input
                    type="text"
                    placeholder="27AAACM1234F1Z8"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                  Industry Vertical
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-brand-600 cursor-pointer"
                >
                  {industryOptions.map((ind, idx) => (
                    <option key={idx} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                  Target Roles You Are Hiring For (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="IoT Intern, Hardware Trainee, AI Researcher"
                  value={formData.hiringRoles}
                  onChange={(e) => setFormData({ ...formData, hiringRoles: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>
            </>
          )}

          {/* Verified Partner Badge Benefits */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-[11px] text-blue-900 font-medium space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>Verified Corporate Hiring Partner Privileges</span>
            </div>
            <p>
              Directly contact student innovators, unlock Tier 2 technical source code and hardware schematics, and post commercial challenges to the student feed.
            </p>
          </div>

          {/* Submit Action */}
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
              className="px-6 py-2.5 bg-[#0A192F] hover:bg-brand-600 active:scale-[0.99] text-white font-black rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>{isSubmitting ? 'Authenticating...' : mode === 'register' ? 'Register Company & Verify →' : 'Access Recruiter Portal →'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
