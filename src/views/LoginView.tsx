import React, { useEffect, useState } from "react";
import { ViewMode, Role, UserProfile } from "../types";
import { USER_PROFILE_KWESI, PROVIDER_PROFILE_PHIRI } from "../data/mockData";

interface LoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (userProfile: UserProfile, role: Role) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
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
      setTimeout(() => {
        setIsSubmitting(false);
        const normalized = email.trim().toLowerCase();
        if (normalized.includes("@") && password.length >= 6) {
          onLoginSuccess({ ...USER_PROFILE_KWESI, email: normalized }, "user");
        } else {
          setErrorMessage("Invalid email or password.");
        }
      }, 500);
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
      setTimeout(() => {
        setIsSubmitting(false);
        const normalized = providerEmail.trim().toLowerCase();
        if (normalized.includes("@") && providerPassword.length >= 6) {
          saveProviderCredentials(normalized, providerPassword);
          onLoginSuccess(PROVIDER_PROFILE_PHIRI, "provider");
        } else {
          setErrorMessage("Invalid institution email or password.");
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#eff4ff] py-10 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#bcc9c6]/30 shadow-lg p-6 sm:p-8 space-y-6">
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

        <div className="space-y-2">
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
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
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
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {selectedRole === "user" ? (
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">
                  Email Address *
                </label>
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
                    onClick={() =>
                      alert(
                        "Password reset link sent to your registered email.",
                      )
                    }
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
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30]">
                  Institution Email Address *
                </label>
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
                    onClick={() =>
                      alert(
                        "Password reset link sent to your registered email.",
                      )
                    }
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
              selectedRole === "provider"
                ? "bg-[#855300] hover:bg-[#653e00]"
                : "bg-[#00685f] hover:bg-[#008378]"
            }`}
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>
                  Sign In as{" "}
                  {selectedRole === "provider" ? "Provider" : "Individual"}
                </span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#3d4947]">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate("register")}
            className="font-bold text-[#00685f] hover:underline cursor-pointer"
          >
            Create Account Here
          </button>
        </div>
      </div>
    </div>
  );
};
