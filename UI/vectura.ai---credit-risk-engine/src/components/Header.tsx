import React, { useState } from 'react';
import { UserPreferences } from '../types/underwriting';

interface HeaderProps {
  activeScreen: 'intake' | 'analytics';
  onNavigate: (screen: 'intake' | 'analytics') => void;
  preferences: UserPreferences;
  onOpenPreferences: () => void;
  onOpenDocs: () => void;
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  preferences,
  onOpenPreferences,
  onOpenDocs,
  onToggleMobileMenu,
  mobileMenuOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Model v2.4 Retraining Finished', time: '12m ago', read: false },
    { id: 2, title: 'SCHUFA Registry Sync Completed', time: '1h ago', read: true },
    { id: 3, title: 'Fair Lending Audit Verified (BaFin)', time: '3h ago', read: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Logo */}
          <div 
            onClick={() => onNavigate('intake')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[19px]">analytics</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[17px] tracking-tight text-slate-900 dark:text-white font-bold">
                VECTURA<span className="text-blue-600 dark:text-blue-400 font-semibold">.AI</span>
              </span>
              <span className="font-body text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                Credit Risk Engine
              </span>
            </div>
          </div>

          {/* Node Pill Status */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">
              Model v2.4 Active
            </span>
          </div>

          {/* Guest Mode Indicator */}
          {preferences.isGuest && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <span className="material-symbols-outlined text-[13px]">person_outline</span>
              Guest Mode
            </span>
          )}
        </div>

        {/* Center & Right Nav */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Main Top Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => onNavigate('intake')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeScreen === 'intake'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              Applicant Intake &amp; Risk Inputs
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeScreen === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              Decision Analytics &amp; Model Output
            </button>
          </nav>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>

          {/* Action Utilities */}
          <div className="flex items-center gap-2 relative">
            {/* Docs trigger */}
            <button
              onClick={onOpenDocs}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Documentation & Model Architecture"
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Audit &amp; System Alerts</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium cursor-pointer" onClick={() => setShowNotifications(false)}>Dismiss</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{n.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Preferences Trigger */}
            <div className="relative pl-1 border-l border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white ${
                  preferences.isGuest ? 'bg-amber-600' : 'bg-slate-900 dark:bg-blue-600'
                }`}>
                  {preferences.isGuest ? 'GU' : 'EV'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[13px] text-slate-900 dark:text-white font-medium leading-tight">
                    {preferences.isGuest ? 'Guest Tester' : preferences.underwriterName}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {preferences.isGuest ? 'Testing Access' : preferences.underwriterRole}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  expand_more
                </span>
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {preferences.isGuest ? 'Guest Testing Session' : preferences.underwriterName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {preferences.isGuest ? 'Full sandbox test access' : 'Authorized Officer #4829'}
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenPreferences();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-500">settings</span>
                      <span>Settings &amp; Dark Mode</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenDocs();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-500">description</span>
                      <span>Model Architecture Docs</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
