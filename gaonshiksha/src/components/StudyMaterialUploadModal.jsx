import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  X,
  Upload,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function StudyMaterialUploadModal({ isOpen, onClose, onMaterialUploaded }) {
  const { lang, currentUser } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Science',
    standard: 'Class 10',
    description: '',
    content: '',
    author: currentUser?.name || ''
  });

  const [isScanning, setIsScanning] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const subjects = [
    { id: 'Science', label: { mr: 'विज्ञान व तंत्रज्ञान (Science)', hi: 'विज्ञान एवं प्रौद्योगिकी', en: 'Science & Technology' } },
    { id: 'Mathematics', label: { mr: 'गणित (Mathematics)', hi: 'गणित (Maths)', en: 'Mathematics' } },
    { id: 'Social Science', label: { mr: 'इतिहास व भूगोल (Social Science)', hi: 'इतिहास एवं भूगोल', en: 'Social Science' } },
    { id: 'Languages', label: { mr: 'मराठी / हिंदी / इंग्रजी (Languages)', hi: 'भाषा (Languages)', en: 'Languages' } },
    { id: 'Vocational', label: { mr: 'व्यावसायिक कौशल्ये (Vocational Skills)', hi: 'व्यावसायिक कौशल', en: 'Vocational Skills' } },
    { id: 'Agriculture', label: { mr: 'शेती व कृषी तंत्रज्ञान (Agriculture)', hi: 'कृषि तकनीक', en: 'Agriculture & Rural Tech' } }
  ];

  const standards = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'MPSC / Gov Exam', 'Vocational / Diploma'];

  const handleScanAndUpload = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setModerationResult(null);

    if (!formData.title.trim() || (!formData.description.trim() && !formData.content.trim())) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया शीर्षक आणि अभ्यास साहित्य माहिती भरा.'
          : lang === 'hi'
          ? 'कृपया शीर्षक और अध्ययन सामग्री का विवरण भरें।'
          : 'Please provide Title and study material content.'
      );
      return;
    }

    setIsScanning(true);

    try {
      const response = await fetch('/api/study-materials/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          author: formData.author || currentUser?.name || 'Verified Community Educator',
          role: currentUser?.role || 'Educator'
        })
      });

      const data = await response.json();
      setIsScanning(false);

      if (response.ok && data.success) {
        setModerationResult(data.moderation);
        setSuccessMessage(
          lang === 'mr'
            ? 'अभिनंदन! जेमिनी AI शील्डने तुमच्या अभ्यास साहित्याची तपासणी करून ते विद्यार्थ्यांसाठी सुरक्षित असल्याचे प्रमाणित केले आहे.'
            : lang === 'hi'
            ? 'बधाई हो! जेमिनी AI शील्ड ने आपकी अध्ययन सामग्री को सत्यापित एवं सुरक्षित घोषित किया है।'
            : 'Verified & Approved! Gemini Protection Shield has validated your study notes for students.'
        );
        if (onMaterialUploaded) onMaterialUploaded(data.material);
      } else {
        setModerationResult(data.moderation || null);
        setErrorMessage(
          data.error ||
          (lang === 'mr'
            ? 'जेमिनी AI शील्डने हे साहित्य ब्लॉक केले आहे कारण यामध्ये दिशाभूल करणारे किंवा असुरक्षित घटक आढळले आहेत.'
            : 'Gemini Protection Shield blocked this upload: Content violates student safety standards.')
        );
      }
    } catch (err) {
      setIsScanning(false);
      setErrorMessage('Network error communicating with Gemini Protection server.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        
        {/* Header with Gemini Shield Badge */}
        <div className="bg-linear-to-r from-[#0097A7] to-[#00838F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-white shadow-md border border-white/30">
              <ShieldCheck className="w-6 h-6 text-[#FFEB01]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base md:text-lg">
                  {lang === 'mr' ? 'अभ्यास साहित्य अपलोड करा' : lang === 'hi' ? 'अध्ययन सामग्री अपलोड करें' : 'Upload Study Material'}
                </h3>
                <span className="text-[10px] font-black bg-[#FFEB01] text-[#0097A7] px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Gemini Protection</span>
                </span>
              </div>
              <p className="text-xs text-teal-100 mt-0.5">
                {lang === 'mr'
                  ? 'विद्यार्थ्यांच्या सुरक्षिततेसाठी जेमिनी AI द्वारे प्रत्येक साहित्याची पूर्व-तपासणी केली जाते.'
                  : 'All materials are pre-screened by Gemini AI to prevent misinformation and misguidance.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Gemini AI Shield Alert Notice */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-teal-900">
            <ShieldCheck className="w-5 h-5 text-[#0097A7] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {lang === 'mr' ? 'जेमिनी AI सुरक्षा कवच (Gemini Protection Shield):' : 'Gemini AI Protection Shield Active:'}
              </span>{' '}
              {lang === 'mr'
                ? 'विद्यार्थ्यांची फसवणूक किंवा चुकीची माहिती रोखण्यासाठी जेमिनी AI शैक्षणिक अचूकता, अभ्यासक्रम सुसंगतता आणि सुरक्षितता तपासेल.'
                : 'To protect rural students from fake leaks, scams, and incorrect notes, Gemini AI screens every submission before publishing.'}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleScanAndUpload} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'विषय (Subject)' : 'Subject'} *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-slate-50"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.label[lang] || s.label.en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'इयत्ता / श्रेणी (Standard / Target)' : 'Standard / Target'} *
                </label>
                <select
                  value={formData.standard}
                  onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-slate-50"
                >
                  {standards.map(std => (
                    <option key={std} value={std}>{std}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'mr' ? 'अभ्यास साहित्याचे शीर्षक (Title)' : 'Study Material Title'} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={lang === 'mr' ? 'उदा. इयत्ता १० वी विज्ञान: रासायनिक अभिक्रिया महत्त्वाच्या नोट्स' : 'e.g. Class 10 Science: Chemical Reactions Summary Guide'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-slate-50 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'mr' ? 'थोडक्यात माहिती व धडा क्रमांक (Description / Chapter)' : 'Description & Chapter Info'} *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={lang === 'mr' ? 'प्रकरणाचा सारांश, महत्त्वाचे सूत्र आणि बोर्ड परीक्षेसाठी मुद्दे' : 'Summary of chapter, important formulas, and solved examples'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-slate-50 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'mr' ? 'अभ्यास साहित्य मजकूर / नोट्स (Content / Notes / Formulas)' : 'Notes & Study Content'} *
              </label>
              <textarea
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={lang === 'mr' ? 'इथे सविस्तर शैक्षणिक माहिती, व्याख्या, सूत्रे, किंवा प्रश्नोत्तरे लिहा...' : 'Provide complete educational notes, definitions, formulas, or question-answers here...'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-slate-50 font-medium leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'mr' ? 'लेखक / मार्गदर्शक नाव (Author / Contributor Name)' : 'Author / Contributor Name'}
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder={currentUser?.name || 'Verified Teacher / Mentor Name'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-slate-50 font-medium"
              />
            </div>

            {/* Moderation Result Card (Live Gemini Shield Verdict) */}
            {moderationResult && (
              <div className={`p-4 rounded-2xl border ${moderationResult.isApproved ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'} space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {moderationResult.isApproved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-black text-xs uppercase tracking-wide">
                      {moderationResult.protectionBadge || `Gemini Shield: ${moderationResult.verdict}`}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white shadow-xs border">
                    Safety Score: {moderationResult.score}/100
                  </span>
                </div>

                <p className="text-xs font-medium">{moderationResult.feedbackForUploader}</p>

                {moderationResult.reasons && moderationResult.reasons.length > 0 && (
                  <ul className="text-[11px] list-disc list-inside space-y-0.5 opacity-90">
                    {moderationResult.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && !moderationResult && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isScanning}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#0097A7] hover:bg-[#00838F] rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-[#FFEB01]" />
                    <span>{lang === 'mr' ? 'Gemini AI तपासणी करत आहे...' : 'Gemini AI Scanning & Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#FFEB01]" />
                    <span>{lang === 'mr' ? 'Gemini तपासणी करून अपलोड करा' : 'Scan with Gemini & Upload'}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
