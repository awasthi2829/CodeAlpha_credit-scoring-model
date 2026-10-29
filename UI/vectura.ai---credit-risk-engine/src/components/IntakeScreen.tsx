import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileCheck2,
  Home,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
} from 'lucide-react';
import {
  ApplicantProfile,
  ArchetypePreset,
  CheckingAccount,
  CollateralType,
  CreditHistory,
  DebtorsType,
  EmploymentTenure,
  HousingTenure,
  InstallmentPlan,
  JobCategory,
  LoanPurpose,
  MaritalStatus,
  SavingsAccount,
} from '../types/underwriting';
import { ARCHETYPE_PRESETS, DEFAULT_APPLICANT } from '../utils/storage';
import { calculateCreditRisk } from '../utils/riskEngine';

interface IntakeScreenProps {
  profile: ApplicantProfile;
  onChangeProfile: (profile: ApplicantProfile) => void;
  onRunInference: () => void;
}

type SelectOption<T extends string> = { value: T; label: string };

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  return (
    <label className="intake-field">
      <span className="intake-label">{label}</span>
      <span className="intake-select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value as T)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </span>
      {hint && <span className="intake-hint">{hint}</span>}
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <label className="intake-field">
      <span className="intake-label">{label}</span>
      <span className="intake-number-wrap">
        <input
          type="number"
          value={draft}
          min={min}
          max={max}
          onChange={(event) => {
            const nextDraft = event.target.value;
            setDraft(nextDraft);
            if (nextDraft === '') return;
            const nextValue = Number(nextDraft);
            if (Number.isFinite(nextValue) && nextValue >= min && nextValue <= max) onChange(nextValue);
          }}
          onBlur={() => {
            const parsed = Number(draft);
            const nextValue = draft.trim() && Number.isFinite(parsed)
              ? Math.min(max, Math.max(min, parsed))
              : value;
            setDraft(String(nextValue));
            if (nextValue !== value) onChange(nextValue);
          }}
        />
        {suffix && <span>{suffix}</span>}
      </span>
    </label>
  );
}

const steps = [
  { title: 'Applicant', description: 'Personal details', icon: UserRound },
  { title: 'Finances', description: 'Accounts & assets', icon: Wallet },
  { title: 'Loan', description: 'Request details', icon: CreditCard },
  { title: 'History', description: 'Work & credit', icon: BriefcaseBusiness },
];

const presets: { id: ArchetypePreset; title: string; caption: string; color: string }[] = [
  { id: 'prime', title: 'Established', caption: 'Strong savings & stable work', color: 'mint' },
  { id: 'young', title: 'Early career', caption: 'A growing credit history', color: 'blue' },
  { id: 'subprime', title: 'Needs review', caption: 'More repayment pressure', color: 'amber' },
  { id: 'custom', title: 'Start fresh', caption: 'Build a custom profile', color: 'plain' },
];

export function IntakeScreen({ profile, onChangeProfile, onRunInference }: IntakeScreenProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const preview = useMemo(() => calculateCreditRisk(profile), [profile]);
  const progress = ((activeStep + 1) / steps.length) * 100;

  const update = <K extends keyof ApplicantProfile>(key: K, value: ApplicantProfile[K]) => {
    onChangeProfile({
      ...profile,
      [key]: value,
      archetype: key === 'archetype' ? (value as ArchetypePreset) : 'custom',
    });
  };

  const selectPreset = (preset: ArchetypePreset) => {
    if (preset === 'custom') {
      onChangeProfile({ ...DEFAULT_APPLICANT, archetype: 'custom', applicantName: 'New applicant' });
      setActiveStep(0);
      return;
    }
    const presetData = ARCHETYPE_PRESETS[preset];
    if (presetData) onChangeProfile({ ...profile, ...presetData, archetype: preset });
  };

  const step = steps[activeStep];
  const StepIcon = step.icon;

  return (
    <div className="intake-page">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <div className="eyebrow"><Sparkles size={14} /> CREDIT RISK WORKSPACE</div>
          <h1>A clearer picture<br className="welcome-break" /> starts here.</h1>
          <p>Tell us a little about the applicant and their loan. We’ll organize the details into an easy-to-review risk assessment.</p>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-card"><ShieldCheck size={30} /><span>Profile<br />ready</span></div>
          <div className="art-dot dot-one" /><div className="art-dot dot-two" />
        </div>
        <div className="welcome-meta">
          <span><FileCheck2 size={15} /> Applicant file</span>
          <strong>{profile.dossierId}</strong>
        </div>
      </section>

      <section className="preset-section" aria-labelledby="preset-title">
        <div className="section-heading preset-heading">
          <div>
            <span className="eyebrow muted-eyebrow">A QUICK WAY TO BEGIN</span>
            <h2 id="preset-title">Choose a starting profile</h2>
          </div>
          <span className="optional-note">You can edit every detail</span>
        </div>
        <div className="preset-grid">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => selectPreset(preset.id)}
              className={`preset-card preset-${preset.color} ${profile.archetype === preset.id ? 'is-selected' : ''}`}
              aria-pressed={profile.archetype === preset.id}
            >
              <span className="preset-icon">
                {preset.id === 'prime' ? <BadgeCheck size={19} /> : preset.id === 'young' ? <Sparkles size={19} /> : preset.id === 'subprime' ? <CircleHelp size={19} /> : <UserRound size={19} />}
              </span>
              <span className="preset-text"><strong>{preset.title}</strong><small>{preset.caption}</small></span>
              <span className="preset-check">{profile.archetype === preset.id && <Check size={14} />}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="intake-layout">
        <section className="form-panel">
          <div className="form-panel-top">
            <div className="form-title-group">
              <span className="form-step-icon"><StepIcon size={20} /></span>
              <div>
                <span className="eyebrow muted-eyebrow">STEP {String(activeStep + 1).padStart(2, '0')} OF 04</span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
            </div>
            <div className="step-count">{activeStep + 1}<span> / 4</span></div>
          </div>
          <div className="step-progress"><span style={{ width: `${progress}%` }} /></div>
          <nav className="step-nav" aria-label="Applicant information steps">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => setActiveStep(index)}
                  className={index === activeStep ? 'step-nav-item active' : index < activeStep ? 'step-nav-item complete' : 'step-nav-item'}
                  aria-current={index === activeStep ? 'step' : undefined}
                >
                  <span className="step-nav-icon">{index < activeStep ? <Check size={14} /> : <Icon size={15} />}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="form-fields">
            {activeStep === 0 && (
              <>
                <div className="form-section-intro"><span className="field-section-icon"><UserRound size={17} /></span><div><h3>About the applicant</h3><p>Basic household details help put the application in context.</p></div></div>
                <div className="fields-grid">
                  <label className="intake-field field-span-2">
                    <span className="intake-label">Applicant name</span>
                    <input className="intake-text-input" value={profile.applicantName} onChange={(event) => update('applicantName', event.target.value)} placeholder="Enter applicant name" />
                  </label>
                  <NumberField label="Age" value={profile.age} min={18} max={100} suffix="years" onChange={(value) => update('age', value)} />
                  <SelectField<MaritalStatus> label="Household status" value={profile.maritalStatus} onChange={(value) => update('maritalStatus', value)} options={[
                    { value: 'male_single', label: 'Single' }, { value: 'male_divorced', label: 'Divorced / separated' }, { value: 'male_married', label: 'Married / widowed' }, { value: 'female_divorced', label: 'Single parent / separated' },
                  ]} />
                  <SelectField<HousingTenure> label="Housing" value={profile.housingTenure} onChange={(value) => update('housingTenure', value)} options={[
                    { value: 'own', label: 'Own home' }, { value: 'rent', label: 'Renting' }, { value: 'free', label: 'Living rent-free' },
                  ]} />
                  <NumberField label="People supported" value={profile.dependents} min={1} max={10} onChange={(value) => update('dependents', value)} />
                  <NumberField label="Years at current address" value={profile.residenceYears} min={1} max={4} suffix="years" onChange={(value) => update('residenceYears', value)} />
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                <div className="form-section-intro"><span className="field-section-icon"><Landmark size={17} /></span><div><h3>Financial picture</h3><p>Share the applicant’s available funds, assets, and existing obligations.</p></div></div>
                <div className="fields-grid">
                  <SelectField<CheckingAccount> label="Checking account balance" value={profile.checkingAccount} onChange={(value) => update('checkingAccount', value)} options={[
                    { value: 'no_checking', label: 'No checking account' }, { value: 'neg', label: 'Overdrawn' }, { value: 'mid', label: 'Under €200' }, { value: 'high', label: '€200 or more' },
                  ]} />
                  <SelectField<SavingsAccount> label="Savings" value={profile.savingsAccount} onChange={(value) => update('savingsAccount', value)} options={[
                    { value: 'unknown', label: 'Not provided' }, { value: 'lt100', label: 'Under €100' }, { value: '100-500', label: '€100 – €500' }, { value: '500-1000', label: '€500 – €1,000' }, { value: 'gt1000', label: 'Over €1,000' },
                  ]} />
                  <SelectField<CollateralType> label="Assets offered as security" value={profile.collateral} onChange={(value) => update('collateral', value)} options={[
                    { value: 'none', label: 'No known assets' }, { value: 'car_other', label: 'Vehicle or other asset' }, { value: 'life_insurance', label: 'Savings / life insurance' }, { value: 'real_estate', label: 'Property / real estate' },
                  ]} />
                  <SelectField<InstallmentPlan> label="Other payment plans" value={profile.installmentPlans} onChange={(value) => update('installmentPlans', value)} options={[
                    { value: 'none', label: 'None' }, { value: 'bank', label: 'Through a bank' }, { value: 'stores', label: 'Through a store' },
                  ]} />
                  <NumberField label="Existing credit accounts" value={profile.existingCredits} min={1} max={10} onChange={(value) => update('existingCredits', value)} />
                  <SelectField<DebtorsType> label="Additional borrower" value={profile.debtors} onChange={(value) => update('debtors', value)} options={[
                    { value: 'none', label: 'None' }, { value: 'co_applicant', label: 'Co-applicant' }, { value: 'guarantor', label: 'Guarantor' },
                  ]} />
                  <label className="toggle-field">
                    <span className="toggle-copy"><strong>Registered phone number</strong><small>Applicant has a phone registered in their name</small></span>
                    <input type="checkbox" checked={profile.hasRegisteredPhone} onChange={(event) => update('hasRegisteredPhone', event.target.checked)} />
                    <span className="toggle-track" aria-hidden="true" />
                  </label>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <div className="form-section-intro"><span className="field-section-icon"><CreditCard size={17} /></span><div><h3>The loan request</h3><p>What is being requested, and how will it be repaid?</p></div></div>
                <div className="fields-grid">
                  <label className="intake-field">
                    <span className="intake-label">Amount requested</span>
                    <span className="intake-number-wrap currency-input"><span>€</span><input type="number" min={0} max={100000} step={100} value={profile.creditAmount} onChange={(event) => update('creditAmount', Math.min(100000, Math.max(0, Number(event.target.value) || 0)))} /></span>
                    <span className="intake-hint">Up to €100,000</span>
                  </label>
                  <NumberField label="Repayment period" value={profile.durationMonths} min={1} max={72} suffix="months" onChange={(value) => update('durationMonths', value)} />
                  <SelectField<LoanPurpose> label="Loan purpose" value={profile.purpose} onChange={(value) => update('purpose', value)} options={[
                    { value: 'new_car', label: 'New car' }, { value: 'used_car', label: 'Used car' }, { value: 'furniture', label: 'Furniture / equipment' }, { value: 'radio_tv', label: 'Appliances' }, { value: 'education', label: 'Education' }, { value: 'retraining', label: 'Career training' }, { value: 'business', label: 'Business' },
                  ]} />
                  <div className="intake-field field-span-2">
                    <div className="range-heading"><span className="intake-label">Monthly payment commitment</span><strong>{profile.installmentRate} <small>of 4</small></strong></div>
                    <input className="intake-range" type="range" min={1} max={4} step={1} value={profile.installmentRate} onChange={(event) => update('installmentRate', Number(event.target.value))} />
                    <div className="range-captions"><span>Comfortable</span><span>Manageable</span><span>High</span><span>Very high</span></div>
                  </div>
                </div>
                <div className="loan-estimate"><CreditCard size={18} /><span>Approximate monthly payment</span><strong>€{Math.round(profile.creditAmount / Math.max(1, profile.durationMonths)).toLocaleString()}</strong><small>before interest</small></div>
              </>
            )}

            {activeStep === 3 && (
              <>
                <div className="form-section-intro"><span className="field-section-icon"><BriefcaseBusiness size={17} /></span><div><h3>Work & repayment history</h3><p>These details help complete the applicant’s financial profile.</p></div></div>
                <div className="fields-grid">
                  <SelectField<EmploymentTenure> label="Time in current employment" value={profile.employmentTenure} onChange={(value) => update('employmentTenure', value)} options={[
                    { value: 'unemployed', label: 'Not currently employed' }, { value: 'lt_1yr', label: 'Less than 1 year' }, { value: '1_4yr', label: '1 – 4 years' }, { value: '4_7yr', label: '4 – 7 years' }, { value: 'gt_7yr', label: 'More than 7 years' },
                  ]} />
                  <SelectField<JobCategory> label="Occupation type" value={profile.jobCategory} onChange={(value) => update('jobCategory', value)} options={[
                    { value: 'unskilled_nonres', label: 'Entry-level, non-resident' }, { value: 'unskilled_res', label: 'Entry-level' }, { value: 'skilled', label: 'Skilled professional' }, { value: 'executive', label: 'Manager / executive' },
                  ]} />
                  <SelectField<CreditHistory> label="Previous credit repayment" value={profile.creditHistory} onChange={(value) => update('creditHistory', value)} options={[
                    { value: 'all_paid', label: 'All previous loans repaid' }, { value: 'bank_paid', label: 'Current loans paid as agreed' }, { value: 'existing_duly', label: 'Existing credit in good standing' }, { value: 'past_delays', label: 'Some payments were late' }, { value: 'critical', label: 'Serious repayment difficulties' },
                  ]} />
                  <NumberField label="Credit bureau score" value={profile.schufaScore} min={0} max={1000} onChange={(value) => update('schufaScore', value)} />
                  <label className="toggle-field">
                    <span className="toggle-copy"><strong>Credit bureau connected</strong><small>Applicant’s record is linked for review</small></span>
                    <input type="checkbox" checked={profile.schufaConnected} onChange={(event) => update('schufaConnected', event.target.checked)} />
                    <span className="toggle-track" aria-hidden="true" />
                  </label>
                  <label className="toggle-field">
                    <span className="toggle-copy"><strong>Foreign worker</strong><small>Applicant is a foreign national worker</small></span>
                    <input type="checkbox" checked={profile.isForeignWorker} onChange={(event) => update('isForeignWorker', event.target.checked)} />
                    <span className="toggle-track" aria-hidden="true" />
                  </label>
                </div>
                <div className="privacy-note"><ShieldCheck size={17} /><span><strong>Use this as a starting point, not a decision.</strong> This educational model should support—not replace—a complete, fair lending review.</span></div>
              </>
            )}
          </div>

          <div className="form-footer">
            <button type="button" className="button-quiet" onClick={() => activeStep === 0 ? onChangeProfile({ ...DEFAULT_APPLICANT }) : setActiveStep(activeStep - 1)}>
              {activeStep === 0 ? <><RotateCcw size={16} /> Reset profile</> : <><ArrowLeft size={16} /> Back</>}
            </button>
            {activeStep < steps.length - 1 ? (
              <button type="button" className="button-primary" onClick={() => setActiveStep(activeStep + 1)}>Continue <ArrowRight size={16} /></button>
            ) : (
              <button type="button" className="button-primary" onClick={onRunInference}>Review risk estimate <ArrowRight size={16} /></button>
            )}
          </div>
        </section>

        <aside className="preview-panel">
          <div className="preview-heading">
            <div><span className="eyebrow muted-eyebrow">LIVE PROFILE</span><h2>At a glance</h2></div>
            <span className="live-indicator"><span /> Updates live</span>
          </div>
          <div className="applicant-mini">
            <div className="applicant-avatar">{profile.applicantName.trim().charAt(0).toUpperCase() || 'A'}</div>
            <div className="applicant-name">
              {isEditingName ? (
                <input autoFocus value={profile.applicantName} onChange={(event) => update('applicantName', event.target.value)} onBlur={() => setIsEditingName(false)} onKeyDown={(event) => event.key === 'Enter' && setIsEditingName(false)} aria-label="Applicant name" />
              ) : (
                <button type="button" onClick={() => setIsEditingName(true)} title="Click to edit applicant name">{profile.applicantName || 'Name not added'} <span>✎</span></button>
              )}
              <small>Applicant · {profile.dossierId}</small>
            </div>
          </div>
          <div className="preview-score-card">
            <div className="preview-score-top"><span>Estimated approval likelihood</span><CircleHelp size={15} /></div>
            <div className="preview-score-value">{Math.round(preview.probabilityGood)}<small>%</small></div>
            <div className="preview-meter"><span style={{ width: `${Math.min(100, Math.max(0, preview.probabilityGood))}%` }} /></div>
            <div className="preview-score-foot"><span>Live estimate</span><span>Not a lending decision</span></div>
          </div>
          <div className="preview-facts">
            <div><span className="preview-fact-icon"><CreditCard size={16} /></span><span><small>Loan amount</small><strong>€{profile.creditAmount.toLocaleString()}</strong></span></div>
            <div><span className="preview-fact-icon"><Home size={16} /></span><span><small>Repayment term</small><strong>{profile.durationMonths} months</strong></span></div>
            <div><span className="preview-fact-icon"><BriefcaseBusiness size={16} /></span><span><small>Employment</small><strong>{profile.employmentTenure.replaceAll('_', ' ').replace('gt', 'Over').replace('lt', 'Under')}</strong></span></div>
          </div>
          <div className="preview-tip"><span className="tip-mark">i</span><p><strong>A helpful tip</strong> Complete each step for a fuller profile. You can change your answers at any time.</p></div>
          <button type="button" className="preview-review-link" onClick={onRunInference}>See full risk assessment <ArrowRight size={15} /></button>
        </aside>
      </div>
      <p className="disclaimer-line">For educational purposes only · Not a credit decision or financial advice</p>
    </div>
  );
}
