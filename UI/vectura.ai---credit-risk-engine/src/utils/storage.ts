import { UserPreferences, ApplicantProfile } from '../types/underwriting';

const PREFS_STORAGE_KEY = 'vectura_user_preferences_v2';
const APPLICANT_STORAGE_KEY = 'vectura_applicant_state_v2';

export const DEFAULT_PREFERENCES: UserPreferences = {
  darkMode: false,
  isGuest: false,
  underwriterName: 'E. Vance',
  underwriterRole: 'Sr. Underwriter',
  approvalCutoff: 65.0,
  autoCalculate: true,
  soundEffects: false,
  compactView: false,
};

export const DEFAULT_APPLICANT: ApplicantProfile = {
  dossierId: 'APP-2024-8849-DE',
  applicantName: 'Marcus Vance',
  archetype: 'prime',
  age: 35,
  housingTenure: 'own',
  dependents: 1,
  residenceYears: 3,
  maritalStatus: 'male_single',
  isForeignWorker: false,
  checkingAccount: 'mid', // 0-200 DM
  savingsAccount: '100-500',
  collateral: 'real_estate',
  installmentPlans: 'none',
  existingCredits: 1,
  hasRegisteredPhone: true,
  creditAmount: 4000,
  durationMonths: 24,
  purpose: 'new_car',
  installmentRate: 3,
  debtors: 'none',
  employmentTenure: '1_4yr',
  jobCategory: 'skilled',
  creditHistory: 'bank_paid',
  schufaConnected: true,
  schufaScore: 712,
  schufaHash: '0x8849...2e91',
};

export const ARCHETYPE_PRESETS: Record<string, Partial<ApplicantProfile>> = {
  prime: {
    archetype: 'prime',
    applicantName: 'Marcus Vance',
    dossierId: 'APP-2024-8849-DE',
    age: 46,
    creditAmount: 8500,
    durationMonths: 36,
    housingTenure: 'own',
    checkingAccount: 'high',
    savingsAccount: 'gt1000',
    collateral: 'real_estate',
    creditHistory: 'all_paid',
    employmentTenure: 'gt_7yr',
    installmentRate: 2,
    jobCategory: 'executive',
    dependents: 2,
    residenceYears: 5,
    isForeignWorker: false,
  },
  young: {
    archetype: 'young',
    applicantName: 'Elena Rostova',
    dossierId: 'APP-2024-9120-DE',
    age: 26,
    creditAmount: 2500,
    durationMonths: 18,
    housingTenure: 'rent',
    checkingAccount: 'mid',
    savingsAccount: '100-500',
    collateral: 'life_insurance',
    creditHistory: 'bank_paid',
    employmentTenure: '1_4yr',
    installmentRate: 2,
    jobCategory: 'skilled',
    dependents: 1,
    residenceYears: 2,
    isForeignWorker: false,
  },
  subprime: {
    archetype: 'subprime',
    applicantName: 'Julian Keller',
    dossierId: 'APP-2024-4318-DE',
    age: 23,
    creditAmount: 11000,
    durationMonths: 48,
    housingTenure: 'rent',
    checkingAccount: 'neg',
    savingsAccount: 'lt100',
    collateral: 'none',
    creditHistory: 'past_delays',
    employmentTenure: 'lt_1yr',
    installmentRate: 4,
    jobCategory: 'unskilled_res',
    dependents: 1,
    residenceYears: 1,
    isForeignWorker: false,
  },
  custom: {
    archetype: 'custom',
    applicantName: 'Custom Applicant',
    dossierId: 'APP-2024-CUSTOM-01',
    age: 35,
    creditAmount: 4000,
    durationMonths: 24,
    housingTenure: 'own',
    checkingAccount: 'mid',
    savingsAccount: '100-500',
    collateral: 'real_estate',
    creditHistory: 'bank_paid',
    employmentTenure: '1_4yr',
    installmentRate: 3,
    jobCategory: 'skilled',
    dependents: 1,
    residenceYears: 3,
    isForeignWorker: false,
  },
};

export function loadUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (e) {
    console.warn('Failed to parse user preferences from localStorage', e);
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    // Apply dark mode class to document
    if (prefs.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.warn('Failed to save user preferences', e);
  }
}

export function loadApplicantProfile(): ApplicantProfile {
  try {
    const raw = localStorage.getItem(APPLICANT_STORAGE_KEY);
    if (!raw) return DEFAULT_APPLICANT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_APPLICANT, ...parsed };
  } catch (e) {
    console.warn('Failed to parse applicant profile from localStorage', e);
    return DEFAULT_APPLICANT;
  }
}

export function saveApplicantProfile(profile: ApplicantProfile): void {
  try {
    localStorage.setItem(APPLICANT_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save applicant profile', e);
  }
}
