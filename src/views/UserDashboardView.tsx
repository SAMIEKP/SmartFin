import React, { useState } from 'react';
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
  const [savedProductsCount] = useState(4);
  const pendingApps = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Action Required' || a.status === 'In Progress'
  );
  const approvedApps = applications.filter((a) => a.status === 'Approved');
  const actionRequiredApp = applications.find((a) => a.status === 'Action Required');

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0b1c30]">
              Welcome back, {userProfile.name}
            </h1>
            <span className="bg-[#89f5e7] text-[#00201d] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Verified Member
            </span>
          </div>
          <p className="text-xs text-[#3d4947] mt-1 font-medium">
            Here's your financial overview • {userProfile.location} • Credit Rating: {userProfile.creditScore} (Good)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('loan-products')}
            className="px-4 py-2.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Continue Discovery</span>
          </button>
        </div>
      </div>

      {/* KPI/stat cards row (4 compact cards) */}
      <div className="flex overflow-x-auto gap-4 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:pb-0 scrollbar-none">
        <div className="min-w-[220px] flex-1 bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#3d4947] block">Applications in Progress</span>
            <span className="text-2xl font-extrabold text-[#00685f] mt-1 block">
              {pendingApps.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#e5eeff] text-[#00685f] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">hourglass_top</span>
          </div>
        </div>

        <div className="min-w-[220px] flex-1 bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#3d4947] block">Approved Loans</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {approvedApps.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        <div className="min-w-[220px] flex-1 bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#3d4947] block">Saved Products</span>
            <span className="text-2xl font-extrabold text-[#855300] mt-1 block">
              {savedProductsCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#ffddb8]/50 text-[#855300] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </div>
        </div>

        <div className="min-w-[220px] flex-1 bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#3d4947] block">Credit Score Rating</span>
            <span className="text-2xl font-extrabold text-[#4648d4] mt-1 block">
              {userProfile.creditScore} / 850
            </span>
          </div>
          <button
            onClick={() => onNavigate('credit-score')}
            className="w-11 h-11 rounded-xl bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center hover:bg-[#c0c1ff] transition-colors cursor-pointer shrink-0"
            title="View full credit report"
          >
            <span className="material-symbols-outlined text-2xl">speed</span>
          </button>
        </div>
      </div>

      {/* Action Required Alert Banner */}
      {actionRequiredApp && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#93000a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
            <div>
              <span className="font-bold block text-sm">Action Required on Application {actionRequiredApp.id}</span>
              <p>{actionRequiredApp.actionRequiredText || 'Documentation required by institution.'}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-applications')}
            className="px-4 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
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
          <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/30 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f]">assignment</span>
                <span>Current Applications</span>
              </h2>
              {applications.length > 0 && (
                <button
                  onClick={() => onNavigate('my-applications')}
                  className="text-xs font-bold text-[#00685f] hover:underline"
                >
                  View Tracker History
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-10 space-y-3 bg-[#eff4ff]/40 rounded-2xl border border-dashed border-[#bcc9c6]/50 p-6">
                <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#00685f] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">inbox</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-[#0b1c30]">You haven't applied for any services yet</h3>
                  <p className="text-xs text-[#3d4947] max-w-sm mx-auto">
                    Discover verified loans, savings accounts, and SACCOs tailored to your profile in Malawi.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('loan-products')}
                  className="px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">explore</span>
                  <span>Start Discovery</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#eff4ff] text-[#3d4947] font-bold border-b border-[#bcc9c6]/30">
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
                        <td className="p-3 font-bold text-[#0b1c30]">{app.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-[#0b1c30] block">{app.productName}</span>
                          <span className="text-[11px] text-gray-500">{app.providerName}</span>
                        </td>
                        <td className="p-3 font-bold text-[#00685f]">
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
                                : 'bg-[#e5eeff] text-[#00685f]'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => onNavigate('my-applications')}
                            className="px-3 py-1 bg-[#eff4ff] text-[#00685f] font-bold rounded-lg hover:bg-[#d3e4fe] transition-colors"
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
          <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/30 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#855300]">thumb_up</span>
                <span>Tailored Recommendations</span>
              </h2>
              <button
                onClick={() => onNavigate('loan-products')}
                className="text-xs font-bold text-[#00685f] hover:underline"
              >
                Explore All Products
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 2).map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-[#eff4ff]/60 rounded-2xl border border-[#bcc9c6]/30 flex flex-col justify-between space-y-3 hover:border-[#00685f] transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded-full">
                        98% Profile Match
                      </span>
                      <span className="text-xs font-extrabold text-[#00685f]">{p.rateDisplay}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0b1c30]">{p.name}</h3>
                    <p className="text-[11px] text-[#3d4947]">{p.provider}</p>

                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[9px] bg-white text-[#00685f] font-bold px-2 py-0.5 rounded">
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
          <div className="relative rounded-2xl overflow-hidden shadow-md text-white p-6 bg-[#00201d] min-h-[200px] flex flex-col justify-between">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMkeEuPpmmzKQpkQB5rNK_FjU_AjlZFp6ULorYRy-N61J_GNkhmq4dX3TazjatopsKZQZf-jJg-JziCMYnc6WTfo0oBn75ACeTduoSETcn6FcseTN4zjbkoaY9PBIAx50NJOVc1XVDRgSr9tI5DIMYtWBJP7AvmOgscJDtT0xEs3S_y1wSCH5FC1wjZpYV8Dnz7mCP7_FqWiLeXHqC8mSL9r2Zn8cSrbOlTXLjy7AMloowqkH80-4X6yRtY_yhSyVrvmHrhDEVbL0"
              alt="Financial City Insights"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded-full">
                Credit Rating Advantage
              </span>
              <h3 className="text-base font-extrabold">Subsidized Agricultural & SME Rates</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Your 740 score unlocks prime rates starting at 8.5% p.a. with Reserve Bank certified lenders.
              </p>
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="relative z-10 mt-3 py-2 px-4 bg-[#89f5e7] text-[#00201d] font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer w-fit"
            >
              Simulate Repayments
            </button>
          </div>

          {/* Activity Timeline & Notifications Feed */}
          <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center justify-between">
              <span>Recent Activity Feed</span>
              <span className="text-[10px] bg-[#e5eeff] text-[#00685f] px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex gap-3 items-start p-2 bg-[#eff4ff]/50 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] mt-1 shrink-0"></span>
                <div>
                  <p className="font-bold text-[#0b1c30]">Utility Bill Requested</p>
                  <p className="text-[#3d4947] text-[11px]">EcoBank requested residence proof for APP-8950.</p>
                  <span className="text-[10px] text-gray-400">Today • 10:24 AM</span>
                </div>
              </div>

              <div className="flex gap-3 items-start p-2 bg-emerald-50/60 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
                <div>
                  <p className="font-bold text-[#0b1c30]">Auto Loan Approved</p>
                  <p className="text-[#3d4947] text-[11px]">NBS Bank approved APP-8995 for MWK 4,500,000.</p>
                  <span className="text-[10px] text-gray-400">Oct 21, 2024</span>
                </div>
              </div>

              <div className="flex gap-3 items-start p-2 bg-purple-50/60 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4648d4] mt-1 shrink-0"></span>
                <div>
                  <p className="font-bold text-[#0b1c30]">Credit Score Updated</p>
                  <p className="text-[#3d4947] text-[11px]">CRB rating increased to 740 points.</p>
                  <span className="text-[10px] text-gray-400">Oct 15, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
