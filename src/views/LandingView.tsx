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
      <section className="relative bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#f8f9ff] pt-16 pb-24 px-4 md:px-8 border-b border-[#bcc9c6]/20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#89f5e7]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-[#00685f]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-[#00685f] rounded-full text-xs font-bold border border-[#008378]/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
              <span>Connecting Borrowers & Lenders</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b1c30] tracking-tight leading-tight">
                Find and understand the <span className="text-[#00685f]">right loans</span> in one place.
              </h1>

              <p className="text-lg md:text-xl text-[#3d4947]/80 leading-relaxed font-medium">
                Connect individuals and trusted loan providers on one simple platform.
              </p>
            </div>

            <p className="text-base md:text-[15px] text-[#3d4947] leading-relaxed max-w-2xl">
              FinAccess Connect helps students, farmers, households and small businesses compare loan offers, understand repayment terms, and apply online — while providers manage services and applications on a dedicated dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('register')}
                className="px-7 py-3.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Get started</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-white border-2 border-[#bcc9c6]/60 text-[#0b1c30] hover:border-[#00685f] hover:text-[#00685f] font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">play_circle</span>
                <span>Explore how it works</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="flex items-center gap-2 pt-2 text-xs text-[#6d7a77]">
              <span className="material-symbols-outlined text-base text-[#00685f]">verified</span>
              <span>Built for Malawi's communities and institutions, with transparent information and guided steps for every application.</span>
            </div>
          </div>

          {/* Right Column Visual – Connection / Platform Concept */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Main visual card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRncdrmA6bC0uISCtdq_8wI0YixkVQVx1TK-GHaR_Dw2LJim9E3vG8Keo9GG-prB61-wW9kEffNX3fIMQ_QqLxzT1pJBRI_KoqVcvLwclnt70hnur23DcGcSTFPm8d5FuDMDGY7g2HwBqjkYsVBG9wohl83D1nfuZ2VrkTaPPNR2IZC0Aw3c9ToQVXT8XLF9EeeRjjtURgW9ETcFkE71nZ7ngZpzd-7cymkzNG_A4BXcTaUjpGTtq1br4VCtkWfnNsZKrfM1MlWfY"
                  alt="FinAccess Connect Platform"
                  className="w-full h-96 object-cover"
                />

                {/* Floating "Two Sides" Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#bcc9c6]/30">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">person</span>
                      </div>
                      <span className="text-xs font-bold text-[#0b1c30]">Individuals</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#00685f]">
                      <span className="material-symbols-outlined text-lg">sync_alt</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-[#0b1c30]">Providers</span>
                      <div className="w-8 h-8 rounded-full bg-[#855300] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">account_balance</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#3d4947] text-center mt-2 border-t border-[#bcc9c6]/20 pt-2">
                    One platform — two experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-4 py-1.5 rounded-full">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] mt-4 mb-4">
            About FinAccess Connect
          </h2>
          <div className="w-16 h-1 bg-[#00685f] rounded-full mx-auto"></div>
        </div>

        {/* Intro paragraph */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <p className="text-base text-[#3d4947] leading-relaxed">
            FinAccess Connect is a web platform that helps individuals and communities find, understand and access the right financial services, while giving loan providers a simple way to reach the people they serve. We focus on clarity, trust and guided steps instead of confusing paperwork and hidden terms.
          </p>
        </div>

        {/* 4-Column Layout: Our Mission | Who We Serve | Our Values | What's Next */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:divide-x md:divide-[#bcc9c6]/40">
          {/* Column 1: Our Mission */}
          <div className="px-5 py-8">
            <h3 className="text-base font-bold text-[#00685f] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f]">rocket_launch</span>
              Our mission
            </h3>
            <p className="text-sm text-[#3d4947] leading-relaxed">
              Our mission is to make loan and financial information clear and accessible for everyone – from students and farmers to households and small businesses – and to help responsible loan providers connect with them through transparent, digital-first experiences. <a href="https://rupeeq.com/our-mission" target="_blank" rel="noopener noreferrer" className="text-[#00685f] hover:underline font-medium">rupeeq →</a>
            </p>
          </div>

          {/* Column 2: Who We Serve */}
          <div className="px-5 py-8">
            <h3 className="text-base font-bold text-[#855300] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#855300]">diversity_3</span>
              Who we serve
            </h3>
            <p className="text-sm text-[#3d4947] leading-relaxed mb-4">
              We are built for people who often face limited information about finance: students trying to pay for school, farmers planning for the next season, households managing daily needs, and small businesses looking for working capital. We are also built for loan providers and institutions who want a better way to present their services, share their policies, and manage applications in one place.
            </p>
            <ul className="space-y-2 text-sm text-[#3d4947]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">check_circle</span>
                <span><strong>Individuals:</strong> discover loan categories that fit your situation and see repayment details before you apply.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#855300] text-base mt-0.5">check_circle</span>
                <span><strong>Loan providers:</strong> configure services, share your policies, and review applications with all data and documents together.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Values */}
          <div className="px-5 py-8">
            <h3 className="text-base font-bold text-[#00685f] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f]">favorite</span>
              Our values
            </h3>
            <p className="text-sm text-[#3d4947] leading-relaxed mb-4">
              We design every part of FinAccess Connect around a few simple values: clarity, fairness, and respect. That means explaining financial terms in plain language, showing important details up front, keeping roles separate so there's no confusion, and giving users control over their profile, notifications and language.
            </p>
            <ul className="space-y-2 text-sm text-[#3d4947]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">lightbulb</span>
                <span><strong>Clarity:</strong> Explain interest, repayment and eligibility in ways anyone can understand.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">balance</span>
                <span><strong>Fairness:</strong> Show information side by side so users can compare offers and make informed choices.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">verified_user</span>
                <span><strong>Respect:</strong> Treat personal and business data carefully, with secure handling and transparent policies. <a href="https://bardglobal.com/fintech-documentation-best-practices/" target="_blank" rel="noopener noreferrer" className="text-[#00685f] hover:underline font-medium">bardglobal →</a></span>
              </li>
            </ul>
          </div>

          {/* Column 4: What's Next */}
          <div className="px-5 py-8">
            <h3 className="text-base font-bold text-[#00685f] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f]">trending_up</span>
              What's next
            </h3>
            <p className="text-sm text-[#3d4947] leading-relaxed mb-4">
              FinAccess Connect will keep improving as we learn from the communities and institutions that use it. Over time, we aim to add more financial products, stronger verification, and better insights – always keeping the experience simple and useful for the people on both sides of every loan.
            </p>
            <div className="bg-[#eff4ff] border border-[#bcc9c6]/30 rounded-xl p-4">
              <p className="text-sm text-[#3d4947] leading-relaxed">
                <strong className="text-[#0b1c30]">Call to action:</strong> If you're an individual, you can start by answering a few questions and exploring your loan options. If you're a loan provider, you can verify your institution, set up your services and see how digital applications can streamline your work.
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-[#bcc9c6]/40 my-12 max-w-4xl mx-auto" />

        {/* How FinAccess Connect Helps */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-[#00685f] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f]">handshake</span>
            How FinAccess Connect helps
          </h3>
          <p className="text-sm text-[#3d4947] leading-relaxed mb-4">
            FinAccess Connect sits in the middle – it does not approve loans itself, but gives both sides the information and tools they need. Individuals get guided questions, clear explanations of interest and repayment, and a dashboard to track applications and approved loans. Providers get a verified profile, service configuration, analytics, and an applications workspace so decisions are faster and better informed. <a href="https://www.nimbleappgenie.com/blogs/how-to-build-a-loan-app/" target="_blank" rel="noopener noreferrer" className="text-[#00685f] hover:underline font-medium">nimbleappgenie →</a>
          </p>
          <ul className="space-y-2 text-sm text-[#3d4947]">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">check_circle</span>
              <span>Guided onboarding and clear loan comparisons instead of guesswork.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">check_circle</span>
              <span>Multi-step applications that collect exactly the data providers need.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">check_circle</span>
              <span>Separate dashboards for users and providers, each with their own tools and analytics.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5">check_circle</span>
              <span>Language preferences that stay the same when you log out and come back, so the app always feels familiar. <a href="https://merge.rocks/blog/ux-design-best-practices-for-fintech-apps" target="_blank" rel="noopener noreferrer" className="text-[#00685f] hover:underline font-medium">merge →</a></span>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
