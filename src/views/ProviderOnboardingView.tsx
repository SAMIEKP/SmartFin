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
  const [institutionName, setInstitutionName] = useState(userProfile.institutionName || '');
  const [institutionType, setInstitutionType] = useState(userProfile.institutionType || '');
  const [registrationNumber, setRegistrationNumber] = useState(userProfile.registrationNumber || '');
  const [institutionEmail, setInstitutionEmail] = useState(userProfile.email || '');
  const phoneParts = (userProfile.phone || '').split(/,\s*/).filter(Boolean);
  const [primaryPhone, setPrimaryPhone] = useState(phoneParts[0] || '');
  const [secondaryPhone, setSecondaryPhone] = useState(phoneParts[1] || '');
  const [showSecondaryPhone, setShowSecondaryPhone] = useState(Boolean(phoneParts[1]));
  const [verificationFiles, setVerificationFiles] = useState<Record<string, File | null>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const requiredDocuments = [
    { key: 'rbm', label: 'Reserve Bank of Malawi (RBM) Operating License' },
    { key: 'tpin', label: 'Tax Identification Certificate (TPIN)' },
    { key: 'incorporation', label: 'Certificate of Incorporation / Registration' },
  ];

  const handleFinish = (target: 'dashboard' | 'add-product') => {
    if (!requiredDocuments.every(({ key }) => verificationFiles[key]) || !logoFile) {
      setErrorMessage('Upload all required verification files and the institution logo before continuing.');
      return;
    }
    onUpdateProfile({
      institutionName,
      institutionType,
      registrationNumber,
      phone: [primaryPhone, secondaryPhone].filter(Boolean).join(', '),
      isPendingVerification: true,
    });

    setIsComplete(true);

    window.setTimeout(() => onNavigate(target === 'add-product' ? 'product-management' : 'provider-dashboard'), 900);
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
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700" role="alert">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Institution Email</label>
              <input
                type="email"
                value={institutionEmail}
                onChange={(e) => setInstitutionEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">Primary Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+265 888 123 456"
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
                />
              </div>
              <div className="space-y-1">
                {showSecondaryPhone ? (
                  <>
                    <label className="font-bold text-[#0b1c30]">Second Contact Phone <span className="font-normal text-[#6d7a77]">(Optional)</span></label>
                    <input
                      type="text"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="Optional second number"
                      className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
                    />
                  </>
                ) : (
                  <button type="button" onClick={() => setShowSecondaryPhone(true)} className="mt-7 inline-flex items-center gap-1 text-[11px] font-bold text-[#855300]">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Add second phone (optional)
                  </button>
                )}
              </div>
            </div>

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
              onClick={() => {
                if (!institutionName.trim() || !institutionEmail.trim() || !primaryPhone.trim()) {
                  setErrorMessage('Institution name, email, and primary phone are required.');
                  return;
                }
                setErrorMessage('');
                setStep(2);
              }}
              className="w-full py-3 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Next: Document Upload</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

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

            <div className="space-y-3">
              {requiredDocuments.map(({ key, label }) => (
                <label key={key} className="block rounded-xl border-2 border-dashed border-[#855300]/30 bg-[#fffaf4] p-3 cursor-pointer hover:border-[#855300]">
                  <span className="flex items-center gap-2 font-bold text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[#855300]">upload_file</span>
                    {label} *
                  </span>
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setVerificationFiles((current) => ({ ...current, [key]: e.target.files?.[0] || null }))}
                    className="mt-2 block w-full text-[11px] text-[#3d4947]"
                  />
                  {verificationFiles[key] && <span className="mt-1 block text-[11px] font-bold text-emerald-700">Uploaded: {verificationFiles[key]?.name}</span>}
                </label>
              ))}
            </div>

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
                onClick={() => {
                  if (!requiredDocuments.every(({ key }) => verificationFiles[key])) {
                    setErrorMessage('Upload all three required verification files before continuing.');
                    return;
                  }
                  setErrorMessage('');
                  setStep(3);
                }}
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

            <div className="text-left space-y-2">
              <label className="font-bold text-[#0b1c30]">Institution Logo *</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#855300]/40 bg-[#fffaf4] p-4 hover:border-[#855300]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#855300] text-white">
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-[#855300]">{logoFile ? logoFile.name : 'Upload institution logo'}</span>
                  <span className="block mt-1 text-[11px] text-[#6d7a77]">PNG, JPG, or JPEG · Required</span>
                </span>
                <input
                  type="file"
                  required
                  accept="image/png,image/jpeg"
                  onChange={(e) => { setLogoFile(e.target.files?.[0] || null); setErrorMessage(''); }}
                  className="sr-only"
                />
              </label>
              {logoFile && (
                <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Institution logo uploaded successfully.
                </p>
              )}
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
