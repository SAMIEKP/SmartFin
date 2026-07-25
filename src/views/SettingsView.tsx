import React, { useState } from 'react';
import { ViewMode, Role, UserProfile } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  role: Role;
  onNavigate: (view: ViewMode) => void;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

type TabType = 'profile' | 'security' | 'notifications' | 'appearance' | 'organization' | 'danger';

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  role,
  onNavigate,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form state
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [location, setLocation] = useState(userProfile.location);
  const [bio, setBio] = useState(userProfile.bio || '');
  const [financialGoal, setFinancialGoal] = useState(userProfile.financialGoal || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || '');

  // Provider Organization Form state
  const [institutionName, setInstitutionName] = useState(userProfile.institutionName || 'FinAccess Institution');
  const [institutionType, setInstitutionType] = useState(userProfile.institutionType || 'MFI');
  const [regNumber, setRegNumber] = useState(userProfile.registrationNumber || 'RBM/MFI/2019/088');

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(userProfile.twoFactorEnabled ?? true);

  // Notifications State
  const [notifAppUpdates, setNotifAppUpdates] = useState(true);
  const [notifTips, setNotifTips] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifSms, setNotifSms] = useState(true);

  // Appearance & Language State
  const [language, setLanguage] = useState(userProfile.language || 'en');
  const [theme, setTheme] = useState<'light' | 'dark'>(userProfile.theme || 'light');
  const [fontSize, setFontSize] = useState<'small' | 'default' | 'large'>(userProfile.fontSize || 'default');

  // Danger Zone Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      location,
      bio,
      financialGoal,
      avatarUrl,
      institutionName,
      institutionType,
      registrationNumber: regNumber,
      twoFactorEnabled: twoFactor,
      language,
      theme,
      fontSize,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0b1c30]">
              Account Settings & Preferences
            </h1>
            <span className="bg-[#e5eeff] text-[#00685f] text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
              {role} Control Center
            </span>
          </div>
          <p className="text-xs text-[#3d4947] mt-1">
            Manage your personal profile, security credentials, notification channels, and privacy controls.
          </p>
        </div>

        <button
          onClick={() => onNavigate('user-profile')}
          className="px-4 py-2 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">visibility</span>
          <span>View Public Profile</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[#00685f]">check_circle</span>
          <span>Your settings and profile details have been successfully updated!</span>
        </div>
      )}

      {/* Main Settings Layout: Left Nav + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">lock</span>
            <span>Security & Passwords</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">notifications</span>
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">translate</span>
            <span>Language & Appearance</span>
          </button>

          {role === 'provider' && (
            <button
              onClick={() => setActiveTab('organization')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'organization'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#3d4947] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-base">corporate_fare</span>
              <span>Organization Details</span>
            </button>
          )}

          <div className="pt-2 my-2 border-t border-gray-100">
            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'danger'
                  ? 'bg-[#ba1a1a] text-white'
                  : 'text-[#ba1a1a] hover:bg-red-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">warning</span>
              <span>Danger Zone</span>
            </button>
          </div>
        </div>

        {/* Right Form Content Panel */}
        <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-2xl border border-[#bcc9c6]/30 shadow-xs">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30]">Personal Profile</h2>
                <p className="text-xs text-[#3d4947]">
                  Update your contact details, profile photo, and financial goals.
                </p>
              </div>

              {/* Avatar Preview & Choice */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#00685f] shrink-0 bg-white shadow-xs">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#00685f]">
                      {name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs w-full">
                  <label className="font-bold text-[#0b1c30] block">Profile Image URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full p-2.5 bg-white border border-[#bcc9c6]/40 rounded-xl text-xs text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                  <span className="text-[10px] text-gray-500 block">
                    Paste an image web URL or choose from your uploaded photo library.
                  </span>
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
              </div>

              {/* Bio & Financial Goal */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Bio / Profile Summary</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short description of your background or business enterprise..."
                    className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                {role === 'user' && (
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">Primary Financial Goal</label>
                    <input
                      type="text"
                      value={financialGoal}
                      onChange={(e) => setFinancialGoal(e.target.value)}
                      placeholder="e.g. Agri-processing expansion, housing loan, emergency fund"
                      className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30]">Security & Access Controls</h2>
                <p className="text-xs text-[#3d4947]">
                  Manage your account password, two-factor authentication, and active browser sessions.
                </p>
              </div>

              {/* Password Form */}
              <div className="p-5 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-4">
                <h3 className="font-bold text-sm text-[#0b1c30]">Change Account Password</h3>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-[#0b1c30] block mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-white border border-[#bcc9c6]/40 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-[#0b1c30] block mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full p-2.5 bg-white border border-[#bcc9c6]/40 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#0b1c30] block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full p-2.5 bg-white border border-[#bcc9c6]/40 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert('Password successfully updated!')}
                  className="px-4 py-2 bg-[#00685f] text-white font-bold rounded-xl hover:bg-[#008378] transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>

              {/* Two-Factor Toggle */}
              <div className="p-5 bg-white border border-[#bcc9c6]/30 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-sm text-[#0b1c30] block">Two-Factor Authentication (2FA)</span>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Receive a secure SMS OTP verification code on {phone} whenever logging in or submitting loan applications.
                  </p>
                </div>

                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    twoFactor ? 'bg-[#00685f]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      twoFactor ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Active Sessions */}
              <div className="p-5 bg-white border border-[#bcc9c6]/30 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-[#0b1c30]">Active Login Sessions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#00685f]">laptop_mac</span>
                      <div>
                        <span className="font-bold block text-[#0b1c30]">Chrome on macOS • Lilongwe</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Active Now (Current Session)</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Trusted
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-500">smartphone</span>
                      <div>
                        <span className="font-bold block text-[#0b1c30]">Android App • Blantyre</span>
                        <span className="text-[10px] text-gray-400">Last active 3 hours ago</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Session revoked.')}
                      className="text-xs text-[#ba1a1a] font-bold hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30]">Notification Preferences</h2>
                <p className="text-xs text-[#3d4947]">
                  Control how and when FinAccess contacts you regarding loan processing, rate updates, and security alerts.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0b1c30] text-sm block">Loan Application Updates</span>
                    <span className="text-gray-500">
                      Get real-time updates when lenders review, approve, or request documents for your applications.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifAppUpdates}
                    onChange={(e) => setNotifAppUpdates(e.target.checked)}
                    className="w-5 h-5 accent-[#00685f] cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0b1c30] text-sm block">Personalized Rate & Product Tips</span>
                    <span className="text-gray-500">
                      Receive alerts when new low-interest loan facilities matching your credit profile are launched.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifTips}
                    onChange={(e) => setNotifTips(e.target.checked)}
                    className="w-5 h-5 accent-[#00685f] cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0b1c30] text-sm block">Security & Login Alerts</span>
                    <span className="text-gray-500">
                      Instant alerts for new device logins, password resets, or two-factor code attempts.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSecurity}
                    onChange={(e) => setNotifSecurity(e.target.checked)}
                    className="w-5 h-5 accent-[#00685f] cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0b1c30] text-sm block">SMS Mobile Alerts</span>
                    <span className="text-gray-500">
                      Deliver urgent notifications to your mobile phone number ({phone}) via SMS.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                    className="w-5 h-5 accent-[#00685f] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Notification Toggles
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: LANGUAGE & APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30]">Language & Visual Preferences</h2>
                <p className="text-xs text-[#3d4947]">
                  Customize your display language, visual contrast, and font scale across FinAccess.
                </p>
              </div>

              <div className="space-y-4">
                {/* Language Selector */}
                <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-2">
                  <label className="font-bold text-[#0b1c30] text-sm block">Display Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-white border border-[#bcc9c6]/40 rounded-xl text-xs font-semibold text-[#0b1c30] outline-none"
                  >
                    <option value="en">English (Official / Default)</option>
                    <option value="ny">Chichewa (Chinyanja)</option>
                    <option value="tum">Tumbuka</option>
                  </select>
                  <p className="text-[11px] text-gray-500">
                    Language preferences automatically persist across your browser sessions.
                  </p>
                </div>

                {/* Theme Selector */}
                <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-3">
                  <label className="font-bold text-[#0b1c30] text-sm block">Visual Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'border-[#00685f] bg-white ring-2 ring-[#00685f]/20'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <span className="font-bold text-[#0b1c30]">Clean Light (Default)</span>
                      <span className="text-[10px] text-gray-500">High clarity daytime contrast</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'border-[#00685f] bg-[#0b1c30] text-white ring-2 ring-[#00685f]/20'
                          : 'border-gray-200 bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-bold">Twilight Dark</span>
                      <span className="text-[10px] text-gray-400">Eye-safe low-light mode</span>
                    </button>
                  </div>
                </div>

                {/* Font Size Accessibility */}
                <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-3">
                  <label className="font-bold text-[#0b1c30] text-sm block">Font Scale Accessibility</label>
                  <div className="flex gap-2">
                    {(['small', 'default', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold capitalize text-xs transition-colors cursor-pointer ${
                          fontSize === size
                            ? 'bg-[#00685f] text-white'
                            : 'bg-white text-[#3d4947] hover:bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Visual Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ORGANIZATION (PROVIDER ONLY) */}
          {activeTab === 'organization' && role === 'provider' && (
            <div className="space-y-6 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30]">Institution Profile & Licensing</h2>
                <p className="text-xs text-[#3d4947]">
                  Configure your financial institution's official details, Reserve Bank license number, and payout channels.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">Institution Legal Name</label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">Institution Category</label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none"
                    >
                      <option value="Bank">Commercial Bank</option>
                      <option value="MFI">Microfinance Institution (MFI)</option>
                      <option value="SACCO">SACCO / Credit Union</option>
                      <option value="Fintech">Digital Fintech Lender</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">Reserve Bank License Number</label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-mono text-[#0b1c30] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">Headquarters Address</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-semibold text-[#0b1c30] outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-2">
                  <span className="font-bold text-[#0b1c30] block">Supported Payout & Disbursement Channels</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-white border border-[#bcc9c6]/40 rounded-lg text-[#00685f] font-bold">
                      ✓ Airtel Money
                    </span>
                    <span className="px-3 py-1 bg-white border border-[#bcc9c6]/40 rounded-lg text-[#00685f] font-bold">
                      ✓ TNM Mpamba
                    </span>
                    <span className="px-3 py-1 bg-white border border-[#bcc9c6]/40 rounded-lg text-[#00685f] font-bold">
                      ✓ Direct Bank Transfer (EFT)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="px-6 py-2.5 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Institution Profile
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="space-y-6 text-xs">
              <div>
                <h2 className="text-lg font-bold text-[#ba1a1a]">Danger Zone</h2>
                <p className="text-xs text-[#3d4947]">
                  Irreversible actions regarding your FinAccess account and data records.
                </p>
              </div>

              <div className="p-5 bg-[#ffdad6]/40 border border-[#ba1a1a]/40 rounded-2xl space-y-4">
                <div className="flex items-start gap-3 text-[#93000a]">
                  <span className="material-symbols-outlined text-2xl shrink-0">warning</span>
                  <div>
                    <span className="font-bold text-sm block">Delete Account & Permanent Removal</span>
                    <p className="text-xs mt-1">
                      Once deleted, all pending loan applications, credit history reports, and verified documents will be permanently scrubbed in accordance with Malawi Data Protection Law.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#bcc9c6]/30 p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-extrabold">Confirm Account Deletion</h3>
            </div>
            <p className="text-[#3d4947] leading-relaxed">
              Are you sure you want to permanently delete the profile for <strong>{name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  alert('Account deletion request submitted. Navigating to landing page.');
                  onNavigate('landing');
                }}
                className="px-4 py-2 bg-[#ba1a1a] text-white rounded-xl font-bold hover:bg-[#93000a]"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
