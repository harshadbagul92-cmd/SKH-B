import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, User, MapPin, Sliders, Briefcase, Heart, Sparkles } from 'lucide-react';

export default function EditProfileDrawer({ isOpen, onClose }) {
  const { userProfile, updateUserProfile, t, isOnline } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    grade: '10th',
    targetGoal: '',
    category: 'vocational',
    country: 'India',
    state: 'Maharashtra',
    city: '',
    pincode: '',
    preferences: {
      notifications: true,
      audioNarration: true,
      jobAlerts: true,
      specialAssistance: false,
      assistanceDetails: '',
      preferredJobRoles: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        mobile: userProfile.mobile || '',
        grade: userProfile.grade || '10th',
        targetGoal: userProfile.targetGoal || '',
        category: userProfile.category || 'vocational',
        country: userProfile.country || 'India',
        state: userProfile.state || 'Maharashtra',
        city: userProfile.city || '',
        pincode: userProfile.pincode || '',
        preferences: {
          notifications: userProfile.preferences?.notifications ?? true,
          audioNarration: userProfile.preferences?.audioNarration ?? true,
          jobAlerts: userProfile.preferences?.jobAlerts ?? true,
          specialAssistance: userProfile.preferences?.specialAssistance ?? false,
          assistanceDetails: userProfile.preferences?.assistanceDetails || '',
          preferredJobRoles: userProfile.preferences?.preferredJobRoles || ''
        }
      });
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const categories = [
    { id: 'general', label: 'General Curriculum Student' },
    { id: 'vocational', label: 'Vocational Trainee' },
    { id: 'certification', label: 'Skill Certification' },
    { id: 'job_seeker', label: 'Competitive Exam Aspirant' },
    { id: 'entrepreneur', label: 'Entrepreneurship' }
  ];

  const educationLevels = [
    { id: '10th', label: '10th Standard (SSC Board)' },
    { id: '12th', label: '12th Standard (HSC Board)' },
    { id: 'iti', label: 'ITI Trade Certificate' },
    { id: 'diploma', label: 'Polytechnic Diploma' },
    { id: 'graduate', label: 'Graduate Degree' },
    { id: 'postgraduate', label: 'Postgraduate' },
    { id: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrefChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveSuccessMsg('');

    const res = await updateUserProfile(formData);
    setIsSubmitting(false);

    if (res) {
      setSaveSuccessMsg(
        isOnline
          ? 'Profile updated & synced to server!'
          : 'Profile updated locally in IndexedDB.'
      );
      setTimeout(() => {
        setSaveSuccessMsg('');
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300">
          
          {/* Header (#0077FF) */}
          <div className="px-6 py-4 bg-[#0077FF] text-white flex items-center justify-between border-b border-blue-400">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
                <User className="w-4 h-4 text-[#FFEB01]" />
              </div>
              <h2 className="text-base font-bold text-white">
                {t('profile.edit_btn') || 'Edit Profile'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Banner for Save Confirmation */}
          {saveSuccessMsg && (
            <div className="bg-teal-700 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between animate-fadeIn">
              <span>✓ {saveSuccessMsg}</span>
            </div>
          )}

          {/* Form Content Body */}
          <form id="edit-profile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Section 1: Basic Info */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-3">
                <User className="w-4 h-4 text-brand-600" />
                <span>Basic Profile Information</span>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic & Career Focus */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Academic & Career Focus</span>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Standard / Class Level
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                    >
                      {educationLevels.map(l => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Learner Category & Specialization
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const isSelected = formData.category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleInputChange('category', cat.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-brand-600 text-brand-800 font-black ring-2 ring-blue-200 shadow-xs'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 font-bold" />}
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Competitive Exam Target
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra Police, MPSC Combine, Talathi, SSC CGL"
                    value={formData.targetGoal}
                    onChange={(e) => handleInputChange('targetGoal', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Location */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-3">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Location Details</span>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Village
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Preferences */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-3">
                <Sliders className="w-4 h-4 text-brand-600" />
                <span>Learning & Placement Preferences</span>
              </div>
              <div className="space-y-3">
                
                {/* Preference Option 1: Notifications */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.notifications
                    ? 'bg-blue-50/80 border-blue-200 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>Curriculum & Exam Notifications</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={(e) => handlePrefChange('notifications', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300 cursor-pointer"
                  />
                </label>

                {/* Preference Option 2: Audio Narration */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.audioNarration
                    ? 'bg-blue-50/80 border-blue-200 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>Offline Voice Narration (Bilingual Audio)</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.audioNarration}
                    onChange={(e) => handlePrefChange('audioNarration', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300 cursor-pointer"
                  />
                </label>

                {/* Preference Option 3: Job Alerts */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.jobAlerts
                    ? 'bg-blue-50/80 border-blue-200 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>Recruitment & Job Placement Alerts</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.jobAlerts}
                    onChange={(e) => handlePrefChange('jobAlerts', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300 cursor-pointer"
                  />
                </label>

              </div>
            </div>

          </form>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 shadow-lg flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
