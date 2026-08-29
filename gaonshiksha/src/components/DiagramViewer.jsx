import React from 'react';
import { useApp } from '../context/AppContext';

export default function DiagramViewer({ diagramKey }) {
  const { lang } = useApp();

  switch (diagramKey) {
    case 'computer_parts':
      return (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-inner border border-slate-800 my-4">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'mr' ? 'संगणक रचना व मराठी टायपिंग आकृती' : 'Computer Anatomy & Marathi Typing Schematic'}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">SVG Vector (0 KB)</span>
          </div>
          <svg viewBox="0 0 700 320" className="w-full h-auto max-h-72">
            {/* Monitor */}
            <rect x="50" y="30" width="220" height="150" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="3"/>
            <rect x="60" y="40" width="200" height="120" rx="4" fill="#0f172a"/>
            {/* Screen Content */}
            <rect x="75" y="55" width="170" height="24" rx="4" fill="#0369a1"/>
            <text x="85" y="72" fill="#ffffff" fontSize="11" fontWeight="bold">
              {lang === 'mr' ? 'कोपरगाव सेतू केंद्र - महाडीबीटी' : 'Kopargaon Center - MahaDBT'}
            </text>
            <text x="80" y="105" fill="#38bdf8" fontSize="12" fontFamily="monospace">
              {lang === 'mr' ? 'Sheti ➔ शेती | Ctrl + S' : 'Typing: Sheti ➔ शेती | Ctrl+S'}
            </text>
            <text x="80" y="130" fill="#4ade80" fontSize="10">
              {lang === 'mr' ? '✓ फाइल सुरक्षित सेव्ह केली' : '✓ File Saved Automatically'}
            </text>
            {/* Monitor Stand */}
            <rect x="145" y="180" width="30" height="25" fill="#334155"/>
            <rect x="120" y="205" width="80" height="10" rx="3" fill="#475569"/>

            {/* CPU Tower */}
            <rect x="300" y="30" width="110" height="185" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="3"/>
            <circle cx="355" cy="65" r="10" fill="#22c55e"/>
            <rect x="320" y="90" width="70" height="10" rx="2" fill="#334155"/>
            <rect x="320" y="110" width="70" height="10" rx="2" fill="#334155"/>
            <rect x="325" y="140" width="60" height="50" rx="4" fill="#0f172a" stroke="#475569"/>
            <text x="355" y="170" fill="#c084fc" fontSize="11" textAnchor="middle" fontWeight="bold">CPU</text>

            {/* Keyboard & Mouse */}
            <rect x="70" y="235" width="280" height="60" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="2"/>
            <g fill="#334155">
              <rect x="85" y="245" width="25" height="18" rx="2"/>
              <rect x="115" y="245" width="25" height="18" rx="2"/>
              <rect x="145" y="245" width="25" height="18" rx="2"/>
              <rect x="175" y="245" width="25" height="18" rx="2"/>
              <rect x="205" y="245" width="25" height="18" rx="2"/>
              <rect x="235" y="245" width="25" height="18" rx="2"/>
              <rect x="265" y="245" width="70" height="18" rx="2" fill="#f97316"/>
              <text x="300" y="258" fill="#ffffff" fontSize="9" textAnchor="middle">Ctrl+S</text>

              <rect x="110" y="270" width="150" height="16" rx="2" fill="#475569"/>
              <text x="185" y="282" fill="#f8fafc" fontSize="9" textAnchor="middle">Space Bar (मराठी)</text>
            </g>

            {/* Mouse */}
            <rect x="380" y="240" width="45" height="60" rx="20" fill="#1e293b" stroke="#94a3b8" strokeWidth="2"/>
            <line x1="402" y1="240" x2="402" y2="265" stroke="#94a3b8" strokeWidth="2"/>

            {/* Labels Panel on Right */}
            <rect x="460" y="30" width="210" height="265" rx="8" fill="#0f172a" stroke="#334155"/>
            <text x="475" y="60" fill="#fbbf24" fontSize="13" fontWeight="bold">
              {lang === 'mr' ? 'महत्वाचे शॉर्टकट्स' : 'Key Shortcuts'}
            </text>
            <text x="475" y="95" fill="#94a3b8" fontSize="11">Ctrl + S : {lang === 'mr' ? 'फाइल सेव्ह करणे' : 'Save File'}</text>
            <text x="475" y="125" fill="#94a3b8" fontSize="11">Ctrl + C : {lang === 'mr' ? 'मजकूर कॉपी करणे' : 'Copy Text'}</text>
            <text x="475" y="155" fill="#94a3b8" fontSize="11">Ctrl + V : {lang === 'mr' ? 'मजकूर पेस्ट करणे' : 'Paste Text'}</text>
            <text x="475" y="185" fill="#94a3b8" fontSize="11">Ctrl + P : {lang === 'mr' ? 'कागदपत्र प्रिंट करणे' : 'Print Document'}</text>
            <text x="475" y="220" fill="#38bdf8" fontSize="11">Google Marathi:</text>
            <text x="475" y="240" fill="#f1f5f9" fontSize="11">gaon ➔ गाव | sheti ➔ शेती</text>
            <text x="475" y="265" fill="#4ade80" fontSize="10">✓ लोडशेडिंगपूर्वी सेव्ह करा</text>
          </svg>
        </div>
      );

    case 'excel_sheet':
      return (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-inner border border-slate-800 my-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'mr' ? 'एमएस एक्सेल: शेती व दुकान हिशोब पत्रक' : 'MS Excel: Farm & Rural Shop Account Sheet'}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Formula Schematic</span>
          </div>
          <svg viewBox="0 0 700 280" className="w-full h-auto max-h-72">
            {/* Excel Formula Bar */}
            <rect x="30" y="20" width="640" height="35" rx="5" fill="#1e293b" stroke="#059669" strokeWidth="2"/>
            <rect x="40" y="27" width="50" height="20" rx="3" fill="#047857"/>
            <text x="65" y="41" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">fx =</text>
            <text x="105" y="42" fill="#34d399" fontSize="13" fontWeight="bold" fontFamily="monospace">
              =SUM(C4:C7) - SUM(D4:D7) [नफा / शिल्लक हिशोब]
            </text>

            {/* Grid Table */}
            <rect x="30" y="65" width="640" height="195" rx="5" fill="#0f172a" stroke="#334155"/>
            
            {/* Headers */}
            <rect x="30" y="65" width="640" height="35" fill="#065f46"/>
            <text x="60" y="88" fill="#ffffff" fontSize="11" fontWeight="bold">A (अनु. क्र.)</text>
            <text x="180" y="88" fill="#ffffff" fontSize="11" fontWeight="bold">B ({lang === 'mr' ? 'तपशील / शेतमाल' : 'Item / Produce'})</text>
            <text x="370" y="88" fill="#ffffff" fontSize="11" fontWeight="bold">C ({lang === 'mr' ? 'जमा रक्कम ₹' : 'Income ₹'})</text>
            <text x="500" y="88" fill="#ffffff" fontSize="11" fontWeight="bold">D ({lang === 'mr' ? 'खर्च ₹' : 'Expense ₹'})</text>

            {/* Rows */}
            <line x1="30" y1="135" x2="670" y2="135" stroke="#1e293b"/>
            <text x="60" y="123" fill="#94a3b8" fontSize="11">1</text>
            <text x="180" y="123" fill="#f8fafc" fontSize="11">{lang === 'mr' ? 'कांदा विक्री (कोपरगाव मार्केट)' : 'Onion Sale (Kopargaon)'}</text>
            <text x="370" y="123" fill="#4ade80" fontSize="11" fontWeight="bold">₹ ४५,०००</text>
            <text x="500" y="123" fill="#94a3b8" fontSize="11">-</text>

            <line x1="30" y1="170" x2="670" y2="170" stroke="#1e293b"/>
            <text x="60" y="158" fill="#94a3b8" fontSize="11">2</text>
            <text x="180" y="158" fill="#f8fafc" fontSize="11">{lang === 'mr' ? 'खते व औषध फवारणी खर्च' : 'Fertilizer & Spray'}</text>
            <text x="370" y="158" fill="#94a3b8" fontSize="11">-</text>
            <text x="500" y="158" fill="#f87171" fontSize="11" fontWeight="bold">₹ १२,५००</text>

            <line x1="30" y1="205" x2="670" y2="205" stroke="#1e293b"/>
            <text x="60" y="193" fill="#94a3b8" fontSize="11">3</text>
            <text x="180" y="193" fill="#f8fafc" fontSize="11">{lang === 'mr' ? 'ट्रॅक्टर मशागत व मजुरी' : 'Tractor & Labor'}</text>
            <text x="370" y="193" fill="#94a3b8" fontSize="11">-</text>
            <text x="500" y="193" fill="#f87171" fontSize="11" fontWeight="bold">₹ ८,०००</text>

            {/* Total Row */}
            <rect x="30" y="215" width="640" height="45" fill="#1e293b"/>
            <text x="180" y="242" fill="#fbbf24" fontSize="12" fontWeight="bold">{lang === 'mr' ? 'एकूण निव्वळ नफा (Net Balance):' : 'Net Profit Balance:'}</text>
            <text x="370" y="242" fill="#34d399" fontSize="14" fontWeight="black">₹ २४,५००</text>
            <text x="500" y="242" fill="#94a3b8" fontSize="10">(C4 - D4 - D5)</text>
          </svg>
        </div>
      );

    case 'cyber_safety':
      return (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-inner border border-slate-800 my-4">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'mr' ? 'महाडीबीटी, डीजीलॉकर व सायबर सुरक्षा कवच' : 'MahaDBT, DigiLocker & Cyber Safety'}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Verification Schema</span>
          </div>
          <svg viewBox="0 0 700 260" className="w-full h-auto max-h-72">
            {/* DigiLocker Box */}
            <rect x="40" y="30" width="180" height="190" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2"/>
            <circle cx="130" cy="70" r="24" fill="#0284c7"/>
            <text x="130" y="76" fill="#ffffff" fontSize="18" textAnchor="middle" fontWeight="bold">🔒</text>
            <text x="130" y="115" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">DigiLocker</text>
            <text x="130" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle">{lang === 'mr' ? 'आधार, १०वी गुणपत्रिका' : 'Aadhaar, Marksheets'}</text>
            <text x="130" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">{lang === 'mr' ? '७/१२, जात प्रमाणपत्र' : '7/12 & Caste Cert'}</text>
            <rect x="60" y="180" width="140" height="24" rx="12" fill="#059669"/>
            <text x="130" y="196" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓ कायदेशीर मान्यता</text>

            {/* MahaDBT Box */}
            <rect x="260" y="30" width="180" height="190" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="350" cy="70" r="24" fill="#d97706"/>
            <text x="350" y="76" fill="#ffffff" fontSize="18" textAnchor="middle" fontWeight="bold">🏛️</text>
            <text x="350" y="115" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">MahaDBT Portal</text>
            <text x="350" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle">{lang === 'mr' ? 'शेतकरी ठिबक सिंचन योजना' : 'Drip Subsidy Schemes'}</text>
            <text x="350" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">{lang === 'mr' ? 'विद्यार्थी शिष्यवृत्ती अर्ज' : 'Student Scholarships'}</text>
            <rect x="280" y="180" width="140" height="24" rx="12" fill="#d97706"/>
            <text x="350" y="196" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">थेट बँक खात्यात जमा</text>

            {/* Cyber Safety Warning */}
            <rect x="480" y="30" width="180" height="190" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2"/>
            <circle cx="570" cy="70" r="24" fill="#dc2626"/>
            <text x="570" y="76" fill="#ffffff" fontSize="18" textAnchor="middle" fontWeight="bold">⚠️</text>
            <text x="570" y="115" fill="#fca5a5" fontSize="13" fontWeight="bold" textAnchor="middle">
              {lang === 'mr' ? 'सायबर दक्षता नियम' : 'Cyber Security'}
            </text>
            <text x="570" y="140" fill="#fecaca" fontSize="10" textAnchor="middle">❌ OTP कोणालाही सांगू नका</text>
            <text x="570" y="160" fill="#fecaca" fontSize="10" textAnchor="middle">❌ मोफत रिचार्ज लिंक टाळा</text>
            <rect x="500" y="180" width="140" height="24" rx="12" fill="#991b1b"/>
            <text x="570" y="196" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">सुरक्षित राहा</text>
          </svg>
        </div>
      );

    case 'sewing_machine':
      return (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-inner border border-slate-800 my-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'mr' ? 'शिलाई यंत्राचे मुख्य भाग व ऑइलिंग बिंदू' : 'Sewing Machine Parts & Lubrication Points'}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Technical Vector</span>
          </div>
          <svg viewBox="0 0 700 300" className="w-full h-auto max-h-72">
            {/* Base */}
            <rect x="60" y="220" width="460" height="40" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
            <rect x="120" y="210" width="70" height="10" fill="#94a3b8"/>

            {/* Arm Body */}
            <path d="M120 210 V100 Q120 70 150 70 H430 Q470 70 470 120 V220 Z" fill="#0f172a" stroke="#10b981" strokeWidth="3"/>
            
            {/* Needle Head & Presser Foot */}
            <rect x="110" y="90" width="30" height="70" rx="3" fill="#334155"/>
            <line x1="125" y1="160" x2="125" y2="210" stroke="#f8fafc" strokeWidth="3"/>
            <circle cx="125" cy="205" r="4" fill="#fbbf24"/>
            <text x="40" y="185" fill="#facc15" fontSize="11" fontWeight="bold">
              {lang === 'mr' ? '१६ नं. सुई' : 'No. 16 Needle'}
            </text>

            {/* Balance Wheel */}
            <ellipse cx="470" cy="130" rx="22" ry="45" fill="#334155" stroke="#94a3b8" strokeWidth="3"/>
            <circle cx="470" cy="130" r="10" fill="#f97316"/>

            {/* Tension Disc */}
            <circle cx="210" cy="120" r="14" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2"/>
            <text x="210" y="150" fill="#93c5fd" fontSize="10" textAnchor="middle">
              {lang === 'mr' ? 'टेन्शन डिस्क' : 'Tension Disc'}
            </text>

            {/* Spool Pin */}
            <rect x="400" y="45" width="8" height="25" fill="#cbd5e1"/>
            <rect x="390" y="40" width="28" height="15" rx="3" fill="#f43f5e"/>

            {/* Oil Indicators */}
            <circle cx="160" cy="85" r="7" fill="#eab308" className="animate-pulse"/>
            <text x="160" y="65" fill="#fef08a" fontSize="10" textAnchor="middle">💧 Oil</text>

            <circle cx="340" cy="85" r="7" fill="#eab308" className="animate-pulse"/>
            <text x="340" y="65" fill="#fef08a" fontSize="10" textAnchor="middle">💧 Oil</text>

            <circle cx="140" cy="235" r="7" fill="#eab308" className="animate-pulse"/>
            <text x="180" y="240" fill="#fef08a" fontSize="10">💧 {lang === 'mr' ? 'बॉबिन केस ऑइल' : 'Bobbin Oil'}</text>

            {/* Legend on Right */}
            <rect x="540" y="30" width="130" height="230" rx="8" fill="#0f172a" stroke="#334155"/>
            <text x="555" y="55" fill="#34d399" fontSize="12" fontWeight="bold">
              {lang === 'mr' ? 'देखभाल नियम' : 'Checklist'}
            </text>
            <text x="555" y="85" fill="#cbd5e1" fontSize="10">१. १६ नं. सुई वापरा</text>
            <text x="555" y="115" fill="#cbd5e1" fontSize="10">२. हलके तेल घाला</text>
            <text x="555" y="145" fill="#cbd5e1" fontSize="10">३. बॉबिन स्वच्छ ठेवा</text>
            <text x="555" y="175" fill="#cbd5e1" fontSize="10">४. धागा अडकू देऊ नका</text>
            <text x="555" y="215" fill="#f87171" fontSize="10">❌ खाद्यतेल वापरू नका</text>
          </svg>
        </div>
      );

    case 'blouse_pattern':
      return (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-inner border border-slate-800 my-4">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'mr' ? 'ब्लाउज पॅटर्न कटिंग व १.५ इंच शिलाई मार्जिन' : 'Blouse Drafting Pattern & 1.5" Seam Margin'}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Drafting Guide</span>
          </div>
          <svg viewBox="0 0 700 280" className="w-full h-auto max-h-72">
            {/* Front Bodice Pattern */}
            <path d="M50 50 H180 V180 H50 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4"/>
            <path d="M60 60 H165 V165 H60 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2"/>
            
            {/* Neck Curve */}
            <path d="M60 60 Q95 60 95 100" fill="none" stroke="#f43f5e" strokeWidth="3"/>
            <text x="110" y="85" fill="#f43f5e" fontSize="10">{lang === 'mr' ? 'गळा (Neck)' : 'Neck'}</text>

            {/* Armhole Curve */}
            <path d="M165 60 Q140 100 165 120" fill="none" stroke="#f59e0b" strokeWidth="3"/>
            <text x="120" y="115" fill="#f59e0b" fontSize="10">{lang === 'mr' ? 'मुंढा (Armhole)' : 'Armhole'}</text>

            {/* Tucks / Darts */}
            <line x1="110" y1="165" x2="110" y2="125" stroke="#a855f7" strokeWidth="3"/>
            <circle cx="110" cy="125" r="4" fill="#c084fc"/>
            <text x="115" y="145" fill="#c084fc" fontSize="9">{lang === 'mr' ? 'मध्य टक्स' : 'Dart'}</text>

            <text x="60" y="205" fill="#38bdf8" fontSize="11" fontWeight="bold">
              {lang === 'mr' ? '१. पुढील भाग (Front Bodice)' : '1. Front Bodice'}
            </text>
            <text x="60" y="225" fill="#94a3b8" fontSize="10">
              {lang === 'mr' ? 'निळा ठिपकेदार: १.५" मार्जिन' : 'Dashed Line: 1.5" Seam Margin'}
            </text>

            {/* Cross Belt / Yoke */}
            <path d="M230 70 H360 L360 120 Q295 135 230 110 Z" fill="#1e293b" stroke="#10b981" strokeWidth="2"/>
            <text x="295" y="100" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
              {lang === 'mr' ? 'योग पट्टी / क्रॉस पट्टी' : 'Yoke / Cross Belt'}
            </text>

            {/* Sleeve Pattern */}
            <path d="M230 150 Q295 125 360 150 V210 H230 Z" fill="#1e293b" stroke="#eab308" strokeWidth="2"/>
            <text x="295" y="185" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
              {lang === 'mr' ? 'बाही पॅटर्न (Sleeve)' : 'Sleeve Pattern'}
            </text>

            {/* Bias Neck Strip Guide */}
            <rect x="410" y="50" width="260" height="190" rx="8" fill="#0f172a" stroke="#334155"/>
            <text x="430" y="80" fill="#fbbf24" fontSize="12" fontWeight="bold">
              {lang === 'mr' ? 'पायपिंग व फिनिशिंग नियम' : 'Piping & Bias Cutting'}
            </text>
            <line x1="430" y1="100" x2="520" y2="160" stroke="#f43f5e" strokeWidth="4"/>
            <text x="535" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">
              {lang === 'mr' ? '४५° तिरपी पट्टी (Bias)' : '45° True Bias'}
            </text>
            <text x="430" y="185" fill="#cbd5e1" fontSize="10">
              {lang === 'mr' ? '• तिरप्या पट्टीमुळे गळ्याला सुरकुत्या येत नाहीत.' : '• True bias provides smooth round neck finish.'}
            </text>
            <text x="430" y="210" fill="#cbd5e1" fontSize="10">
              {lang === 'mr' ? '• नेहमी १.५ इंच अतिरिक्त मार्जिन ठेवा.' : '• Keep 1.5" extra margin for alterations.'}
            </text>
          </svg>
        </div>
      );

    case 'finishing_boutique':
      return (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-inner border border-slate-800 my-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'mr' ? 'फिनिशिंग, इस्त्री व स्थानिक शिलाई दर तक्ता' : 'Finishing, Ironing & Village Pricing Table'}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Business Rates</span>
          </div>
          <svg viewBox="0 0 700 240" className="w-full h-auto max-h-72">
            {/* Hook & Eye Card */}
            <rect x="40" y="30" width="180" height="170" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2"/>
            <circle cx="80" cy="70" r="14" fill="#0284c7"/>
            <text x="80" y="75" fill="#ffffff" fontSize="12" textAnchor="middle">🪡</text>
            <text x="105" y="75" fill="#ffffff" fontSize="12" fontWeight="bold">{lang === 'mr' ? 'हुक व लूक' : 'Hooks & Eyes'}</text>
            <text x="55" y="110" fill="#94a3b8" fontSize="10">• ५ टाके घालून पक्के बसवा</text>
            <text x="55" y="135" fill="#94a3b8" fontSize="10">• समान अंतरावर मार्किंग करा</text>
            <text x="55" y="160" fill="#4ade80" fontSize="10">✓ टिकाऊ व मजबूत</text>

            {/* Ironing Card */}
            <rect x="250" y="30" width="180" height="170" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="290" cy="70" r="14" fill="#d97706"/>
            <text x="290" y="75" fill="#ffffff" fontSize="12" textAnchor="middle">♨️</text>
            <text x="315" y="75" fill="#ffffff" fontSize="12" fontWeight="bold">{lang === 'mr' ? 'स्टीम इस्त्री' : 'Pressing'}</text>
            <text x="265" y="110" fill="#94a3b8" fontSize="10">• प्रत्येक शिवणीवर इस्त्री फिरवा</text>
            <text x="265" y="135" fill="#94a3b8" fontSize="10">• बुटीक फिनिश लूक येतो</text>
            <text x="265" y="160" fill="#fbbf24" fontSize="10">✓ जास्त दर मिळतो</text>

            {/* Pricing Card */}
            <rect x="460" y="30" width="200" height="170" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2"/>
            <text x="475" y="60" fill="#34d399" fontSize="12" fontWeight="bold">
              {lang === 'mr' ? 'कोपरगाव स्थानिक दर' : 'Kopargaon Rate Card'}
            </text>
            <text x="475" y="90" fill="#cbd5e1" fontSize="10">साधा ब्लाउज: ₹२०० - ₹३००</text>
            <text x="475" y="115" fill="#cbd5e1" fontSize="10">अस्तर ब्लाउज: ₹३५० - ₹५००</text>
            <text x="475" y="140" fill="#cbd5e1" fontSize="10">प्रिन्स कट / डिझाइन: ₹६००+</text>
            <text x="475" y="165" fill="#38bdf8" fontSize="10">गणवेश / पिशव्या: घाऊक दर</text>
            <text x="475" y="188" fill="#4ade80" fontSize="9">✓ नफा = दर उणे (कापड+वीज+धागा)</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
