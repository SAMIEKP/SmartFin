import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto bg-[#cbdbf5] text-[#0b1c30] border-t border-[#bcc9c6]/30 py-lg px-lg">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-col md:flex-row items-center gap-md">
          <span className="font-bold text-xl text-[#00685f]">FinAccess</span>
          <span className="text-xs text-[#3d4947]">
            © 2024 FinAccess Malawi. All Rights Reserved.
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-md text-xs text-[#3d4947]">
          <a href="#privacy" className="hover:underline hover:text-[#00685f] transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:underline hover:text-[#00685f] transition-colors">
            Terms of Service
          </a>
          <a href="#disclosure" className="hover:underline hover:text-[#00685f] transition-colors">
            Financial Disclosure
          </a>
          <a href="#contact" className="hover:underline hover:text-[#00685f] transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};
