import React from 'react';
import { ViewMode, Role, UserProfile, ApplicationItem } from '../types';

interface UserProfileViewProps {
  userProfile: UserProfile;
  role: Role;
  applications: ApplicationItem[];
  onNavigate: (view: ViewMode) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userProfile,
  role,
  applications,
  onNavigate,
}) => {
  const approvedAppsCount = applications.filter((a) => a.status === 'Approved').length;
  const pendingAppsCount = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Action Required' || a.status === 'In Progress'
  ).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Profile Hero Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-md shrink-0 bg-white">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary bg-surface-container">
                {userProfile.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-on-surface">{userProfile.name}</h1>
              <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {userProfile.memberStatus}
              </span>
              <span className="bg-surface-container text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                {role === 'provider' ? 'Lender Representative' : 'Individual Borrower'}
              </span>
            </div>

            <p className="text-xs text-on-surface-variant flex items-center justify-center sm:justify-start gap-1 font-medium">
              <span className="material-symbols-outlined text-sm text-primary">location_on</span>
              <span>{userProfile.location}</span>
            </p>

            {userProfile.bio && (
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">{userProfile.bio}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('settings')}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>Edit Profile in Settings</span>
          </button>

          <button
            onClick={() => {
              // Confirmation before logout
              const ok = window.confirm('Are you sure you want to log out of your account?');
              if (ok) {
                try {
                  localStorage.removeItem('authToken');
                } catch (e) {
                  // ignore
                }
                onNavigate('login');
              }
            }}
            className="px-4 py-2.5 bg-white hover:bg-gray-100 text-[#ba1a1a] border border-[#f1c6c6] font-bold text-xs rounded-xl shadow-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details + Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Details & Financial Preferences */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact & Verification Card */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4 text-xs">
            <h2 className="font-extrabold text-base text-on-surface flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              <span>Contact & Identity Verification</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Email Address</span>
                <span className="font-bold text-on-surface text-sm truncate block mt-0.5">
                  {userProfile.email}
                </span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Phone Number</span>
                <span className="font-bold text-on-surface text-sm block mt-0.5">
                  {userProfile.phone}
                </span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">NRIS Identity Check</span>
                <span className="font-bold text-emerald-600 text-xs flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>National ID Verified</span>
                </span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Credit Reference Score</span>
                <span className="font-bold text-tertiary text-sm flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">speed</span>
                  <span>{userProfile.creditScore} (Good)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Financial Preferences Card */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4 text-xs">
            <h2 className="font-extrabold text-base text-on-surface flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="material-symbols-outlined text-primary">savings</span>
              <span>Financial Profile & Preferences</span>
            </h2>

            {role === 'user' ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">
                    Primary Financial Goal
                  </span>
                  <p className="font-semibold text-on-surface text-sm mt-0.5">
                    {userProfile.financialGoal || 'Agri-Business & Housing Credit Line'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">
                    Preferred Product Categories
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(userProfile.preferredCategories || ['agriculture', 'business', 'mortgage']).map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-surface-container text-primary rounded-lg font-bold text-xs uppercase"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">
                    Preferred Payout Channels
                  </span>
                  <p className="font-semibold text-on-surface text-xs mt-0.5">
                    Airtel Money, TNM Mpamba, Direct Bank Wire
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">
                    Institution Name & Category
                  </span>
                  <p className="font-semibold text-on-surface text-sm mt-0.5">
                    {userProfile.institutionName || 'FinAccess Institution'} ({userProfile.institutionType || 'MFI'})
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">
                    Reserve Bank Registration License
                  </span>
                  <p className="font-mono text-xs font-bold text-primary mt-0.5">
                    {userProfile.registrationNumber || 'RBM/MFI/2019/088'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Summary & Quick Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-1">
              <span className="text-xs text-gray-500 font-semibold block">Approved Loans</span>
              <span className="text-2xl font-extrabold text-emerald-600 block">{approvedAppsCount}</span>
              <span className="text-[10px] text-emerald-700 font-bold">100% On-Time Record</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-1">
              <span className="text-xs text-gray-500 font-semibold block">In Progress</span>
              <span className="text-2xl font-extrabold text-primary block">{pendingAppsCount}</span>
              <span className="text-[10px] text-gray-400">Awaiting Decision</span>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-on-surface">Recent Activity History</h3>
              <button
                onClick={() => onNavigate('my-applications')}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                View Applications
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-on-surface">{app.productName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-surface-container text-primary'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>{app.providerName}</span>
                    <span className="font-bold text-primary">MWK {app.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
