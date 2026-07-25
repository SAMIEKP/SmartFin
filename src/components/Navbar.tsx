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
      </div>

      {/* Center Nav Links for Landing - Removed per requirements */}

      {/* Right Controls */}
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

{/* Login Primary CTA */}
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">login</span>
          <span>Login</span>
        </button>

        {/* Profile Avatar / Login CTA */}
        {role === 'guest' ? (
          <button
            onClick={() => onNavigate('register')}
            className="px-3 py-1.5 border border-[#00685f] text-[#00685f] hover:bg-[#00685f] hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            Sign In / Register
          </button>
        ) : currentView !== 'landing' ? (
          <button
            onClick={() => onNavigate('user-profile')}
            className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="View Profile"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00685f]/20"
            />
          </button>
        ) : null}
      </div>
    </header>
  );
};
