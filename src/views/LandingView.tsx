import React from 'react';
import { ViewMode, LoanProduct } from '../types';
import { Footer } from '../components/Footer';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
  products: LoanProduct[];
  onSelectProduct: (product: LoanProduct) => void;
  onOpenApplyModal: () => void;
  notifications?: any[];
  loans?: any[];
  onNavigateToRegister?: (role: 'user' | 'provider') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  products,
  onSelectProduct,
  onOpenApplyModal,
  notifications,
  loans,
  onNavigateToRegister,
}) => {
  const featuredProducts = products.filter((p) => p.isMatch || p.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Header with Member and Provider buttons */}
      <header className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-3">
          <button
            onClick={() => onNavigateToRegister?.('user')}
            className="px-5 py-2.5 bg-white hover:bg-[#00685f] hover:text-white text-[#00685f] border-2 border-[#00685f] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">person</span>
            <span>Member</span>
          </button>
          <button
            onClick={() => onNavigateToRegister?.('provider')}
            className="px-5 py-2.5 bg-white hover:bg-[#855300] hover:text-white text-[#855300] border-2 border-[#855300] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">account_balance</span>
            <span>Provider</span>
          </button>
        </div>
      </header>

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
              SmartFin Access Connect helps students, farmers, households and small businesses compare loan offers, understand repayment terms, and apply online while providers manage services and applications on a dedicated dashboard.
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white">
                <img
                  src="/Home_page.jpg"
                  alt="SmartFin Access Connect Platform"
                  className="w-full h-99 object-cover"
                  loading="lazy"
                  decoding="async"
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
            About SmartFin Access Connect
          </h2>
          <div className="w-16 h-1 bg-[#00685f] rounded-full mx-auto"></div>
        </div>

        {/* Intro paragraph */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <p className="text-base text-[#3d4947] leading-relaxed">
            SmartFin Access Connect is a web platform that helps individuals and communities find, understand and access the right financial services, while giving loan providers a simple way to reach the people they serve. We focus on clarity, trust and guided steps instead of confusing paperwork and hidden terms.
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
              We design every part of SmartFin Access Connect around a few simple values: clarity, fairness, and respect. That means explaining financial terms in plain language, showing important details up front, keeping roles separate so there's no confusion, and giving users control over their profile, notifications and language.
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
              SmartFin Access Connect will keep improving as we learn from the communities and institutions that use it. Over time, we aim to add more financial products, stronger verification, and better insights – always keeping the experience simple and useful for the people on both sides of every loan.
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

        {/* How SmartFin Access Connect Helps */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-[#00685f] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f]">handshake</span>
            How SmartFin Access Connect helps
          </h3>
          <p className="text-sm text-[#3d4947] leading-relaxed mb-4">
            SmartFin Access Connect sits in the middle – it does not approve loans itself, but gives both sides the information and tools they need. Individuals get guided questions, clear explanations of interest and repayment, and a dashboard to track applications and approved loans. Providers get a verified profile, service configuration, analytics, and an applications workspace so decisions are faster and better informed. <a href="https://www.nimbleappgenie.com/blogs/how-to-build-a-loan-app/" target="_blank" rel="noopener noreferrer" className="text-[#00685f] hover:underline font-medium">nimbleappgenie →</a>
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

      {/* Dual Role Selector Cards */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#f8f9ff] border-y border-[#bcc9c6]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-4 py-1.5 rounded-full">
              Who are you?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] mt-4 mb-3">
              Choose your path
            </h2>
            <p className="text-sm text-[#3d4947] max-w-xl mx-auto">
              SamrtFin Access Connect works for everyone. Select the role that fits you best and we will tailor the experience to match your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Individual Card */}
            <div className="bento-card bg-white rounded-2xl p-6 card-shadow border border-[#bcc9c6]/20 hover:border-[#00685f]/40 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 flex items-center justify-center group-hover:bg-[#00685f]/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[#00685f] text-2xl">person</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">I am an individual</h3>
                </div>
              </div>
              <p className="text-xs text-[#3d4947] leading-relaxed mb-4">
                Explore loan options that match your situation. Compare interest rates, repayment terms and fees. Apply with guided steps and track your application from start to finish.
              </p>
              <ul className="space-y-1.5 mb-5 text-xs text-[#3d4947]">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-sm mt-0.5">check_circle</span>
                  <span>Discover loans by category — Student, Farmer, Household, Small Business</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-sm mt-0.5">check_circle</span>
                  <span>Compare offers side by side with clear terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-sm mt-0.5">check_circle</span>
                  <span>Apply, upload documents, and track your dashboard</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('register')}
                className="w-full px-4 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Start as an individual</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Provider Card */}
            <div className="bento-card bg-white rounded-2xl p-6 card-shadow border border-[#bcc9c6]/20 hover:border-[#855300]/40 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#855300]/10 flex items-center justify-center group-hover:bg-[#855300]/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[#855300] text-2xl">account_balance</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">I am a loan provider</h3>
                </div>
              </div>
              <p className="text-xs text-[#3d4947] leading-relaxed mb-4">
                Manage your loan products, review applications and track performance — all from one dashboard. Configure services by category and reach the people who need them.
              </p>
              <ul className="space-y-1.5 mb-5 text-xs text-[#3d4947]">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-sm mt-0.5">check_circle</span>
                  <span>Verify your institution and set up loan products by category</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-sm mt-0.5">check_circle</span>
                  <span>Configure rates, tenures, eligibility rules and docs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-sm mt-0.5">check_circle</span>
                  <span>View analytics, review applications, approve or reject</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('register')}
                className="w-full px-4 py-2.5 bg-[#855300] hover:bg-[#a86b00] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Start as a loan provider</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Individuals Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-4 py-1.5 rounded-full inline-block">
              For Individuals
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              For individuals: see your options clearly
            </h2>
            <p className="text-base text-[#3d4947] leading-relaxed">
              Whether you are a student, farmer, household or small business owner, SmartFin Access Connect lets you discover loan categories that fit your situation, compare offers side by side, and understand exactly how repayment will work before you apply.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">search</span>
                <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">See loan options by category</strong> like Student, Farmer, Household, Small business.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">description</span>
                <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Read interest rates, tenures, fees and repayment plans</strong> in plain language.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">edit_note</span>
                <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Apply through guided steps</strong> with clear questions and document uploads.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">dashboard</span>
                <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Track application status and approved loans</strong> from your dashboard.</span>
              </li>
            </ul>
            <button
              onClick={() => onNavigate('register')}
              className="mt-4 px-6 py-3 bg-[#00685f] hover:bg-[#008378] text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Start as an individual</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {/* Right: Visual / Illustration Placeholder */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#e5eeff] to-[#f8f9ff] rounded-2xl border border-[#bcc9c6]/20 p-8 card-shadow">
              <div className="bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#00685f]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#00685f] text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Individual Dashboard</p>
                    <p className="text-xs text-[#6d7a77]">Your loan journey in one place</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                    <span className="material-symbols-outlined text-[#00685f] text-base">category</span>
                    <span className="text-xs text-[#3d4947]">Browse loans by category</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                    <span className="material-symbols-outlined text-[#00685f] text-base">compare_arrows</span>
                    <span className="text-xs text-[#3d4947]">Compare offers side by side</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                    <span className="material-symbols-outlined text-[#00685f] text-base">assignment</span>
                    <span className="text-xs text-[#3d4947]">Guided application steps</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                    <span className="material-symbols-outlined text-[#00685f] text-base">track_changes</span>
                    <span className="text-xs text-[#3d4947]">Track your applications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Loan Providers Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#f8f9ff] border-y border-[#bcc9c6]/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Visual / Illustration Placeholder */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-[#e5eeff] to-[#f8f9ff] rounded-2xl border border-[#bcc9c6]/20 p-8 card-shadow">
                <div className="bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#855300]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#855300] text-xl">account_balance</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0b1c30]">Provider Dashboard</p>
                      <p className="text-xs text-[#6d7a77]">Manage services and applications</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                      <span className="material-symbols-outlined text-[#855300] text-base">settings</span>
                      <span className="text-xs text-[#3d4947]">Configure loan products</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                      <span className="material-symbols-outlined text-[#855300] text-base">analytics</span>
                      <span className="text-xs text-[#3d4947]">Monthly analytics & charts</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                      <span className="material-symbols-outlined text-[#855300] text-base">fact_check</span>
                      <span className="text-xs text-[#3d4947]">Review & manage applications</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-lg">
                      <span className="material-symbols-outlined text-[#855300] text-base">policy</span>
                      <span className="text-xs text-[#3d4947]">Keep policies up to date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <span className="text-xs font-bold text-[#855300] uppercase tracking-wider bg-[#ffddb8]/40 px-4 py-1.5 rounded-full inline-block">
                For Loan Providers
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
                For loan providers: one place to manage services and applications
              </h2>
              <p className="text-base text-[#3d4947] leading-relaxed">
                SmartFin Access Connect gives loan providers a dedicated dashboard to verify their institution, configure loan products by category, see monthly analytics, and review applications with all the information and documents in one view.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">layers</span>
                  <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Set up multiple loan services</strong> for farmers, students, households and small businesses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">tune</span>
                  <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Configure interest rates, tenures, eligibility rules</strong> and required documents per service.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">donut_large</span>
                  <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">View applied and approved loans</strong> with circle widgets and charts updated monthly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">task_alt</span>
                  <span className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Review applications, approve or reject</strong> with confidence, and keep policies up to date.</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('register')}
                className="mt-4 px-6 py-3 bg-[#855300] hover:bg-[#a86b00] text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Start as a loan provider</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-4 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] mt-4 mb-3">
            How SmartFin Access Connect works
          </h2>
          <p className="text-sm text-[#3d4947] max-w-xl mx-auto">
            Two simple flows designed for individuals and loan providers. Each path is built around the steps that matter most to you.
          </p>
        </div>

        {/* Individual Flow */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <h3 className="text-xl font-bold text-[#0b1c30]">For individuals</h3>
            <div className="h-px flex-1 bg-[#bcc9c6]/30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/20">
              <div className="w-10 h-10 rounded-lg bg-[#00685f]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#00685f] text-xl">quiz</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2">Step 1 – Answer a few questions</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Tell us who you are, what you need and where you are. We use this to show you relevant loan categories and services.
              </p>
            </div>
            <div className="bento-card bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/20">
              <div className="w-10 h-10 rounded-lg bg-[#00685f]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#00685f] text-xl">compare_arrows</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2">Step 2 – Compare and read the details</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Explore services in your category, see interest, repayment and requirements, and pick the one that fits you.
              </p>
            </div>
            <div className="bento-card bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/20">
              <div className="w-10 h-10 rounded-lg bg-[#00685f]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#00685f] text-xl">track_changes</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2">Step 3 – Apply and track your loan</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Complete a guided application form with the questions and documents that provider needs. Then track your status and approved loans from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Flow */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#855300] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <h3 className="text-xl font-bold text-[#0b1c30]">For loan providers</h3>
            <div className="h-px flex-1 bg-[#bcc9c6]/30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/20">
              <div className="w-10 h-10 rounded-lg bg-[#855300]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#855300] text-xl">verified_user</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2">Step 1 – Verify your institution</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Sign up as a loan provider, share your business details and policies so users know who you are and how you work.
              </p>
            </div>
            <div className="bento-card bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/20">
              <div className="w-10 h-10 rounded-lg bg-[#855300]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#855300] text-xl">tune</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2">Step 2 – Configure your services</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Create loan services by category, set your terms, eligibility and data to collect, and publish them to the platform.
              </p>
            </div>
            <div className="bento-card bg-white rounded-xl p-6 card-shadow border border-[#bcc9c6]/20">
              <div className="w-10 h-10 rounded-lg bg-[#855300]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#855300] text-xl">analytics</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2">Step 3 – Review applications and see analytics</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Receive applications with all answers and documents, make decisions, and view monthly metrics for applied and approved loans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SmartFin Access Connect / Benefits Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#f8f9ff] border-y border-[#bcc9c6]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-4 py-1.5 rounded-full">
              Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] mt-4 mb-3">
              Why use SmartFin Access Connect?
            </h2>
            <p className="text-sm text-[#3d4947] max-w-xl mx-auto">
              We focus on clarity and fairness for individuals, and control and visibility for loan providers. That means fewer surprises, better information, and smoother decisions on both sides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Individual Benefits */}
            <div className="bento-card bg-white rounded-2xl p-8 card-shadow border border-[#bcc9c6]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#00685f]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00685f] text-xl">person</span>
                </div>
                <h3 className="text-base font-bold text-[#0b1c30]">Benefits for individuals</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">visibility</span>
                  <p className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Understand loans before you apply, not after.</strong> See repayment expectations and risks in one clear view.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">summarize</span>
                  <p className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">See repayment expectations and risks in one clear view.</strong> Compare offers side by side before making a decision.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00685f] text-base mt-0.5 shrink-0">settings</span>
                  <p className="text-sm text-[#3d4947]"><strong className="text-[#0b1c30]">Keep your profile and language preference consistent across visits.</strong> Your settings stay the same every time you come back.</p>
                </li>
              </ul>
            </div>

            {/* Provider Benefits */}
            <div className="bento-card bg-white rounded-2xl p-8 card-shadow border border-[#bcc9c6]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#855300]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#855300] text-xl">account_balance</span>
                </div>
                <h3 className="text-base font-bold text-[#0b1c30]">Benefits for providers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">folder</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0b1c30]">Keep all services, applications and policies in one place.</p>
                    <p className="text-xs text-[#3d4947] mt-0.5">A single dashboard to manage everything related to your loan products.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">sync_alt</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0b1c30]">Reduce back-and-forth by collecting the right information up front.</p>
                    <p className="text-xs text-[#3d4947] mt-0.5">Structured applications gather exactly the data and documents you need.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#855300] text-base mt-0.5 shrink-0">monitoring</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0b1c30]">Use dashboards to monitor applications, approvals and trends.</p>
                    <p className="text-xs text-[#3d4947] mt-0.5">Visual metrics help you track performance and spot opportunities.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started / Conversion Section */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto w-full text-center">
        <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-[#89f5e7]/30 px-4 py-1.5 rounded-full inline-block mb-4">
          Get Started
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] mt-4 mb-4">
          Ready to get started?
        </h2>
        <p className="text-base text-[#3d4947] leading-relaxed max-w-2xl mx-auto mb-10">
          Choose how you want to use SmartFin Access Connect. You can sign up as an individual looking for financial services or as a loan provider offering services to communities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-3.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Sign up as individual</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-3.5 bg-white border-2 border-[#bcc9c6]/60 text-[#0b1c30] hover:border-[#855300] hover:text-[#855300] font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Sign up as loan provider</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
        <p className="text-xs text-[#6d7a77] max-w-lg mx-auto">
          Free to start. Your information is handled securely and used only to improve your matches and applications.
        </p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
