import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  User,
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

  const handleQuickFill = () => {
    setFormData({
      name: 'Scholar Student',
      email: 'student@invictus.edu',
      password: 'password123',
      mobile: '9822012345',
      city: 'Kopargaon',
      grade: '10th'
    });
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
        email,
        password: password || 'password123',
        name: formData.name.trim() || email.split('@')[0],
        role: 'student',
        mobile: formData.mobile.trim() || '9876543210',
        city: formData.city.trim() || 'Kopargaon',
        grade: formData.grade || '10th'
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Unable to sign in. Please verify your details.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0097A7] text-white flex flex-col justify-between selection:bg-[#FFEB01] selection:text-[#0097A7] font-sans">
      
      {/* 1. Top Navigation Bar */}
      <header className="w-full bg-[#0097A7] border-b border-white/20 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        
        {/* Left: Shield Logo & Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-md border border-white/30">
            <Shield className="w-6 h-6 text-[#FFEB01] fill-[#FFEB01]/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                INVICTUS
              </span>
              <span className="text-[10px] uppercase font-black bg-[#FFEB01] text-[#0097A7] px-2 py-0.5 rounded-full font-mono">
                Learning
              </span>
            </div>
            <p className="text-[11px] text-blue-100 font-semibold hidden sm:block">
              Bridging Talent with Real-World Challenges
            </p>
          </div>
        </div>

        {/* Center/Right: Navigation Links & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          <nav className="hidden md:flex items-center space-x-5 text-xs font-bold text-white/90">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-yellow-300 transition-colors"
            >
              {t('nav.home') || 'Home'}
            </a>
            <a
              href="#problems"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-yellow-300 transition-colors"
            >
              {t('nav.problem_statements') || 'Problem Statements'}
            </a>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center bg-black/20 border border-white/30 rounded-xl p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLang('mr')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'mr' ? 'bg-[#FFEB01] text-[#0097A7] font-black' : 'text-white hover:text-yellow-200'
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'hi' ? 'bg-[#FFEB01] text-[#0097A7] font-black' : 'text-white hover:text-yellow-200'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'en' ? 'bg-[#FFEB01] text-[#0097A7] font-black' : 'text-white hover:text-yellow-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* Top-Right Toggle Button */}
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs font-black bg-[#FFEB01] hover:bg-yellow-300 text-[#0097A7] px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer border border-yellow-200"
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-4 animate-fadeIn">
          
          {/* Centered White Card Container (High Contrast for Educational Clarity) */}
          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
            
            {/* Header: Shield Badge + Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0097A7] text-white flex items-center justify-center shadow-lg mx-auto border-2 border-blue-400">
                <Shield className="w-8 h-8 text-[#FFEB01] fill-[#FFEB01]/20" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                INVICTUS
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-600">
                {mode === 'signin' ? t('auth.title_signin') : t('auth.title_signup')}
              </p>
            </div>

            {/* Quick Demo Fill Button */}
            <div className="flex items-center justify-center mb-4">
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-[#0097A7] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFEB01] fill-[#FFEB01]" />
                <span>Fill Demo Student Credentials</span>
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
                      className="w-full bg-white border border-slate-300 focus:border-[#0097A7] focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Student Gmail ID */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1">
                  {t('auth.gmail_student_label')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={t('auth.gmail_placeholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-[#0097A7] focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
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
                    className="w-full bg-white border border-slate-300 focus:border-[#0097A7] focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
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
                        className="w-full bg-white border border-slate-300 focus:border-[#0097A7] focus:ring-2 focus:ring-blue-100 rounded-xl pl-8 pr-2.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
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
                        className="w-full bg-white border border-slate-300 focus:border-[#0097A7] focus:ring-2 focus:ring-blue-100 rounded-xl pl-8 pr-2.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 transition-all focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Action Button (#0097A7 with Gold Arrow) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#0097A7] hover:bg-blue-600 active:scale-[0.99] text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 border border-blue-400 cursor-pointer"
                >
                  <span>
                    {loading
                      ? 'Signing in...'
                      : mode === 'signin'
                      ? t('auth.submit_signin_student')
                      : t('auth.submit_signup_student')}
                  </span>
                  {!loading && <ArrowRight className="w-4 h-4 text-[#FFEB01]" />}
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
            <span className="inline-flex items-center space-x-1.5 text-xs text-white/90 font-semibold bg-black/20 border border-white/20 px-3.5 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#FFEB01]" />
              <span>{t('auth.offline_notice')}</span>
            </span>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-3 px-4 text-center text-xs text-white/70 font-medium border-t border-white/20">
        Invictus Learning Academy © 2026 • Offline-First Digital Curriculum & Exam Hub
      </footer>

    </div>
  );
}
