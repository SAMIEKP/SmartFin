import React, { useEffect, useRef, useState } from 'react';
import { ViewMode, Role, UserProfile, UserNotification } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  role: Role;
  userProfile: UserProfile;
  onOpenApplyModal: () => void;
  onSwitchRole?: (role: Role) => void;
  onNavigateLogin?: (defaultRole: Role) => void;
  onNavigateToRegister?: (role: 'user' | 'provider') => void;
  notifications?: UserNotification[];
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
  notifications = [],
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.read_at).length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const userViewTitles: Partial<Record<ViewMode, string>> = {
    'user-dashboard': 'Dashboard',
    'loan-products': 'Explore Services',
    'product-details': 'Loan Details',
    'my-applications': 'My Applications',
    'credit-score': 'Credit Score',
    calculator: 'Repayment Calculator',
    'user-profile': 'My Profile',
    settings: 'Settings',
    support: 'Support',
  };
  const providerViewTitles: Partial<Record<ViewMode, string>> = {
    'provider-dashboard': 'Provider Dashboard',
    'product-management': 'Loan Products',
    'application-management': 'Applications',
    'provider-onboarding': 'Provider Onboarding',
    settings: 'Settings',
    support: 'Support',
    'user-profile': 'Profile',
  };
  const headerTitle = currentView !== 'landing'
    ? role === 'provider'
      ? providerViewTitles[currentView] || 'Provider Dashboard'
      : userViewTitles[currentView] || 'Dashboard'
    : 'SmartFin Connect';

  return (
    <header
      className={`${currentView === 'landing' ? 'absolute top-0 left-0 w-full bg-transparent border-[#132d3a]/10' : role === 'user' ? 'sticky top-0 bg-[#faf8f4]/90 border-transparent' : 'sticky top-0 bg-[#f4f0e9]/90 border-[#bcc9c6]/20'} z-40 backdrop-blur-sm border-b px-6 py-4 sm:px-10 lg:px-12 flex items-center justify-between gap-4`}
    >
      {/* Brand or Search */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left"
        >
          <span className={`${currentView !== 'landing' ? 'font-geist text-lg font-extrabold tracking-[-.04em]' : 'font-great-vibes text-4xl'} text-[#132d3a]`}>
            {headerTitle}
          </span>
        </button>

      </div>

      {currentView === 'landing' && (
        <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.14em] text-[#53636a] lg:flex">
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#e56f5d]">How it works</button>
          <button onClick={() => document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#e56f5d]">Loan options</button>
          <button onClick={() => onNavigateToRegister?.('provider')} className="hover:text-[#e56f5d]">For providers</button>
        </nav>
      )}

      {role === 'user' && currentView !== 'landing' && (
        <div className="flex items-center gap-3">
          <div ref={notificationRef} className="relative">
            <button type="button" onClick={() => setIsNotificationsOpen((value) => !value)} className="user-header-icon relative" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={isNotificationsOpen} title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && <span className="user-notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            {isNotificationsOpen && (
              <div className="user-notification-popover" role="dialog" aria-label="Notifications">
                <div className="flex items-center justify-between border-b border-[#ded7cd] px-4 py-3">
                  <h2 className="font-serif text-lg text-[#132d3a]">Notifications</h2>
                  {unreadCount > 0 && <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#e56f5d]">{unreadCount} new</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-[#69777a]">You are all caught up.</div>
                  ) : notifications.slice(0, 6).map((notification) => (
                    <div key={notification.id} className={`border-b border-[#eee8df] px-4 py-3 last:border-0 ${notification.read_at ? '' : 'bg-[#fff7f3]'}`}>
                      <div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.read_at ? 'bg-[#c9c0b5]' : 'bg-[#e56f5d]'}`} /><div className="min-w-0"><p className="text-xs font-bold text-[#132d3a]">{notification.title}</p><p className="mt-1 text-[11px] leading-5 text-[#69777a]">{notification.message}</p><p className="mt-1 text-[10px] text-[#9aa3a1]">{new Date(notification.created_at).toLocaleString()}</p></div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button type="button" onClick={() => onNavigate('user-profile')} className="user-header-profile" aria-label="Open profile"><span>{userProfile.name?.charAt(0) || 'M'}</span></button>
        </div>
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
