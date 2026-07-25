import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#f8f9ff] text-[#0b1c30] py-10 px-4 border-t border-[#bcc9c6]/20">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[#3d4947]">
              <span className="material-symbols-outlined text-[#00685f] text-lg">verified</span>
              <span className="text-xs font-medium">Trusted by local financial institutions</span>
            </div>
            <div className="flex items-center gap-2 text-[#3d4947]">
              <span className="material-symbols-outlined text-[#00685f] text-lg">diversity_3</span>
              <span className="text-xs font-medium">Community organizations across Malawi</span>
            </div>
            <div className="flex items-center gap-2 text-[#3d4947]">
              <span className="material-symbols-outlined text-[#00685f] text-lg">security</span>
              <span className="text-xs font-medium">Built with secure technology &amp; clear privacy standards</span>
            </div>
          </div>
          <p className="text-xs text-[#3d4947] text-center max-w-2xl mx-auto">
            Trusted by local financial institutions and community organizations. We are committed to transparent information, clear privacy standards, and guided steps for every application.
          </p>
        </div>

        <hr className="border-t border-[#bcc9c6]/40" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-[#0b1c30]">SmartFin Access Connect</span>
            <span className="text-xs text-[#3d4947]">
              {'©'} 2026 SmartFin Access Connect. All Rights Reserved.
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#3d4947]">
            <a href="#about" className="hover:text-[#00685f] transition-colors">About</a>
            <a href="#privacy" className="hover:text-[#00685f] transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-[#00685f] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
