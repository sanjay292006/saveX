import React, { useState } from 'react';
import appIcon from '../assets/images/savex_app_icon_1785774237450.jpg';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'google' | 'email' | 'guest';
}

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onSkipAsGuest?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onSkipAsGuest,
}) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name) return;

    setLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        name: isSignUp ? name : email.split('@')[0],
        email,
        provider: 'email',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
      setLoading(false);
      onLoginSuccess(user);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        name: 'Alex Sharma',
        email: 'alex.sharma@gmail.com',
        provider: 'google',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setLoading(false);
      onLoginSuccess(user);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center relative overflow-hidden">
        {/* Top Decorative Banner Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-emerald-500 to-indigo-600" />

        {/* Generated App Icon */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-indigo-100 mb-4 p-1 bg-white">
          <img
            src={appIcon}
            alt="saveX App Icon"
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* App Title & Tagline */}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          save<span className="text-indigo-600">X</span>
        </h1>
        <p className="text-xs font-mono-num font-semibold text-slate-500 mt-1 mb-6 text-center">
          Smart Personal Wealth & Safe-To-Spend Engine
        </p>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="w-full flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono-num font-bold transition-all ${
              !isSignUp
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono-num font-bold transition-all ${
              isSignUp
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-xs font-bold font-mono-num text-slate-700 flex items-center justify-center gap-3 transition-all active:scale-98 mb-5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-mono-num font-bold text-slate-400 uppercase tracking-wider">
            Or with email
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs font-mono-num shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : isSignUp ? (
              'Create saveX Account'
            ) : (
              'Sign In to saveX'
            )}
          </button>
        </form>

        {/* Skip as Guest Option */}
        {onSkipAsGuest && (
          <button
            type="button"
            onClick={onSkipAsGuest}
            className="mt-5 text-xs font-mono-num font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Continue as Guest →
          </button>
        )}
      </div>
    </div>
  );
};
