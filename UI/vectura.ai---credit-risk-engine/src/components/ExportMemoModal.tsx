import React, { useState } from 'react';
import { ApplicantProfile, InferenceResult } from '../types/underwriting';

interface ExportMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApplicantProfile;
  result: InferenceResult;
}

export const ExportMemoModal: React.FC<ExportMemoModalProps> = ({
  isOpen,
  onClose,
  profile,
  result,
}) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'memo' | 'json'>('memo');

  if (!isOpen) return null;

  const memoText = `# CREDIT UNDERWRITING MEMORANDUM
Dossier Reference: ${profile.dossierId}
Applicant Name: ${profile.applicantName}
Date of Decision: ${new Date().toISOString().split('T')[0]}
Reviewing Officer: ${result.auditTrail.underwriter}
Supervisory Tier: EU AI Act Tier-2 · Basel III Internal Ratings-Based

## 1. Executive Summary & Policy Recommendation
- Automated Risk Verdict: ${result.tier} (${result.statusBadge})
- Calculated Probability of Good Creditworthiness: ${result.probabilityGood.toFixed(2)}%
- Credit Score Equivalent: ${result.creditScore} / 850
- Expected Loss (EL): ${result.expectedLoss.toFixed(2)}%
- Recommended Exposure Limit: $${result.recommendedLimit.toLocaleString()}

## 2. Requested Terms & Exposure Architecture
- Principal Amount Requested: $${profile.creditAmount.toLocaleString()}
- Amortization Horizon: ${profile.durationMonths} Months
- Allocation Purpose: ${profile.purpose.replace('_', ' ').toUpperCase()}
- Loss Given Default (LGD): ${result.lgd.toFixed(2)}%
- Exposure At Default (EAD): $${result.ead.toLocaleString()}.00

## 3. KernelSHAP Feature Attribution Decomposition
${result.factors
  .map(
    (f) =>
      `- ${f.title}: Weight ${f.weight.toFixed(3)} [${f.impactPercent >= 0 ? '+' : ''}${f.impactPercent.toFixed(1)}% P(Good)] -> ${f.description}`
  )
  .join('\n')}

## 4. Compliance & Audit Verification
- Seed Hash: ${result.auditTrail.seedHash}
- Model Checkpoint: ${result.auditTrail.checkpointDigest}
- Fairness Parity Ratio: ${result.auditTrail.fairnessRatio} (ECOA Pass > 0.80)
- Digital Ledger Status: ${result.auditTrail.isSigned ? 'SIGNED & SEALED' : 'PENDING COUNTERSIGNATURE'}
`;

  const jsonText = JSON.stringify(
    {
      dossierId: profile.dossierId,
      applicant: profile,
      inference: result,
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  const activeContent = format === 'memo' ? memoText : jsonText;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: format === 'memo' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.dossierId}-underwriting-memo.${format === 'memo' ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-slate-900 dark:text-white">
                Export Underwriting Memorandum
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Institutional credit dossier export for committee review
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

        {/* Format Selector */}
        <div className="px-6 pt-3 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFormat('memo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              format === 'memo'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Markdown Memo
          </button>
          <button
            type="button"
            onClick={() => setFormat('json')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              format === 'json'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            JSON Raw Payload
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto">
          <pre className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-pre-wrap select-all leading-relaxed">
            {activeContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            Close
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
