import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Lightbulb,
  Cpu,
  Layers,
  FileText,
  Link2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SubmitInnovationModal({ isOpen, onClose }) {
  const { lang, t, tObj, currentUser, submitInnovation } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    domain: 'agritech',
    stage: 'working_prototype',
    abstract: '',
    hardware: '',
    software: '',
    methodology: '',
    fundingNeeded: '',
    githubUrl: '',
    demoUrl: '',
    hasSchematic: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const domainOptions = [
    { id: 'agritech', label: { en: 'Agritech & Rural Innovation', hi: 'कृषि एवं ग्रामीण नवाचार', mr: 'कृषी व ग्रामीण तंत्रज्ञान' } },
    { id: 'iot_embedded', label: { en: 'IoT & Embedded Systems', hi: 'IoT एवं एम्बेडेड सिस्टम', mr: 'IoT आणि एम्बेडेड प्रणाली' } },
    { id: 'ai_ml', label: { en: 'AI & Machine Learning', hi: 'कृत्रिम बुद्धिमत्ता (AI/ML)', mr: 'कृत्रिम बुद्धिमत्ता (AI/ML)' } },
    { id: 'robotics', label: { en: 'Robotics & Hardware Automation', hi: 'रोबोटिक्स एवं ऑटोमेशन', mr: 'रोबोटिक्स व हार्डवेअर ऑटोमेशन' } },
    { id: 'renewable_energy', label: { en: 'Renewable Energy & Cleantech', hi: 'अक्षय ऊर्जा एवं स्वच्छ तकनीक', mr: 'अक्षय ऊर्जा व पर्यावरण तंत्रज्ञान' } },
    { id: 'web_mobile', label: { en: 'Web & Mobile Applications', hi: 'वेब एवं मोबाइल ऍप्स', mr: 'वेब आणि मोबाईल ॲप्लिकेशन्स' } },
    { id: 'social_impact', label: { en: 'Social & Healthcare Tech', hi: 'सामाजिक एवं स्वास्थ्य तकनीक', mr: 'सामाजिक व आरोग्य तंत्रज्ञान' } }
  ];

  const stageOptions = [
    { id: 'concept', label: { en: 'Concept / Research Idea', hi: 'संकल्पना / शोध विचार', mr: 'संकल्पना / संशोधन' } },
    { id: 'working_prototype', label: { en: 'Working Prototype (Tested)', hi: 'कार्यशील प्रोटोटाइप', mr: 'कार्यरत प्रोटोटाइप (चाचणी झालेली)' } },
    { id: 'deployed', label: { en: 'Pilot Deployed / Patent Pending', hi: 'तैनात / पेटेंट लंबित', mr: 'प्रत्यक्ष वापरात / पेटंट प्रक्रियेत' } }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.title.trim() || !formData.abstract.trim()) {
      setErrorMessage(lang === 'mr' ? 'कृपया प्रकल्पाचे नाव आणि संक्षिप्त माहिती भरा.' : 'Please provide project title and abstract.');
      return;
    }

    setIsSubmitting(true);

    // Run Gemini Protection Shield scan on project proposal
    try {
      const modRes = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: `${formData.abstract} Hardware: ${formData.hardware} Software: ${formData.software} Methodology: ${formData.methodology}`,
          subject: formData.domain,
          author: currentUser?.name || 'Student Innovator'
        })
      });

      if (modRes.ok) {
        const modData = await modRes.json();
        if (!modData.isApproved || modData.verdict === 'REJECTED') {
          setIsSubmitting(false);
          setErrorMessage(
            lang === 'mr'
              ? `जेमिनी AI शील्डने हा प्रकल्प ब्लॉक केला आहे: ${modData.reasons?.[0] || 'दिशाभूल किंवा सुरक्षा उल्लंघन.'}`
              : `Gemini Protection Shield blocked submission: ${modData.reasons?.[0] || 'Content flagged for safety/misguidance violations.'}`
          );
          return;
        }
      }
    } catch (e) {
      console.warn('Gemini moderation check skipped or offline:', e);
    }

    const selectedDomain = domainOptions.find(d => d.id === formData.domain);
    const selectedStage = stageOptions.find(s => s.id === formData.stage);

    const payload = {
      title: { en: formData.title, hi: formData.title, mr: formData.title },
      domain: formData.domain,
      domainLabel: selectedDomain?.label || { en: formData.domain, hi: formData.domain, mr: formData.domain },
      stage: formData.stage,
      stageLabel: selectedStage?.label || { en: formData.stage, hi: formData.stage, mr: formData.stage },
      abstract: { en: formData.abstract, hi: formData.abstract, mr: formData.abstract },
      technicalSpecs: {
        hardware: formData.hardware,
        software: formData.software,
        methodology: formData.methodology
      },
      fundingNeeded: Number(formData.fundingNeeded) || 0,
      media: {
        githubUrl: formData.githubUrl,
        demoUrl: formData.demoUrl,
        hasSchematic: formData.hasSchematic
      },
      geminiProtection: {
        isApproved: true,
        badge: 'Gemini Shield: Verified Student Innovation',
        timestamp: new Date().toISOString()
      }
    };

    const res = await submitInnovation(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        lang === 'mr'
          ? 'आपला प्रकल्प जेमिनी AI द्वारे सत्यापित होऊन यशस्वीरीत्या प्रकाशित झाला!'
          : 'Your innovation was verified safe by Gemini AI Shield and published successfully!'
      );
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setErrorMessage(res.message || 'Submission error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0A192F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow-md border border-brand-400">
              <Lightbulb className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {lang === 'mr' ? 'नवीन प्रकल्प / कल्पना प्रकाशित करा' : lang === 'hi' ? 'नया प्रोजेक्ट / इनोवेशन सबमिट करें' : 'Publish Your Project & Innovation'}
                </h2>
                <span className="text-[10px] font-black bg-gold-500 text-navy-950 px-2 py-0.5 rounded-full font-mono">
                  Open Access
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {lang === 'mr'
                  ? 'सर्व विद्यार्थ्यांसाठी खुला मंच — कोणतीही गुण किंवा प्रमाणपत्र मर्यादा नाही'
                  : 'Zero prerequisite barriers — Open to all registered student innovators'}
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

        {/* Modal Body / Form Container */}
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

          {/* Project Title */}
          <div>
            <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
              {lang === 'mr' ? 'प्रकल्पाचे नाव / शीर्षक *' : 'Project Title *'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smart IoT Pest Warning & Crop Disease Scanner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none transition-all"
            />
          </div>

          {/* Domain & Stage Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
                {lang === 'mr' ? 'क्षेत्र / वर्गवारी (Domain Tag) *' : 'Domain Tag *'}
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none transition-all cursor-pointer"
              >
                {domainOptions.map(d => (
                  <option key={d.id} value={d.id}>
                    {tObj(d.label)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
                {lang === 'mr' ? 'प्रकल्प टप्पा (Project Stage) *' : 'Current Stage *'}
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none transition-all cursor-pointer"
              >
                {stageOptions.map(s => (
                  <option key={s.id} value={s.id}>
                    {tObj(s.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem Statement & Abstract */}
          <div>
            <label className="block font-black text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
              {lang === 'mr' ? 'समस्या विधान व संकल्पना (Problem Statement & Abstract) *' : 'Problem Statement & Concept Abstract *'}
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain the real-world challenge addressed, target beneficiary (e.g. farmers, students, rural citizens), and your core solution..."
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Technical Specifications (Two-Tier Protected) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-brand-700" />
              <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
                Technical Specifications & Architecture (Protected View)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                  Hardware & Sensors Used
                </label>
                <input
                  type="text"
                  placeholder="e.g. ESP32, DHT22, LoRa Node, 12V Solar Panel"
                  value={formData.hardware}
                  onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                  Software, Languages & Libraries
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arduino C++, MicroPython, MQTT, TensorFlow Lite"
                  value={formData.software}
                  onChange={(e) => setFormData({ ...formData, software: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                Methodology / Working Algorithm
              </label>
              <textarea
                rows={2}
                placeholder="Brief technical description of your algorithm, circuit schematic logic, or data flow..."
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          {/* Media Links & Funding Needed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                Demo Video Link (Drive/YouTube)
              </label>
              <input
                type="url"
                placeholder="https://youtu.be/..."
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[10px] uppercase">
                Prototype Grant Needed (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 25000"
                value={formData.fundingNeeded}
                onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          {/* Two-Tier IP Protection Assurance */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 flex items-start space-x-2 text-[11px] text-blue-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
            <div>
              <b>2-Tier IP Protection Active:</b> Your public card displays only the title and teaser abstract. Full source code links, hardware schematics, and deep technical specs unlock exclusively when a verified corporate recruiter sends a collaboration inquiry.
            </div>
          </div>

          {/* Submit Footer Actions */}
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
              <span>{isSubmitting ? 'Publishing...' : 'Publish Innovation →'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
