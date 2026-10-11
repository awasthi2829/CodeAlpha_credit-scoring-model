import React, { useState } from 'react';
import { ApplicantProfile, InferenceResult } from '../types/underwriting';

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApplicantProfile;
  result: InferenceResult;
  onConfirmOverride: (forcedTier: string, notes: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  isOpen,
  onClose,
  profile,
  result,
  onConfirmOverride,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('Tier 1 (Force Approval)');
  const [reason, setReason] = useState<string>('Compensating Liquid Assets');
  const [notes, setNotes] = useState<string>('Applicant has verified unencumbered secondary depository holdings with affiliated institution. Collateral valuation confirmed via third-party appraisal.');
  const [authorized, setAuthorized] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 dark:text-white">
                Underwriter Manual Override
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dossier {profile.dossierId} · Marcus Vance
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-amber-800 dark:text-amber-300">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
            <div>
              <strong>Supervisory Protocol Notice:</strong> Manual overrides trigger elevated EBA supervisory logging. Current automated recommendation is <strong>{result.statusBadge}</strong> ({result.probabilityGood.toFixed(2)}% P(Good)).
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Target Overridden Verdict Tier
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium"
            >
              <option value="Tier 1 (Force Approval)">Tier 1: Standard Disbursal (Full Approval)</option>
              <option value="Tier 2 (Conditional Approval)">Tier 2: Conditional Approval with Surety</option>
              <option value="Tier 3 (Force Decline)">Tier 3: Adverse Action / Formal Decline</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Primary Compensating Justification
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium"
            >
              <option value="Compensating Liquid Assets">Verified Compensating Liquid Reserves</option>
              <option value="Institutional Corporate Relationship">Institutional Relationship Tenure &gt; 5 yrs</option>
              <option value="Independent Physical Appraisal">Unencumbered Fixed Property Collateral</option>
              <option value="Secondary Sovereign / Co-Borrower">Contingent Co-Maker Guarantee Attached</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Credit Committee Rationale Memo
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700"
              placeholder="Provide quantitative rationale for manual exception..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600"
            />
            <span className="text-slate-600 dark:text-slate-400">
              I certify under Policy §4.2 that this override satisfies institutional risk appetite.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!authorized}
            onClick={() => onConfirmOverride(selectedTier, notes)}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs"
          >
            Execute Manual Override
          </button>
        </div>
      </div>
    </div>
  );
};
