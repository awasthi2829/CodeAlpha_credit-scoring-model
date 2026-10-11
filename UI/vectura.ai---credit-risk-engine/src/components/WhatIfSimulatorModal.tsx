import React, { useState } from 'react';
import { ApplicantProfile, CollateralType, CheckingAccount } from '../types/underwriting';
import { calculateCreditRisk } from '../utils/riskEngine';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApplicantProfile;
  onApplyProfile: (profile: ApplicantProfile) => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onApplyProfile,
}) => {
  const [simProfile, setSimProfile] = useState<ApplicantProfile>({ ...profile });

  if (!isOpen) return null;

  const simResult = calculateCreditRisk(simProfile);
  const baselineResult = calculateCreditRisk(profile);
  const deltaP = simResult.probabilityGood - baselineResult.probabilityGood;
  const deltaScore = simResult.creditScore - baselineResult.creditScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 dark:text-white">
                Interactive Counterfactual Simulator
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Simulate parameter adjustments to optimize creditworthiness probability
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

        {/* Live Delta Banner */}
        <div className="px-6 py-3 bg-purple-50/60 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold">Simulated P(Good)</span>
              <div className="font-display text-xl font-bold text-purple-950 dark:text-purple-100">
                {simResult.probabilityGood.toFixed(2)}%
                <span className={`text-xs ml-1.5 font-mono ${deltaP >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deltaP >= 0 ? `+${deltaP.toFixed(2)}%` : `${deltaP.toFixed(2)}%`}
                </span>
              </div>
            </div>
            <div className="h-6 w-px bg-purple-200 dark:bg-purple-800"></div>
            <div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold">Credit Score Eq.</span>
              <div className="font-display text-xl font-bold text-purple-950 dark:text-purple-100">
                {simResult.creditScore}
                <span className={`text-xs ml-1.5 font-mono ${deltaScore >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deltaScore >= 0 ? `+${deltaScore}` : `${deltaScore}`}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold">
            {simResult.tier}
          </span>
        </div>

        {/* Interactive Sliders Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Credit Amount */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Credit Principal Requested
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                ${simProfile.creditAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="250"
              value={simProfile.creditAmount}
              onChange={(e) => setSimProfile({ ...simProfile, creditAmount: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Duration Months */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Amortization Term (Duration)
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {simProfile.durationMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="72"
              step="6"
              value={simProfile.durationMonths}
              onChange={(e) => setSimProfile({ ...simProfile, durationMonths: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Checking Account Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">
              Checking Account Balance Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'no_checking', label: 'No Checking' },
                { id: 'neg', label: '< 0 DM' },
                { id: 'mid', label: '0 – 200 DM' },
                { id: 'high', label: '≥ 200 DM / Sal' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSimProfile({ ...simProfile, checkingAccount: c.id as CheckingAccount })}
                  className={`p-2 rounded-lg text-center font-mono transition-all border ${
                    simProfile.checkingAccount === c.id
                      ? 'bg-blue-600 text-white font-semibold border-blue-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collateral Type */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">
              Pledged Collateral Asset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'real_estate', label: 'Real Estate' },
                { id: 'life_insurance', label: 'Life Policy' },
                { id: 'car_other', label: 'Automobile' },
                { id: 'none', label: 'None' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSimProfile({ ...simProfile, collateral: c.id as CollateralType })}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    simProfile.collateral === c.id
                      ? 'bg-blue-600 text-white font-semibold border-blue-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSimProfile({ ...profile })}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            Reset to Baseline
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyProfile(simProfile);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              Apply What-If Values
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
