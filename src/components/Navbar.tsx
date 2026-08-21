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
    <header
      className={`${currentView === 'landing' ? 'absolute top-0 left-0 w-full bg-transparent border-[#132d3a]/10' : 'sticky top-0 bg-[#f4f0e9]/90 border-[#bcc9c6]/20'} z-40 backdrop-blur-sm border-b px-6 py-4 sm:px-10 lg:px-12 flex items-center justify-between gap-4`}
    >
      {/* Brand or Search */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left group"
        >
          <span className="font-serif text-xl font-bold tracking-[-.03em] text-[#132d3a] group-hover:text-[#e56f5d] transition-colors">
            smartfin<span className="text-[#e56f5d]">.</span>
          </span>
        </button>

      </div>

      {currentView === 'landing' && (
        <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.14em] text-[#53636a] lg:flex">
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#e56f5d]">How it works</button>
          <button onClick={() => onNavigate('loan-products')} className="hover:text-[#e56f5d]">Loan options</button>
          <button onClick={() => onNavigateToRegister?.('provider')} className="hover:text-[#e56f5d]">For providers</button>
        </nav>
      )}

      {/* Right Controls */}
      {currentView === 'landing' && (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigateToRegister?.('user')}
            className="hidden px-3 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#53636a] transition-colors hover:text-[#e56f5d] sm:block"
          >
            Member login
          </button>
          <button
            onClick={() => onNavigateToRegister?.('provider')}
            className="border border-[#132d3a] bg-[#132d3a] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.12em] text-white transition-colors hover:border-[#e56f5d] hover:bg-[#e56f5d]"
          >
            Join SmartFin
          </button>
        </div>
      )}
    </header>
  );
};
