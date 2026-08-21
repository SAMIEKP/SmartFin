import React from 'react';
import { ArrowRight, Check, ChevronDown, Play, ShieldCheck, Sparkles } from 'lucide-react';
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

const categories = [
  { label: 'For households', icon: '01', tone: 'coral' },
  { label: 'For farmers', icon: '02', tone: 'gold' },
  { label: 'For students', icon: '03', tone: 'blue' },
  { label: 'For small businesses', icon: '04', tone: 'green' },
];

const individualSteps = [
  ['01', 'Answer a few questions', 'Tell us who you are, what you need and where you are so we can show relevant options.'],
  ['02', 'Compare the details', 'Read rates, fees, repayment schedules, eligibility and requirements before choosing.'],
  ['03', 'Apply and track', 'Complete a guided application, upload documents and follow your status from your dashboard.'],
];

const providerSteps = [
  ['01', 'Verify your institution', 'Share your business details and policies so people know who they are working with.'],
  ['02', 'Configure your services', 'Create products by category and set terms, eligibility rules and required documents.'],
  ['03', 'Review and measure', 'Receive complete applications, make decisions and monitor monthly performance analytics.'],
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  products,
  onSelectProduct,
  onNavigateToRegister,
}) => {
  const register = (role: 'user' | 'provider') => onNavigateToRegister?.(role) ?? onNavigate('register');

  return (
    <div className="landing-page min-h-screen bg-[#f4f0e9] text-[#132d3a]">
      <section className="relative overflow-hidden bg-[#f4f0e9]">
        <div className="absolute inset-y-0 right-0 hidden w-[43%] bg-[#e5ddd0] lg:block" />
        <div className="relative mx-auto max-w-310 px-6 pb-20 pt-28 sm:px-10 lg:px-12 lg:pb-32 lg:pt-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.03fr_.97fr] lg:gap-6">
            <div className="relative z-10 max-w-162.5">
              <p className="mb-7 text-[11px] font-bold uppercase tracking-[.28em] text-[#e56f5d]">Smart finance for Malawi</p>
              <h1 className="font-serif text-5xl leading-[.98] tracking-[-.035em] text-[#132d3a] sm:text-7xl lg:text-[86px]">
                Your future,<br /><em className="text-[#e56f5d]">financed</em> clearly.
              </h1>
              <p className="mt-8 max-w-120 text-base leading-8 text-[#53636a] sm:text-lg">Compare trusted loan products, understand the terms, and take your next step with confidence.</p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button onClick={() => register('user')} className="landing-primary-button">Explore loan options <ArrowRight size={17} /></button>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="landing-text-button"><span className="landing-play"><Play size={12} fill="currentColor" /></span> How it works</button>
              </div>
              <div className="mt-10 flex items-center gap-3 text-xs text-[#69777a]"><ShieldCheck size={17} className="text-[#e56f5d]" /> Secure, transparent and built for real life.</div>
            </div>
            <div className="relative z-10 lg:pl-8">
              <div className="landing-hero-image"><img src="/Home_page.jpg" alt="SmartFin Access Connect platform" /><div className="landing-image-note"><Sparkles size={15} /><span>Make informed<br />financial decisions.</span></div></div>
            </div>
          </div>
        </div>
        <a href="#stats" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-[#6f7a7b] lg:block"><ChevronDown size={22} /></a>
      </section>

      <section id="stats" className="bg-[#132d3a] text-white">
        <div className="mx-auto grid max-w-310 grid-cols-1 sm:grid-cols-3">
          {[['01', 'Clear information', 'No confusing language or hidden surprises.'], ['02', 'Better choices', 'Compare products side by side before applying.'], ['03', 'A guided journey', 'Track every application in one calm workspace.']].map(([number, title, copy]) => <div key={number} className="border-b border-white/15 px-7 py-10 sm:border-b-0 sm:border-r sm:px-10 lg:py-12"><span className="text-xs font-bold tracking-[.2em] text-[#ed8774]">{number}</span><h2 className="mt-5 font-serif text-2xl">{title}</h2><p className="mt-3 max-w-57.5 text-sm leading-6 text-white/65">{copy}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-310 px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
          <div>
            <p className="landing-kicker">About SmartFin</p>
            <h2 className="landing-section-title">Financial access without the fog.</h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-[#53636a]">
            <p>SmartFin Access Connect helps individuals and communities find, understand and access the right financial services, while giving loan providers a simple way to reach the people they serve.</p>
            <p>We focus on clarity, trust and guided steps instead of confusing paperwork and hidden terms. The platform does not approve loans itself. It gives both sides the information and tools they need to make better decisions.</p>
            <div className="grid gap-6 border-t border-[#c9c0b5] pt-6 sm:grid-cols-2">
              <div><h3 className="font-serif text-2xl text-[#132d3a]">For individuals</h3><p className="mt-2 text-sm leading-6">Discover categories that fit your situation, compare repayment details and manage applications in one place.</p></div>
              <div><h3 className="font-serif text-2xl text-[#132d3a]">For providers</h3><p className="mt-2 text-sm leading-6">Present your services clearly, share policies and review applications with all the required information together.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="what-we-do" className="mx-auto max-w-310 px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div><p className="landing-kicker">What we do</p><h2 className="landing-section-title">Finance that meets you where you are.</h2><p className="mt-7 text-base leading-8 text-[#53636a]">From your first search to your final repayment, SmartFin Access Connect makes the process easier to see, understand and manage.</p><button onClick={() => register('user')} className="landing-outline-button mt-8">Start your journey <ArrowRight size={16} /></button></div>
          <div className="grid gap-0 border-t border-[#c9c0b5]">{categories.map((category) => <div key={category.label} className="group flex items-center justify-between border-b border-[#c9c0b5] py-7"><div className="flex items-center gap-6"><span className={`landing-index ${category.tone}`}>{category.icon}</span><h3 className="font-serif text-2xl">{category.label}</h3></div><ArrowRight className="text-[#9ba4a2] transition-transform group-hover:translate-x-2" size={20} /></div>)}</div>
        </div>
      </section>

      <section className="bg-[#e8e0d5] px-6 py-24 sm:px-10 lg:px-12 lg:py-32"><div className="mx-auto grid max-w-310 items-center gap-14 lg:grid-cols-2 lg:gap-24"><div className="order-2 overflow-hidden lg:order-1"><img className="h-90 w-full object-cover sm:h-125" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85" alt="Friends planning together" /></div><div className="order-1 lg:order-2"><p className="landing-kicker">For individuals</p><h2 className="landing-section-title">A clearer way forward.</h2><p className="mt-7 text-base leading-8 text-[#53636a]">Whether you are building a business, paying school fees or planning the next season, find options that fit your goals and your reality.</p><ul className="mt-8 space-y-4 text-sm text-[#53636a]">{['See rates, fees and repayment terms up front.', 'Apply with guided steps and the right documents.', 'Follow your progress from one personal dashboard.'].map((item) => <li key={item} className="flex items-center gap-3"><Check size={16} className="text-[#e56f5d]" />{item}</li>)}</ul><button onClick={() => register('user')} className="landing-primary-button mt-9">Join as an individual <ArrowRight size={17} /></button></div></div></section>

      <section className="bg-[#132d3a] px-6 py-24 text-white sm:px-10 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-310 items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div><p className="text-[11px] font-bold uppercase tracking-[.25em] text-[#ed8774]">For loan providers</p><h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">One place to manage services and applications.</h2><p className="mt-7 max-w-xl text-base leading-8 text-white/65">Verify your institution, configure loan products, reach the right communities and review every application with answers and documents in one view.</p><button onClick={() => register('provider')} className="landing-light-button mt-9">Join as a provider <ArrowRight size={17} /></button></div>
          <div className="grid gap-0 border-t border-white/20">{['Configure multiple loan services by category.', 'Set interest rates, tenures, eligibility and required documents.', 'View applied and approved loans with monthly analytics.', 'Keep lending, late-payment and privacy policies up to date.'].map((item, index) => <div key={item} className="flex items-start gap-5 border-b border-white/20 py-6"><span className="text-xs font-bold tracking-[.2em] text-[#ed8774]">0{index + 1}</span><p className="text-sm leading-6 text-white/80">{item}</p></div>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-310 px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
        <div className="mb-14 max-w-2xl"><p className="landing-kicker">How it works</p><h2 className="landing-section-title">Two simple journeys, one trusted platform.</h2><p className="mt-6 text-base leading-8 text-[#53636a]">Each path is designed around the steps that matter most, whether you are looking for financial support or providing it.</p></div>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {[['For individuals', individualSteps, 'landing-index coral'], ['For loan providers', providerSteps, 'landing-index blue']].map(([title, steps, indexClass]) => <div key={title as string}><h3 className="mb-7 font-serif text-3xl">{title as string}</h3><div className="space-y-8">{(steps as string[][]).map(([number, stepTitle, copy]) => <div key={number} className="flex gap-5"><span className={indexClass as string}>{number}</span><div><h4 className="text-base font-bold">{stepTitle}</h4><p className="mt-2 text-sm leading-6 text-[#69777a]">{copy}</p></div></div>)}</div></div>)}
        </div>
      </section>

      <section className="border-y border-[#c9c0b5] bg-[#ebe5dc] px-6 py-24 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-310"><div className="mb-12 max-w-2xl"><p className="landing-kicker">Why SmartFin</p><h2 className="landing-section-title">More confidence on both sides of every loan.</h2></div><div className="grid gap-10 md:grid-cols-2"><div><h3 className="font-serif text-3xl">For individuals</h3><ul className="mt-6 space-y-4 text-sm leading-6 text-[#53636a]"><li className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-[#e56f5d]" />Understand loans before you apply, not after.</li><li className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-[#e56f5d]" />Compare offers side by side with repayment expectations visible.</li><li className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-[#e56f5d]" />Keep applications, approved loans and next steps together.</li></ul></div><div><h3 className="font-serif text-3xl">For providers</h3><ul className="mt-6 space-y-4 text-sm leading-6 text-[#53636a]"><li className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-[#e56f5d]" />Keep products, applications and policies in one workspace.</li><li className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-[#e56f5d]" />Collect the right information up front and reduce back-and-forth.</li><li className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-[#e56f5d]" />Use dashboards to monitor approvals and monthly trends.</li></ul></div></div></div>
      </section>

      <section className="bg-[#e56f5d] px-6 py-20 text-center text-white sm:px-10 lg:py-28"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-white/75">Ready when you are</p><h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">Build your next chapter with clarity.</h2><div className="mt-9 flex flex-wrap justify-center gap-4"><button onClick={() => register('user')} className="landing-light-button">Find a loan <ArrowRight size={16} /></button><button onClick={() => register('provider')} className="landing-coral-outline-button">Join as a provider <ArrowRight size={16} /></button></div></section>
      <Footer />
    </div>
  );
};
