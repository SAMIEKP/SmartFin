import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';

interface ProviderOnboardingViewProps {
  userProfile: UserProfile;
  onNavigate: (view: ViewMode) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProviderOnboardingView: React.FC<ProviderOnboardingViewProps> = ({
  userProfile,
  onNavigate,
  onUpdateProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [institutionName, setInstitutionName] = useState(userProfile.institutionName || 'Central Microfinance');
  const [institutionType, setInstitutionType] = useState(userProfile.institutionType || 'Microfinance Institution (MFI)');
  const [registrationNumber, setRegistrationNumber] = useState(userProfile.registrationNumber || 'RBM/MFI/2024/088');
  
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([
    'Reserve_Bank_Malawi_Licence.pdf'
  ]);
  const [docName, setDocName] = useState('');

  const handleAddDoc = () => {
    if (docName.trim()) {
      setUploadedDocs(prev => [...prev, docName.trim()]);
      setDocName('');
    }
  };

  const handleFinish = (target: 'dashboard' | 'add-product') => {
    onUpdateProfile({
      institutionName,
      institutionType,
      registrationNumber,
      isPendingVerification: true,
    });

    if (target === 'add-product') {
      onNavigate('product-management');
    } else {
      onNavigate('provider-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#eff4ff] py-10 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#bcc9c6]/30 shadow-lg p-6 sm:p-8 space-y-6">
        
        {/* Verification Status Alert Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
          <span className="material-symbols-outlined text-amber-600 mt-0.5">verified_user</span>
          <div className="text-xs space-y-1">
            <div className="font-extrabold text-amber-900">Account Status: Pending Verification</div>
            <p className="text-amber-800">
              Your institution is undergoing compliance review by FinAccess verification team. You can create products now; application approvals will be enabled once verified.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2 border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center text-xs font-bold text-[#855300]">
            <span>PROVIDER INSTITUTION SETUP</span>
            <span>Step {step} of 3</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#0b1c30]">
            {step === 1 && "Confirm Institution Information"}
            {step === 2 && "Verification & Compliance Upload"}
            {step === 3 && "Add Your First Product"}
          </h1>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Institution Legal Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Institution Category</label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              >
                <option value="Commercial Bank">Commercial Bank</option>
                <option value="Microfinance Institution (MFI)">Microfinance Institution (MFI)</option>
                <option value="SACCO">SACCO (Savings & Credit Coop)</option>
                <option value="Fintech / Mobile Lender">Fintech / Mobile Lender</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">RBM Registration / Licence Number</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Next: Document Upload</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  localStorage.setItem('openSettingsTab', 'organization');
                  onNavigate('settings');
                }}
                className="mt-2 inline-block px-4 py-2 text-xs bg-[#00685f] text-white rounded-lg hover:bg-[#005a4f]"
              >
                Upload Institution Logo (Open Settings)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-2">
              <span className="font-bold text-[#0b1c30] block">Required Documents for Gold Verification Badge</span>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-[11px]">
                <li>Reserve Bank of Malawi (RBM) Operating License</li>
                <li>Tax Identification Certificate (TPIN)</li>
                <li>Certificate of Incorporation / Registration</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#0b1c30]">Upload Compliance Certificate</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Document title or reference..."
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddDoc}
                  className="px-4 py-2 bg-[#855300] text-white rounded-xl font-bold hover:bg-[#653e00] cursor-pointer"
                >
                  Upload File
                </button>
              </div>
            </div>

            {uploadedDocs.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-[#0b1c30] block">Uploaded Verification Files</span>
                <div className="space-y-1">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#855300] text-sm">description</span>
                        <span className="font-medium text-[#0b1c30] text-[11px]">{doc}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Received
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 border border-[#bcc9c6]/50 rounded-xl text-xs font-bold text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Add First Product</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 text-xs text-center py-4">
            <div className="w-16 h-16 bg-[#fff8f0] border-2 border-[#855300] text-[#855300] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">add_box</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#0b1c30]">You're Ready to Add Your First Financial Product</h2>
              <p className="text-xs text-[#3d4947] max-w-md mx-auto">
                List loans, savings accounts, or insurance packages on FinAccess discovery marketplace to reach thousands of Malawian users.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleFinish('add-product')}
                className="flex-1 py-3 bg-[#855300] hover:bg-[#653e00] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add First Product Now</span>
              </button>
              <button
                type="button"
                onClick={() => handleFinish('dashboard')}
                className="py-3 px-6 border border-[#bcc9c6]/50 rounded-xl text-xs font-bold text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer"
              >
                Go to Provider Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
