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
  FileCheck
} from 'lucide-react';

export default function CertificateView() {
  const { lang, t, certificatesList, setActiveView, userProfile } = useApp();
  const [selectedCert, setSelectedCert] = useState(certificatesList[0] || null);
  const [downloading, setDownloading] = useState(false);

  // If no certs exist yet, show demo / empty state with prompt
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

      // Background Cream Canvas
      doc.setFillColor(255, 253, 247);
      doc.rect(0, 0, 297, 210, 'F');

      // Ornate Border
      doc.setDrawColor(234, 88, 12); // Saffron
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
      doc.text('SATHI RURAL SKILLS & VOCATIONAL ACADEMY', 148.5, 28, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('SATHI Rural Livelihood & Skill Mission | Kopargaon, Maharashtra', 148.5, 34, { align: 'center' });

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

      // Address / Village
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(`Resident of: ${cert.village || userProfile.village}`, 148.5, 88, { align: 'center' });

      // Course text
      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85);
      doc.text('has successfully completed the comprehensive training curriculum and practical assessment for:', 148.5, 98, { align: 'center' });

      // Course Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(5, 150, 105);
      const titleStr = typeof cert.courseTitle === 'object' ? (cert.courseTitle.en || cert.courseTitle.mr) : cert.courseTitle;
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
      doc.text('KOPARGAON', 225, 168, { align: 'center' });

      // Signatures (Right Bottom)
      doc.setDrawColor(148, 163, 184);
      doc.line(160, 185, 210, 185);
      doc.line(230, 185, 280, 185);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Authorized Instructor', 185, 190, { align: 'center' });
      doc.text('Director, Rural Academy', 255, 190, { align: 'center' });

      // QR Code representation text
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Scan QR / Verify at: https://sathi-app.vercel.app/verify/${cert.verificationCode}`, 25, 190);

      // Save PDF
      doc.save(`SATHI_Certificate_${cert.verificationCode}.pdf`);
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
            {lang === 'mr' ? 'माझी कौशल्य प्रमाणपत्रे' : 'My Verified Skill Certificates'}
          </h1>
        </div>

        {currentCert && (
          <button
            onClick={() => handleDownloadPDF(currentCert)}
            disabled={downloading}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? (lang === 'mr' ? 'तयार होत आहे...' : 'Generating PDF...') : t('certificate.download_pdf')}</span>
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
            {lang === 'mr' ? 'अद्याप कोणतेही प्रमाणपत्र प्राप्त नाही' : 'No Certificates Earned Yet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'mr'
              ? 'कोणताही अभ्यासक्रम पूर्ण करा आणि ५-प्रश्नांची परीक्षा ६०% गुणांनी उत्तीर्ण होऊन तात्काळ प्रमाणपत्र मिळवा.'
              : 'Complete all lessons of a course and pass the 5-question certification quiz with 60%+ score to unlock your downloadable certificate.'}
          </p>
          <button
            onClick={() => setActiveView('courses')}
            className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition-transform active:scale-95"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{lang === 'mr' ? 'अभ्यासक्रम सुरू करा' : 'Browse Courses Now'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* List of Earned Certificates on Left */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === 'mr' ? 'प्राप्त झालेली प्रमाणपत्रे' : 'Earned Credentials'} ({certificatesList.length})
            </h2>

            {certificatesList.map(cert => {
              const isSelected = currentCert?.id === cert.id;
              const titleStr = typeof cert.courseTitle === 'object' ? (cert.courseTitle[lang] || cert.courseTitle.mr) : cert.courseTitle;

              return (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50/80 border-brand-500 shadow-md ring-2 ring-orange-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold font-mono bg-orange-100 text-brand-700 px-2 py-0.5 rounded">
                        {cert.verificationCode}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {titleStr}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {cert.issueDate} • {cert.grade}
                      </p>
                    </div>
                    <Award className="w-5 h-5 text-brand-600 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* High-Resolution Certificate Preview Canvas on Right */}
          {currentCert && (
            <div className="lg:col-span-2 space-y-4">
              
              {/* The Certificate Frame */}
              <div className="relative bg-[#fffdf7] border-[10px] border-double border-brand-700 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center overflow-hidden">
                
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <GraduationCap className="w-96 h-96 text-brand-900" />
                </div>

                {/* Top Badge & Seal */}
                <div className="flex items-center justify-between border-b border-orange-200 pb-4">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">
                      {t('certificate.subtitle')}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      साथी (SATHI) ग्रामीण कौशल्य संस्था
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-brand-600 flex items-center justify-center text-white font-black text-[9px] text-center p-1 shadow-md border-2 border-white">
                    SEAL OF SKILL
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {t('certificate.title')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-800 tracking-tight">
                    CERTIFICATE OF VOCATIONAL SKILL
                  </h2>
                </div>

                {/* Awarded to */}
                <div className="space-y-2 max-w-xl mx-auto">
                  <p className="text-xs italic text-slate-600">
                    {t('certificate.awarded_to')}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 border-b-2 border-dashed border-orange-300 pb-1">
                    {currentCert.studentName || userProfile.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentCert.village || userProfile.village}
                  </p>
                </div>

                {/* Completion Text & Course Name */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">
                    {t('certificate.completion_text')}
                  </p>
                  <div className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm sm:text-base px-6 py-2.5 rounded-2xl shadow">
                    {typeof currentCert.courseTitle === 'object'
                      ? (currentCert.courseTitle[lang] || currentCert.courseTitle.mr)
                      : currentCert.courseTitle}
                  </div>
                </div>

                {/* Score & Verification Info */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-orange-200 text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">{t('certificate.verification_id')}</span>
                    <span className="text-xs font-bold font-mono text-brand-700">{currentCert.verificationCode}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-semibold block">{t('certificate.grade')}</span>
                    <span className="text-xs font-bold text-emerald-700">{currentCert.grade || 'A+ (उत्कृष्ट)'}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-semibold block">{t('certificate.issue_date')}</span>
                    <span className="text-xs font-bold text-slate-800">{currentCert.issueDate}</span>
                  </div>
                </div>

                {/* Signatures & Security Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t('certificate.seal_text')} (Digitally Signed)</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-bold text-slate-800">संचालक, ग्रामीण तंत्रज्ञान केंद्र</div>
                    <div className="text-[10px] text-slate-500">कोपरगाव, अहमदनगर</div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleDownloadPDF(currentCert)}
                  disabled={downloading}
                  className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? (lang === 'mr' ? 'तयार होत आहे...' : 'Generating...') : t('certificate.download_pdf')}</span>
                </button>

                <button
                  onClick={() => setActiveView('opportunities')}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-transform active:scale-95"
                >
                  <span>{lang === 'mr' ? 'या प्रमाणपत्रावर नोकऱ्या पहा' : 'View Matching Jobs'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
