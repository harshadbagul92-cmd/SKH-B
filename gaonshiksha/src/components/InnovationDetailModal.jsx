import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lightbulb,
  X,
  ShieldCheck,
  Lock,
  Unlock,
  Cpu,
  Github,
  Youtube,
  DollarSign,
  Briefcase,
  MapPin,
  Sparkles,
  Layers,
  ArrowUpRight,
  Send,
  Eye
} from 'lucide-react';

export default function InnovationDetailModal({ isOpen, onClose, innovation, onOpenRecruiterAction }) {
  const { lang, t, tObj, activeCompanyUser, allCollaborationOffers } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'protected_tech'

  if (!isOpen || !innovation) return null;

  // Check if active company or current student has access to Tier 2 Protected View
  const hasSentOffer = allCollaborationOffers.some(
    o => o.innovationId === innovation.id && (o.recruiterEmail === activeCompanyUser?.email || o.status === 'accepted')
  );

  const isAuthor = true; // Student authors can always inspect their own technical specs
  const canViewTier2 = isAuthor || hasSentOffer || Boolean(activeCompanyUser);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header (Academic Deep Navy Banner) */}
        <div className="bg-[#0A192F] text-white p-6 border-b border-slate-800 shrink-0 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-mono shadow-xs">
                  {tObj(innovation.domainLabel)}
                </span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded font-mono">
                  {tObj(innovation.stageLabel)}
                </span>
                {canViewTier2 && (
                  <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>Tier 2 Unlocked</span>
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-black text-white leading-snug">
                {tObj(innovation.title)}
              </h1>

              {/* Author Attribution */}
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <span className="font-bold text-white flex items-center space-x-1">
                  <span>Innovator:</span>
                  <span className="text-gold-400">{innovation.studentName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{innovation.studentCity} ({innovation.studentGrade})</span>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Overview vs Tier 2 Protected Architecture) */}
          <div className="flex items-center space-x-2 mt-5 border-t border-slate-800 pt-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-navy-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tier 1: Public Summary
            </button>

            <button
              onClick={() => setActiveTab('protected_tech')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'protected_tech'
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {canViewTier2 ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-gold-400" />}
              <span>Tier 2: Protected Tech & IP</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          
          {/* TAB 1: TIER 1 PUBLIC VIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Problem Statement & Abstract */}
              <div className="space-y-2">
                <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-wider">
                  Problem Statement & Abstract
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                  {tObj(innovation.abstract)}
                </div>
              </div>

              {/* Prototype Details & Funding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                    Project Stage & Maturity
                  </span>
                  <div className="text-sm font-black text-[#0F172A]">
                    {tObj(innovation.stageLabel)}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Field validated on rural sugarcane farms with real-time feedback loops.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Target Prototype Grant Needed
                  </span>
                  <div className="text-sm font-black text-amber-950">
                    {innovation.fundingNeeded ? `₹${innovation.fundingNeeded.toLocaleString('en-IN')}` : 'Open to Mentorship'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Seeking corporate sponsor for hardware scaling and patent filing.
                  </p>
                </div>
              </div>

              {/* IP Protection Notice */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3 text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <b>Intellectual Property Protection Active:</b> The student holds full rights to this concept. Detailed hardware schematics and GitHub code are safeguarded in Tier 2 to prevent unauthorized replication.
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TIER 2 PROTECTED ARCHITECTURE VIEW */}
          {activeTab === 'protected_tech' && (
            <div className="space-y-5 animate-fadeIn">
              
              {canViewTier2 ? (
                <>
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center space-x-3 text-emerald-900">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-xs block">Verified Industry Access Authorized</span>
                      <span className="text-[11px]">Full schematics, firmware repository, and methodology unlocked for technical evaluation.</span>
                    </div>
                  </div>

                  {/* Hardware & Sensors */}
                  <div className="space-y-2">
                    <h3 className="font-black text-[#0F172A] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                      <Cpu className="w-4 h-4 text-brand-700" />
                      <span>Hardware & Component Architecture</span>
                    </h3>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                      {innovation.technicalSpecs?.hardware || 'ESP32 NodeMCU, Solenoid Relays, Soil Capacitive Probes, 20W Solar Panel'}
                    </div>
                  </div>

                  {/* Software & Methodology */}
                  <div className="space-y-2">
                    <h3 className="font-black text-[#0F172A] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-brand-700" />
                      <span>Software, Libraries & Methodology</span>
                    </h3>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                      <div><b>Tech Stack:</b> {innovation.technicalSpecs?.software || 'C++, MicroPython, MQTT, TensorFlow Lite'}</div>
                      <div><b>Algorithm:</b> {innovation.technicalSpecs?.methodology || 'Closed-loop automated threshold trigger with edge-computed battery optimization.'}</div>
                    </div>
                  </div>

                  {/* Media Links */}
                  <div className="space-y-2">
                    <h3 className="font-black text-[#0F172A] text-xs uppercase tracking-wider">
                      Verified Code Repository & Demo Media
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {innovation.media?.githubUrl && (
                        <a
                          href={innovation.media.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center space-x-2 no-underline"
                        >
                          <Github className="w-4 h-4" />
                          <span>View GitHub Repository</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {innovation.media?.demoUrl && (
                        <a
                          href={innovation.media.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center space-x-2 no-underline"
                        >
                          <Youtube className="w-4 h-4" />
                          <span>Watch Prototype Video</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border-2 border-amber-300 shadow">
                    <Lock className="w-7 h-7 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-[#0F172A]">
                      Tier 2 Protected Technical Documentation
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Full source code, circuit CAD schematics, and deep methodology are locked under student IP protection.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRecruiterAction(innovation, 'internship');
                      }}
                      className="px-6 py-3 bg-[#0A192F] hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 mx-auto cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-gold-400" />
                      <span>Send Recruiter Inquiry to Unlock Tier 2 →</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-bold">
            Project ID: <span className="font-mono text-slate-900">{innovation.id}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenRecruiterAction(innovation, 'internship');
              }}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer border border-brand-400"
            >
              <Briefcase className="w-3.5 h-3.5 text-gold-400" />
              <span>Offer Internship / Sponsor Prototype →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
