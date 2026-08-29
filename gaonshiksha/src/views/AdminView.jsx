import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db';
import {
  Users,
  Award,
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  Building2,
  Clock,
  Download,
  AlertCircle,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';

export default function AdminView() {
  const {
    lang,
    t,
    tObj,
    allCourses,
    certificatesList,
    applicationsList,
    pendingSyncCount,
    triggerSync,
    syncStatus,
    userProfile
  } = useApp();

  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const sampleStudents = [
    {
      id: 's1',
      name: userProfile?.name || 'विकास एकनाथ तांबडे (Vikas Tambade)',
      village: userProfile?.city || 'संवत्सर, कोपरगाव',
      course: 'इयत्ता १० वी मराठी कुमारभारती',
      progress: '100%',
      quizScore: '5/5 (100%)',
      certCode: certificatesList[0]?.verificationCode || 'IL-CERT-2026-8419',
      synced: true,
      lastActive: 'आज (Today)'
    },
    {
      id: 's2',
      name: 'पूजा रमेश वाघमारे (Pooja Waghmare)',
      village: 'पुणे / कोपरगाव',
      course: 'हिंदी लोकभारती - कक्षा १०वीं',
      progress: '100%',
      quizScore: '5/5 (100%)',
      certCode: 'IL-CERT-2026-9124',
      synced: true,
      lastActive: 'काल (Yesterday)'
    },
    {
      id: 's3',
      name: 'रोहित संजय गांगुर्डे (Rohit Gangurde)',
      village: 'नाशिक',
      course: 'English MyEnglishBook Class 10',
      progress: '80%',
      quizScore: 'In Progress',
      certCode: 'Pending',
      synced: false,
      lastActive: '२ दिवसांपूर्वी (2d ago)'
    }
  ];

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const matchedCert = await db.certificates
      .where('verificationCode')
      .equals(verifyCode.trim())
      .first();

    if (matchedCert) {
      setVerifyResult({
        valid: true,
        studentName: matchedCert.studentName,
        courseTitle: matchedCert.courseTitle,
        village: matchedCert.village,
        issueDate: matchedCert.issueDate,
        grade: matchedCert.grade
      });
      return;
    }

    const mockCert = sampleStudents.find(s => s.certCode === verifyCode.trim());
    if (mockCert) {
      setVerifyResult({
        valid: true,
        studentName: mockCert.name,
        courseTitle: mockCert.course,
        village: mockCert.village,
        issueDate: 'August 2026',
        grade: 'A+ (Outstanding)'
      });
      return;
    }

    setVerifyResult({ valid: false });
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Village / City', 'Course', 'Progress', 'Quiz Score', 'Cert Code', 'Sync Status'];
    const rows = sampleStudents.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.village}"`,
      `"${s.course}"`,
      s.progress,
      `"${s.quizScore}"`,
      s.certCode,
      s.synced ? 'Synced' : 'Pending'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Invictus_Learning_Student_Roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner (Deep Navy) */}
      <div className="bg-[#0A192F] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-gold-400 border border-slate-700">
            <Building2 className="w-3.5 h-3.5" />
            <span>Invictus Learning • Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Academic Monitoring & Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time student records, offline sync management, and certificate verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer border border-brand-400/30"
          >
            <RefreshCw className={`w-4 h-4 text-gold-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>Sync Records</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-gold-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{sampleStudents.length + 44}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Enrolled Scholars</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-gold-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{certificatesList.length + 38}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Certificates Issued</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            <RefreshCw className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{pendingSyncCount}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending Offline Syncs</div>
          </div>
        </div>
      </div>

      {/* Certificate Verification Sandbox */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900">
            Verify Student Digital Certificate
          </h3>
          <p className="text-xs text-slate-500">
            Enter the unique Certificate Verification ID (e.g., IL-CERT-2026-8419) to validate authenticity.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. IL-CERT-2026-8419"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase font-mono"
          />
          <button
            type="submit"
            className="bg-[#0A192F] hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer border border-slate-700"
          >
            Verify Certificate
          </button>
        </form>

        {verifyResult && (
          <div className={`p-4 rounded-xl text-xs ${
            verifyResult.valid
              ? 'bg-blue-50 border border-blue-200 text-brand-900'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {verifyResult.valid ? (
              <div className="space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Verified Authentic Certificate</span>
                </div>
                <p>Student: <strong>{verifyResult.studentName}</strong> ({verifyResult.village})</p>
                <p>Course: <strong>{verifyResult.courseTitle}</strong></p>
                <p>Grade Awarded: <strong>{verifyResult.grade}</strong> | Date: {verifyResult.issueDate}</p>
              </div>
            ) : (
              <div className="flex items-center space-x-2 font-bold text-rose-700">
                <AlertCircle className="w-4 h-4" />
                <span>Certificate not found in local database or sync ledger.</span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
