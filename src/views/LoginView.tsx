import React, { useState, useEffect } from 'react';
import { ViewMode, Role, UserProfile } from '../types';
import { authAPI, mapApiUser } from '../services/api';

interface LoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (userProfile: UserProfile, role: Role, token?: string) => void;
  defaultRole?: Role;
  infoMessage?: string | null;
}

const PROVIDER_CREDENTIALS_KEY = "smartfin_provider_credentials";

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
  defaultRole = "user",
  infoMessage = null,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerPassword, setProviderPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProviderPassword, setShowProviderPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetId, setResetId] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PROVIDER_CREDENTIALS_KEY);
      if (!saved) {
        return;
      }
      const credentials = JSON.parse(saved);
      if (credentials?.email) {
        setProviderEmail(credentials.email);
      }
      if (credentials?.password) {
        setProviderPassword(credentials.password);
      }
    } catch {
      // Ignore invalid storage data.
    }
  }, []);

  const saveProviderCredentials = (email: string, password: string) => {
    try {
      window.localStorage.setItem(
        PROVIDER_CREDENTIALS_KEY,
        JSON.stringify({ email, password }),
      );
    } catch {
      // Ignore storage failures.
    }
  };

  const resetEmail = selectedRole === 'user' ? email : providerEmail;

  const handlePasswordResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await authAPI.requestPasswordReset(resetEmail);
      setResetId(response.resetId || '');
      setResetMessage(response.message);
    } catch (error: any) {
      setErrorMessage(error.message || 'Unable to start password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    if (resetPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await authAPI.resetPassword(resetId, resetCode, resetPassword);
      setResetMessage(response.message);
      setResetMode(false);
      setResetId('');
      setResetCode('');
      setResetPassword('');
      setPassword('');
      setProviderPassword('');
    } catch (error: any) {
      setErrorMessage(error.message || 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (selectedRole === "user") {
      if (!email || !password) {
        setErrorMessage("Please fill in both email and password.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
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
        setErrorMessage("Please fill in both institution email and password.");
        return;
      }
      if (providerPassword.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
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
    <div className="auth-page auth-page-login min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="auth-app-shell mx-auto grid w-full max-w-6xl overflow-hidden lg:grid-cols-[.82fr_1.18fr]">
        <aside className="auth-visual-panel hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <div><button type="button" onClick={() => onNavigate('landing')} className="auth-brand auth-brand-button">{'Smart'}{'Fin'} Connect</button><p className="auth-eyebrow mt-20">Your financial workspace</p><h2 className="auth-display-title mt-5">Make your next move with more clarity.</h2><p className="mt-6 max-w-sm text-sm leading-7 text-white/65">Find trusted options, understand the details and keep every application moving forward.</p></div>
          <div className="auth-visual-stat"><span className="material-symbols-outlined">verified</span><span>Built for individuals and institutions across Malawi.</span></div>
        </aside>
        <main className="auth-form-panel p-6 sm:p-10 lg:p-12">
        <div className="mb-8 flex items-center justify-between lg:hidden"><span className="auth-brand auth-brand-dark">{'Smart'}{'Fin'} Connect</span><span className="auth-step-label">Secure access</span></div>
        <div className="auth-form-card space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-[#00685f] tracking-tight">
            SmartFin Access Connect
          </h1>
          <h2 className="text-xl font-bold text-[#0b1c30]">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-[#3d4947]">
            Access your financial discovery dashboard and track applications.
          </p>
        </div>

        {infoMessage && (
          <div className="p-3 bg-[#e6f7ff] border border-[#bfe9ff] text-[#055160] rounded-xl font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>{infoMessage}</span>
          </div>
        )}

          <div className="auth-role-switch space-y-2">
          <label className="text-xs font-bold text-[#0b1c30] block">
            Select Account Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("user");
                setErrorMessage("");
              }}
                className={`auth-role-option p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                selectedRole === "user"
                  ? "border-[#00685f] bg-[#f4fffc] ring-2 ring-[#00685f]/30"
                  : "border-[#bcc9c6]/40 hover:bg-[#eff4ff]"
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
                setSelectedRole("provider");
                setErrorMessage("");
              }}
                className={`auth-role-option p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                selectedRole === "provider"
                  ? "border-[#855300] bg-[#fff8f0] ring-2 ring-[#855300]/30"
                  : "border-[#bcc9c6]/40 hover:bg-[#eff4ff]"
              }`}
            >
              <div className="flex items-center gap-2 text-[#855300]">
                <span className="material-symbols-outlined">
                  account_balance
                </span>
                <span className="font-extrabold text-xs">
                  Loan Provider / Institution
                </span>
              </div>
              <p className="text-[11px] text-[#3d4947] mt-2">
                Sign in to manage your loan products and applications.
              </p>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div key={`${selectedRole}-${resetMode ? 'reset' : 'login'}`} className={`auth-role-content ${selectedRole === 'provider' ? 'is-provider' : 'is-individual'}`}>
        {resetMode ? (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-[#0b1c30]">Reset your password</h3>
              <p className="mt-1 text-[#3d4947]">Enter your registered email to receive a six-digit reset code.</p>
            </div>
            {!resetId ? (
              <form onSubmit={handlePasswordResetRequest} className="space-y-3">
                <input type="email" required value={resetEmail} onChange={(event) => selectedRole === 'user' ? setEmail(event.target.value) : setProviderEmail(event.target.value)} placeholder="Email address" className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-[#0b1c30]" />
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#00685f] text-white rounded-xl font-bold disabled:opacity-50">{isSubmitting ? 'Sending code...' : 'Send reset code'}</button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input required inputMode="numeric" value={resetCode} onChange={(event) => setResetCode(event.target.value)} placeholder="Six-digit reset code" className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-[#0b1c30]" />
                <div className="relative"><input required type={showResetPassword ? 'text' : 'password'} value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} placeholder="New password" className="w-full px-3 py-2.5 pr-10 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-[#0b1c30]" /><button type="button" onClick={() => setShowResetPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7a77]" aria-label={showResetPassword ? 'Hide new password' : 'Show new password'}><span className="material-symbols-outlined text-base">{showResetPassword ? 'visibility_off' : 'visibility'}</span></button></div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#00685f] text-white rounded-xl font-bold disabled:opacity-50">{isSubmitting ? 'Updating password...' : 'Set new password'}</button>
              </form>
            )}
            {resetMessage && <p className="rounded-xl bg-[#f4fffc] p-3 text-[#00685f]">{resetMessage}</p>}
            <button type="button" onClick={() => { setResetMode(false); setResetMessage(''); setResetId(''); }} className="font-bold text-[#00685f] hover:underline">Back to sign in</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0b1c30]">{selectedRole === 'provider' ? 'Institution Email Address *' : 'Email Address *'}</label>
              <input type="email" required value={selectedRole === 'provider' ? providerEmail : email} onChange={(event) => selectedRole === 'provider' ? setProviderEmail(event.target.value) : setEmail(event.target.value)} placeholder={selectedRole === 'provider' ? 'admin@institution.mw' : 'kwesi@example.mw'} className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-[#0b1c30]">Password *</label>
                <button type="button" onClick={() => setResetMode(true)} className={`text-[11px] font-bold hover:underline ${selectedRole === 'provider' ? 'text-[#855300]' : 'text-[#00685f]'}`}>Forgot Password?</button>
              </div>
              <div className="relative"><input type={selectedRole === 'provider' ? (showProviderPassword ? 'text' : 'password') : (showPassword ? 'text' : 'password')} required value={selectedRole === 'provider' ? providerPassword : password} onChange={(event) => selectedRole === 'provider' ? setProviderPassword(event.target.value) : setPassword(event.target.value)} placeholder="Enter your password" className="w-full px-3 py-2.5 pr-10 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30" /><button type="button" onClick={() => selectedRole === 'provider' ? setShowProviderPassword((value) => !value) : setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7a77]" aria-label={(selectedRole === 'provider' ? showProviderPassword : showPassword) ? 'Hide password' : 'Show password'}><span className="material-symbols-outlined text-base">{(selectedRole === 'provider' ? showProviderPassword : showPassword) ? 'visibility_off' : 'visibility'}</span></button></div>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full py-3.5 text-white font-extrabold text-xs rounded-xl shadow-xs disabled:opacity-50 ${selectedRole === 'provider' ? 'bg-[#855300]' : 'bg-[#00685f]'}`}>{isSubmitting ? 'Signing In...' : `Sign In as ${selectedRole === 'provider' ? 'Provider' : 'Individual'}`}</button>
          </form>
        )}
        </div>

        <div className="auth-form-footer text-center pt-2 border-t border-gray-100 text-xs text-[#3d4947]">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate("register")}
            className="font-bold text-[#00685f] hover:underline cursor-pointer"
          >
            Create Account Here
          </button>
        </div>
        </div>
        </main>
      </div>
    </div>
  );
};
