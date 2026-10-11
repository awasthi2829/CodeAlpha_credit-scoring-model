import React, { useState } from 'react';
import { ApplicantProfile, InferenceResult } from '../types/underwriting';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApplicantProfile;
  result: InferenceResult;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  profile,
  result,
}) => {
  const [issued, setIssued] = useState(false);

  if (!isOpen) return null;

  // Monthly payment calculation: P * (r*(1+r)^n) / ((1+r)^n - 1)
  const principal = profile.creditAmount;
  const annualRate = 0.0575; // 5.75%
  const monthlyRate = annualRate / 12;
  const n = profile.durationMonths;
  const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalInterest = monthlyPayment * n - principal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 dark:text-white">
                Credit Disbursal Term Sheet &amp; Offer
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Institutional Policy ID: PR-EU-884 · Basel III Qualified
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

        {/* Term Sheet Body */}
        <div className="p-6 space-y-4 text-xs">
          {issued ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2">
              <span className="material-symbols-outlined text-emerald-600 text-[36px]">check_circle</span>
              <h3 className="font-display text-base font-bold text-emerald-800 dark:text-emerald-300">
                Credit Offer Formally Disbursed!
              </h3>
              <p className="text-emerald-700 dark:text-emerald-400 text-xs">
                Electronic binding agreement dispatched to applicant <strong>{profile.applicantName}</strong>. Tracking hash: <span className="font-mono font-semibold">0x8849...2e91</span>.
              </p>
            </div>
          ) : (
            <>
              {/* Summary grid */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Approved Principal</span>
                  <div className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">${principal.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Term Amortization</span>
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-white">{n} Months</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Fixed APR</span>
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-white">5.75%</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Est. Monthly</span>
                  <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">${monthlyPayment.toFixed(2)}</div>
                </div>
              </div>

              {/* Details table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-500">Borrower Entity</span>
                  <span className="font-medium text-slate-900 dark:text-white">{profile.applicantName}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-500">Total Lifetime Finance Charge</span>
                  <span className="font-mono font-medium">${totalInterest.toFixed(2)}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-500">Total Contractual Repayment</span>
                  <span className="font-mono font-medium">${(principal + totalInterest).toFixed(2)}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-500">Underwriting Risk Tier</span>
                  <span className="font-semibold text-emerald-600">{result.tier} (Score {result.creditScore})</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-500">Encumbered Security</span>
                  <span className="capitalize">{profile.collateral.replace('_', ' ')}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            {issued ? 'Close' : 'Cancel'}
          </button>
          {!issued && (
            <button
              type="button"
              onClick={() => setIssued(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Execute Offer Disbursal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
