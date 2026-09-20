import React, { useState } from "react";
import { UserService } from "../services/UserService";
import type { UserModel } from "../models/UserModel";
import navarroLogo from "../assets/navarroweb-logo.png";
import prioriGridLogo from "../assets/prioriGridLogo.png";
import ButterflyCursorBackground from "../components/effects/butterflyCursorBg";

interface SignInScreenProps {
  onSuccess?: (user: UserModel) => void;
  onNavigateToSignUp?: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSuccess,
  onNavigateToSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const clearError = () => {
    if (error || hasError) {
      setError(null);
      setHasError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHasError(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setHasError(true);
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      setHasError(true);
      return;
    }

    try {
      setLoading(true);
      const user = await UserService.login(email, password);
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setHasError(true);
      let userFriendlyMessage = "Invalid email or password. Please try again.";
      if (
        err?.code === "auth/invalid-credential" ||
        err?.message?.includes("auth/invalid-credential")
      ) {
        userFriendlyMessage = "Invalid email or password. Please try again.";
      } else if (
        err?.code === "auth/user-not-found" ||
        err?.message?.includes("auth/user-not-found")
      ) {
        userFriendlyMessage = "No account found with this email address.";
      } else if (
        err?.code === "auth/wrong-password" ||
        err?.message?.includes("auth/wrong-password")
      ) {
        userFriendlyMessage = "Incorrect password. Please try again.";
      } else if (
        err?.code === "auth/too-many-requests" ||
        err?.message?.includes("auth/too-many-requests")
      ) {
        userFriendlyMessage = "Too many failed attempts. Please try again later.";
      } else if (err?.message && !err.message.includes("Firebase:")) {
        userFriendlyMessage = err.message;
      }
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ff7e5f 0%, #feb47b 20%, #ff5252 45%, #e91e63 75%, #880e4f 100%)",
      }}
    >
      <ButterflyCursorBackground />
      <div
        className="relative z-10 w-full max-w-md p-8 sm:p-10 flex flex-col gap-6 rounded-3xl shadow-2xl transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <img
            src={prioriGridLogo}
            alt="PrioriGrid Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to your account
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <svg
                className="w-5 h-5 text-red-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Email field */}
          <div className="relative flex items-center">
            <div
              className={`absolute left-3.5 pointer-events-none transition-colors duration-200 ${
                hasError ? "text-red-500" : "text-slate-400"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              placeholder="Email address"
              className={`w-full pl-11 pr-4 py-3.5 bg-white/90 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm ${
                hasError
                  ? "border-2 border-red-500/90 focus:border-red-500 focus:ring-red-500/20"
                  : "border border-slate-200/90 focus:border-orange-500 focus:ring-orange-500/20 focus:bg-white"
              }`}
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <div
                className={`absolute left-3.5 pointer-events-none transition-colors duration-200 ${
                  hasError ? "text-red-500" : "text-slate-400"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder="Password"
                className={`w-full pl-11 pr-12 py-3.5 bg-white/90 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm ${
                  hasError
                    ? "border-2 border-red-500/90 focus:border-red-500 focus:ring-red-500/20"
                    : "border border-slate-200/90 focus:border-orange-500 focus:ring-orange-500/20 focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors duration-150 cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            <span>Sign In</span>
          </button>
        </form>

        {onNavigateToSignUp && (
          <div className="text-center mt-1 text-sm text-slate-600 font-medium">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="font-bold text-pink-600 hover:text-pink-700 hover:underline focus:outline-none cursor-pointer transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Social & Company Links */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col items-center gap-2.5">
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            Developed by Camila Javiera
          </p>
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <a
              href="https://www.linkedin.com/in/camila-javiera-navarro/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
              title="LinkedIn Profile"
            >
              <svg
                className="w-4 h-4 text-blue-600 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/camijavi/react-priorigrid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
              title="GitHub Repository"
            >
              <svg
                className="w-4 h-4 text-slate-800 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://navarroweb.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
              title="Navarro Web"
            >
              <img
                src={navarroLogo}
                alt="Navarro Web Logo"
                className="w-4 h-4 object-contain"
              />
              <span>Navarro Web</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
