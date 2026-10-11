import React, { useState } from 'react';
import { ApplicantProfile, InferenceResult } from '../types/underwriting';

interface AnalyticsScreenProps {
  profile: ApplicantProfile;
  result: InferenceResult;
  onAdjustInputs: () => void;
  onOpenOverride: () => void;
  onOpenOffer: () => void;
  onOpenSimulator: () => void;
  onAffixSignature: () => void;
  onExportMemo: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  profile,
  result,
  onAdjustInputs,
  onOpenOverride,
  onOpenOffer,
  onOpenSimulator,
  onAffixSignature,
  onExportMemo,
}) => {
  const [factorFilter, setFactorFilter] = useState<'all' | 'pos' | 'neg'>('all');

  // Filter factors
  const filteredFactors = result.factors.filter((f) => {
    if (factorFilter === 'all') return true;
    return f.type === factorFilter;
  });

  // Gauge calculation
  // Total circumference of half-circle with r=95 is pi * 95 = 298.45
  const totalArc = 298.45;
  const progressRatio = Math.max(0, Math.min(1, result.probabilityGood / 100));
  const strokeOffset = totalArc * (1 - progressRatio);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Metadata & Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onAdjustInputs}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Re-adjust Inputs</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              Dossier
            </span>
            <span className="font-mono text-[13px] font-semibold text-slate-900 dark:text-white">
              {profile.dossierId}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-[10px] font-semibold uppercase tracking-wide">
              Retail Prime
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[12px]">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[15px]">bolt</span>
            <span>XGBoost-Ensemble v2.4</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold tracking-wide">
              Fair Lending ECOA: Cleared
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[11px] mr-2 hidden sm:flex">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>Inference: Just now</span>
          </div>
          <button
            type="button"
            onClick={onExportMemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span className="hidden sm:inline">Export Memo</span>
          </button>
          <button
            type="button"
            onClick={onOpenOverride}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Override Decision</span>
          </button>
        </div>
      </div>

      {/* Primary Outcome Banner & Radial Arc Hub */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left Hero: Circular Gauge & Automated Recommendation (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs relative transition-colors">
          {/* Top Gauge Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                Automated Policy Greenlight
              </span>
              <h2 className="font-display text-[26px] font-bold text-slate-900 dark:text-white tracking-tight">
                {result.tier}
              </h2>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              result.probabilityGood >= 70
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : result.probabilityGood >= 60
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
            }`}>
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{result.statusBadge}</span>
            </div>
          </div>

          {/* Radial Dial & Score Center */}
          <div className="relative flex flex-col items-center justify-center my-4 py-2">
            <div className="relative w-72 h-44 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full transform translate-y-2" viewBox="0 0 240 140">
                <defs>
                  <linearGradient id="cleanGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="40%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Gauge Background Track */}
                <path
                  d="M 25 125 A 95 95 0 0 1 215 125"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Gauge Fill Track */}
                <path
                  d="M 25 125 A 95 95 0 0 1 215 125"
                  fill="none"
                  stroke="url(#cleanGaugeGradient)"
                  strokeWidth="14"
                  strokeDasharray={totalArc}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Threshold Markers */}
                <circle cx="25" cy="125" r="3.5" fill="#f87171" />
                <circle cx="120" cy="30" r="3" fill="#94a3b8" />
                <circle cx="215" cy="125" r="3.5" fill="#10b981" />
              </svg>

              {/* Dial Centerpiece Readout */}
              <div className="absolute bottom-1 flex flex-col items-center text-center">
                <span className="font-display text-[44px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                  {result.probabilityGood.toFixed(2)}
                  <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">%</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  P(Good Creditworthiness)
                </span>
              </div>
            </div>

            {/* Scale range markers */}
            <div className="w-72 flex justify-between px-2 font-mono text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              <span>0.00 (High Risk)</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Cutoff: 65.0%</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">100.0%</span>
            </div>
          </div>

          {/* Decision Classification Ribbon */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[13px] font-medium text-slate-900 dark:text-white">
                {result.verdict}
              </span>
            </div>
            <span className="font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">
              Score: {result.creditScore} / 850
            </span>
          </div>

          <div className="mt-2.5 pt-1 flex justify-between items-center text-slate-500 dark:text-slate-400 text-[12px]">
            <span>{result.segment}</span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Basel III Compliant</span>
            </span>
          </div>
        </div>

        {/* Right Hero: Metric Matrix & Credit Terms Recommendation (7 cols) */}
        <div className="xl:col-span-7 flex flex-col justify-between gap-4">
          {/* 4 Core Quantitative Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                  Credit Score Eq.
                </span>
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">credit_score</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[26px] font-bold text-slate-900 dark:text-white leading-tight">
                  {result.creditScore}
                </span>
                <div className="flex items-center gap-1 mt-1 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  <span>+{Math.max(0, result.creditScore - 724)} pts vs median</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                  Rec. Credit Limit
                </span>
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">payments</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[26px] font-bold text-slate-900 dark:text-white leading-tight">
                  ${result.recommendedLimit.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <span>+${Math.max(0, result.recommendedLimit - profile.creditAmount).toLocaleString()} buffer</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                  Expected Loss
                </span>
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">query_stats</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[26px] font-bold text-slate-900 dark:text-white leading-tight">
                  {result.expectedLoss.toFixed(2)}%
                </span>
                <div className="flex items-center gap-1 mt-1 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">south</span>
                  <span>-0.8% below cap</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                  Inference Conf.
                </span>
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">psychology</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[26px] font-bold text-slate-900 dark:text-white leading-tight">
                  {result.inferenceConfidence}%
                </span>
                <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <span>σ = {result.confidenceSigma}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Terms & Risk Parameters Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 flex-1 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">tune</span>
                <h3 className="font-display text-[16px] font-semibold text-slate-900 dark:text-white">
                  Underwriting Terms &amp; Parametric Exposure
                </h3>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Policy ID: PR-EU-884
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Loss Given Default (LGD)
                </span>
                <span className="font-display text-[20px] font-bold text-slate-900 dark:text-white">
                  {result.lgd.toFixed(2)}%
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {profile.collateral === 'real_estate' ? 'Real property collateral' : 'Pledged asset collateral'}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Exposure at Default (EAD)
                </span>
                <span className="font-display text-[20px] font-bold text-slate-900 dark:text-white">
                  ${profile.creditAmount.toLocaleString()}.00
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Requested balance requested
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Max Term Cap
                </span>
                <span className="font-display text-[20px] font-bold text-slate-900 dark:text-white">
                  {result.maxTermCap} Months
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  Requested {profile.durationMonths}m within bound
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                    Automatic Execution Available
                  </span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400">
                    No manual underwriting intervention required under Policy §4.2
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenOffer}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors shadow-xs"
              >
                Confirm &amp; Issue Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: SHAP Factor Attribution (Explainable AI) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                Explainable AI (XAI)
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">
                KernelSHAP Attribution Decomposition
              </span>
            </div>
            <h3 className="font-display text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">
              Feature Contribution Breakdown
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
              Marginal impact of applicant attributes shifting baseline probability (52.0%) to final verdict ({result.probabilityGood.toFixed(2)}%).
            </p>
          </div>

          {/* Feature Category Filter Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 self-start lg:self-auto text-xs">
            <button
              type="button"
              onClick={() => setFactorFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                factorFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Factors ({result.factors.length})
            </button>
            <button
              type="button"
              onClick={() => setFactorFilter('pos')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                factorFilter === 'pos'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Positive Drivers (+40.5%)
            </button>
            <button
              type="button"
              onClick={() => setFactorFilter('neg')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                factorFilter === 'neg'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Risk Draggers (-12.6%)
            </button>
          </div>
        </div>

        {/* Diverging Waterfall / Horizontal Attribution Grid */}
        <div className="space-y-3">
          {filteredFactors.map((factor) => {
            const isPos = factor.type === 'pos';
            const barWidth = Math.min(100, Math.max(10, Math.abs(factor.impactPercent) * 5));

            return (
              <div
                key={factor.id}
                className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center border ${
                        isPos
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{factor.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                        {factor.title}
                      </span>
                      <span className="text-[12px] text-slate-500 dark:text-slate-400">
                        {factor.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      Weight: {factor.weight > 0 ? factor.weight.toFixed(3) : factor.weight.toFixed(3)}
                    </span>
                    <span
                      className={`font-mono text-[12px] font-semibold px-2.5 py-0.5 rounded-md border ${
                        isPos
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/70 dark:border-emerald-800/70'
                          : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200/70 dark:border-rose-800/70'
                      }`}
                    >
                      {isPos ? `+${factor.impactPercent.toFixed(1)}% P(Good)` : `${factor.impactPercent.toFixed(1)}% Drag`}
                    </span>
                  </div>
                </div>

                {/* Attribution Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isPos ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-rose-500 dark:bg-rose-400'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Operational Advisory & Compliance Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Counterfactual Optimization & What-If Simulation (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">science</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                  Algorithmic Counterfactuals
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                Inverse Inference Engine
              </span>
            </div>
            <h3 className="font-display text-[18px] font-bold text-slate-900 dark:text-white tracking-tight mb-1">
              Underwriting Optimization Scenarios
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">
              Actionable parameter adjustments calculated to maximize applicant limit while reducing expected loss under portfolio risk caps.
            </p>

            <div className="space-y-3">
              {result.counterfactuals.map((scenario) => (
                <div
                  key={scenario.id}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[17px]">{scenario.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                        {scenario.title}
                      </span>
                      <span className="font-mono text-[12px] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50">
                        {scenario.impact}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Simulated against 100,000 Monte Carlo bootstrap paths
            </span>
            <button
              type="button"
              onClick={onOpenSimulator}
              className="text-[12px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Open Full Simulator</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Column: Compliance Audit Trail & Governance Sign-Off (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">policy</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                  Model Governance &amp; EBA Log
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                EU AI ACT: Tier-2
              </span>
            </div>
            <h3 className="font-display text-[18px] font-bold text-slate-900 dark:text-white tracking-tight mb-1">
              Cryptographic Audit Trail
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">
              Immutable ledger record for regulatory inspectability and supervisory compliance review.
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Inference Seed Hash</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  {result.auditTrail.seedHash}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Model Checkpoint Digest</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  {result.auditTrail.checkpointDigest}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Fairness Parity Disparate Impact Ratio</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                  {result.auditTrail.fairnessRatio} (Regulatory Bound: &gt; 0.80)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Reviewing Underwriter</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {result.auditTrail.underwriter}
                </span>
              </div>
            </div>
          </div>

          {/* Sign-Off Action Block */}
          <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[18px] ${
                result.auditTrail.isSigned ? 'text-emerald-600' : 'text-blue-600 dark:text-blue-400'
              }`}>
                {result.auditTrail.isSigned ? 'verified' : 'lock'}
              </span>
              <span className="text-[12px] text-slate-800 dark:text-slate-200 font-medium">
                {result.auditTrail.isSigned
                  ? `Signed digitally on ${result.auditTrail.signedTimestamp || 'Record'}`
                  : 'Audit session digitally signed and preserved'}
              </span>
            </div>

            <button
              type="button"
              onClick={onAffixSignature}
              className={`w-full sm:w-auto px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                result.auditTrail.isSigned
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white'
              }`}
            >
              {result.auditTrail.isSigned ? 'Signature Verified ✓' : 'Affix Digital Signature'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
