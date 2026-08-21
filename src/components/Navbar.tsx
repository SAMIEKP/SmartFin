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
  onNavigateToRegister?: (role: 'user' | 'provider') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  role,
  userProfile,
  onOpenApplyModal,
  onSwitchRole,
  onNavigateLogin,
  onNavigateToRegister,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#eff4ff]/90 backdrop-blur-md border-b border-[#bcc9c6]/20 px-4 py-3 flex items-center justify-between gap-4">
      {/* Brand or Search */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left group"
        >
          <span className="font-dancing font-bold text-3xl text-[#00685f] tracking-normal group-hover:text-[#008378] transition-colors">
            SmartFin Connect
          </span>
        </button>

      </div>

      {/* Center Nav Links for Landing - Removed per requirements */}

      {/* Right Controls */}
      {currentView === 'landing' && (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigateToRegister?.('user')}
            className="px-3 sm:px-5 py-2.5 bg-white hover:bg-[#00685f] hover:text-white text-[#00685f] border-2 border-[#00685f] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">person</span>
            <span>Member</span>
          </button>
          <button
            onClick={() => onNavigateToRegister?.('provider')}
            className="px-3 sm:px-5 py-2.5 bg-white hover:bg-[#855300] hover:text-white text-[#855300] border-2 border-[#855300] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">account_balance</span>
            <span>Provider</span>
          </button>
        </div>
      )}
    </header>
  );
};
