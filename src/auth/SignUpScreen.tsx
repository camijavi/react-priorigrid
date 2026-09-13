import React, { useState } from "react";
import { UserService } from "../services/UserService";
import type { UserModel } from "../models/UserModel";
import navarroLogo from "../assets/navarro-logo.png";

interface SignUpScreenProps {
  onSuccess?: (user: UserModel) => void;
  onNavigateToLogin?: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const errors: { username?: string; email?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = "Please enter your username";
    }

    if (!email.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Please enter your password";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      // Check existing account validation before registration
      const [userExists, emailExists] = await Promise.all([
        UserService.isUsernameExists(username),
        UserService.isEmailExists(email),
      ]);

      const existingErrors: { username?: string; email?: string } = {};

      if (userExists) {
        existingErrors.username = "This username is already taken.";
      }
      if (emailExists) {
        existingErrors.email = "This email is already registered.";
      }

      if (Object.keys(existingErrors).length > 0) {
        setFieldErrors(existingErrors);
        setLoading(false);
        return;
      }

      const user = await UserService.register(
        email.trim(),
        password,
        username.trim(),
      );
      setSuccessMsg(`Welcome, ${user.username}! Account created successfully.`);

      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err?.code === "auth/email-already-in-use") {
        setFieldErrors({ email: "This email is already registered." });
      } else if (err?.code === "auth/weak-password") {
        setFieldErrors({
          password: "Password must be at least 6 characters long.",
        });
      } else {
        const message =
          err?.message || "Failed to create account. Please try again.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 font-sans"
      style={{
        background:
          "linear-gradient(135deg, #ffea85 0%, #ff7e5f 35%, #feb47b 65%, #ff416c 100%)",
      }}
    >
      <div
        className="signup-container w-full max-w-md p-8 flex flex-col gap-6"
        style={{
          background: "rgba(255, 255, 255, 0.23)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(3.4px)",
          WebkitBackdropFilter: "blur(3.4px)",
          border: "1px solid rgba(255, 255, 255, 0.51)",
        }}
      >
        {/* 1- Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-white drop-shadow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* 2- Sign Up with email header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Sign Up with email
          </h2>
          <p className="text-sm text-gray-700/80 mt-1">
            Create your account to get started
          </p>
        </div>

        {/* Form container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-900 text-sm font-medium backdrop-blur-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-900 text-sm font-medium backdrop-blur-sm">
              {successMsg}
            </div>
          )}

          {/* 3- Username Input field */}
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-700 pointer-events-none">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username)
                    setFieldErrors((prev) => ({
                      ...prev,
                      username: undefined,
                    }));
                }}
                placeholder="Username"
                className={`w-full pl-10 pr-4 py-3 bg-white/30 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:bg-white/40 transition-all duration-200 ${
                  fieldErrors.username
                    ? "border-2 border-red-500/90 focus:ring-red-400"
                    : "border border-white/50 focus:ring-white/80"
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p className="text-xs text-red-800 font-semibold pl-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* 4- Email Input field */}
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-700 pointer-events-none">
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
                  if (fieldErrors.email)
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Email address"
                className={`w-full pl-10 pr-4 py-3 bg-white/30 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:bg-white/40 transition-all duration-200 ${
                  fieldErrors.email
                    ? "border-2 border-red-500/90 focus:ring-red-400"
                    : "border border-white/50 focus:ring-white/80"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-800 font-semibold pl-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* 5- Password Input field */}
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-700 pointer-events-none">
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
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                }}
                placeholder="Password"
                className={`w-full pl-10 pr-12 py-3 bg-white/30 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:bg-white/40 transition-all duration-200 ${
                  fieldErrors.password
                    ? "border-2 border-red-500/90 focus:ring-red-400"
                    : "border border-white/50 focus:ring-white/80"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 text-gray-700 hover:text-gray-900 focus:outline-none p-1 transition-colors duration-150 cursor-pointer"
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
            {fieldErrors.password ? (
              <p className="text-xs text-red-800 font-semibold pl-1">
                {fieldErrors.password}
              </p>
            ) : (
              <p className="text-xs text-gray-700/90 font-medium pl-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* 6- Get started text btn */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
            <span>Get started</span>
          </button>
        </form>

        {onNavigateToLogin && (
          <div className="text-center mt-2 text-sm text-gray-700">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-gray-900 hover:underline focus:outline-none cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Social & Company Links */}
        <div className="pt-4 border-t border-white/30 flex flex-col items-center gap-2">
          <p className="text-xs text-gray-800 font-medium">
            Developed by Camila Javiera
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://www.linkedin.com/in/camila-javiera-navarro/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/50 border border-white/40 text-xs font-semibold text-gray-800 transition-all duration-200 hover:scale-105"
              title="LinkedIn Profile"
            >
              <svg
                className="w-4 h-4 text-blue-700 fill-current"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/50 border border-white/40 text-xs font-semibold text-gray-800 transition-all duration-200 hover:scale-105"
              title="GitHub Repository"
            >
              <svg
                className="w-4 h-4 text-gray-900 fill-current"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/50 border border-white/40 text-xs font-semibold text-gray-800 transition-all duration-200 hover:scale-105"
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

export default SignUpScreen;
