import React, { useState } from 'react';
import { ViewMode, Role, UserProfile } from '../types';
import { authAPI, mapApiUser } from '../services/api';

interface LoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (userProfile: UserProfile, role: Role, token?: string) => void;
  defaultRole?: Role;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
  defaultRole = 'user',
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);
  
  // Individual login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Provider login fields
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPassword, setProviderPassword] = useState('');

  // Validation
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'user') {
      if (!email || !password) {
        setErrorMessage('Please fill in all required fields (Email, Password).');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await authAPI.login({ email, password });
        
        const userProfile = mapApiUser(response.user);

        onLoginSuccess(userProfile, response.user.role as Role, response.token);
        onNavigate(response.user.role === 'provider' ? 'provider-dashboard' : 'user-dashboard');
      } catch (error: any) {
        setErrorMessage(error.message || 'Invalid email or password.');
      } finally {
        setIsSubmitting(false);
      }

    } else {
      if (!providerEmail || !providerPassword) {
        setErrorMessage('Please fill in all required institution fields.');
        return;
      }
      if (providerPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await authAPI.login({
          email: providerEmail,
          password: providerPassword
        });

        const userProfile = mapApiUser(response.user);

        onLoginSuccess(userProfile, response.user.role as Role, response.token);
        onNavigate(response.user.role === 'provider' ? 'provider-dashboard' : 'user-dashboard');
      } catch (error: any) {
        setErrorMessage(error.message || 'Invalid email or password.');
      } finally {
        setIsSubmitting(false);
      }
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
          <h2 className="text-xl font-bold text-[#0b1c30]">Sign In to Your Account</h2>
          <p className="text-xs text-[#3d4947]">
            Access your financial discovery dashboard and track applications.
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
                Sign in to access your loan applications and dashboard.
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
                Sign in to manage your loan products and applications.
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
            /* Individual User Login Fields */
            <>
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

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#0b1c30]">Password *</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-[11px] font-bold text-[#00685f] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>
            </>
          ) : (
            /* Loan Provider Login Fields */
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">Institution Email Address *</label>
                <input
                  type="email"
                  required
                  value={providerEmail}
                  onChange={(e) => setProviderEmail(e.target.value)}
                  placeholder="admin@institution.mw"
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#0b1c30]">Password *</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-[11px] font-bold text-[#855300] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={providerPassword}
                  onChange={(e) => setProviderPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#855300]/30"
                />
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
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole === 'provider' ? 'Provider' : 'Individual'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#3d4947]">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-[#00685f] hover:underline cursor-pointer"
          >
            Create Account Here
          </button>
        </div>
      </div>
    </div>
  );
};
