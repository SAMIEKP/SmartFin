import React from 'react';
import { ViewMode, LoanProduct } from '../types';
import { Footer } from '../components/Footer';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
  products: LoanProduct[];
  onSelectProduct: (product: LoanProduct) => void;
  onOpenApplyModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  products,
  onSelectProduct,
  onOpenApplyModal,
}) => {
  const featuredProducts = products.filter((p) => p.isMatch || p.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#f8f9ff] pt-12 pb-20 px-4 md:px-8 border-b border-[#bcc9c6]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#89f5e7]/40 text-[#005049] rounded-full text-xs font-bold border border-[#008378]/20">
              <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
              <span>Malawi's Premier Financial Portal</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b1c30] tracking-tight leading-tight">
              Access Verified <span className="text-[#00685f]">Loans & Credit</span> Products in Malawi.
            </h1>

            <p className="text-base md:text-lg text-[#3d4947] leading-relaxed max-w-2xl font-normal">
              Connect directly with verified Malawian banks, microfinance sacco institutions, and licensed credit providers. Compare rates, calculate repayments, and submit instant applications with transparent terms.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('loan-products')}
                className="px-6 py-3.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Explore Loan Products</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigate('calculator')}
                className="px-6 py-3.5 bg-white border border-[#00685f] text-[#00685f] hover:bg-[#f4fffc] font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">calculate</span>
                <span>Loan Calculator</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#bcc9c6]/30">
              <div>
                <span className="block text-2xl font-extrabold text-[#00685f]">MWK 1.2B+</span>
                <span className="text-xs text-[#3d4947]">Capital Applied</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#00685f]">14+</span>
                <span className="text-xs text-[#3d4947]">Verified Partners</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#00685f]">98.4%</span>
                <span className="text-xs text-[#3d4947]">Match Accuracy</span>
              </div>
            </div>
          </div>

          {/* Right Column Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRncdrmA6bC0uISCtdq_8wI0YixkVQVx1TK-GHaR_Dw2LJim9E3vG8Keo9GG-prB61-wW9kEffNX3fIMQ_QqLxzT1pJBRI_KoqVcvLwclnt70hnur23DcGcSTFPm8d5FuDMDGY7g2HwBqjkYsVBG9wohl83D1nfuZ2VrkTaPPNR2IZC0Aw3c9ToQVXT8XLF9EeeRjjtURgW9ETcFkE71nZ7ngZpzd-7cymkzNG_A4BXcTaUjpGTtq1br4VCtkWfnNsZKrfM1MlWfY"
                alt="FinAccess Malawi Member"
                className="w-full h-96 object-cover"
              />

              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#bcc9c6]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0b1c30]">Reserve Bank Approved Standards</h4>
                  <p className="text-[11px] text-[#3d4947]">Licensed credit bureau & encryption security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Role Selector Cards */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-3 py-1 rounded-full">
            Tailored Experiences
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1c30] mt-3">
            Built for Individuals & Financial Institutions
          </h2>
          <p className="text-sm text-[#3d4947] mt-2">
            Select your account pathway to access customized tools and loan management dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Individual Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#bcc9c6]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e5eeff] text-[#00685f] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0b1c30]">For Individuals & Small Businesses</h3>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Discover competitive rates for personal loans, agricultural expansion, mortgages, or SME working capital. Calculate exact monthly repayments and submit applications online.
              </p>
              <ul className="space-y-2 text-xs text-[#0b1c30]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-base">check_circle</span>
                  <span>Compare rates from top Malawian banks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-base">check_circle</span>
                  <span>Free credit score assessment & history tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-base">check_circle</span>
                  <span>Direct application status updates</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('user-dashboard')}
              className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Member Dashboard</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Provider Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#bcc9c6]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#ffddb8] text-[#855300] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0b1c30]">For Financial Institutions & Lenders</h3>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                List loan products, receive pre-verified applicants, manage loan catalogs, and streamline credit decisioning with automated compliance verification.
              </p>
              <ul className="space-y-2 text-xs text-[#0b1c30]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-base">check_circle</span>
                  <span>Publish and manage custom financial product catalogs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-base">check_circle</span>
                  <span>Automated biometric & tax PIN risk checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-base">check_circle</span>
                  <span>Real-time loan decision analytics & approval volume</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('provider-dashboard')}
              className="w-full py-3 bg-[#855300] hover:bg-[#653e00] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Provider Portal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Bento Grid */}
      <section className="py-12 px-4 md:px-8 bg-[#eff4ff] border-y border-[#bcc9c6]/20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider">
                Top Rated Products
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] mt-1">
                Featured Malawian Loan Opportunities
              </h2>
            </div>
            <button
              onClick={() => onNavigate('loan-products')}
              className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1"
            >
              <span>View All Products</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded-full">
                      {p.categoryLabel}
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                      ★ {p.rating} ({p.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#0b1c30]">{p.name}</h3>
                  <p className="text-xs text-[#3d4947] mt-1 font-medium">{p.provider}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#eff4ff] rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Interest Rate</span>
                      <span className="font-bold text-[#00685f]">{p.rateDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Max Term</span>
                      <span className="font-bold text-[#0b1c30]">{p.termDisplay}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      onSelectProduct(p);
                      onNavigate('product-details');
                    }}
                    className="flex-1 py-2 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectProduct(p);
                      onOpenApplyModal();
                    }}
                    className="flex-1 py-2 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Journey */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-[#0b1c30]">How FinAccess Works</h2>
          <p className="text-xs text-[#3d4947] mt-2">
            A seamless, transparent 4-step process designed for fast, reliable credit access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#bcc9c6]/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#00685f] text-white font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h3 className="font-bold text-base text-[#0b1c30]">Create Account</h3>
            <p className="text-xs text-[#3d4947]">Register as an individual or verified institution.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#bcc9c6]/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#00685f] text-white font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h3 className="font-bold text-base text-[#0b1c30]">Explore & Compare</h3>
            <p className="text-xs text-[#3d4947]">Filter loan products by interest rate, terms, and location.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#bcc9c6]/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#00685f] text-white font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h3 className="font-bold text-base text-[#0b1c30]">Instant Submission</h3>
            <p className="text-xs text-[#3d4947]">Submit applications directly with encrypted National ID check.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#bcc9c6]/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#00685f] text-white font-bold flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h3 className="font-bold text-base text-[#0b1c30]">Receive Capital</h3>
            <p className="text-xs text-[#3d4947]">Get approved funds directly into your bank or mobile money.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
