import React, { useState } from 'react';
import { ViewMode, Role, UserProfile } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  role: Role;
  userProfile: UserProfile;
  onOpenApplyModal: () => void;
  onSwitchRole?: (role: Role) => void;
  onNavigateLogin?: (defaultRole: Role) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  role,
  userProfile,
  onOpenApplyModal,
  onSwitchRole,
  onNavigateLogin,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationsCount] = useState(2);

  return (
    <header className="sticky top-0 z-40 bg-[#eff4ff]/90 backdrop-blur-md border-b border-[#bcc9c6]/20 px-4 py-3 flex items-center justify-between gap-4">
      {/* Brand or Search */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left group"
        >
          <span className="font-bold text-xl text-[#00685f] tracking-tight group-hover:text-[#008378] transition-colors">
            SmartFin Connect
          </span>
        </button>

        {/* Global Search input */}
        {currentView !== 'login' && currentView !== 'register' && (
          <div className="hidden md:flex items-center gap-2 bg-white border border-[#bcc9c6]/40 rounded-full px-3 py-1.5 text-xs text-[#3d4947] w-64 focus-within:ring-2 focus-within:ring-[#00685f]/30">
            <span className="material-symbols-outlined text-sm text-[#6d7a77]">search</span>
            <input
              type="text"
              placeholder="Search loans, rates, providers..."
              className="bg-transparent border-none outline-none w-full text-xs text-[#0b1c30]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigate('loan-products');
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Center Nav Links for Landing - Removed per requirements */}

      {/* Right Controls */}
      {currentView !== 'login' && currentView !== 'register' && (
        <div className="flex items-center gap-3">
          {/* Notifications Icon Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-[#d3e4fe] transition-colors relative text-[#3d4947]"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#bcc9c6]/30 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="font-bold text-sm text-[#0b1c30]">Notifications</span>
                  <span className="text-[10px] text-[#00685f] bg-[#89f5e7]/40 px-2 py-0.5 rounded-full font-bold">
                    {unreadNotificationsCount} New
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                  <div className="p-2 bg-[#eff4ff] rounded-lg border-l-2 border-[#00685f]">
                    <p className="font-semibold text-[#0b1c30]">Application Update</p>
                    <p className="text-[#3d4947]">EcoBank requested utility bill for APP-8950.</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">10 mins ago</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-[#0b1c30]">Loan Pre-Approved</p>
                    <p className="text-[#3d4947]">Your Auto Loan Pro application was pre-approved!</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role toggle badge - Navigate to Login */}
          <div className="hidden sm:flex bg-[#e5eeff] p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => onNavigateLogin ? onNavigateLogin('user') : onNavigate('login')}
              className={`px-3 py-1 rounded-full transition-all ${
                role === 'user'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#3d4947] hover:text-[#00685f]'
              }`}
            >
              Member
            </button>
            <button
              onClick={() => onNavigateLogin ? onNavigateLogin('provider') : onNavigate('login')}
              className={`px-3 py-1 rounded-full transition-all ${
                role === 'provider'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#3d4947] hover:text-[#00685f]'
              }`}
            >
              Provider
            </button>
          </div>

          {/* User Avatar */}
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00685f]/20"
            />
          ) : null}
        </div>
      )}
    </header>
  );
};
