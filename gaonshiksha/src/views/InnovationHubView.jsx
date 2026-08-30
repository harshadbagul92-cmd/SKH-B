import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SubmitInnovationModal from '../components/SubmitInnovationModal';
import InnovationDetailModal from '../components/InnovationDetailModal';
import RecruiterActionModal from '../components/RecruiterActionModal';
import CompanyRegisterModal from '../components/CompanyRegisterModal';
import {
  Lightbulb,
  Search,
  Filter,
  Plus,
  Briefcase,
  DollarSign,
  Building2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Download,
  Lock,
  Unlock,
  Award,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Receipt,
  FileCheck
} from 'lucide-react';

export default function InnovationHubView() {
  const {
    lang,
    t,
    tObj,
    currentUser,
    allInnovations,
    allCollaborationOffers,
    allSponsoredBounties,
    allCompanies,
    activeCompanyUser,
    isRecruiterMode,
    toggleRecruiterMode,
    respondToCollaborationOffer,
    logoutCompany
  } = useApp();

  // Navigation Tabs: 'feed' | 'recruiter' | 'bounties' | 'my_offers'
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');

  // Modal States
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedInnovationForDetail, setSelectedInnovationForDetail] = useState(null);
  const [selectedInnovationForOffer, setSelectedInnovationForOffer] = useState(null);
  const [initialOfferAction, setInitialOfferAction] = useState('internship');

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const domainFilterList = [
    { id: 'all', label: { en: 'All Domains', hi: 'सभी क्षेत्र', mr: 'सर्व क्षेत्र' } },
    { id: 'agritech', label: { en: 'Agritech', hi: 'कृषि तकनीक', mr: 'कृषी तंत्रज्ञान' } },
    { id: 'iot_embedded', label: { en: 'IoT & Embedded', hi: 'IoT सिस्टम', mr: 'IoT व एम्बेडेड' } },
    { id: 'ai_ml', label: { en: 'AI & ML', hi: 'AI / ML', mr: 'AI व ML' } },
    { id: 'robotics', label: { en: 'Robotics', hi: 'रोबोटिक्स', mr: 'रोबोटिक्स' } },
    { id: 'renewable_energy', label: { en: 'Clean Energy', hi: 'स्वच्छ ऊर्जा', mr: 'अक्षय ऊर्जा' } },
    { id: 'web_mobile', label: { en: 'Web & Apps', hi: 'वेब / ऍप्स', mr: 'वेब व ॲप्स' } }
  ];

  // Filter Innovations
  const filteredInnovations = allInnovations.filter(innov => {
    const matchesDomain = selectedDomain === 'all' || innov.domain === selectedDomain;
    const matchesStage = selectedStage === 'all' || innov.stage === selectedStage;
    const q = searchQuery.toLowerCase().trim();
    const titleStr = (tObj(innov.title) || '').toLowerCase();
    const studentStr = (innov.studentName || '').toLowerCase();
    const cityStr = (innov.studentCity || '').toLowerCase();
    const matchesSearch = !q || titleStr.includes(q) || studentStr.includes(q) || cityStr.includes(q);
    return matchesDomain && matchesStage && matchesSearch;
  });

  // Calculate Metrics
  const totalProjects = allInnovations.length;
  const totalOffersCount = allCollaborationOffers.length;
  const totalBountiesSum = allSponsoredBounties.reduce((sum, b) => sum + (b.bountyAmount || 0), 0);
  const myOffers = allCollaborationOffers.filter(
    o => o.studentEmail === currentUser?.email || o.studentName === currentUser?.name
  );

  const handleOpenOfferModal = (innov, action = 'internship') => {
    setSelectedInnovationForOffer(innov);
    setInitialOfferAction(action);
  };

  const handleRespondOffer = async (offerId, status) => {
    const res = await respondToCollaborationOffer(offerId, status);
    if (res.success) {
      triggerToast(
        status === 'accepted'
          ? (lang === 'mr' ? 'प्रस्ताव स्वीकारला! उद्योग प्रतिनिधीचा संपर्क क्रमांक अनलॉक झाला.' : 'Offer Accepted! Direct corporate contact details unlocked.')
          : (lang === 'mr' ? 'प्रस्ताव नाकारला.' : 'Offer Declined.')
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-gold-500 text-navy-950 font-black text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border-2 border-navy-950">
          <CheckCircle2 className="w-4 h-4 text-navy-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <SubmitInnovationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <InnovationDetailModal
        isOpen={Boolean(selectedInnovationForDetail)}
        innovation={selectedInnovationForDetail}
        onClose={() => setSelectedInnovationForDetail(null)}
        onOpenRecruiterAction={handleOpenOfferModal}
      />

      <RecruiterActionModal
        isOpen={Boolean(selectedInnovationForOffer)}
        innovation={selectedInnovationForOffer}
        initialAction={initialOfferAction}
        onClose={() => setSelectedInnovationForOffer(null)}
      />

      <CompanyRegisterModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

      {/* 1. Header Banner & Executive Stats */}
      <div className="bg-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden space-y-6">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-mono shadow-xs">
                Open-Access Matchmaking Hub
              </span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded font-mono">
                No Score Restrictions • Direct Industry Connect
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'mr'
                ? 'इनोव्हेशन व टॅलेंट मॅचमेकिंग केंद्र'
                : lang === 'hi'
                ? 'इनोवेशन एवं टैलेंट मैचमेकिंग हब'
                : 'Innovation & Talent Matchmaking Hub'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {lang === 'mr'
                ? 'सर्व विद्यार्थ्यांसाठी खुला मंच: आपले प्रकल्प प्रकाशित करा, उद्योग भागीदारांकडून प्रायोजकत्व व इंटर्नशिप मिळवा.'
                : 'Publish student prototypes, unlock corporate prototype sponsorships, and connect directly with verified hiring partners.'}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-3 bg-[#0097A7] hover:bg-teal-600 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-2 border border-teal-400 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-gold-400" />
              <span>{lang === 'mr' ? 'प्रकल्प प्रकाशित करा' : 'Publish Your Innovation'}</span>
            </button>

            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center space-x-2 border border-white/20 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-gold-400" />
              <span>{activeCompanyUser ? activeCompanyUser.companyName : 'Recruiter Portal'}</span>
            </button>
          </div>

        </div>

        {/* Executive Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-center">
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Innovations</span>
            <span className="text-xl font-black text-white">{totalProjects} Live</span>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Verified Companies</span>
            <span className="text-xl font-black text-emerald-400">{allCompanies.length + 8} Active</span>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Corporate Offers Sent</span>
            <span className="text-xl font-black text-gold-400">{totalOffersCount} Offers</span>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Prize Bounties</span>
            <span className="text-xl font-black text-white">₹{totalBountiesSum.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* 2. Navigation Tabs (4 Core Views) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border cursor-pointer flex items-center space-x-2 ${
            activeTab === 'feed'
              ? 'bg-[#0A192F] text-white border-slate-900 shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          <Lightbulb className={`w-4 h-4 ${activeTab === 'feed' ? 'text-gold-400' : 'text-slate-500'}`} />
          <span>Innovation Showcase ({filteredInnovations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bounties')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border cursor-pointer flex items-center space-x-2 ${
            activeTab === 'bounties'
              ? 'bg-[#0A192F] text-white border-slate-900 shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          <DollarSign className={`w-4 h-4 ${activeTab === 'bounties' ? 'text-gold-400' : 'text-emerald-600'}`} />
          <span>Industry Bounties ({allSponsoredBounties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recruiter')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border cursor-pointer flex items-center space-x-2 ${
            activeTab === 'recruiter'
              ? 'bg-[#0A192F] text-white border-slate-900 shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeTab === 'recruiter' ? 'text-gold-400' : 'text-slate-500'}`} />
          <span>Corporate & Recruiter Portal</span>
        </button>

        <button
          onClick={() => setActiveTab('my_offers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border cursor-pointer flex items-center space-x-2 ${
            activeTab === 'my_offers'
              ? 'bg-[#0A192F] text-white border-slate-900 shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          <Briefcase className={`w-4 h-4 ${activeTab === 'my_offers' ? 'text-gold-400' : 'text-slate-500'}`} />
          <span>My Offers & Placements</span>
          {myOffers.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.2 rounded-full">
              {myOffers.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================
          TAB 1: INNOVATION SHOWCASE FEED
         ======================================================== */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ideas, hardware, student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none transition-all"
              />
            </div>

            {/* Domain Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1">
              {domainFilterList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedDomain === d.id
                      ? 'bg-brand-600 text-white border-brand-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {tObj(d.label)}
                </button>
              ))}
            </div>

          </div>

          {/* Innovation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInnovations.map((innov) => (
              <div
                key={innov.id}
                className="bg-white rounded-3xl border border-slate-300 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group hover:border-brand-500"
              >
                
                {/* Top Card Banner */}
                <div>
                  <div className="p-6 bg-[#0097A7] text-white relative">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-mono shadow-xs">
                        {tObj(innov.domainLabel)}
                      </span>
                      <span className="text-[10px] font-bold text-white/90 bg-black/20 px-2.5 py-0.5 rounded border border-white/20 font-mono">
                        {tObj(innov.stageLabel)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black mt-3 leading-snug text-white">
                      {tObj(innov.title)}
                    </h3>

                    {/* Author Tag */}
                    <div className="flex items-center space-x-2 mt-2 text-xs text-white/90 font-medium">
                      <span className="font-bold text-gold-300">{innov.studentName}</span>
                      <span>•</span>
                      <span>{innov.studentCity}</span>
                    </div>
                  </div>

                  {/* Card Body (Tier 1 Public Teaser) */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3">
                      {tObj(innov.abstract)}
                    </p>

                    {/* Tech Snippets */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Primary Hardware & Frameworks
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1 font-mono">
                        {innov.technicalSpecs?.hardware || 'ESP32, MicroPython, Solar Power Relays'}
                      </div>
                    </div>

                    {/* Funding / Grant Needed */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 font-semibold">Target Prototype Grant:</span>
                      <span className="font-black text-brand-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {innov.fundingNeeded ? `₹${innov.fundingNeeded.toLocaleString('en-IN')}` : 'Mentorship / Open'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: 2-Tier Inspection & Recruiter Action Buttons */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedInnovationForDetail(innov)}
                    className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 border border-slate-300 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Abstract & Tech</span>
                  </button>

                  <button
                    onClick={() => handleOpenOfferModal(innov, 'internship')}
                    className="py-3 px-3 bg-[#0A192F] hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-gold-400" />
                    <span>Offer / Sponsor →</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: INDUSTRY BOUNTIES & SPONSORED CHALLENGES
         ======================================================== */}
      {activeTab === 'bounties' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-gradient-to-r from-blue-900 to-navy-950 text-white p-6 rounded-3xl border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-mono">
                Commercial Problem Statements
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Corporate Prize Bounties & Paid Prototype Grants
              </h2>
              <p className="text-xs text-slate-300">
                Solve verified engineering challenges posted by top enterprises to win cash prizes and pre-placement internship offers.
              </p>
            </div>

            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer shrink-0"
            >
              Post Commercial Bounty (For Companies)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allSponsoredBounties.map((bounty) => (
              <div
                key={bounty.id}
                className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 sm:p-7 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{bounty.companyLogo || '🏢'}</span>
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{bounty.companyName}</span>
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Enterprise Sponsor</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Prize Bounty</span>
                      <span className="text-lg font-black text-emerald-600 font-mono">₹{bounty.bountyAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#0F172A] leading-snug">
                    {tObj(bounty.title)}
                  </h3>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {tObj(bounty.problemDescription)}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-800">Deliverables Expected:</div>
                    <div className="text-[11px] text-slate-600">{bounty.deliverables}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    Deadline: <span className="text-slate-900">{bounty.deadline}</span>
                  </div>

                  <button
                    onClick={() => {
                      triggerToast('Solution workspace activated for this commercial challenge!');
                    }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    Submit Solution Prototype →
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 3: CORPORATE & RECRUITER PORTAL
         ======================================================== */}
      {activeTab === 'recruiter' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Recruiter Banner */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-black text-[#0F172A]">
                    Talent Discovery & Corporate Recruitment
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    Verified Partner Network
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Discover self-taught innovators, filter by tech stack, and issue direct pre-placement internship offers.
                </p>
              </div>

              {activeCompanyUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    Logged in as: <b>{activeCompanyUser.companyName}</b>
                  </span>
                  <button
                    onClick={logoutCompany}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCompanyModalOpen(true)}
                  className="px-5 py-2.5 bg-[#0A192F] hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  Register Company Credentials →
                </button>
              )}
            </div>

            {/* Recruiter Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 text-xs block">1. Unlock Tier 2 Schematics</span>
                <p className="text-[11px] text-slate-600">Access full GitHub repositories, circuit diagrams, and working models upon inquiry.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 text-xs block">2. Direct Contact Exchange</span>
                <p className="text-[11px] text-slate-600">Instantly schedule interviews and lab visits once the student accepts your proposal.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 text-xs block">3. Automated 8% Facilitation</span>
                <p className="text-[11px] text-slate-600">Seamless platform ledger and tax-compliant invoice generation for corporate CSR/R&D grants.</p>
              </div>
            </div>
          </div>

          {/* List of Registered Partner Companies */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-xs p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Verified Enterprise Hiring Partners
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allCompanies.map((comp) => (
                <div key={comp.email} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">{comp.companyName}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">{comp.industry}</span>
                  <div className="text-[11px] font-bold text-brand-800">
                    Hiring: {Array.isArray(comp.hiringRoles) ? comp.hiringRoles.join(', ') : 'Interns'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 4: MY OFFERS & PLACEMENTS LEDGER
         ======================================================== */}
      {activeTab === 'my_offers' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
                  Student Matchmaking & Offer Hub
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Review formal internship offers, prototype grants, and mentorship proposals from verified companies.
                </p>
              </div>
              <span className="bg-gold-500 text-navy-950 text-xs font-black px-3 py-1 rounded-xl">
                {myOffers.length} Offers Received
              </span>
            </div>

            {myOffers.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-black text-slate-800">No Corporate Proposals Yet</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Publish your innovative project ideas and hardware prototypes in the showcase to receive recruiter offers!
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-xl shadow cursor-pointer"
                >
                  Publish Your First Project →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myOffers.map((offer) => {
                  const isAccepted = offer.status === 'accepted';
                  const isDeclined = offer.status === 'declined';

                  return (
                    <div
                      key={offer.id}
                      className={`p-5 rounded-2xl border-2 space-y-4 transition-all ${
                        isAccepted
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : isDeclined
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-blue-200 shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-sm text-slate-900">{offer.companyName}</span>
                            <span className="text-[10px] font-black uppercase bg-brand-100 text-brand-800 px-2 py-0.2 rounded font-mono">
                              {offer.type}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium">
                            {offer.recruiterName} ({offer.recruiterEmail})
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${
                            isAccepted ? 'bg-emerald-100 text-emerald-800' : isDeclined ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isAccepted ? '✓ Offer Accepted' : isDeclined ? '✕ Declined' : 'Pending Response'}
                          </span>
                        </div>
                      </div>

                      {/* Offer Terms */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Stipend / Grant</span>
                          <span className="font-black text-[#0F172A]">
                            {offer.stipend ? `₹${offer.stipend.toLocaleString('en-IN')} / mo` : `₹${(offer.sponsorshipBudget || 0).toLocaleString('en-IN')} Grant`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Duration</span>
                          <span className="font-bold text-slate-800">{offer.duration}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Facilitation Fee</span>
                          <span className="font-bold text-slate-800">8% Platform Support</span>
                        </div>
                      </div>

                      {/* Proposal Message */}
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                        "{offer.message}"
                      </div>

                      {/* Unlocked Contact Details if Accepted */}
                      {isAccepted && (
                        <div className="p-3.5 bg-emerald-100/80 rounded-xl border border-emerald-300 text-xs text-emerald-950 font-bold flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Contact Channel Unlocked: Connect with {offer.recruiterName} at <b>{offer.recruiterEmail}</b></span>
                          </div>
                          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">Verified Match</span>
                        </div>
                      )}

                      {/* Accept / Decline Action Buttons */}
                      {!isAccepted && !isDeclined && (
                        <div className="flex items-center justify-end space-x-3 pt-1">
                          <button
                            onClick={() => handleRespondOffer(offer.id, 'declined')}
                            className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer border border-rose-200"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleRespondOffer(offer.id, 'accepted')}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md cursor-pointer border border-emerald-400 flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Offer & Unlock Contact →</span>
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
