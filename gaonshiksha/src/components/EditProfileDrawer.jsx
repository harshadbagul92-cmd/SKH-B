import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, User, MapPin, Sliders, Briefcase, Heart, Sparkles } from 'lucide-react';

export default function EditProfileDrawer({ isOpen, onClose }) {
  const { userProfile, updateUserProfile, t, isOnline } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    grade: '12th',
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
        grade: userProfile.grade || '12th',
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
    { id: 'general', label: t('profile.edit_drawer.categories.general') || 'General Student' },
    { id: 'vocational', label: t('profile.edit_drawer.categories.vocational') || 'Vocational Trainee' },
    { id: 'certification', label: t('profile.edit_drawer.categories.certification') || 'Skill Certification' },
    { id: 'job_seeker', label: t('profile.edit_drawer.categories.job_seeker') || 'Job Seeker' },
    { id: 'entrepreneur', label: t('profile.edit_drawer.categories.entrepreneur') || 'Entrepreneurship' }
  ];

  const indianStates = [
    'Maharashtra',
    'Madhya Pradesh',
    'Gujarat',
    'Karnataka',
    'Delhi NCR',
    'Rajasthan',
    'Uttar Pradesh',
    'Bihar',
    'Telangana',
    'Tamil Nadu',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrefChange = (prefKey, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [prefKey]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveSuccessMsg('');

    const res = await updateUserProfile(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSaveSuccessMsg(
        isOnline
          ? 'Profile updated & synced to server!'
          : 'Profile updated locally (saved offline & queued for sync).'
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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold">
                {t('profile.edit_drawer.title') || 'Edit Profile'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Banner for Save Confirmation */}
          {saveSuccessMsg && (
            <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between animate-fadeIn">
              <span>✓ {saveSuccessMsg}</span>
            </div>
          )}

          {/* Form Content Body */}
          <form id="edit-profile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Section 1: Basic Info */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm mb-3">
                <User className="w-4 h-4 text-brand-600" />
                <span>{t('profile.edit_drawer.basic_info') || 'Basic Info'}</span>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('profile.edit_drawer.full_name') || 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('profile.edit_drawer.email') || 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('profile.edit_drawer.mobile') || 'Mobile Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('profile.edit_drawer.education') || 'Education Level / Grade'}
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="10th">10th Standard / Matriculation (१० वी)</option>
                    <option value="12th">12th Standard / Higher Secondary (१२ वी)</option>
                    <option value="iti">ITI / Vocational Trade Certificate</option>
                    <option value="diploma">Polytechnic Diploma</option>
                    <option value="graduate">Undergraduate Degree (BA, BCom, BSc, BE)</option>
                    <option value="postgraduate">Postgraduate / Master's</option>
                    <option value="other">Other / Self-Taught</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('profile.edit_drawer.target_goal') || 'Target / Career Goal'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electrical & Solar Installation Technician"
                    value={formData.targetGoal}
                    onChange={(e) => handleInputChange('targetGoal', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Section 2: Category / Specialization (Grouped Chips Selector) */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm mb-3">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>{t('profile.edit_drawer.category_section') || 'Category / Specialization'}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Choose the category that best describes your primary objective:
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleInputChange('category', cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold ring-2 ring-orange-200 shadow-xs'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Section 3: Location */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm mb-3">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>{t('profile.edit_drawer.location_section') || 'Location Details'}</span>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('profile.edit_drawer.country') || 'Country'}
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="India">India (भारत)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('profile.edit_drawer.state') || 'State'}
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      {indianStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('profile.edit_drawer.city') || 'City / Village Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kopargaon, Shirdi, Pune"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('profile.edit_drawer.pincode') || 'Pin Code'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423601"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Section 4: Preferences & Conditional Fields */}
            <div>
              <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm mb-3">
                <Sliders className="w-4 h-4 text-brand-600" />
                <span>{t('profile.edit_drawer.preferences_section') || 'Preferences & Settings'}</span>
              </div>
              
              <div className="space-y-2">
                {/* Preference Option 1 */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.notifications
                    ? 'bg-orange-50/70 border-orange-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>{t('profile.edit_drawer.pref_notifications') || 'Receive Email & Mobile Alerts'}</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={(e) => handlePrefChange('notifications', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300"
                  />
                </label>

                {/* Preference Option 2 */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.audioNarration
                    ? 'bg-orange-50/70 border-orange-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>{t('profile.edit_drawer.pref_audio') || 'Offline Audio Narration Enabled'}</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.audioNarration}
                    onChange={(e) => handlePrefChange('audioNarration', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300"
                  />
                </label>

                {/* Preference Option 3: Job Alerts */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.jobAlerts
                    ? 'bg-orange-50/70 border-orange-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>{t('profile.edit_drawer.pref_job_alerts') || 'Job Placement Alerts'}</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.jobAlerts}
                    onChange={(e) => handlePrefChange('jobAlerts', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300"
                  />
                </label>

                {/* Conditional Field 1: Preferred Job Roles (Appears only when jobAlerts is checked) */}
                {formData.preferences.jobAlerts && (
                  <div className="ml-4 p-3 bg-amber-50 rounded-xl border border-amber-200 animate-fadeIn">
                    <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('profile.edit_drawer.job_roles_label') || 'Preferred Job Roles'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Apprentice, Electrician, Data Entry"
                      value={formData.preferences.preferredJobRoles}
                      onChange={(e) => handlePrefChange('preferredJobRoles', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                )}

                {/* Preference Option 4: Special Assistance */}
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  formData.preferences.specialAssistance
                    ? 'bg-orange-50/70 border-orange-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span>{t('profile.edit_drawer.pref_special_assistance') || 'Special Assistance Required'}</span>
                  <input
                    type="checkbox"
                    checked={formData.preferences.specialAssistance}
                    onChange={(e) => handlePrefChange('specialAssistance', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300"
                  />
                </label>

                {/* Conditional Field 2: Assistance Details (Appears only when specialAssistance is checked) */}
                {formData.preferences.specialAssistance && (
                  <div className="ml-4 p-3 bg-blue-50 rounded-xl border border-blue-200 animate-fadeIn">
                    <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t('profile.edit_drawer.assistance_details_label') || 'Assistance Details & Requirements'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Screen reader support, Large font, Audio translation"
                      value={formData.preferences.assistanceDetails}
                      onChange={(e) => handlePrefChange('assistanceDetails', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                )}

              </div>
            </div>

          </form>

          {/* Sticky Footer with Update Profile Button */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 shadow-lg flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('profile.edit_drawer.saving') || 'Saving Profile...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('profile.edit_drawer.update_btn') || 'Update Profile'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
