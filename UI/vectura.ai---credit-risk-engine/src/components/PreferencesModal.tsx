import React from 'react';
import { UserPreferences } from '../types/underwriting';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  onResetPreferences: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onResetPreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 dark:text-white">
                Underwriting Preferences
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Saved automatically to local storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-[20px]">
                  {preferences.darkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Appearance Theme (Dark Mode)
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400">
                  Switch between light and slate dark mode palettes
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.darkMode}
              onClick={() => onSavePreferences({ ...preferences, darkMode: !preferences.darkMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                preferences.darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Guest Access Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Guest Testing Mode
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400">
                  Allows testing without authentication credentials
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.isGuest}
              onClick={() => onSavePreferences({ ...preferences, isGuest: !preferences.isGuest })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                preferences.isGuest ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  preferences.isGuest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Underwriter Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="font-semibold text-slate-900 dark:text-white">
              Underwriter Identity (Signatory)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Officer Name
                </label>
                <input
                  type="text"
                  value={preferences.underwriterName}
                  onChange={(e) => onSavePreferences({ ...preferences, underwriterName: e.target.value })}
                  className="w-full mt-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Title / Role
                </label>
                <input
                  type="text"
                  value={preferences.underwriterRole}
                  onChange={(e) => onSavePreferences({ ...preferences, underwriterRole: e.target.value })}
                  className="w-full mt-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Approval Cutoff Threshold */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Regulatory Approval Cutoff
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400">
                  Minimum probability threshold for automated greenlight
                </div>
              </div>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                {preferences.approvalCutoff.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="80"
              step="0.5"
              value={preferences.approvalCutoff}
              onChange={(e) => onSavePreferences({ ...preferences, approvalCutoff: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetPreferences}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
