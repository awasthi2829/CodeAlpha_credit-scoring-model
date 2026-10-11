export type HousingTenure = 'own' | 'rent' | 'free';
export type MaritalStatus = 'male_single' | 'male_divorced' | 'male_married' | 'female_divorced';
export type CheckingAccount = 'no_checking' | 'neg' | 'mid' | 'high';
export type SavingsAccount = 'lt100' | '100-500' | '500-1000' | 'gt1000' | 'unknown';
export type CollateralType = 'real_estate' | 'life_insurance' | 'car_other' | 'none';
export type InstallmentPlan = 'bank' | 'stores' | 'none';
export type LoanPurpose = 'new_car' | 'used_car' | 'furniture' | 'radio_tv' | 'education' | 'retraining' | 'business';
export type DebtorsType = 'none' | 'co_applicant' | 'guarantor';
export type EmploymentTenure = 'unemployed' | 'lt_1yr' | '1_4yr' | '4_7yr' | 'gt_7yr';
export type JobCategory = 'unskilled_nonres' | 'unskilled_res' | 'skilled' | 'executive';
export type CreditHistory = 'all_paid' | 'bank_paid' | 'existing_duly' | 'past_delays' | 'critical';
export type ArchetypePreset = 'prime' | 'young' | 'subprime' | 'custom';

export interface ApplicantProfile {
  dossierId: string;
  applicantName: string;
  archetype: ArchetypePreset;
  // Demographic
  age: number;
  housingTenure: HousingTenure;
  dependents: number;
  residenceYears: number;
  maritalStatus: MaritalStatus;
  isForeignWorker: boolean;
  // Liquidity & Assets
  checkingAccount: CheckingAccount;
  savingsAccount: SavingsAccount;
  collateral: CollateralType;
  installmentPlans: InstallmentPlan;
  existingCredits: number;
  hasRegisteredPhone: boolean;
  // Loan Exposure
  creditAmount: number;
  durationMonths: number;
  purpose: LoanPurpose;
  installmentRate: number; // 1, 2, 3, 4
  debtors: DebtorsType;
  // Employment & KYC
  employmentTenure: EmploymentTenure;
  jobCategory: JobCategory;
  creditHistory: CreditHistory;
  schufaConnected: boolean;
  schufaScore: number;
  schufaHash: string;
}

export interface ShapFactor {
  id: string;
  title: string;
  description: string;
  weight: number;
  impactPercent: number;
  type: 'pos' | 'neg';
  icon: string;
  category: string;
}

export interface CounterfactualScenario {
  id: string;
  title: string;
  impact: string;
  impactDelta: number;
  description: string;
  icon: string;
  applied?: boolean;
}

export interface InferenceResult {
  probabilityGood: number;
  creditScore: number;
  scoreMax: number;
  tier: string;
  statusBadge: string;
  verdict: string;
  segment: string;
  recommendedLimit: number;
  expectedLoss: number;
  inferenceConfidence: number;
  confidenceSigma: number;
  lgd: number;
  ead: number;
  maxTermCap: number;
  dtiRatio: number;
  factors: ShapFactor[];
  counterfactuals: CounterfactualScenario[];
  auditTrail: {
    seedHash: string;
    checkpointDigest: string;
    fairnessRatio: number;
    underwriter: string;
    isSigned: boolean;
    signedTimestamp?: string;
  };
}

export interface UserPreferences {
  darkMode: boolean;
  isGuest: boolean;
  underwriterName: string;
  underwriterRole: string;
  approvalCutoff: number;
  autoCalculate: boolean;
  soundEffects: boolean;
  compactView: boolean;
}
