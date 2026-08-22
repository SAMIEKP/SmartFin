import React from "react";
import { ViewMode, Role, UserProfile } from "../types";

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  role: Role;
  userProfile: UserProfile;
  onOpenSupport: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  role,
  userProfile,
  onOpenSupport,
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside className={`${role === 'user' ? 'user-app-sidebar hidden lg:flex' : 'flex'} ${collapsed ? 'sidebar-collapsed w-20' : 'w-64'} h-screen fixed left-0 top-0 bg-[#eff4ff] flex-col p-4 gap-2 border-r border-[#bcc9c6]/20 z-50 overflow-y-auto custom-scrollbar transition-[width] duration-200`}>
      {/* Brand Header */}
      <div className={`sidebar-brand mb-6 px-2 ${collapsed ? 'text-center' : ''}`}>
        <h1
          className="sidebar-logo"
        >
          {collapsed ? 'FA' : 'FinAccess'}
        </h1>
        <p className="sidebar-label text-xs text-[#3d4947] font-medium mt-0.5">
          Clear finance. Better decisions.
        </p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() =>
            onNavigate(
              role === "provider" ? "provider-dashboard" : "user-dashboard",
            )
          }
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === "user-dashboard" ||
            currentView === "provider-dashboard"
              ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
              : "text-[#3d4947] hover:bg-[#d3e4fe]"
          }`}
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span className="sidebar-label">Dashboard</span>
        </button>

        <button
          onClick={() =>
            onNavigate(
              role === "provider" ? "product-management" : "loan-products",
            )
          }
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === "loan-products" ||
            currentView === "product-management" ||
            currentView === "product-details"
              ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
              : "text-[#3d4947] hover:bg-[#d3e4fe]"
          }`}
        >
          <span className="material-symbols-outlined text-base">payments</span>
          <span className="sidebar-label">Services</span>
        </button>

        {role === "provider" && (
          <button
            onClick={() => onNavigate("application-management")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentView === "application-management"
                ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
                : "text-[#3d4947] hover:bg-[#d3e4fe]"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              inventory
            </span>
            <span className="sidebar-label">Application Management</span>
          </button>
        )}

        {role === 'user' && (
          <>
            <button
              onClick={() => onNavigate("my-applications")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                currentView === "my-applications"
                  ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
                  : "text-[#3d4947] hover:bg-[#d3e4fe]"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                assignment_turned_in
              </span>
              <span className="sidebar-label">My Applications</span>
            </button>

            <button
              onClick={() => onNavigate("credit-score")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                currentView === "credit-score"
                  ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
                  : "text-[#3d4947] hover:bg-[#d3e4fe]"
              }`}
            >
              <span className="material-symbols-outlined text-base">speed</span>
              <span className="sidebar-label">Credit Score</span>
            </button>
          </>
        )}

        <button
          onClick={() => onNavigate("calculator")}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === "calculator"
              ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
              : "text-[#3d4947] hover:bg-[#d3e4fe]"
          }`}
        >
          <span className="material-symbols-outlined text-base">calculate</span>
          <span className="sidebar-label">Calculator</span>
        </button>

        <button
          onClick={() => onNavigate("user-profile")}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === "user-profile"
              ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
              : "text-[#3d4947] hover:bg-[#d3e4fe]"
          }`}
        >
          <span className="material-symbols-outlined text-base">person</span>
          <span className="sidebar-label">Profile</span>
        </button>

        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            currentView === "settings"
              ? "bg-[#6bd8cb] text-[#00685f] shadow-xs"
              : "text-[#3d4947] hover:bg-[#d3e4fe]"
          }`}
        >
          <span className="material-symbols-outlined text-base">settings</span>
          <span className="sidebar-label">Settings</span>
        </button>

        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-[#3d4947] hover:bg-[#d3e4fe] transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">
            contact_support
          </span>
          <span className="sidebar-label">Support</span>
        </button>
      </nav>

      {/* Role Indicator */}
      <div className="sidebar-label bg-[#d3e4fe]/50 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#00685f] mb-2 text-center">
        {role === "user" ? "Member" : "Provider"}
      </div>

      {/* User Profile Bar */}
      <div
        onClick={() => onNavigate("user-profile")}
        className={`sidebar-profile mt-3 flex items-center gap-2.5 px-2 pt-2 border-t border-[#bcc9c6]/30 cursor-pointer hover:opacity-90 transition-opacity ${collapsed ? 'justify-center' : ''}`}
      >
        <div className="w-9 h-9 rounded-full bg-[#d3e4fe] flex items-center justify-center overflow-hidden shrink-0 border border-[#00685f]/20">
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={role === 'provider' ? userProfile.institutionName || 'FinAccess Institution' : userProfile.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="font-bold text-[#00685f]">
              {(role === 'provider' ? userProfile.institutionName || 'FinAccess Institution' : userProfile.name).charAt(0)}
            </span>
          )}
        </div>
        <div className="sidebar-label flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#0b1c30] truncate">
            {role === 'provider' ? userProfile.institutionName || 'FinAccess Institution' : userProfile.name}
          </span>
          <span className="text-[10px] text-[#3d4947] truncate">
            {role === 'provider' ? userProfile.providerStatus || userProfile.memberStatus : userProfile.memberStatus}
          </span>
        </div>
      </div>

      {onToggleCollapse && (
        <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="sidebar-toggle mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#bcc9c6]/30 p-3 text-xs font-bold text-[#3d4947] transition-colors hover:bg-[#d3e4fe]">
          <span className="material-symbols-outlined text-base">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
          <span className="sidebar-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      )}
    </aside>
  );
};

interface MobileBottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  const items: Array<{ view: ViewMode; label: string; icon: string }> = [
    { view: 'user-dashboard', label: 'Home', icon: 'home' },
    { view: 'loan-products', label: 'Explore', icon: 'explore' },
    { view: 'my-applications', label: 'Applications', icon: 'assignment_turned_in' },
    { view: 'user-profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="user-mobile-nav lg:hidden" aria-label="Member navigation">
      {items.map((item) => {
        const isActive = currentView === item.view || (item.view === 'loan-products' && currentView === 'product-details');
        return (
          <button key={item.view} type="button" onClick={() => onNavigate(item.view)} className={isActive ? 'is-active' : ''} aria-label={item.label}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
