import React from 'react';
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

        </div>
      )}
    </header>
  );
};
