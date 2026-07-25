import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto bg-[#cbdbf5] text-[#0b1c30] border-t border-[#bcc9c6]/30 py-lg px-lg">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-md">
        {/* Trust Signals in Footer */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[#6d7a77]">
            <span className="material-symbols-outlined text-[#00685f] text-lg">verified</span>
            <span className="text-xs font-medium">Trusted by local financial institutions</span>
          </div>
          <div className="flex items-center gap-2 text-[#6d7a77]">
            <span className="material-symbols-outlined text-[#00685f] text-lg">diversity_3</span>
            <span className="text-xs font-medium">Community organizations across Malawi</span>
          </div>
          <div className="flex items-center gap-2 text-[#6d7a77]">
            <span className="material-symbols-outlined text-[#00685f] text-lg">security</span>
            <span className="text-xs font-medium">Built with secure technology &amp; clear privacy standards</span>
          </div>
        </div>

        <p className="text-xs text-[#6d7a77] text-center max-w-2xl mx-auto">
          Trusted by local financial institutions and community organizations. We are committed to transparent information, clear privacy standards, and guided steps for every application.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-md pt-3 border-t border-[#bcc9c6]/20">
          <div className="flex flex-col md:flex-row items-center gap-md">
            <span className="font-bold text-xl text-[#00685f]">FinAccess Connect</span>
            <span className="text-xs text-[#3d4947]">
              {'\u00A9'} 2024 FinAccess Malawi. All Rights Reserved.
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-[#3d4947]">
            <a href="#about" className="hover:underline hover:text-[#00685f] transition-colors">
              About
            </a>
            <a href="#help" className="hover:underline hover:text-[#00685f] transition-colors">
              Help &amp; FAQs
            </a>
            <a href="#contact" className="hover:underline hover:text-[#00685f] transition-colors">
              Contact
            </a>
            <a href="#privacy" className="hover:underline hover:text-[#00685f] transition-colors">
              Privacy &amp; data
            </a>
            <a href="#terms" className="hover:underline hover:text-[#00685f] transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Compliance / Disclaimer */}
        <p className="text-xs text-[#6d7a77] text-center max-w-3xl mx-auto leading-relaxed pt-2">
          FinAccess Connect is a platform to help individuals and providers share information. Loan approvals and conditions are set by each provider, and we encourage every user to read and understand terms before applying.
        </p>
      </div>
    </footer>
  );
};
