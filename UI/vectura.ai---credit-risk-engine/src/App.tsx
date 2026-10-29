import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { IntakeScreen } from './components/IntakeScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { PreferencesModal } from './components/PreferencesModal';
import { DocumentationModal } from './components/DocumentationModal';
import { OverrideModal } from './components/OverrideModal';
import { OfferModal } from './components/OfferModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { ExportMemoModal } from './components/ExportMemoModal';
import {
  loadUserPreferences,
  saveUserPreferences,
  loadApplicantProfile,
  saveApplicantProfile,
  DEFAULT_PREFERENCES,
} from './utils/storage';
import { calculateCreditRisk, fetchCreditRiskInference } from './utils/riskEngine';
import { ApplicantProfile, UserPreferences, InferenceResult } from './types/underwriting';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'intake' | 'analytics'>('intake');
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadUserPreferences());
  const [profile, setProfile] = useState<ApplicantProfile>(() => loadApplicantProfile());
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [signedTime, setSignedTime] = useState<string | undefined>();
  const [overrideData, setOverrideData] = useState<{ forcedTier: string; notes: string } | null>(null);

  // Active inference result state (initialized with synchronous local baseline)
  const [inferenceResult, setInferenceResult] = useState<InferenceResult>(() =>
    calculateCreditRisk(profile, 'E. Vance (Sr. Credit Officer, ID #4829)')
  );
  const [isInferencing, setIsInferencing] = useState<boolean>(false);

  // Modals state
  const [showPreferences, setShowPreferences] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply dark mode on mount and preference changes
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  // Request inference from live backend or local calculation
  const triggerInference = useCallback(async (applicantProfile: ApplicantProfile) => {
    setIsInferencing(true);
    const underwriter = preferences.isGuest
      ? 'Guest Tester (Testing Mode)'
      : `${preferences.underwriterName} (${preferences.underwriterRole}, ID #4829)`;

    try {
      const res = await fetchCreditRiskInference(applicantProfile, underwriter);

      // Preserve digital signature if affixed
      if (isSigned) {
        res.auditTrail.isSigned = true;
        res.auditTrail.signedTimestamp = signedTime;
      }

      // Preserve manual override if committed
      if (overrideData) {
        res.tier = overrideData.forcedTier;
        res.statusBadge = overrideData.forcedTier.includes('Approval')
          ? 'Manual Override Approved'
          : 'Manual Override Declined';
        res.verdict = `Verdict: Manual Exception (${overrideData.forcedTier})`;
      }

      setInferenceResult(res);
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsInferencing(false);
    }
  }, [preferences, isSigned, signedTime, overrideData]);

  // Trigger inference on initial mount
  useEffect(() => {
    triggerInference(profile);
  }, []);

  // Save profile changes to localStorage and trigger recalculation if autoCalculate is on
  const handleProfileChange = (newProfile: ApplicantProfile) => {
    setProfile(newProfile);
    saveApplicantProfile(newProfile);
    setOverrideData(null); // Reset override on parameter change

    if (preferences.autoCalculate) {
      triggerInference(newProfile);
    }
  };

  // Explicit calculation button on Intake screen
  const handleRunInference = async () => {
    await triggerInference(profile);
    setActiveScreen('analytics');
  };

  // Save preferences changes to localStorage
  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    saveUserPreferences(newPrefs);
  };

  const handleResetPreferences = () => {
    handleSavePreferences({ ...DEFAULT_PREFERENCES });
  };

  // Digital Signature action
  const handleAffixSignature = () => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setIsSigned(true);
    setSignedTime(timestamp);
    setInferenceResult((prev) => ({
      ...prev,
      auditTrail: {
        ...prev.auditTrail,
        isSigned: true,
        signedTimestamp: timestamp,
      },
    }));
  };

  // Handle manual override
  const handleConfirmOverride = (forcedTier: string, notes: string) => {
    setOverrideData({ forcedTier, notes });
    setInferenceResult((prev) => ({
      ...prev,
      tier: forcedTier,
      statusBadge: forcedTier.includes('Approval')
        ? 'Manual Override Approved'
        : 'Manual Override Declined',
      verdict: `Verdict: Manual Exception (${forcedTier})`,
    }));
    setShowOverride(false);
  };

  return (
    <div className="app-shell">
      <Header
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        preferences={preferences}
        onOpenPreferences={() => setShowPreferences(true)}
        onOpenDocs={() => setShowDocs(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <main className="app-main">
        <div className="app-container">
            {/* Guest Access Banner Notice if in Guest Mode */}
            {preferences.isGuest && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>
                    <strong>Guest Access Active:</strong> Full testing mode enabled. All model vectors, inference simulations, and decision analytics are unrestricted.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="font-semibold text-amber-900 dark:text-amber-200 underline hover:text-amber-700"
                >
                  Configure Identity
                </button>
              </div>
            )}

            {/* Screen Switching */}
            {activeScreen === 'intake' ? (
              <IntakeScreen
                profile={profile}
                onChangeProfile={handleProfileChange}
                onRunInference={handleRunInference}
              />
            ) : (
              <AnalyticsScreen
                profile={profile}
                result={inferenceResult}
                onAdjustInputs={() => setActiveScreen('intake')}
                onOpenOverride={() => setShowOverride(true)}
                onOpenOffer={() => setShowOffer(true)}
                onOpenSimulator={() => setShowSimulator(true)}
                onAffixSignature={handleAffixSignature}
                onExportMemo={() => setShowExport(true)}
              />
            )}
        </div>
      </main>

      {/* Modals & Dialogs */}
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSavePreferences={handleSavePreferences}
        onResetPreferences={handleResetPreferences}
      />

      <DocumentationModal
        isOpen={showDocs}
        onClose={() => setShowDocs(false)}
      />

      <OverrideModal
        isOpen={showOverride}
        onClose={() => setShowOverride(false)}
        profile={profile}
        result={inferenceResult}
        onConfirmOverride={handleConfirmOverride}
      />

      <OfferModal
        isOpen={showOffer}
        onClose={() => setShowOffer(false)}
        profile={profile}
        result={inferenceResult}
      />

      <WhatIfSimulatorModal
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        profile={profile}
        onApplyProfile={handleProfileChange}
      />

      <ExportMemoModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        profile={profile}
        result={inferenceResult}
      />
    </div>
  );
}
