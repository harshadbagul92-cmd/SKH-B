import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Phone,
  BookOpen,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe,
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function AuthView() {
  const { lang, t, setLang, signup, login, setHasSelectedSessionLang } = useApp();

  const [activeTab, setActiveTab] = useState('signup'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    grade: '',
    city: ''
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '', // email or mobile
    password: ''
  });

  const educationOptions = [
    { value: '10th', label: t('auth.education_levels.10th') },
    { value: '12th', label: t('auth.education_levels.12th') },
    { value: 'iti', label: t('auth.education_levels.iti') },
    { value: 'diploma', label: t('auth.education_levels.diploma') },
    { value: 'graduate', label: t('auth.education_levels.graduate') },
    { value: 'postgraduate', label: t('auth.education_levels.postgraduate') },
    { value: 'other', label: t('auth.education_levels.other') }
  ];

  const handleSignupChange = (e) => {
    setSignupForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleLoginChange = (e) => {
    setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const validateSignup = () => {
    if (!signupForm.name.trim()) {
      setErrorMsg(t('auth.validation.name_required'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupForm.email.trim() || !emailRegex.test(signupForm.email)) {
      setErrorMsg(t('auth.validation.email_invalid'));
      return false;
    }
    if (!signupForm.password || signupForm.password.length < 6) {
      setErrorMsg(t('auth.validation.password_short'));
      return false;
    }
    const cleanedMobile = signupForm.mobile.replace(/\D/g, '');
    if (!cleanedMobile || cleanedMobile.length < 10) {
      setErrorMsg(t('auth.validation.mobile_invalid'));
      return false;
    }
    if (!signupForm.grade) {
      setErrorMsg(t('auth.validation.education_required'));
      return false;
    }
    if (!signupForm.city.trim()) {
      setErrorMsg(t('auth.validation.city_required'));
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!loginForm.identifier.trim()) {
      setErrorMsg(t('auth.validation.identifier_required'));
      return false;
    }
    if (!loginForm.password) {
      setErrorMsg(t('auth.validation.password_short'));
      return false;
    }
    return true;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    try {
      const result = await signup(signupForm);
      if (result.success) {
        setSuccessMsg(
          lang === 'mr'
            ? 'नोंदणी यशस्वी! डॅशबोर्डवर नेले जात आहे...'
            : lang === 'hi'
            ? 'पंजीकरण सफल! डैशबोर्ड पर भेजा जा रहा है...'
            : 'Registration successful! Redirecting to dashboard...'
        );
      } else {
        setErrorMsg(result.message || 'Signup failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred during signup');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const result = await login(loginForm.identifier, loginForm.password);
      if (result.success) {
        setSuccessMsg(
          lang === 'mr'
            ? 'लॉगिन यशस्वी! डॅशबोर्ड उघडत आहे...'
            : lang === 'hi'
            ? 'लॉगिन सफल! डैशबोर्ड खुल रहा है...'
            : 'Login successful! Opening dashboard...'
        );
      } else {
        setErrorMsg(t('auth.validation.invalid_credentials'));
      }
    } catch (err) {
      setErrorMsg(t('auth.validation.invalid_credentials'));
    }
  };

  const handleDemoLogin = async () => {
    const demoIdentifier = 'vikas@invictus.edu';
    const demoPassword = 'password123';
    await login(demoIdentifier, demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-slate-100">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar: Back to Language Select & Language Toggle */}
      <div className="max-w-xl w-full flex items-center justify-between mb-4 z-10">
        <button
          onClick={() => setHasSelectedSessionLang(false)}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'mr' ? 'भाषा बदला' : lang === 'hi' ? 'भाषा बदलें' : 'Change Language'}</span>
        </button>

        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {['en', 'hi', 'mr'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                lang === l
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-brand-600 to-amber-500 p-2.5 rounded-2xl shadow-lg mb-3">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Invictus Learning
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            {activeTab === 'signup' ? t('auth.signup_subtitle') : t('auth.login_subtitle')}
          </p>
        </div>

        {/* Tab Switcher (Signup vs Login) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'signup'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('auth.signup_tab')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'login'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('auth.login_tab')}
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-5 flex items-start space-x-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3.5 rounded-2xl text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 flex items-center space-x-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-2xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGNUP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.full_name_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  placeholder={t('auth.full_name_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* 2. Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.email_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  placeholder={t('auth.email_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* 3. Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.password_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  placeholder={t('auth.password_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.mobile_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="mobile"
                  maxLength={10}
                  value={signupForm.mobile}
                  onChange={handleSignupChange}
                  placeholder={t('auth.mobile_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* 5. Education Level / Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.education_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  name="grade"
                  value={signupForm.grade}
                  onChange={handleSignupChange}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white transition-colors"
                >
                  <option value="" className="bg-slate-900 text-slate-400">
                    {t('auth.education_select_prompt')}
                  </option>
                  {educationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. City / Village Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.city_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="city"
                  value={signupForm.city}
                  onChange={handleSignupChange}
                  placeholder={t('auth.city_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2 mt-4 active:scale-98 cursor-pointer"
            >
              <span>{t('auth.signup_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Identifier (Email or Mobile) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.login_identifier_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="identifier"
                  value={loginForm.identifier}
                  onChange={handleLoginChange}
                  placeholder={t('auth.login_identifier_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('auth.password_label')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder={t('auth.password_placeholder')}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2 mt-4 active:scale-98 cursor-pointer"
            >
              <span>{t('auth.login_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t('auth.or_divider')}
          </span>
        </div>

        {/* Quick Demo Test Student Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{t('auth.demo_student_btn')}</span>
        </button>

        {/* Switch Tab Link Footer */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {activeTab === 'signup' ? (
            <p>
              {t('auth.already_have_account')}{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-brand-400 font-bold hover:underline cursor-pointer"
              >
                {t('auth.switch_to_login')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.dont_have_account')}{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-brand-400 font-bold hover:underline cursor-pointer"
              >
                {t('auth.switch_to_signup')}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
