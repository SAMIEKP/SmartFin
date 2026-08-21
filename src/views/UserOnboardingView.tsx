import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';

interface UserOnboardingViewProps {
  userProfile: UserProfile;
  onNavigate: (view: ViewMode) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

export const UserOnboardingView: React.FC<UserOnboardingViewProps> = ({
  userProfile,
  onNavigate,
  onUpdateProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic profile
  const [name, setName] = useState(userProfile.name || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [segment, setSegment] = useState(userProfile.segment || '');
  const district = userProfile.district || location.split(',')[0]?.trim() || '';
  const cityVillage = userProfile.cityVillage || location.trim();

  // Step 2: Financial goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 3: Preferences
  const [incomeRange, setIncomeRange] = useState(userProfile.incomeRange || 'MWK 250,000 - MWK 750,000');
  const [employmentType, setEmploymentType] = useState('Self-Employed Farmer / Business');
  const [channelPreference, setChannelPreference] = useState<'mobile_money' | 'bank' | 'sacco' | 'any'>('any');
  const [isFinishing, setIsFinishing] = useState(false);

  const toggleGoal = (goalKey: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalKey) ? prev.filter((g) => g !== goalKey) : [...prev, goalKey]
    );
  };

  const handleFinish = async () => {
    if (selectedGoals.length === 0 || isFinishing) return;
    setIsFinishing(true);
    const goalsText = selectedGoals.map(g => {
      if (g === 'small_loan') return 'Personal & Agri Loans';
      if (g === 'save') return 'High-Yield Savings';
      if (g === 'payments') return 'Digital Payments & Mobile Money';
      if (g === 'mortgage') return 'Home Housing Credit';
      return g;
    }).join(', ');

    try {
      await onUpdateProfile({
        name,
        location,
        phone,
        financialGoal: goalsText,
        incomeRange,
        employmentType,
        channelPreference,
        preferredCategories: selectedGoals,
        segment: segment || undefined,
        district,
        cityVillage,
        needs: selectedGoals,
        profileStatus: 'complete',
      });
      onNavigate('loan-products');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eff4ff] py-10 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#bcc9c6]/30 shadow-lg p-6 sm:p-8 space-y-6">
        
        {/* Step Indicator Header */}
        <div className="space-y-3 border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#00685f]">
            <span>Member Onboarding</span>
            <div className="flex items-center gap-2">
              {step === 1 && (
                <button type="button" onClick={() => onNavigate('landing')} aria-label="Go to home" title="Home" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#bcc9c6]/50 text-[#00685f] transition-colors hover:bg-[#f4fffc]">
                  <span className="material-symbols-outlined text-base">home</span>
                </button>
              )}
              <span className="rounded-full bg-[#e5eeff] px-2.5 py-1 text-[10px] text-[#00685f]">Step {step} of 3</span>
            </div>
          </div>

          <div className="rounded-full bg-[#e9eef5] p-1">
            <div className="flex gap-2">
              {[1, 2, 3].map((index) => {
                const isActive = step === index;
                const isComplete = step > index;
                return (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all duration-200 ${
                      isComplete || isActive ? 'bg-[#00685f]' : 'bg-[#cfd8e3]'
                    } ${isActive ? 'shadow-[0_0_0_3px_rgba(0,104,95,0.15)]' : ''}`}
                  />
                );
              })}
            </div>
          </div>

          <h1 className="text-xl font-extrabold text-[#0b1c30]">
            {step === 1 && "Confirm Your Basic Profile"}
            {step === 2 && "What are your main financial goals?"}
            {step === 3 && "Income & Preferred Delivery Channels"}
          </h1>
          <p className="text-xs text-[#3d4947]">
            {step === 1 && "Ensure your contact details are accurate so loan providers can verify your application."}
            {step === 2 && "We will filter and rank loans, savings, and SACCO accounts tailored to your exact needs."}
            {step === 3 && "Tell us your comfort with digital mobile money, commercial banks, or SACCOs."}
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Location in Malawi</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lilongwe, Central Region"
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Mobile Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">I am a *</label>
              <select value={segment} onChange={(e) => setSegment(e.target.value)} className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none">
                <option value="">Select your segment</option>
                <option value="student">Student</option><option value="farmer">Farmer</option>
                <option value="microbusiness">Microbusiness</option><option value="small_business">Small business</option><option value="household">Household</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Next: Financial Goals</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'small_loan', label: 'I want a loan', icon: 'payments', desc: 'SME, agricultural, or quick personal cash loan.' },
                { key: 'save', label: 'I want to save', icon: 'savings', desc: 'High-yield SACCO or bank savings accounts.' },
                { key: 'payments', label: 'Manage Payments', icon: 'account_balance_wallet', desc: 'Mobile money, merchant, and transfer tools.' },
                { key: 'mortgage', label: 'Home & Housing', icon: 'home', desc: 'Mortgages and land improvement loans.' },
              ].map((goal) => {
                const isSelected = selectedGoals.includes(goal.key);
                return (
                  <button
                    key={goal.key}
                    type="button"
                    onClick={() => toggleGoal(goal.key)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00685f] bg-[#f4fffc] ring-2 ring-[#00685f]/30'
                        : 'border-[#bcc9c6]/40 bg-white hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[#00685f]">{goal.icon}</span>
                      <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-[#00685f]' : 'text-gray-300'}`}>
                        {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-[#0b1c30] mt-2">{goal.label}</div>
                    <p className="text-[11px] text-[#3d4947] mt-1">{goal.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                aria-label="Back to financial goals"
                title="Back"
                className="py-3 px-4 border border-[#bcc9c6]/50 rounded-xl text-xs font-bold text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Risk & Channel</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Monthly Income Range</label>
              <select
                value={incomeRange}
                onChange={(e) => setIncomeRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              >
                <option value="Under MWK 100,000">Under MWK 100,000</option>
                <option value="MWK 100,000 - MWK 250,000">MWK 100,000 - MWK 250,000</option>
                <option value="MWK 250,000 - MWK 750,000">MWK 250,000 - MWK 750,000</option>
                <option value="MWK 750,000 - MWK 2,000,000">MWK 750,000 - MWK 2,000,000</option>
                <option value="Above MWK 2,000,000">Above MWK 2,000,000</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Employment / Business Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none"
              >
                <option value="Salaried Professional">Salaried Professional</option>
                <option value="Self-Employed Farmer / Business">Self-Employed Farmer / Business</option>
                <option value="SME Business Owner">SME Business Owner</option>
                <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                <option value="Student / Other">Student / Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">Preferred Channel Comfort</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'any', label: 'Any Channel' },
                  { key: 'mobile_money', label: 'Mobile Money (Airtel/TNM)' },
                  { key: 'bank', label: 'Commercial Bank Account' },
                  { key: 'sacco', label: 'SACCO / Cooperative' },
                ].map((ch) => (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => setChannelPreference(ch.key as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      channelPreference === ch.key
                        ? 'border-[#00685f] bg-[#f4fffc] text-[#00685f]'
                        : 'border-[#bcc9c6]/40 text-[#0b1c30] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                aria-label="Back to financial goals"
                title="Back"
                className="py-3 px-4 border border-[#bcc9c6]/50 rounded-xl text-xs font-bold text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={selectedGoals.length === 0 || isFinishing}
                className="flex-1 py-3 bg-[#00685f] hover:bg-[#008378] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isFinishing ? 'Saving your setup...' : 'Complete Setup & Discover Services'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
