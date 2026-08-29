import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ShieldCheck,
  User,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  Globe,
  CheckCircle2,
  BookOpen,
  Zap
} from 'lucide-react';

export default function AuthView() {
  const { lang, setLang, t, login, userProfile } = useApp();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [role, setRole] = useState('student'); // 'student' | 'mentor'
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    password: '',
    mobile: userProfile?.mobile || '',
    city: userProfile?.city || '',
    grade: userProfile?.grade || '10th'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errorMsg) setErrorMsg('');
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (errorMsg) setErrorMsg('');
  };

  const handleQuickFill = (targetRole) => {
    if (targetRole === 'student') {
      setRole('student');
      setFormData({
        name: 'Scholar Student',
        email: 'student@invictus.edu',
        password: 'password123',
        mobile: '9822012345',
        city: 'Kopargaon',
        grade: '10th'
      });
    } else {
      setRole('mentor');
      setFormData({
        name: 'Dr. S. K. Bagul',
        email: 'mentor.bagul@invictus.edu',
        password: 'password123',
        mobile: '9876543210',
        city: 'Pune',
        grade: 'Mentor'
      });
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const email = formData.email.trim();
      const password = formData.password.trim();

      if (!email) {
        setErrorMsg('Please enter your Gmail / Email ID.');
        setLoading(false);
        return;
      }

      if (mode === 'signup' && !formData.name.trim()) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }

      const res = await login({
        name: formData.name || (email.includes('@') ? email.split('@')[0] : 'Scholar'),
        email: email,
        password: password || 'password123',
        mobile: formData.mobile,
        city: formData.city,
        grade: formData.grade,
        role: role,
        category: role === 'mentor' ? 'mentor' : 'general'
      });

      if (!res || !res.success) {
        setErrorMsg(res?.message || 'Authentication error. Please check your credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000083] text-white flex flex-col justify-between selection:bg-[#FFEB01] selection:text-[#000083] font-sans">
      
      {/* 1. Top Navigation Bar */}
      <header className="w-full bg-[#000083] border-b border-blue-900/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        
        {/* Left: Shield Logo & Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#002EAF] flex items-center justify-center text-white shadow-md border border-blue-400">
            <Shield className="w-6 h-6 text-[#FFEB01] fill-[#FFEB01]/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                INVICTUS
              </span>
              <span className="text-[10px] uppercase font-black bg-[#FFEB01] text-[#000083] px-2 py-0.5 rounded-full font-mono">
                Learning
              </span>
            </div>
            <p className="text-[11px] text-blue-200 font-semibold hidden sm:block">
              Bridging Talent with Real-World Challenges
            </p>
          </div>
        </div>

        {/* Center/Right: Navigation Links & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          <nav className="hidden md:flex items-center space-x-5 text-xs font-bold text-slate-200">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-gold-400 transition-colors"
            >
              {t('nav.home') || 'Home'}
            </a>
            <a
              href="#problems"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-gold-400 transition-colors"
            >
              {t('nav.problem_statements') || 'Problem Statements'}
            </a>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-600 rounded-xl p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLang('mr')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'mr' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-200 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'hi' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-200 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'en' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-200 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Top-Right Toggle Button */}
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs font-black bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer border border-brand-400"
          >
            <span>
              {mode === 'signin'
                ? (lang === 'mr' ? 'नोंदणी (Register)' : lang === 'hi' ? 'रजिस्टर' : 'Register')
                : (lang === 'mr' ? 'साइन इन (Sign In)' : lang === 'hi' ? 'साइन इन' : 'Sign In')}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Main Centered Authentication Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-4 animate-fadeIn">
          
          {/* Centered White Card Container (High Contrast for Educational Clarity) */}
          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-300">
            
            {/* Header: Shield Badge + Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg mx-auto border-2 border-brand-400">
                <Shield className="w-8 h-8 text-gold-400 fill-gold-400/20" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0A192F]">
                INVICTUS
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-600">
                {mode === 'signin' ? t('auth.title_signin') : t('auth.title_signup')}
              </p>
            </div>

            {/* Role Selector (Segmented Pill Toggle) */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-4 border border-slate-300">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  role === 'student'
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'text-slate-800 hover:text-black font-bold'
                }`}
              >
                <User className="w-4 h-4 text-gold-400" />
                <span>{t('auth.role_student') || 'Student'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('mentor')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  role === 'mentor'
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'text-slate-800 hover:text-black font-bold'
                }`}
              >
                <Users className="w-4 h-4 text-gold-400" />
                <span>{t('auth.role_mentor') || 'Mentor'}</span>
              </button>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="text-[11px] font-bold text-brand-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
              >
                <Zap className="w-3 h-3 text-gold-500" />
                <span>Demo Student Account</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('mentor')}
                className="text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
              >
                <Zap className="w-3 h-3 text-gold-500" />
                <span>Demo Mentor (Dr. Bagul)</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold animate-fadeIn">
                {errorMsg}
              </div>
            )}

            {/* Form with High Contrast Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* If Sign Up: Full Name */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1">
                    {t('auth.fullname_label')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder={t('auth.fullname_placeholder')}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Student / Mentor Gmail ID */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1">
                  {role === 'student' ? t('auth.gmail_student_label') : t('auth.gmail_mentor_label')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={t('auth.gmail_placeholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1">
                  {t('auth.password_label')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t('auth.password_placeholder')}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-500 hover:text-slate-800 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* If Sign Up: Mobile & City */}
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1">
                      {t('auth.mobile_label')}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="Mobile"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-8 pr-2.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1">
                      {t('auth.city_label')}
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-8 pr-2.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Action Button (Deep Navy with Gold Arrow) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#0A192F] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 border border-slate-700 hover:border-brand-400 cursor-pointer"
                >
                  <span>
                    {loading
                      ? 'Signing in...'
                      : mode === 'signin'
                      ? role === 'student' ? t('auth.submit_signin_student') : t('auth.submit_signin_mentor')
                      : role === 'student' ? t('auth.submit_signup_student') : t('auth.submit_signup_mentor')}
                  </span>
                  {!loading && <ArrowRight className="w-4 h-4 text-gold-400" />}
                </button>
              </div>

            </form>

            {/* 3. Bottom Footer Switcher Container */}
            <div className="mt-6 pt-5 border-t border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-600 font-semibold">
                {mode === 'signin' ? t('auth.no_account_yet') : t('auth.already_have_account')}
              </p>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrorMsg('');
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-black text-xs border border-slate-300 transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>
                  {mode === 'signin'
                    ? t('auth.toggle_signup_btn')
                    : t('auth.toggle_signin_btn')}
                </span>
              </button>
            </div>

          </div>

          {/* Offline Notice Badge */}
          <div className="text-center">
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-300 font-semibold bg-slate-900 border border-slate-700 px-3.5 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>{t('auth.offline_notice')}</span>
            </span>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-3 px-4 text-center text-xs text-slate-400 font-medium border-t border-slate-800">
        Invictus Learning Academy © 2026 • Offline-First Digital Curriculum & Exam Hub
      </footer>

    </div>
  );
}
