import React from 'react';
import appIcon from '../assets/images/savex_app_icon_1785774237450.jpg';
import { UserProfile } from './AuthScreen';

interface HeaderProps {
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenSettings: () => void;
  user?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  privacyMode,
  onTogglePrivacy,
  onOpenSettings,
  user,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header id="vaultflow-header" className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-[1280px] mx-auto h-16 flex items-center justify-between px-3 sm:px-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-xs border border-indigo-200 bg-white flex items-center justify-center shrink-0">
            <img
              src={appIcon}
              alt="saveX Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
              save<span className="text-indigo-600">X</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono-num text-indigo-600 font-bold tracking-wider uppercase mt-0.5">
              Smart Wealth
            </span>
          </div>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Privacy Toggle Button */}
          <button
            id="privacy-toggle-btn"
            onClick={onTogglePrivacy}
            title={privacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 border shrink-0 ${
              privacyMode
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {privacyMode ? 'visibility_off' : 'visibility'}
            </span>
            <span className="font-mono-num uppercase tracking-wider text-[10px] hidden sm:inline">
              {privacyMode ? 'Private' : 'Privacy'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            id="settings-open-btn"
            onClick={onOpenSettings}
            title="Budget Settings"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200 shrink-0"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center gap-2 ml-0.5 shrink-0">
              <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-slate-100 border border-slate-200 rounded-full">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-mono-num font-bold text-slate-700 max-w-[90px] truncate hidden sm:inline">
                  {user.name}
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="ml-0.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-mono-num font-bold shadow-xs transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

