import React, { useState } from 'react';
import { ApplicantProfile, ArchetypePreset, LoanPurpose, HousingTenure, CheckingAccount, SavingsAccount, CollateralType, InstallmentPlan } from '../types/underwriting';
import { ARCHETYPE_PRESETS, DEFAULT_APPLICANT } from '../utils/storage';

interface IntakeScreenProps {
  profile: ApplicantProfile;
  onChangeProfile: (profile: ApplicantProfile) => void;
  onRunInference: () => void;
}

export const IntakeScreen: React.FC<IntakeScreenProps> = ({
  profile,
  onChangeProfile,
  onRunInference,
}) => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);
  const [isEditingName, setIsEditingName] = useState(false);

  const update = <K extends keyof ApplicantProfile>(key: K, value: ApplicantProfile[K]) => {
    onChangeProfile({
      ...profile,
      [key]: value,
      archetype: key === 'archetype' ? (value as ArchetypePreset) : 'custom',
    });
  };

  const handleSelectPreset = (preset: ArchetypePreset) => {
    if (preset === 'custom') {
      update('archetype', 'custom');
      return;
    }
    const presetData = ARCHETYPE_PRESETS[preset];
    if (presetData) {
      onChangeProfile({
        ...profile,
        ...presetData,
        archetype: preset,
      });
    }
  };

  const handleResetBaseline = () => {
    onChangeProfile({ ...DEFAULT_APPLICANT });
    setActiveTab(0);
  };

  // Format currency
  const formattedAmt = Number(profile.creditAmount).toLocaleString('en-US');

  // Purpose options
  const purposeList: { id: LoanPurpose; label: string; icon: string }[] = [
    { id: 'new_car', label: 'New Car', icon: 'directions_car' },
    { id: 'used_car', label: 'Used Car', icon: 'minor_crash' },
    { id: 'furniture', label: 'Furniture', icon: 'chair' },
    { id: 'radio_tv', label: 'Appliances', icon: 'tv' },
    { id: 'education', label: 'Education', icon: 'school' },
    { id: 'retraining', label: 'Retraining', icon: 'psychology' },
    { id: 'business', label: 'Business', icon: 'storefront' },
  ];

  // Dynamic DTI
  const dti = (profile.installmentRate * 5.2 + profile.dependents * 1.4 + (profile.creditAmount / 2000)).toFixed(1);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Dossier Meta & Header Action Strip */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-[22px]">folder_shared</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Dossier ID
                </span>
                <span className="font-mono text-[12px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {profile.dossierId}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active"></span>
              </div>

              {isEditingName ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="text"
                    value={profile.applicantName}
                    onChange={(e) => update('applicantName', e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                    autoFocus
                    className="font-display text-[18px] text-slate-900 dark:text-white font-semibold tracking-tight bg-slate-50 dark:bg-slate-800 border border-blue-400 px-1.5 py-0.5 rounded"
                  />
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-2 cursor-pointer group"
                  title="Click to rename applicant"
                >
                  <h1 className="font-display text-[20px] text-slate-900 dark:text-white font-semibold tracking-tight">
                    {profile.applicantName}
                  </h1>
                  <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    edit
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* Presets Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">
              Archetype:
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg gap-1 border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full">
              {(['prime', 'young', 'subprime', 'custom'] as const).map((preset) => {
                const labels: Record<string, string> = {
                  prime: 'Prime Homeowner',
                  young: 'Young Professional',
                  subprime: 'Subprime Auto',
                  custom: 'Custom Draft',
                };
                const isActive = profile.archetype === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded font-body text-[12px] font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {labels[preset]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 self-end xl:self-auto">
          <button
            type="button"
            onClick={handleResetBaseline}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-[13px] font-medium transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500 dark:text-slate-400">restart_alt</span>
            <span>Reset Baseline</span>
          </button>
          <button
            type="button"
            onClick={onRunInference}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            <span>Run Risk Inference</span>
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Clean Wizard Stepper */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-1.5 transition-colors">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {[
            { num: 1, title: 'Personal Profile', sec: 'Section 01' },
            { num: 2, title: 'Liquidity & Assets', sec: 'Section 02' },
            { num: 3, title: 'Loan Exposure', sec: 'Section 03' },
            { num: 4, title: 'Employment & KYC', sec: 'Section 04' },
          ].map((step, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveTab(idx as 0 | 1 | 2 | 3)}
                className={`flex items-center justify-between p-3 rounded-lg transition-all text-left border ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
                      {step.sec}
                    </span>
                    <span
                      className={`text-[13px] font-semibold truncate ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  check_circle
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form & Vector Summary Rail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Variable Input Sections (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* TAB 1: PERSONAL PROFILE */}
          {activeTab === 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]">badge</span>
                  <h2 className="font-display text-[18px] text-slate-900 dark:text-white font-semibold tracking-tight">
                    Demographic &amp; Household Profile
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  6 Variables
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Applicant Age */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Applicant Age
                    </label>
                    <div className="flex items-baseline gap-1 font-mono text-[14px] font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      <span>{profile.age}</span>
                      <span className="text-[11px] font-normal text-slate-400 font-body">yrs</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="75"
                    value={profile.age}
                    onChange={(e) => update('age', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer my-3"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>18 (Min)</span>
                    <span>45 (Median)</span>
                    <span>75 (Max)</span>
                  </div>
                </div>

                {/* Housing Tenure */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Housing Tenure
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-200/70 dark:bg-slate-700/60 p-1 rounded-lg">
                    {[
                      { key: 'own', label: 'Own' },
                      { key: 'rent', label: 'Rent' },
                      { key: 'free', label: 'For Free' },
                    ].map((h) => (
                      <button
                        key={h.key}
                        type="button"
                        onClick={() => update('housingTenure', h.key as HousingTenure)}
                        className={`py-1.5 rounded-md text-[13px] transition-all ${
                          profile.housingTenure === h.key
                            ? 'font-semibold bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
                    Free indicates institutional or subsidized lodging
                  </span>
                </div>

                {/* Liable Dependents */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Liable Dependents
                  </label>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      disabled={profile.dependents <= 1}
                      onClick={() => update('dependents', Math.max(1, profile.dependents - 1))}
                      className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <div className="font-mono text-[16px] text-slate-900 dark:text-white font-semibold">
                      {profile.dependents}
                    </div>
                    <button
                      type="button"
                      disabled={profile.dependents >= 5}
                      onClick={() => update('dependents', Math.min(5, profile.dependents + 1))}
                      className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
                    Excludes legal co-borrower guarantees
                  </span>
                </div>

                {/* Duration at Current Residence */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Present Residence
                  </label>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      disabled={profile.residenceYears <= 1}
                      onClick={() => update('residenceYears', Math.max(1, profile.residenceYears - 1))}
                      className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-[16px] text-slate-900 dark:text-white font-semibold">
                        {profile.residenceYears}
                      </span>
                      <span className="text-[12px] text-slate-400 font-normal">years</span>
                    </div>
                    <button
                      type="button"
                      disabled={profile.residenceYears >= 10}
                      onClick={() => update('residenceYears', Math.min(10, profile.residenceYears + 1))}
                      className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
                    Stability vector across address registry
                  </span>
                </div>

                {/* Marital & Personal Status */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Marital &amp; Personal Status
                  </label>
                  <div className="relative">
                    <select
                      value={profile.maritalStatus}
                      onChange={(e) => update('maritalStatus', e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-8 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
                    >
                      <option value="male_single">Male: Single / Unmarried</option>
                      <option value="male_divorced">Male: Divorced / Separated</option>
                      <option value="male_married">Male: Married / Widowed</option>
                      <option value="female_divorced">Female: Divorced / Separated / Married</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    Statutory German Credit classification A91-A94
                  </span>
                </div>

                {/* Foreign Worker Status */}
                <div className="flex flex-col justify-between bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Foreign Worker Status
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Statutory immigration/residency permit
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={profile.isForeignWorker}
                      onClick={() => update('isForeignWorker', !profile.isForeignWorker)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        profile.isForeignWorker ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                          profile.isForeignWorker ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-blue-600 dark:text-blue-400 text-[12px] font-medium">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>
                      {profile.isForeignWorker
                        ? 'Non-Resident / Foreign Worker Flagged'
                        : 'Resident National / Non-foreign Tier'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: FINANCIAL ASSETS & LIQUIDITY */}
          {activeTab === 1 && (
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]">account_balance</span>
                  <h2 className="font-display text-[18px] text-slate-900 dark:text-white font-semibold tracking-tight">
                    Liquidity Reserves &amp; Collateral Base
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  6 Variables
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {/* Checking Account Status */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Checking Account (Status of existing balance)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { key: 'no_checking', title: 'No Checking', code: 'A14: No account', red: false },
                      { key: 'neg', title: '< 0 DM', code: 'A11: Overdraft', red: true },
                      { key: 'mid', title: '0 – 200 DM', code: 'A12: Moderate', red: false },
                      { key: 'high', title: '≥ 200 DM / Sal', code: 'A13: Strong flow', red: false },
                    ].map((opt) => {
                      const isSel = profile.checkingAccount === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => update('checkingAccount', opt.key as CheckingAccount)}
                          className={`p-3 rounded-lg text-left transition-all border ${
                            isSel
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-600 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className={`font-mono text-[13px] font-medium ${opt.red ? 'text-red-600' : isSel ? 'font-bold' : ''}`}>
                            {opt.title}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">{opt.code}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Savings Account Magnitude */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Savings Account &amp; Bond Magnitude
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {[
                      { key: 'lt100', label: '< 100 DM' },
                      { key: '100-500', label: '100 – 500 DM' },
                      { key: '500-1000', label: '500 – 1k DM' },
                      { key: 'gt1000', label: '≥ 1,000 DM' },
                      { key: 'unknown', label: 'Unknown' },
                    ].map((s) => {
                      const isSel = profile.savingsAccount === s.key;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => update('savingsAccount', s.key as SavingsAccount)}
                          className={`p-2.5 rounded-lg text-center font-mono text-[12px] transition-all border ${
                            isSel
                              ? 'bg-blue-600 text-white font-semibold shadow-xs border-blue-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Property / Collateral Type */}
                  <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Property &amp; Collateral Vector
                    </label>
                    <div className="relative">
                      <select
                        value={profile.collateral}
                        onChange={(e) => update('collateral', e.target.value as CollateralType)}
                        className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-8 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
                      >
                        <option value="real_estate">Real Estate / Freehold Land</option>
                        <option value="life_insurance">Building Society Savings / Life Policy</option>
                        <option value="car_other">Automobile or Other Tangible</option>
                        <option value="none">Unknown / No Tangible Property</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Other Installment Plans */}
                  <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Other Active Installment Plans
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200/70 dark:bg-slate-700/60 p-1 rounded-lg">
                      {[
                        { key: 'bank', label: 'Bank' },
                        { key: 'stores', label: 'Stores' },
                        { key: 'none', label: 'None' },
                      ].map((plan) => (
                        <button
                          key={plan.key}
                          type="button"
                          onClick={() => update('installmentPlans', plan.key as InstallmentPlan)}
                          className={`py-1.5 rounded-md text-[13px] transition-all ${
                            profile.installmentPlans === plan.key
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {plan.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Existing Credits at this Bank */}
                  <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Existing Credits at this Bank
                    </label>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        disabled={profile.existingCredits <= 1}
                        onClick={() => update('existingCredits', Math.max(1, profile.existingCredits - 1))}
                        className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-[16px] text-slate-900 dark:text-white font-semibold">
                          {profile.existingCredits}
                        </span>
                        <span className="text-[12px] text-slate-400 font-normal">account</span>
                      </div>
                      <button
                        type="button"
                        disabled={profile.existingCredits >= 6}
                        onClick={() => update('existingCredits', Math.min(6, profile.existingCredits + 1))}
                        className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Telephone Registration Toggle */}
                  <div className="flex flex-col justify-between bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Registered Telephone
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          Listed under applicant's name
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={profile.hasRegisteredPhone}
                        onClick={() => update('hasRegisteredPhone', !profile.hasRegisteredPhone)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          profile.hasRegisteredPhone ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                            profile.hasRegisteredPhone ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-blue-600 dark:text-blue-400 text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>
                        {profile.hasRegisteredPhone
                          ? 'Verified Landline / Mobile Registered'
                          : 'No Registered Telephone on Record'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: LOAN REQUEST & EXPOSURE */}
          {activeTab === 2 && (
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]">payments</span>
                  <h2 className="font-display text-[18px] text-slate-900 dark:text-white font-semibold tracking-tight">
                    Loan Terms &amp; Debt Architecture
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  5 Variables
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {/* Credit Amount Slider */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Principal Requested (Credit Amount)
                    </label>
                    <div className="flex items-center gap-1 font-mono text-[16px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">
                      <span>$</span>
                      <span>{formattedAmt}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="250"
                    value={profile.creditAmount}
                    onChange={(e) => update('creditAmount', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer my-3"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>$500</span>
                    <span>$5,000</span>
                    <span>$10,000</span>
                    <span>$20,000 (Max)</span>
                  </div>
                </div>

                {/* Duration in Months Slider */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Amortization Term (Duration)
                    </label>
                    <div className="flex items-center gap-1 font-mono text-[16px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">
                      <span>{profile.durationMonths}</span>
                      <span className="text-[12px] font-normal text-slate-400 font-body">Months</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="72"
                    step="6"
                    value={profile.durationMonths}
                    onChange={(e) => update('durationMonths', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer my-3"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>6 mos</span>
                    <span>24 mos</span>
                    <span>48 mos</span>
                    <span>72 mos</span>
                  </div>
                </div>

                {/* Purpose Grid Cards */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Credit Allocation Purpose
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {purposeList.map((item) => {
                      const isSel = profile.purpose === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => update('purpose', item.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all gap-1 border ${
                            isSel
                              ? 'bg-blue-600 text-white shadow-xs border-blue-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                          <span className="text-[11px] font-medium text-center leading-tight">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Installment Rate */}
                  <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Installment Rate (% Disposable Income)
                    </label>
                    <div className="grid grid-cols-4 gap-1 bg-slate-200/70 dark:bg-slate-700/60 p-1 rounded-lg">
                      {[1, 2, 3, 4].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => update('installmentRate', rate)}
                          className={`py-1.5 rounded-md text-[13px] transition-all ${
                            profile.installmentRate === rate
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
                      Statutory disposable income debt ratio baseline
                    </span>
                  </div>

                  {/* Other Debtors / Guarantors */}
                  <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Other Debtors / Joint Obligors
                    </label>
                    <div className="relative">
                      <select
                        value={profile.debtors}
                        onChange={(e) => update('debtors', e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-8 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
                      >
                        <option value="none">None</option>
                        <option value="co_applicant">Co-Applicant (Joint Liability)</option>
                        <option value="guarantor">Guarantor (Contingent Surety)</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[20px]">
                        expand_more
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                      Directly mitigates primary default severity
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: EMPLOYMENT & KYC */}
          {activeTab === 3 && (
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]">work</span>
                  <h2 className="font-display text-[18px] text-slate-900 dark:text-white font-semibold tracking-tight">
                    Employment Standing &amp; Credit Bureau KYC
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  3 Variables
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Present Employment Tenure */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Present Employment Tenure
                  </label>
                  <div className="relative">
                    <select
                      value={profile.employmentTenure}
                      onChange={(e) => update('employmentTenure', e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-8 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
                    >
                      <option value="unemployed">Unemployed</option>
                      <option value="lt_1yr">&lt; 1 Year</option>
                      <option value="1_4yr">1 – 4 Years</option>
                      <option value="4_7yr">4 – 7 Years</option>
                      <option value="gt_7yr">≥ 7 Years</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    Continuous tenure with employer entity
                  </span>
                </div>

                {/* Job Category */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Job Category &amp; Skill Level
                  </label>
                  <div className="relative">
                    <select
                      value={profile.jobCategory}
                      onChange={(e) => update('jobCategory', e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-8 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
                    >
                      <option value="unskilled_nonres">Unskilled – Non-resident</option>
                      <option value="unskilled_res">Unskilled – Resident</option>
                      <option value="skilled">Skilled Worker / Official</option>
                      <option value="executive">Management / Self-employed / Specialist</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    German Industry Chamber classification
                  </span>
                </div>

                {/* Credit History */}
                <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Credit History Behavior
                  </label>
                  <div className="relative">
                    <select
                      value={profile.creditHistory}
                      onChange={(e) => update('creditHistory', e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-8 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
                    >
                      <option value="all_paid">A30: No credits taken / all paid back duly</option>
                      <option value="bank_paid">A31: All credits at this bank paid back duly</option>
                      <option value="existing_duly">A32: Existing credits paid back duly till now</option>
                      <option value="past_delays">A33: Delay in paying off in the past</option>
                      <option value="critical">A34: Critical account / other credits elsewhere</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    Bureau repayment integrity verification
                  </span>
                </div>

                {/* Bureau KYC Card */}
                <div className="flex flex-col justify-between bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        SCHUFA Bureau Node
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        Cryptographic KYC sync active
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      CONNECTED
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-slate-700 dark:text-slate-300">
                    <span>
                      Identity Hash: <span className="font-mono text-slate-400">{profile.schufaHash}</span>
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      Score {profile.schufaScore} / 850
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bottom Form Stepper Navigation */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
            <button
              type="button"
              disabled={activeTab === 0}
              onClick={() => setActiveTab((prev) => (prev > 0 ? ((prev - 1) as any) : 0))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">west</span>
              <span>Previous Step</span>
            </button>

            <div className="text-[12px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Configuring <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">20</span> Scored Model Predictors
            </div>

            <button
              type="button"
              onClick={() => {
                if (activeTab < 3) {
                  setActiveTab((prev) => ((prev + 1) as any));
                } else {
                  onRunInference();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-[13px] font-medium transition-all shadow-xs"
            >
              <span>
                {activeTab === 0
                  ? 'Next: Assets & Liquidity'
                  : activeTab === 1
                  ? 'Next: Loan Exposure'
                  : activeTab === 2
                  ? 'Next: Employment & KYC'
                  : 'Generate Decision Analytics'}
              </span>
              <span className="material-symbols-outlined text-[18px]">
                {activeTab === 3 ? 'query_stats' : 'east'}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT PANE: Live Feature Vector Summary Rail (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-20">
          {/* Vector Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 flex flex-col gap-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">view_in_ar</span>
                <span className="font-display text-[15px] text-slate-900 dark:text-white font-semibold">
                  Vector Summary
                </span>
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                20 / 20 Valid
              </span>
            </div>

            {/* Completeness Progress */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-blue-600 dark:text-blue-400"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="100, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">100%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-slate-900 dark:text-white font-semibold leading-tight">
                    Input Vector Ready
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    German Credit Core v2.4
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[22px]">
                verified
              </span>
            </div>

            {/* Dynamic Parameter Readouts */}
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 text-[13px]">
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-500 dark:text-slate-400">Applicant Age</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  {profile.age} yrs
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-500 dark:text-slate-400">Credit Requested</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  ${formattedAmt}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-500 dark:text-slate-400">Term Duration</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  {profile.durationMonths} mos
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-500 dark:text-slate-400">Purpose Vector</span>
                <span className="font-medium text-slate-900 dark:text-white capitalize">
                  {purposeList.find((p) => p.id === profile.purpose)?.label || 'New Car'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-500 dark:text-slate-400">Estimated DTI Ratio</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {dti}%
                </span>
              </div>
            </div>

            {/* Compliance Verification */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Regulatory Compliance
                </span>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">gavel</span>
                  PASS
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-emerald-400">
                  task_alt
                </span>
                <span>Fair Lending (ECOA / BaFin) Verified</span>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={onRunInference}
              className="group w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-center font-display text-[14px] font-semibold transition-all shadow-sm shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Calculate Score &amp; Analytics</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                query_stats
              </span>
            </button>
            <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
              Inference latency estimated &lt; 42ms
            </div>
          </div>

          {/* Model Weights Matrix Reference Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 flex flex-col gap-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Model Weights Matrix
              </span>
              <span className="font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Statlog DB
              </span>
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              Features are normalized to standard German Credit scoring distribution with categorical label encoding for gradient boosting models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
