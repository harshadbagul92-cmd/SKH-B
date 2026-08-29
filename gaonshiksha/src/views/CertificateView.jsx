import React, { useState } from 'react';
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
  CheckCircle2,
  Shield
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
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Background Canvas
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 297, 210, 'F');

      // Outer Navy Border
      doc.setDrawColor(10, 25, 47); // Navy #0A192F
      doc.setLineWidth(3);
      doc.rect(8, 8, 281, 194);

      // Inner Gold Accent Border
      doc.setDrawColor(250, 204, 21); // Yellow Gold #FACC15
      doc.setLineWidth(1);
      doc.rect(12, 12, 273, 186);

      // Corner flourishes
      doc.setFillColor(29, 78, 216); // Royal Blue #1D4ED8
      doc.circle(12, 12, 4, 'F');
      doc.circle(285, 12, 4, 'F');
      doc.circle(12, 198, 4, 'F');
      doc.circle(285, 198, 4, 'F');

      // Header: Academy Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(10, 25, 47);
      doc.text('INVICTUS LEARNING ACADEMY', 148.5, 30, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('Accredited Offline-First Digital Curriculum & Skill Certification', 148.5, 37, { align: 'center' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(29, 78, 216);
      doc.text('CERTIFICATE OF ACADEMIC ACHIEVEMENT', 148.5, 54, { align: 'center' });

      // Body text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('This is officially presented to acknowledge that', 148.5, 68, { align: 'center' });

      // Student Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(10, 25, 47);
      doc.text(cert.studentName || 'Student Name', 148.5, 82, { align: 'center' });

      // Underline
      doc.setDrawColor(250, 204, 21);
      doc.setLineWidth(0.8);
      doc.line(70, 86, 227, 86);

      // Details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`of ${cert.village || 'Maharashtra, India'}, has successfully completed and demonstrated proficiency in:`, 148.5, 96, { align: 'center' });

      // Course Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(29, 78, 216);
      doc.text(cert.courseTitle || 'Curriculum Course', 148.5, 108, { align: 'center' });

      // Score and Grade
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Exam Evaluation Score: ${cert.score || '5/5 (100%)'}  |  Grade Awarded: ${cert.grade || 'A+ (Outstanding)'}`, 148.5, 118, { align: 'center' });

      // Bottom Metadata Grid
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      // Left Column: Issue Date
      doc.text(`Date of Issuance: ${cert.issueDate || '2026'}`, 25, 160);
      doc.text(`Certificate ID: ${cert.verificationCode || 'IL-CERT-2026'}`, 25, 167);

      // Right Column: Signatures
      doc.setFont('helvetica', 'bold');
      doc.text('Dr. S. K. Bagul', 230, 158);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Director of Academic Certification', 230, 164);
      doc.text('Invictus Learning Trust', 230, 169);

      doc.setDrawColor(148, 163, 184);
      doc.line(220, 152, 275, 152);

      // Footer
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
    <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-gold-600" />
            <span>{t('certificate.title')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            My Verified Skill Certificates
          </h1>
        </div>

        {currentCert && (
          <button
            onClick={() => handleDownloadPDF(currentCert)}
            disabled={downloading}
            className="flex items-center space-x-2 bg-[#0A192F] hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-transform active:scale-95 cursor-pointer border border-slate-700"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>
              {downloading ? 'Generating PDF...' : t('certificate.download_pdf')}
            </span>
          </button>
        )}
      </div>

      {certificatesList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl sm:rounded-3xl p-10 text-center border border-slate-200 space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center mx-auto border border-blue-100">
            <Award className="w-8 h-8 text-gold-500" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            No Certificates Earned Yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Complete all lessons in a course and pass the 5-question certification quiz to unlock your verifiable PDF certificate.
          </p>
          <button
            onClick={() => setActiveView('courses')}
            className="inline-flex items-center space-x-2 bg-[#0A192F] hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow cursor-pointer"
          >
            <span>Browse Courses & E-Books</span>
          </button>
        </div>
      ) : (
        /* Certificate Viewer & Selector */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Certificate List / Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Earned Certificates ({certificatesList.length})
            </h3>

            <div className="space-y-2.5">
              {certificatesList.map((cert) => {
                const isSelected = currentCert && currentCert.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {cert.verificationCode}
                      </span>
                      <span className="text-[10px] font-bold text-brand-700 bg-blue-100 px-2 py-0.5 rounded">
                        {cert.grade}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {cert.courseTitle}
                    </h4>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{cert.studentName}</span>
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Realistic Certificate Canvas Preview */}
          <div className="lg:col-span-2 space-y-4">
            {currentCert && (
              <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border-4 border-[#0A192F] shadow-xl relative overflow-hidden space-y-6">
                
                {/* Inner Gold Border */}
                <div className="absolute inset-2 border-2 border-gold-500 pointer-events-none rounded-xl" />

                {/* Top Certificate Header */}
                <div className="text-center space-y-1 relative z-10 pt-2">
                  <div className="inline-flex items-center space-x-2 text-slate-900 font-black text-base sm:text-xl tracking-tight uppercase">
                    <Shield className="w-6 h-6 text-brand-600 fill-brand-600/20" />
                    <span>Invictus Learning Academy</span>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    Accredited Offline-First Digital Curriculum & Skill Certification
                  </p>
                </div>

                {/* Certificate Award Title */}
                <div className="text-center space-y-2 relative z-10">
                  <h2 className="text-xl sm:text-2xl font-black text-brand-700 tracking-tight">
                    CERTIFICATE OF ACADEMIC ACHIEVEMENT
                  </h2>
                  <p className="text-xs text-slate-600 italic">
                    This is officially presented to acknowledge that
                  </p>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 border-b-2 border-gold-500 pb-2 max-w-md mx-auto">
                    {currentCert.studentName}
                  </div>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto pt-1 leading-relaxed">
                    of <strong className="text-slate-800">{currentCert.village}</strong>, has successfully completed and demonstrated proficiency in the curriculum:
                  </p>
                  <div className="text-base sm:text-lg font-black text-brand-800 pt-1">
                    {currentCert.courseTitle}
                  </div>
                </div>

                {/* Score & Evaluation Badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-around text-center text-xs relative z-10 max-w-md mx-auto">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Score
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      {currentCert.score}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Grade
                    </span>
                    <span className="font-black text-brand-700 text-sm">
                      {currentCert.grade}
                    </span>
                  </div>
                </div>

                {/* Bottom Signatures & Verification */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left relative z-10 items-end">
                  
                  {/* Issue Date */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      Issue Date
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {currentCert.issueDate}
                    </span>
                  </div>

                  {/* Verification QR / Code */}
                  <div className="text-center sm:text-left space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      Verification ID
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-700">
                      {currentCert.verificationCode}
                    </span>
                  </div>

                  {/* Authorized Signature */}
                  <div className="text-right space-y-0.5 col-span-2 sm:col-span-1">
                    <div className="font-serif italic font-bold text-slate-900 text-sm">
                      Dr. S. K. Bagul
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">
                      Director of Certification
                    </span>
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
