import React from 'react';
import { ViewMode, Role, UserProfile } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  role: Role;
  userProfile: UserProfile;
  onOpenSupport: () => void;
  onSwitchRole?: (newRole: Role) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  role,
  userProfile,
  onOpenSupport,
  onSwitchRole,
}) => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#eff4ff] flex flex-col p-4 gap-2 border-r border-[#bcc9c6]/20 z-50 overflow-y-auto custom-scrollbar">
      {/* Brand Header */}
      <div className="mb-6 px-2">
        <h1 
          onClick={() => onNavigate('landing')}
          className="font-bold text-2xl text-[#00685f] cursor-pointer hover:opacity-80 transition-opacity tracking-tight"
        >
          FinAccess
        </h1>
        <p className="text-xs text-[#3d4947] font-medium mt-0.5">
          {userProfile.memberStatus || (role === 'provider' ? 'Provider Dashboard' : 'Verified Member')}
        </p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onNavigate(role === 'provider' ? 'provider-dashboard' : 'user-dashboard')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'user-dashboard' || currentView === 'provider-dashboard'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate(role === 'provider' ? 'product-management' : 'loan-products')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'loan-products' || currentView === 'product-management' || currentView === 'product-details'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">payments</span>
          <span>Loan Products</span>
        </button>

        <button
          onClick={() => onNavigate('my-applications')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'my-applications'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">assignment_turned_in</span>
          <span>My Applications</span>
        </button>

        <button
          onClick={() => onNavigate('credit-score')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'credit-score'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">speed</span>
          <span>Credit Score</span>
        </button>

        <button
          onClick={() => onNavigate('calculator')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'calculator'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">calculate</span>
          <span>Calculator</span>
        </button>

        <button
          onClick={() => onNavigate('user-profile')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'user-profile'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">person</span>
          <span>Profile</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === 'settings'
              ? 'bg-[#6bd8cb] text-[#00685f] shadow-xs'
              : 'text-[#3d4947] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-base">settings</span>
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-[#3d4947] hover:bg-[#d3e4fe] transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">contact_support</span>
          <span>Support</span>
        </button>
      </nav>

      {/* Role Switcher Pill */}
      {onSwitchRole && (
        <div className="bg-[#d3e4fe]/50 p-1.5 rounded-xl flex gap-1 text-xs mb-2">
          <button
            onClick={() => onSwitchRole('user')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer ${
              role === 'user' ? 'bg-[#00685f] text-white shadow-xs' : 'text-[#3d4947] hover:text-[#00685f]'
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => onSwitchRole('provider')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer ${
              role === 'provider' ? 'bg-[#00685f] text-white shadow-xs' : 'text-[#3d4947] hover:text-[#00685f]'
            }`}
          >
            Provider
          </button>
        </div>
      )}

      {/* Expert Help Box */}
      <div className="mt-auto p-4 bg-[#008378] rounded-2xl text-[#f4fffc] flex flex-col items-center gap-2 text-center shadow-xs">
        <span className="material-symbols-outlined text-2xl">lightbulb</span>
        <p className="text-xs font-medium">
          {role === 'provider' ? 'Need performance insights?' : 'Need guidance on interest rates?'}
        </p>
        <button
          onClick={onOpenSupport}
          className="w-full py-2 px-3 bg-[#f4fffc] text-[#008378] rounded-xl text-xs font-bold hover:bg-white transition-colors cursor-pointer"
        >
          Get Expert Help
        </button>
      </div>

      {/* User Profile Bar */}
      <div 
        onClick={() => onNavigate('user-profile')}
        className="mt-3 flex items-center gap-2.5 px-2 pt-2 border-t border-[#bcc9c6]/30 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="w-9 h-9 rounded-full bg-[#d3e4fe] flex items-center justify-center overflow-hidden shrink-0 border border-[#00685f]/20">
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-[#00685f]">
              {userProfile.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#0b1c30] truncate">
            {userProfile.name}
          </span>
          <span className="text-[10px] text-[#3d4947] truncate">
            {userProfile.memberStatus}
          </span>
        </div>
      </div>
    </aside>
  );
};
