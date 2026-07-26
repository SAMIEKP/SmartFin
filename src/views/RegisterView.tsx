import React, { useState } from 'react';
import { ViewMode, Role, UserProfile } from '../types';
import { USER_PROFILE_KWESI, PROVIDER_PROFILE_PHIRI } from '../data/mockData';

interface RegisterViewProps {
  onNavigate: (view: ViewMode) => void;
  onSelectUser: (user: UserProfile, role: Role) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate, onSelectUser }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  
  // Individual fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Lilongwe, Central Region');
  const [incomeRange, setIncomeRange] = useState('MWK 250,000 - MWK 750,000');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Provider fields
  const [institutionName, setInstitutionName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPhone, setProviderPhone] = useState('');
  const [institutionType, setInstitutionType] = useState('MFI');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [providerPassword, setProviderPassword] = useState('');
  const [providerConfirmPassword, setProviderConfirmPassword] = useState('');

  // Validation
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'user') {
      if (!name || !email || !password) {
        setErrorMessage('Please fill in all required fields (Name, Email, Password).');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const newUser: UserProfile = {
          ...USER_PROFILE_KWESI,
          name: name,
          email: email,
          phone: phone || '+265 999 123 456',
          location: location,
          incomeRange: incomeRange,
          role: 'user',
        };
        onSelectUser(newUser, 'user');
        onNavigate('user-onboarding');
      }, 500);

    } else {
      if (!institutionName || !contactPerson || !providerEmail || !providerPassword) {
        setErrorMessage('Please fill in all required institution fields.');
        return;
      }
      if (providerPassword !== providerConfirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (providerPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const newProvider: UserProfile = {
          ...PROVIDER_PROFILE_PHIRI,
          name: contactPerson,
          institutionName: institutionName,
          email: providerEmail,
          phone: providerPhone || '+265 888 765 432',
          institutionType: institutionType,
          registrationNumber: registrationNumber || 'RBM/PENDING/2024',
          role: 'provider',
          isPendingVerification: true,
        };
        onSelectUser(newProvider, 'provider');
        onNavigate('provider-onboarding');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#eff4ff] py-10 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#bcc9c6]/30 shadow-lg p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-[#00685f] tracking-tight">
            SmartFin Access Connect
          </h1>
          <h2 className="text-xl font-bold text-[#0b1c30]">Create your FinAccess Account</h2>
          <p className="text-xs text-[#3d4947]">
            Connect to financial discovery, verified lenders, and seamless service applications.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0b1c30] block">Select Account Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('user');
                setErrorMessage('');
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                selectedRole === 'user'
                  ? 'border-[#00685f] bg-[#f4fffc] ring-2 ring-[#00685f]/30'
                  : 'border-[#bcc9c6]/40 hover:bg-[#eff4ff]'
              }`}
            >
              <div className="flex items-center gap-2 text-[#00685f]">
                <span className="material-symbols-outlined">person</span>
                <span className="font-extrabold text-xs">Individual User</span>
              </div>
              <p className="text-[11px] text-[#3d4947] mt-2">
                I'm looking for financial services (loans, savings, insurance, SACCO).
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('provider');
                setErrorMessage('');
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                selectedRole === 'provider'
                  ? 'border-[#855300] bg-[#fff8f0] ring-2 ring-[#855300]/30'
                  : 'border-[#bcc9c6]/40 hover:bg-[#eff4ff]'
              }`}
            >
              <div className="flex items-center gap-2 text-[#855300]">
                <span className="material-symbols-outlined">account_balance</span>
                <span className="font-extrabold text-xs">Loan Provider / Institution</span>
              </div>
              <p className="text-[11px] text-[#3d4947] mt-2">
                I'm an institution or organization offering financial products.
              </p>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {selectedRole === 'user' ? (
            /* Individual User Fields */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kwesi Banda"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwesi@example.mw"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+265 999 123 456"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  >
                    <option value="Lilongwe, Central Region">Lilongwe, Central Region</option>
                    <option value="Blantyre, Southern Region">Blantyre, Southern Region</option>
                    <option value="Mzuzu, Northern Region">Mzuzu, Northern Region</option>
                    <option value="Zomba, Eastern Region">Zomba, Eastern Region</option>
                    <option value="Kasungu, Central Region">Kasungu, Central Region</option>
                    <option value="Mangochi, Southern Region">Mangochi, Southern Region</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">Estimated Monthly Income Range (Optional)</label>
                <select
                  value={incomeRange}
                  onChange={(e) => setIncomeRange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                >
                  <option value="Under MWK 100,000">Under MWK 100,000</option>
                  <option value="MWK 100,000 - MWK 250,000">MWK 100,000 - MWK 250,000</option>
                  <option value="MWK 250,000 - MWK 750,000">MWK 250,000 - MWK 750,000</option>
                  <option value="MWK 750,000 - MWK 2,000,000">MWK 750,000 - MWK 2,000,000</option>
                  <option value="Above MWK 2,000,000">Above MWK 2,000,000</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 chars"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Loan Provider Fields */
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">Institution / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Malawi Central Microfinance"
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. M. Phiri"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={providerEmail}
                    onChange={(e) => setProviderEmail(e.target.value)}
                    placeholder="m.phiri@institution.mw"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Institution Type</label>
                  <select
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                  >
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Microfinance Institution (MFI)">Microfinance Institution (MFI)</option>
                    <option value="SACCO">SACCO (Savings & Credit Coop)</option>
                    <option value="Fintech / Mobile Lender">Fintech / Mobile Lender</option>
                    <option value="Government / NGO Fund">Government / NGO Fund</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">RBM Licence / Registration ID</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. RBM/MFI/2024/019"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">Institution Contact Phone</label>
                <input
                  type="tel"
                  value={providerPhone}
                  onChange={(e) => setProviderPhone(e.target.value)}
                  placeholder="+265 888 765 432"
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Password *</label>
                  <input
                    type="password"
                    required
                    value={providerPassword}
                    onChange={(e) => setProviderPassword(e.target.value)}
                    placeholder="At least 6 chars"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30]">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={providerConfirmPassword}
                    onChange={(e) => setProviderConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              selectedRole === 'provider' ? 'bg-[#855300] hover:bg-[#653e00]' : 'bg-[#00685f] hover:bg-[#008378]'
            }`}
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create {selectedRole === 'provider' ? 'Provider Account' : 'Individual Account'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer link to Login */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#3d4947]">
          <span>Already registered on FinAccess? </span>
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#00685f] hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
