import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import {
  Award,
  Download,
  ShieldCheck,
  CheckCircle,
  Share2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  QrCode,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export default function CertificateView() {
  const { lang, t, tObj, certificatesList, setActiveView, userProfile } = useApp();
  const [selectedCert, setSelectedCert] = useState(certificatesList[0] || null);
  const [downloading, setDownloading] = useState(false);

  const currentCert = selectedCert || certificatesList[0];

  const handleDownloadPDF = (cert) => {
    if (!cert) return;
    setDownloading(true);

    try {
      // Create landscape A4 PDF: 297mm x 210mm
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Background Canvas
      doc.setFillColor(255, 253, 247);
      doc.rect(0, 0, 297, 210, 'F');

      // Ornate Border
      doc.setDrawColor(234, 88, 12); // Brand Orange
      doc.setLineWidth(2.5);
      doc.rect(8, 8, 281, 194);

      doc.setDrawColor(5, 150, 105); // Emerald Green
      doc.setLineWidth(0.8);
      doc.rect(12, 12, 273, 186);

      // Corner flourishes
      doc.setFillColor(234, 88, 12);
      doc.circle(12, 12, 4, 'F');
      doc.circle(285, 12, 4, 'F');
      doc.circle(12, 198, 4, 'F');
      doc.circle(285, 198, 4, 'F');

      // Header: Academy Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(120, 53, 15); // Dark Earth
      doc.text('INVICTUS LEARNING • SKILL CERTIFICATION ACADEMY', 148.5, 28, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Vocational Skills, Digital Competence & Employment Mission', 148.5, 34, { align: 'center' });

      // Title: Certificate of Competence
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(234, 88, 12);
      doc.text('CERTIFICATE OF VOCATIONAL COMPETENCE', 148.5, 52, { align: 'center' });

      // Subtitle
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      doc.text('This is to officially certify that', 148.5, 64, { align: 'center' });

      // Student Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(15, 23, 42);
      doc.text(cert.studentName || userProfile.name, 148.5, 78, { align: 'center' });

      // Underline under student name
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.8);
      doc.line(60, 82, 237, 82);

      // Address / Village / City
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(`Location: ${cert.village || userProfile.city || userProfile.village || 'Maharashtra'}`, 148.5, 88, { align: 'center' });

      // Course text
      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85);
      doc.text('has successfully completed the comprehensive training curriculum and practical assessment for:', 148.5, 98, { align: 'center' });

      // Course Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(5, 150, 105);
      const titleStr = typeof cert.courseTitle === 'object' ? (cert.courseTitle.en || cert.courseTitle.mr || cert.courseTitle.hi) : (cert.courseTitle || 'Skill Development');
      doc.text(titleStr.toUpperCase(), 148.5, 112, { align: 'center' });

      // Score and Grade Banner Box
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.5);
      doc.roundedRect(80, 122, 137, 16, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(146, 64, 14);
      doc.text(`Assessment Score: ${cert.score || '100%'}   |   Grade: ${cert.grade || 'A+ (Exemplary)'}`, 148.5, 132, { align: 'center' });

      // Verification Code & Date (Left Bottom)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Certificate Verification ID: ${cert.verificationCode}`, 25, 160);
      doc.text(`Issue Date: ${cert.issueDate || 'August 29, 2026'}`, 25, 166);
      doc.text(`Status: Digitally Verified & Locally Stored`, 25, 172);

      // Gold Seal Graphic (Center-Right)
      doc.setDrawColor(217, 119, 6);
      doc.setFillColor(245, 158, 11);
      doc.circle(225, 165, 16, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('OFFICIAL SEAL', 225, 163, { align: 'center' });
      doc.text('INVICTUS', 225, 168, { align: 'center' });

      // Signatures (Right Bottom)
      doc.setDrawColor(148, 163, 184);
      doc.line(160, 185, 210, 185);
      doc.line(230, 185, 280, 185);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Authorized Instructor', 185, 190, { align: 'center' });
      doc.text('Director, Invictus Academy', 255, 190, { align: 'center' });

      // QR Code representation text
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Scan QR / Verify at: https://invictuslearning.edu/verify/${cert.verificationCode}`, 25, 190);

      // Save PDF
      doc.save(`Invictus_Certificate_${cert.verificationCode}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{t('certificate.title')}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
            {lang === 'mr'
              ? 'माझी कौशल्य प्रमाणपत्रे'
              : lang === 'hi'
              ? 'मेरे कौशल प्रमाणपत्र'
              : 'My Verified Skill Certificates'}
          </h1>
        </div>

        {currentCert && (
          <button
            onClick={() => handleDownloadPDF(currentCert)}
            disabled={downloading}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading
                ? lang === 'mr' ? 'तयार होत आहे...' : lang === 'hi' ? 'तैयार हो रहा है...' : 'Generating PDF...'
                : t('certificate.download_pdf')}
            </span>
          </button>
        )}
      </div>

      {certificatesList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            {lang === 'mr'
              ? 'अद्याप कोणतेही प्रमाणपत्र प्राप्त नाही'
              : lang === 'hi'
              ? 'अभी तक कोई प्रमाणपत्र अर्जित नहीं हुआ'
              : 'No Certificates Earned Yet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'mr'
              ? 'कोणताही कोर्स पूर्ण करा आणि ५-प्रश्नांची चाचणी उत्तीर्ण होऊन तात्काळ अधिकृत डिजिटल प्रमाणपत्र मिळवा.'
              : lang === 'hi'
              ? 'कोई भी कोर्स पूरा करें और ५-प्रश्नों की क्विज़ उत्तीर्ण कर तुरंत आधिकारिक डिजिटल प्रमाणपत्र प्राप्त करें।'
              : 'Complete all lessons in a course and pass the 5-question certification quiz to unlock your verifiable PDF certificate.'}
          </p>
          <button
            onClick={() => setActiveView('courses')}
            className="inline-flex items-center space-x-2 bg-brand-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow cursor-pointer"
          >
            <span>{t('course.title')}</span>
          </button>
        </div>
      ) : (
        /* Certificate Viewer & Selector */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Certificate List / Selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {lang === 'mr' ? 'प्राप्त प्रमाणपत्रे' : lang === 'hi' ? 'अर्जित प्रमाणपत्र' : 'Earned Certificates'} ({certificatesList.length})
            </h3>

            <div className="space-y-3">
              {certificatesList.map((cert) => {
                const isSelected = currentCert && currentCert.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {cert.verificationCode}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {cert.grade || 'A+'}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2">
                      {typeof cert.courseTitle === 'object' ? tObj(cert.courseTitle) : cert.courseTitle}
                    </h4>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Interactive Certificate Canvas Preview */}
          <div className="lg:col-span-2 space-y-4">
            {currentCert && (
              <div className="bg-[#fffdf7] border-4 border-double border-amber-600 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-900 space-y-6">
                
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <GraduationCap className="w-96 h-96 text-slate-900" />
                </div>

                {/* Top Border Header */}
                <div className="text-center space-y-1 relative z-10 border-b border-amber-200 pb-4">
                  <div className="inline-flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Invictus Learning Academy</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-900 tracking-tight">
                    {t('certificate.title')}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {t('certificate.subtitle')}
                  </p>
                </div>

                {/* Awardee Body */}
                <div className="text-center space-y-3 relative z-10 py-2">
                  <p className="text-xs italic text-slate-600">
                    {t('certificate.awarded_to')}
                  </p>
                  
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide border-b-2 border-amber-500 pb-2 inline-block px-8">
                    {currentCert.studentName || userProfile.name}
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {currentCert.village || userProfile.city || userProfile.village}
                  </p>

                  <p className="text-xs text-slate-700 pt-2">
                    {t('certificate.completion_text')}
                  </p>

                  <h3 className="text-base sm:text-xl font-black text-emerald-800">
                    {typeof currentCert.courseTitle === 'object' ? tObj(currentCert.courseTitle) : currentCert.courseTitle}
                  </h3>

                  {/* Score & Grade pill */}
                  <div className="inline-flex items-center space-x-3 bg-amber-100/80 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 mt-2">
                    <span>{t('quiz.score')}: {currentCert.score}</span>
                    <span>•</span>
                    <span>{t('certificate.grade')}: {currentCert.grade}</span>
                  </div>
                </div>

                {/* Bottom Verifiable Metadata & Seal */}
                <div className="border-t border-amber-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs">
                  
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="font-mono text-[11px] font-bold text-slate-700">
                      {t('certificate.verification_id')}: <span className="text-brand-700 font-black">{currentCert.verificationCode}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {t('certificate.issue_date')}: {currentCert.issueDate}
                    </div>
                    <div className="text-emerald-700 font-semibold text-[11px] flex items-center justify-center sm:justify-start space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'mr' ? 'डिजिटल स्वाक्षरीकृत व पडताळणीयोग्य' : lang === 'hi' ? 'डिजिटल हस्ताक्षरित एवं सत्यापित' : 'Digitally Signed & Locally Verified'}</span>
                    </div>
                  </div>

                  {/* Seal Stamp */}
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-600 bg-amber-50 flex flex-col items-center justify-center text-amber-800 text-[9px] font-black text-center shadow-inner shrink-0 p-1">
                    <ShieldCheck className="w-5 h-5 text-amber-600 mb-0.5" />
                    <span>INVICTUS</span>
                    <span className="text-[8px] font-semibold text-amber-700">VERIFIED</span>
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
