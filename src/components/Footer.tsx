import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/15 bg-[#132d3a] px-6 py-14 text-white sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-310 flex-col gap-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-great-vibes text-4xl text-white transition-colors hover:text-[#ed8774]">SmartFin Connect</a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">Clear, trusted financial information for individuals, communities and the providers who serve them.</p>
          </div>
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#ed8774]">Explore</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/70"><a href="#how-it-works" className="transition-colors hover:text-white">How it works</a><a href="#stats" className="transition-colors hover:text-white">Why SmartFin</a><a href="#top" className="transition-colors hover:text-white">Back to top</a></div></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#ed8774]">Built for</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/70"><span>Individuals and families</span><span>Farmers and students</span><span>Loan providers</span></div></div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/45 md:flex-row"><span>{'©'} 2026 SmartFin Access Connect. All rights reserved.</span><div className="flex gap-5"><a href="#privacy" className="transition-colors hover:text-white">Privacy</a><a href="#terms" className="transition-colors hover:text-white">Terms</a></div></div>
      </div>
    </footer>
  );
};
