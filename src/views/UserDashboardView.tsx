import React, { useState } from 'react';
import { JSX } from 'react';
import { ViewMode, LoanProduct, ApplicationItem, UserProfile } from '../types';

interface UserDashboardViewProps {
  userProfile: UserProfile;
  applications: ApplicationItem[];
  products: LoanProduct[];
  onNavigate: (view: ViewMode) => void;
  onSelectProduct: (product: LoanProduct) => void;
  onOpenApplyModal: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  userProfile,
  applications,
  products,
  onNavigate,
  onSelectProduct,
  onOpenApplyModal,
}) => {
  const [savedProductsCount] = useState(0);
  const pendingApps = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Action Required' || a.status === 'In Progress'
  );
  const approvedApps = applications.filter((a) => a.status === 'Approved');
  const actionRequiredApp = applications.find((a) => a.status === 'Action Required');

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
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
        <div className="min-w-55 flex-1 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
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

        <div className="min-w-55 flex-1 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
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

        <div className="min-w-55 flex-1 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
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
      {actionRequiredApp && (
        <div className="bg-error-container border border-error/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-on-error-container">
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
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
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
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
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
          {/* Advisory Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-md text-white p-6 bg-surface-container-high min-h-[200px] flex flex-col justify-between">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMkeEuPpmmzKQpkQB5rNK_FjU_AjlZFp6ULorYRy-N61J_GNkhmq4dX3TazjatopsKZQZf-jJg-JziCMYnc6WTfo0oBn75ACeTduoSETcn6FcseTN4zjbkoaY9PBIAx50NJOVc1XVDRgSr9tI5DIMYtWBJP7AvmOgscJDtT0xEs3S_y1wSCH5FC1wjZpYV8Dnz7mCP7_FqWiLeXHqC8mSL9r2Zn8cSrbOlTXLjy7AMloowqkH80-4X6yRtY_yhSyVrvmHrhDEVbL0"
              alt="Financial City Insights"
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
              loading="lazy"
              decoding="async"
            />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full">
                Credit Rating Advantage
              </span>
              <h3 className="text-base font-extrabold">Subsidized Agricultural & SME Rates</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Access personalized lending rates and offers based on your verified credit profile.
              </p>
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="relative z-10 mt-3 py-2 px-4 bg-primary-fixed text-on-primary-fixed font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer w-fit"
            >
              Simulate Repayments
            </button>
          </div>

          {/* Activity Timeline & Notifications Feed */}
          <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-on-surface flex items-center justify-between">
              <span>Recent Activity Feed</span>
              <span className="text-[10px] bg-surface-container text-primary px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="text-center py-8 text-on-surface-variant">
                <p className="font-medium">No recent activity to show.</p>
                <p className="text-[11px]">Live activity will appear here when available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
