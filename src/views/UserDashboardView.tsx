import React, { useState } from 'react';
import { JSX } from 'react';
import { ViewMode, LoanProduct, ApplicationItem, UserProfile, UserNotification, ApprovedLoan } from '../types';

interface UserDashboardViewProps {
  userProfile: UserProfile;
  applications: ApplicationItem[];
  products: LoanProduct[];
  onNavigate: (view: ViewMode) => void;
  onSelectProduct: (product: LoanProduct) => void;
  onOpenApplyModal: () => void;
  onOpenSupport: () => void;
  notifications?: UserNotification[];
  loans?: ApprovedLoan[];
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  userProfile,
  applications,
  products,
  onNavigate,
  onSelectProduct,
  onOpenApplyModal,
  onOpenSupport,
  notifications = [],
  loans = [],
}) => {
  const smartFinUpdates: Array<{ date: string; tag: string; title: string; summary: string }> = [];
  const [savedProductsCount] = useState(0);
  const pendingApps = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Action Required' || a.status === 'In Progress'
  );
  const approvedApps = applications.filter((a) => a.status === 'Approved');
  const actionRequiredApp = applications.find((a) => a.status === 'Action Required');

  return (
    <div className="user-dashboard-view space-y-6 pb-12">
      {/* Header section */}
      <div className="user-dashboard-welcome flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-on-surface">
              Welcome back, {userProfile.name}
            </h1>
            <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Verified Member
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">
            Here's your financial overview • {userProfile.location} • Credit Rating: {userProfile.creditScore} (Good)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('loan-products')}
            className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Continue Discovery</span>
          </button>
        </div>
      </div>

      {/* KPI/stat cards row (4 compact cards) */}
      <div className="flex overflow-x-auto gap-4 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:pb-0 scrollbar-none">
        <div className="user-dashboard-stat min-w-55 flex-1 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant block">Applications in Progress</span>
            <span className="text-2xl font-extrabold text-primary mt-1 block">
              {pendingApps.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">hourglass_top</span>
          </div>
        </div>

        <div className="user-dashboard-stat min-w-55 flex-1 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant block">Approved Loans</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {approvedApps.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        <div className="user-dashboard-stat min-w-55 flex-1 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant block">Saved Products</span>
            <span className="text-2xl font-extrabold text-secondary mt-1 block">
              {savedProductsCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </div>
        </div>

        {/* Credit Score Rating card removed per design (no demo widget) */}
      </div>

      {/* Action Required Alert Banner */}
      {loans.length > 0 && (
        <div className="user-dashboard-loans bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
          <h3 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2"><span className="material-symbols-outlined">account_balance</span>Approved loans & repayments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{loans.map((loan) => <div key={loan.id} className="bg-white rounded-xl p-3 text-xs border border-emerald-100"><p className="font-bold text-[#0b1c30]">{loan.product_name} · {loan.provider_name}</p><p className="mt-1 text-[#3d4947]">Outstanding: <strong>MWK {Number(loan.outstanding_balance).toLocaleString()}</strong></p><p className="text-[#3d4947]">Next payment: <strong>MWK {Number(loan.payment_amount).toLocaleString()}</strong> due {loan.next_payment_due || 'scheduled soon'}</p></div>)}</div>
        </div>
      )}
      {actionRequiredApp && (
        <div className="user-dashboard-action bg-error-container border border-error/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-on-error-container">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
            <div>
              <span className="font-bold block text-sm">Action Required on Application {actionRequiredApp.id}</span>
              <p>{actionRequiredApp.actionRequiredText || 'Documentation required by institution.'}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-applications')}
            className="px-4 py-2 bg-error hover:bg-on-error-container text-white font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            Upload Document
          </button>
        </div>
      )}

      {/* Main Grid: Applications Panel + Recommendations + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Current Applications + Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Applications Panel */}
          <div className="user-dashboard-panel bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">assignment</span>
                <span>Current Applications</span>
              </h2>
              {applications.length > 0 && (
                <button
                  onClick={() => onNavigate('my-applications')}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View Tracker History
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-10 space-y-3 bg-surface-container-low/40 rounded-2xl border border-dashed border-outline-variant/50 p-6">
                <div className="w-12 h-12 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">inbox</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-on-surface">You haven't applied for any services yet</h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    Discover verified loans, savings accounts, and SACCOs tailored to your profile in Malawi.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('loan-products')}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">explore</span>
                  <span>Start Discovery</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/30">
                      <th className="p-3 rounded-l-xl">App ID</th>
                      <th className="p-3">Product & Provider</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3 font-bold text-on-surface">{app.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-on-surface block">{app.productName}</span>
                          <span className="text-[11px] text-gray-500">{app.providerName}</span>
                        </td>
                        <td className="p-3 font-bold text-primary">
                          MWK {app.amount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Action Required'
                                ? 'bg-amber-100 text-amber-800'
                                : app.status === 'Under Review' || app.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : app.status === 'Declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-surface-container text-primary'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => onNavigate('my-applications')}
                            className="px-3 py-1 bg-surface-container-low text-primary font-bold rounded-lg hover:bg-surface-container transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recommendations Panel */}
          <div className="user-dashboard-panel bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="font-extrabold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">thumb_up</span>
                <span>Tailored Recommendations</span>
              </h2>
              <button
                onClick={() => onNavigate('loan-products')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Explore All Products
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 2).map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-surface-container-low/60 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 hover:border-primary transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full">
                        98% Profile Match
                      </span>
                      <span className="text-xs font-extrabold text-primary">{p.rateDisplay}</span>
                    </div>
                    <h3 className="font-bold text-sm text-on-surface">{p.name}</h3>
                    <p className="text-[11px] text-on-surface-variant">{p.provider}</p>

                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[9px] bg-white text-primary font-bold px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        onSelectProduct(p);
                        onNavigate('product-details');
                      }}
                      className="w-full py-2 bg-white text-[#00685f] font-bold text-xs rounded-xl border border-[#00685f]/30 hover:bg-[#f4fffc] transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1-Col: Member Insight + Recent Activity & Notifications */}
        <div className="space-y-6">
          {/* SmartFin Access Connect updates */}
          <div className="user-dashboard-updates bg-[#ebe5dc] p-5 rounded-2xl border border-[#ded7cd] shadow-sm text-[#132d3a] space-y-4">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e56f5d]">SmartFin updates</p><h3 className="mt-1 font-serif text-2xl font-normal">News & platform updates</h3></div><span className="material-symbols-outlined text-[#e56f5d]">campaign</span></div>
            {smartFinUpdates.length > 0 ? <div className="space-y-3">{smartFinUpdates.map((update) => <article key={update.title} className="border-t border-[#c9c0b5] pt-3"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#e56f5d]">{update.tag}</span><span className="text-[10px] text-[#9aa3a1]">{update.date}</span></div><h4 className="mt-1 text-sm font-bold text-[#132d3a]">{update.title}</h4><p className="mt-1 text-[11px] leading-5 text-[#69777a]">{update.summary}</p></article>)}</div> : <div className="border-t border-[#c9c0b5] py-8 text-center"><span className="material-symbols-outlined text-3xl text-[#b6aaa0]">campaign</span><p className="mt-2 text-sm font-bold text-[#132d3a]">No new updates</p><p className="mt-1 text-[11px] leading-5 text-[#69777a]">SmartFin Access Connect announcements will appear here when available.</p></div>}
            <button type="button" onClick={onOpenSupport} className="inline-flex items-center gap-2 text-xs font-bold text-[#132d3a] transition-colors hover:text-[#e56f5d]">Ask SmartFin Support <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
          </div>

          {/* Activity Timeline & Notifications Feed */}
          <div className="user-dashboard-panel bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-on-surface flex items-center justify-between">
              <span>Recent Activity Feed</span>
              <span className="text-[10px] bg-surface-container text-primary px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="text-center py-8 text-on-surface-variant">
              {notifications.length === 0 ? <><p className="font-medium">No recent activity to show.</p><p className="text-[11px]">Live activity will appear here when available.</p></> : notifications.slice(0, 5).map((notification) => <div key={notification.id} className="rounded-xl bg-surface-container-low p-3 text-left"><p className="font-bold text-on-surface">{notification.title}</p><p className="text-[11px] text-on-surface-variant mt-1">{notification.message}</p><p className="text-[10px] text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
