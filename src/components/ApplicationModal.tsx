import React, { useState } from 'react';
import { LoanProduct, ApplicationItem } from '../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: LoanProduct[];
  selectedProduct?: LoanProduct | null;
  onSubmitApplication: (newApp: ApplicationItem) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onSubmitApplication,
}) => {
  const defaultProd = selectedProduct || products[0] || null;
  const [chosenProductId, setChosenProductId] = useState<string>(defaultProd?.id || '');
  const [amount, setAmount] = useState<number>(defaultProd?.minAmount || 0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [fullName, setFullName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.id === chosenProductId) || defaultProd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const estimatedMonthly = Math.round((amount * 1.12) / 12);
      const newApp: ApplicationItem = {
        id: `APP-${Math.floor(8000 + Math.random() * 2000)}`,
        applicantName: fullName,
        applicantInitials: fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        productName: currentProd ? currentProd.name : 'Personal Credit',
        productId: currentProd ? currentProd.id : 'prod-001',
        providerName: currentProd ? currentProd.provider : 'FinAccess Malawi',
        amount: Number(amount),
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        monthlyRepayment: estimatedMonthly,
      };

      onSubmitApplication(newApp);
      setIsSubmitting(false);
      setStep(3); // Success step
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#bcc9c6]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#00685f] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded-full">
              Malawi Verified Portal
            </span>
            <h2 className="text-xl font-bold mt-1">Loan Product Application</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Stepper Header */}
        {step < 3 && (
          <div className="bg-[#eff4ff] px-6 py-3 border-b border-[#bcc9c6]/30 flex items-center justify-between text-xs font-semibold text-[#3d4947]">
            <span className={step === 1 ? 'text-[#00685f] font-bold' : ''}>
              1. Select & Amount
            </span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className={step === 2 ? 'text-[#00685f] font-bold' : ''}>
              2. Applicant Details
            </span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>3. Instant Verification</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5 uppercase tracking-wider">
                  Select Financial Product
                </label>
                <select
                  value={chosenProductId}
                  onChange={(e) => {
                    setChosenProductId(e.target.value);
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) setAmount(found.minAmount);
                  }}
                  className="w-full p-3 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-sm text-[#0b1c30] font-semibold focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.provider} ({p.rateDisplay})
                    </option>
                  ))}
                </select>
              </div>

              {currentProd && (
                <div className="p-4 bg-[#f4fffc] border border-[#008378]/30 rounded-xl text-xs space-y-1 text-[#00201d]">
                  <p className="font-bold text-sm text-[#00685f]">{currentProd.name}</p>
                  <p className="text-gray-600">{currentProd.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#008378]/20">
                    <span className="bg-white px-2 py-1 rounded font-semibold border border-[#008378]/20">
                      Rate: {currentProd.rateDisplay}
                    </span>
                    <span className="bg-white px-2 py-1 rounded font-semibold border border-[#008378]/20">
                      Term: {currentProd.termDisplay}
                    </span>
                    <span className="bg-white px-2 py-1 rounded font-semibold border border-[#008378]/20">
                      Processing: ~{currentProd.processingDays} Days
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
                    Requested Amount (MWK)
                  </label>
                  <span className="text-sm font-bold text-[#00685f]">
                    MWK {Number(amount).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentProd?.minAmount || 100000}
                  max={currentProd?.maxAmount || 25000000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-[#00685f] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#3d4947] mt-1">
                  <span>MWK {(currentProd?.minAmount || 100000).toLocaleString()}</span>
                  <span>MWK {(currentProd?.maxAmount || 25000000).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1 uppercase tracking-wider">
                  Loan Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs font-medium text-[#0b1c30]"
                >
                  <option value="Business Expansion">Business Expansion / Capital</option>
                  <option value="Agricultural Inputs">Agricultural Seeds / Fertilizers / Equipment</option>
                  <option value="Home Construction">Home Construction / Property Repair</option>
                  <option value="School & Medical">School Fees & Emergency Household</option>
                  <option value="Asset Financing">Vehicle or Asset Purchase</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] uppercase mb-1">
                    Full Name (National ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] uppercase mb-1">
                    Malawi National ID
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] uppercase mb-1">
                    Location / City
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs font-medium text-[#0b1c30]"
                  >
                    <option value="Lilongwe">Lilongwe</option>
                    <option value="Blantyre">Blantyre</option>
                    <option value="Mzuzu">Mzuzu</option>
                    <option value="Zomba">Zomba</option>
                    <option value="Kasungu">Kasungu</option>
                    <option value="Mangochi">Mangochi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] uppercase mb-1">
                    Employment Status
                  </label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs font-medium text-[#0b1c30]"
                  >
                    <option value="Employed">Formally Employed</option>
                    <option value="Self-Employed">Self-Employed / Business Owner</option>
                    <option value="Farmer">Farmer / Agri Producer</option>
                    <option value="Civil Servant">Civil Servant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] uppercase mb-1">
                    Monthly Net Income (MWK)
                  </label>
                  <input
                    type="number"
                    required
                    min={50000}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#e5eeff] rounded-xl text-xs text-[#0b1c30] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#00685f]">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>Instant Verification Notice</span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  By submitting, your national credit identity score will be securely retrieved from the Malawi Credit Reference Bureau.
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-[#bcc9c6] text-[#3d4947] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                      <span>Verifying Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <span className="material-symbols-outlined text-sm">send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#89f5e7] text-[#00201d] rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-[#00685f]">Application Submitted Successfully!</h3>
              <p className="text-xs text-[#3d4947] max-w-md mx-auto">
                Your application for <strong className="text-[#0b1c30]">{currentProd?.name}</strong> has been transmitted to <strong className="text-[#0b1c30]">{currentProd?.provider}</strong>. You can track its live status under "My Applications".
              </p>

              <div className="p-4 bg-[#eff4ff] rounded-xl max-w-sm mx-auto text-left text-xs space-y-2 border border-[#bcc9c6]/30">
                <div className="flex justify-between">
                  <span className="text-[#3d4947]">Amount Requested:</span>
                  <span className="font-bold text-[#0b1c30]">MWK {Number(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3d4947]">Est. Monthly Repayment:</span>
                  <span className="font-bold text-[#00685f]">
                    MWK {Math.round((amount * 1.12) / 12).toLocaleString()} / mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3d4947]">Initial Status:</span>
                  <span className="font-bold bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded text-[10px]">
                    Pending Verification
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
