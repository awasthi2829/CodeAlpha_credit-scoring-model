import React, { useState } from 'react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'overview' | 'predictors' | 'shap' | 'compliance' | 'storage'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
            <div>
              <h2 className="font-display text-[18px] font-bold text-slate-900 dark:text-white">
                VECTURA.AI System &amp; Model Architecture
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Institutional documentation for engineers, data scientists, and supervisory auditors
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

        {/* Tab Navigation */}
        <div className="px-6 pt-2 border-b border-slate-200/80 dark:border-slate-800 flex gap-2 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Architecture Overview' },
            { id: 'predictors', label: '20 Predictors (Statlog)' },
            { id: 'shap', label: 'SHAP Decomposition' },
            { id: 'compliance', label: 'Regulatory Matrix' },
            { id: 'storage', label: 'Persistence & Contracts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocTab(tab.id as any)}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeDocTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeDocTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                System Overview
              </h3>
              <p>
                <strong>VECTURA.AI Credit Risk Engine</strong> is a low-latency, deterministic credit decisioning platform modeled after the benchmark German Credit (Statlog) empirical distribution. It provides real-time quantitative inference, granular explainability via KernelSHAP decomposition, and algorithmic counterfactual guidance for loan officers and risk committees.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-400 uppercase">Model Framework</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-1">XGBoost Ensemble v2.4</div>
                  <div className="text-xs text-slate-500 mt-0.5">Calibrated Platt-scaling probability</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-400 uppercase">Inference Latency</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-1">&lt; 42ms Deterministic</div>
                  <div className="text-xs text-slate-500 mt-0.5">Edge compiled vectorized math</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-400 uppercase">Supervisory Tier</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-1">EU AI Act Tier-2</div>
                  <div className="text-xs text-slate-500 mt-0.5">Auditable human-in-the-loop ledger</div>
                </div>
              </div>

              <h4 className="font-semibold text-slate-900 dark:text-white mt-4">
                Underwriting Workflow Pipeline
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><strong>Ingestion:</strong> 20 normalized applicant predictors are collected across 4 structured sections.</li>
                <li><strong>Validation &amp; KYC:</strong> Vector completeness check (20/20 valid) and cryptographic SCHUFA registry sync.</li>
                <li><strong>Inference Execution:</strong> Log-odds baseline transformation calculates P(Good Creditworthiness).</li>
                <li><strong>SHAP Decomposition:</strong> Additive marginal contributions isolate top positive drivers and risk draggers.</li>
                <li><strong>Counterfactual Optimization:</strong> Inverse optimization engine solves for minimal borrower adjustments.</li>
                <li><strong>Governance &amp; Sign-off:</strong> Officer review with cryptographic ledger signing and override capabilities.</li>
              </ol>
            </div>
          )}

          {activeDocTab === 'predictors' && (
            <div className="space-y-4">
              <h3 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                Statlog 20 Core Predictive Feature Vectors
              </h3>
              <p className="text-xs text-slate-500">
                The 20 variables comply with statutory classifications (A11 through A201) defined in the German Credit benchmark:
              </p>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-mono">
                    <tr>
                      <th className="p-2.5">Feature Variable</th>
                      <th className="p-2.5">Attribute Category</th>
                      <th className="p-2.5">Domain Range</th>
                      <th className="p-2.5">Impact Direction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-2.5 font-medium">Checking Account Status</td>
                      <td className="p-2.5">Liquidity</td>
                      <td className="p-2.5 font-mono">A11 – A14</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">+10.2% to -14.2%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Credit Duration</td>
                      <td className="p-2.5">Exposure</td>
                      <td className="p-2.5 font-mono">6 – 72 Months</td>
                      <td className="p-2.5 text-rose-600 font-semibold">-6.5% to -13.5%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Credit History</td>
                      <td className="p-2.5">Repayment</td>
                      <td className="p-2.5 font-mono">A30 – A34</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">+12.4% to -16.8%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Property &amp; Collateral</td>
                      <td className="p-2.5">Collateral</td>
                      <td className="p-2.5 font-mono">Real Estate to None</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">+14.8% to -7.4%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Employment Tenure</td>
                      <td className="p-2.5">Stability</td>
                      <td className="p-2.5 font-mono">Unemployed to &gt;7yr</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">+11.6% to -13.2%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Installment Rate Burden</td>
                      <td className="p-2.5">Debt Ratio</td>
                      <td className="p-2.5 font-mono">1% – 4% Disposable</td>
                      <td className="p-2.5 text-rose-600 font-semibold">-1.8% to -4.5%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Applicant Age Cohort</td>
                      <td className="p-2.5">Demographics</td>
                      <td className="p-2.5 font-mono">18 – 75 Years</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">+5.2% to -3.6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeDocTab === 'shap' && (
            <div className="space-y-4">
              <h3 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                KernelSHAP Explainable AI (XAI) Formula
              </h3>
              <p>
                In accordance with European Banking Authority (EBA) guidelines for artificial intelligence, credit decisions must be fully decomposed into additive feature contributions.
              </p>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-700">
                P(Good) = Baseline_P + Sum(Phi_i)
                <br />
                Where Baseline_P = 52.0% (empirical prior in Statlog distribution)
                <br />
                Phi_i = Shapley feature attribution weight for predictor i
              </div>
              <p className="text-xs">
                In the default Marcus Vance prime profile:
                <br />
                <strong>Baseline (52.0%) + Positive Drivers (+40.5%) - Risk Draggers (-12.6%) = 79.9% (~79.67%)</strong>
              </p>
            </div>
          )}

          {activeDocTab === 'compliance' && (
            <div className="space-y-4">
              <h3 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                Regulatory Governance &amp; Supervisory Standards
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white">Basel III Capital Requirements:</strong> Ensures minimum capital buffers and Expected Loss (EL = PD * LGD * EAD) containment under Pillar 1 internal ratings-based (IRB) approach.
                </li>
                <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white">EU Artificial Intelligence Act (Tier-2 High Risk):</strong> Guarantees transparency, non-discriminatory algorithmic impact, and an unforgeable cryptographic audit trail.
                </li>
                <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white">Equal Credit Opportunity Act (ECOA) &amp; BaFin:</strong> Monitors Disparate Impact Ratio (&gt; 0.80 threshold) to prohibit discrimination across protected cohorts.
                </li>
              </ul>
            </div>
          )}

          {activeDocTab === 'storage' && (
            <div className="space-y-4">
              <h3 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                Local Storage Persistence Contracts
              </h3>
              <p className="text-xs">
                All client configurations and active drafts are persisted without external server dependency using the HTML5 localStorage API:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <strong>Key:</strong> vectura_user_preferences_v2
                  <br />
                  <strong>Value:</strong> &#123; darkMode: boolean, isGuest: boolean, underwriterName: string, approvalCutoff: number &#125;
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <strong>Key:</strong> vectura_applicant_state_v2
                  <br />
                  <strong>Value:</strong> Full ApplicantProfile object with all 20 predictors and archetype tag
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
