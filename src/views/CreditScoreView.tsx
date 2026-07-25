import React from 'react';
import { ViewMode, UserProfile } from '../types';

interface CreditScoreViewProps {
  userProfile: UserProfile;
  onNavigate: (view: ViewMode) => void;
  onOpenApplyModal: () => void;
}

export const CreditScoreView: React.FC<CreditScoreViewProps> = ({
  userProfile,
  onNavigate,
  onOpenApplyModal,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]">speed</span>
            <span>Malawi National Credit Score Analysis</span>
          </h1>
          <p className="text-xs text-[#3d4947] mt-1">
            Verified rating provided by the Credit Reference Bureau of Malawi.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading official Credit Reference Bureau PDF Certificate...')}
          className="px-5 py-2.5 bg-[#4648d4] hover:bg-[#2f2ebe] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">file_download</span>
          <span>Download Credit Certificate</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gauge Score Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0b1c30] to-[#112d4e] text-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center justify-between space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-3 py-1 rounded-full">
            Verified Identity Match
          </span>

          <div className="relative w-48 h-48 rounded-full border-8 border-[#4648d4] flex flex-col items-center justify-center bg-white/5 shadow-inner">
            <span className="text-5xl font-extrabold text-[#89f5e7]">{userProfile.creditScore}</span>
            <span className="text-xs font-bold text-white/80 uppercase mt-1">Good Rating</span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">Range: 300 - 850</span>
          </div>

          <p className="text-xs text-white/80 max-w-xs leading-relaxed">
            Your credit score places you in the top 15% of borrowers in Lilongwe District. You qualify for prime interest rates starting at 8.5% p.a.
          </p>

          <button
            onClick={() => onNavigate('loan-products')}
            className="w-full py-3 bg-[#89f5e7] text-[#00201d] font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer"
          >
            Unlock Prime Rate Loans
          </button>
        </div>

        {/* Breakdown Factors */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-6">
          <h2 className="font-extrabold text-base text-[#0b1c30]">Score Factor Breakdown</h2>

          <div className="space-y-4 text-xs">
            {/* Factor 1 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-[#0b1c30]">On-Time Payment History (35% weight)</span>
                <span className="text-emerald-600">98% Excellent</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%]"></div>
              </div>
              <p className="text-[11px] text-gray-500">24 out of 25 previous loan installments paid on time.</p>
            </div>

            {/* Factor 2 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-[#0b1c30]">Credit Utilization Ratio (30% weight)</span>
                <span className="text-[#00685f]">22% Low Risk</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-[#00685f] h-full w-[22%]"></div>
              </div>
              <p className="text-[11px] text-gray-500">Using MWK 1.2M out of MWK 5.5M total available limit.</p>
            </div>

            {/* Factor 3 */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-[#0b1c30]">Credit History Length (15% weight)</span>
                <span className="text-[#4648d4]">4.2 Years</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-[#4648d4] h-full w-[65%]"></div>
              </div>
              <p className="text-[11px] text-gray-500">Active credit profile registered since 2020.</p>
            </div>
          </div>

          {/* Recommendations to reach Excellent (780+) */}
          <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/30 space-y-2 text-xs">
            <h3 className="font-bold text-[#00685f] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              <span>Tips to reach Excellent (780+ Score)</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#3d4947]">
              <li>Maintain current credit utilization below 30%.</li>
              <li>Keep older sacco/bank accounts active to increase average account age.</li>
              <li>Limit new hard credit bureau inquiries to 1 every 6 months.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
