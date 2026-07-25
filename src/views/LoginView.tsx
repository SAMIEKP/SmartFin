import React, { useState, useRef } from "react";
import { ViewMode, Role, UserProfile } from "../types";
import { USER_PROFILE_KWESI, PROVIDER_PROFILE_PHIRI } from "../data/mockData";

interface LoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (userProfile: UserProfile, role: Role) => void;
  infoMessage?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
  infoMessage = null,
}) => {
  const [email, setEmail] = useState("kwesi.banda@example.mw");
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrorMessage("");
    setEmailError(null);
    setPasswordError(null);

    const cleanEmail = email.trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailError("Enter a valid email address.");
      emailRef.current?.focus();
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      passwordRef.current?.focus();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const normalized = cleanEmail.toLowerCase();

      if (
        normalized === "m.phiri@finaccess.mw" ||
        normalized.includes("provider") ||
        normalized.includes("lender")
      ) {
        onLoginSuccess(PROVIDER_PROFILE_PHIRI, "provider");
        return;
      }

      if (
        normalized === "kwesi.banda@example.mw" ||
        (normalized.includes("@") && password.length >= 6)
      ) {
        onLoginSuccess({ ...USER_PROFILE_KWESI, email: email }, "user");
        return;
      }

      setErrorMessage(
        "Email or password is incorrect. Please check your credentials.",
      );
      // focus password to encourage retry
      passwordRef.current?.focus();
    }, 600);
  };

  const handleQuickLogin = (roleType: "user" | "provider") => {
    setErrorMessage("");
    setEmailError(null);
    setPasswordError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (roleType === "provider") {
        onLoginSuccess(PROVIDER_PROFILE_PHIRI, "provider");
      } else {
        onLoginSuccess(USER_PROFILE_KWESI, "user");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#eff4ff] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#bcc9c6]/30 shadow-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            onClick={() => onNavigate("landing")}
            className="text-3xl font-extrabold text-[#00685f] cursor-pointer hover:opacity-80 transition-opacity tracking-tight"
          >
            FinAccess
          </h1>
          <h2 className="text-xl font-bold text-[#0b1c30]">Welcome Back</h2>
          <p className="text-xs text-[#3d4947]">
            Sign in to access your financial discovery account and track
            applications.
          </p>
        </div>

        {/* Info banner when redirected */}
        {infoMessage && (
          <div className="p-3 bg-[#e6f7ff] border border-[#bfe9ff] text-[#055160] rounded-xl font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Quick Demo Login Switcher */}
        <div className="p-3 bg-[#eff4ff] rounded-2xl border border-[#bcc9c6]/30 space-y-2 text-xs">
          <span className="font-bold text-[#0b1c30] block text-center">
            Quick Demo Accounts
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("user")}
              className="flex-1 py-2 px-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold transition-colors cursor-pointer text-center"
            >
              Individual User
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("provider")}
              className="flex-1 py-2 px-3 bg-[#855300] hover:bg-[#653e00] text-white rounded-xl font-bold transition-colors cursor-pointer text-center"
            >
              Loan Provider
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-[#0b1c30] block">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                mail
              </span>
              <input
                ref={emailRef}
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="name@example.mw"
                className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-xs font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
              />
            </div>
            {emailError && (
              <p className="text-red-600 text-[11px] mt-1">{emailError}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-[#0b1c30] block">Password</label>
              <button
                type="button"
                onClick={() =>
                  alert("Password reset link sent to your registered email.")
                }
                className="text-[11px] font-bold text-[#00685f] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                lock
              </span>
              <input
                ref={passwordRef}
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-xs font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
              />
            </div>
            {passwordError && (
              <p className="text-red-600 text-[11px] mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to FinAccess</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#3d4947]">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate("register")}
            className="font-bold text-[#00685f] hover:underline cursor-pointer"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};
