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

  // Sample Seeding Roster for Demo
  const sampleStudents = [
    {
      id: 's1',
      name: 'विकास एकनाथ तांबडे (Vikas Tambade)',
      village: 'संवत्सर, कोपरगाव',
      course: 'संगणक व डिजिटल साक्षरता',
      progress: '100%',
      quizScore: '5/5 (100%)',
      certCode: certificatesList[0]?.verificationCode || 'SATHI-KPG-2026-8419',
      synced: true,
      lastActive: 'आज (Today)'
    },
    {
      id: 's2',
      name: 'पूजा रमेश वाघमारे (Pooja Waghmare)',
      village: 'टाकळी, कोपरगाव',
      course: 'आधुनिक शिलाई व बुटीक व्यवसाय',
      progress: '100%',
      quizScore: '5/5 (100%)',
      certCode: 'SATHI-KPG-2026-9124',
      synced: true,
      lastActive: 'काल (Yesterday)'
    },
    {
      id: 's3',
      name: 'सचिन ज्ञानेश्वर कदम (Sachin Kadam)',
      village: 'येऊर, कोपरगाव',
      course: 'संगणक व डिजिटल साक्षरता',
      progress: '66%',
      quizScore: 'प्रलंबित (Pending)',
      certCode: '-',
      synced: false,
      lastActive: '२ दिवसांपूर्वी'
    },
    {
      id: 's4',
      name: 'मनिषा विठ्ठल सोनवणे (Manisha Sonawane)',
      village: 'काकडी, शिर्डी परिसर',
      course: 'आधुनिक शिलाई व बुटीक व्यवसाय',
      progress: '100%',
      quizScore: '4/5 (80%)',
      certCode: 'SATHI-KPG-2026-7831',
      synced: true,
      lastActive: 'आज (Today)'
    }
  ];

  const handleVerifyLookup = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const cleanCode = verifyCode.trim().toUpperCase();
    
    // Check in local certificates
    const foundCert = certificatesList.find(c => c.verificationCode?.toUpperCase() === cleanCode);
    const foundSample = sampleStudents.find(s => s.certCode?.toUpperCase() === cleanCode);

    if (foundCert) {
      setVerifyResult({
        valid: true,
        code: foundCert.verificationCode,
        name: foundCert.studentName,
        course: typeof foundCert.courseTitle === 'object' ? foundCert.courseTitle.mr : foundCert.courseTitle,
        date: foundCert.issueDate,
        grade: foundCert.grade || 'A+ (उत्कृष्ट)',
        score: foundCert.score
      });
    } else if (foundSample && foundSample.certCode !== '-') {
      setVerifyResult({
        valid: true,
        code: foundSample.certCode,
        name: foundSample.name,
        course: foundSample.course,
        date: '२९ ऑगस्ट २०२६',
        grade: 'A+ (उत्कृष्ट)',
        score: foundSample.quizScore
      });
    } else {
      setVerifyResult({
        valid: false,
        code: cleanCode
      });
    }
  };

  const exportRosterCSV = () => {
    const csvRows = [
      ['Student Name', 'Village', 'Course', 'Progress', 'Quiz Score', 'Certificate Code', 'Sync Status'],
      ...sampleStudents.map(s => [s.name, s.village, s.course, s.progress, s.quizScore, s.certCode, s.synced ? 'Synced' : 'Offline'])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SATHI_Kopargaon_Student_Roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>{t('admin.title')}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
            {lang === 'mr' ? 'कोपरगाव प्रशिक्षण केंद्र - प्रशासन डॅशबोर्ड' : 'Kopargaon Academy - Teacher & Admin Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportRosterCSV}
            className="flex items-center space-x-1.5 text-xs font-bold px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'mr' ? 'हजेरी पत्रक CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={triggerSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center space-x-1.5 text-xs font-bold px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{t('app.sync_now')}</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('admin.total_students')}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">४८ विद्यार्थी</div>
          <div className="text-[11px] text-slate-500">कोपरगाव तालुक्यातील ४ गावे</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('admin.total_completions')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">३९ पूर्ण</div>
          <div className="text-[11px] text-emerald-600 font-semibold">८१% उत्तीर्ण प्रमाण (Pass Rate)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'mr' ? 'जारी प्रमाणपत्रे' : 'Certificates Issued'}</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{34 + certificatesList.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold">QR पडताळणीसह</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('admin.pending_syncs')}</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-brand-600">{pendingSyncCount}</div>
          <div className="text-[11px] text-slate-500">स्थानिक रांगेत जतन (Local Queue)</div>
        </div>
      </div>

      {/* Certificate Verification Lookup Tool */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('admin.cert_verify_title')}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">
            {lang === 'mr' ? 'प्रमाणपत्र अधिकृतता पडताळणी टूल' : 'Official Certificate Verification Lookup'}
          </h3>
          <p className="text-xs text-slate-300">
            {lang === 'mr'
              ? 'प्रमाणपत्रावरील नोंदणी क्रमांक टाकून विद्यार्थ्याचे मूळ रेकॉर्ड तपासा.'
              : 'Enter verification code to instantly validate certificate credentials against institute database.'}
          </p>
        </div>

        <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            placeholder="उदा. GS-KPG-2026-8419"
            className="flex-1 px-4 py-3 text-xs sm:text-sm font-mono uppercase bg-slate-800 text-white border border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-slate-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow"
          >
            <Search className="w-4 h-4" />
            <span>{t('admin.verify_btn')}</span>
          </button>
        </form>

        {/* Verification Result Card */}
        {verifyResult && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm mt-4 animate-in fade-in duration-200 ${
              verifyResult.valid
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                : 'bg-rose-950/80 border-rose-500 text-rose-100'
            }`}
          >
            {verifyResult.valid ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t('admin.verified_valid')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-black/30 p-3 rounded-xl">
                  <div><strong className="text-slate-400">विद्यार्थी:</strong> {verifyResult.name}</div>
                  <div><strong className="text-slate-400">नोंदणी कोड:</strong> <span className="font-mono">{verifyResult.code}</span></div>
                  <div><strong className="text-slate-400">अभ्यासक्रम:</strong> {verifyResult.course}</div>
                  <div><strong className="text-slate-400">गुण व श्रेणी:</strong> {verifyResult.score} ({verifyResult.grade})</div>
                  <div><strong className="text-slate-400">जारी तारीख:</strong> {verifyResult.date}</div>
                  <div><strong className="text-slate-400">संस्था:</strong> कोपरगाव ग्रामीण कौशल्य संस्था ✓</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-rose-300 font-bold">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>{t('admin.verified_invalid')} ({verifyResult.code})</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t('admin.roster_title')}</h3>
            <p className="text-xs text-slate-500">{lang === 'mr' ? 'कोपरगाव तुकडी १ - ऑगस्ट २०२६' : 'Kopargaon Batch 1 - August 2026'}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                <th className="py-3 px-3">{t('admin.name')}</th>
                <th className="py-3 px-3">{t('admin.village')}</th>
                <th className="py-3 px-3">{t('admin.course')}</th>
                <th className="py-3 px-3">{t('admin.progress')}</th>
                <th className="py-3 px-3">{t('admin.quiz_score')}</th>
                <th className="py-3 px-3">प्रमाणपत्र कोड</th>
                <th className="py-3 px-3">{t('admin.sync_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{student.name}</td>
                  <td className="py-3 px-3 text-slate-600">{student.village}</td>
                  <td className="py-3 px-3 text-slate-700">{student.course}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {student.progress}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-semibold">{student.quizScore}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-brand-700 font-bold">
                    {student.certCode}
                  </td>
                  <td className="py-3 px-3">
                    {student.synced ? (
                      <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        सिंक पूर्ण
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 mr-1 text-amber-600" />
                        ऑफलाइन
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submitted Job Applications Roster */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {lang === 'mr' ? 'स्थानिक रोजगार अर्ज नोंदी (Job Applications Received)' : 'Submitted Local Job Applications'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'mr' ? 'ऑफलाइन व ऑनलाइन माध्यमातून प्राप्त झालेले अर्ज' : 'Inquiries submitted by certified students'}
            </p>
          </div>
        </div>

        {applicationsList.length === 0 ? (
          <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-2xl text-center">
            {lang === 'mr'
              ? 'विद्यार्थ्यांनी स्थानिक संधीसाठी अर्ज केल्यावर येथे यादी दिसेल.'
              : 'Applications submitted from the Local Opportunities board will appear here.'}
          </div>
        ) : (
          <div className="space-y-2">
            {applicationsList.map(app => (
              <div key={app.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{app.studentName}</span> ({app.village}, {app.phone})
                  <div className="text-slate-600 text-[11px]">
                    संधी: {typeof app.oppTitle === 'object' ? app.oppTitle.mr : app.oppTitle} • {app.notes}
                  </div>
                </div>
                <div>
                  {app.synced ? (
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                      ✓ सिंक पूर्ण (Synced)
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold bg-amber-100 px-2.5 py-1 rounded-full">
                      ⏳ ऑफलाइन रांगेत (Queued)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
