import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Sliders,
  Shield,
  ShieldCheck,
  Bot,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { RecoveryPolicyService } from '../services/RecoveryPolicyService';
import { RecoveryPolicy } from '../types';

export const PoliciesPage: React.FC = () => {
  const { policy, updatePolicy, showToast } = useRecovery();

  const [form, setForm] = useState<RecoveryPolicy>({ ...policy });

  const dynamicPreview = RecoveryPolicyService.generateNaturalLanguagePreview(form);

  const handleSave = () => {
    updatePolicy(form);
  };

  const handleReset = () => {
    setForm({ ...policy });
    showToast('Reset policy changes to saved configuration.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Recovery Constitution & Agent Governance
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary-bright border border-primary/30">
              POLICY VERSION {form.id}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Define what RecoverAI may execute automatically, when it must mandate human operator sign-off, and when it must stop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-muted hover:text-main transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-bold shadow-glow-violet transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Constitution</span>
          </button>
        </div>
      </div>

      {/* Dynamic Natural Language Policy Preview */}
      <div className="bg-surface border border-primary/40 rounded-2xl p-5 sm:p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2 text-primary-bright font-mono text-xs font-semibold uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Dynamic Natural-Language Policy Translation</span>
        </div>
        <p className="text-xs sm:text-sm text-main leading-relaxed font-sans bg-surface-elevated p-4 rounded-xl border border-border/80">
          "{dynamicPreview}"
        </p>
      </div>

      {/* Autonomy Level Selector */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-main">Merchant Autonomy Level</h3>
          <p className="text-xs text-muted">Select how much operational authority is granted to RecoverAI.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            {
              id: 'observe_only',
              label: '1. Observe Only',
              desc: 'Passively monitors checkout interruptions without generating actions.',
            },
            {
              id: 'recommend_actions',
              label: '2. Recommend Actions',
              desc: 'Diagnoses failure and prepares recommendation for human review.',
            },
            {
              id: 'prepare_actions',
              label: '3. Prepare Actions',
              desc: 'Generates ready-to-send recovery links for 1-click dispatch.',
            },
            {
              id: 'act_automatically',
              label: '4. Act Automatically',
              desc: 'Dispatches safe recovery links automatically within policy limits.',
            },
          ].map((lvl) => {
            const isSelected = form.autonomyLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setForm({ ...form, autonomyLevel: lvl.id as any })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-primary-bright shadow-glow-violet font-semibold'
                    : 'bg-surface-elevated border-border text-muted hover:text-main hover:bg-surface-highlight'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-main mb-1">{lvl.label}</div>
                  <div className="text-[11px] text-muted leading-relaxed font-sans">{lvl.desc}</div>
                </div>
                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-primary-bright">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE AUTONOMY
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Policy Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending & Velocity Controls */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Shield className="w-4 h-4 text-primary-bright" />
            <h3 className="text-sm font-bold text-main">Spending & Retry Boundaries</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Max Autonomous Recovery Amount (₹):</span>
                <span className="text-main font-mono font-bold">₹{form.maxAutomaticAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="1000"
                value={form.maxAutomaticAmount}
                onChange={(e) => setForm({ ...form, maxAutomaticAmount: Number(e.target.value) })}
                className="w-full accent-primary bg-surface-elevated rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Human Operator Mandatory Sign-off Ceiling (₹):</span>
                <span className="text-main font-mono font-bold">₹{form.humanApprovalThreshold.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={form.humanApprovalThreshold}
                onChange={(e) => setForm({ ...form, humanApprovalThreshold: Number(e.target.value) })}
                className="w-full accent-primary bg-surface-elevated rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Max Attempts per Case:</span>
                <span className="text-main font-mono font-bold">{form.maxAttempts} attempts max</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={form.maxAttempts}
                onChange={(e) => setForm({ ...form, maxAttempts: Number(e.target.value) })}
                className="w-full accent-primary bg-surface-elevated rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Minimum Delay Between Ingestions (Cooldown):</span>
                <span className="text-main font-mono font-bold">{form.minimumDelayMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={form.minimumDelayMinutes}
                onChange={(e) => setForm({ ...form, minimumDelayMinutes: Number(e.target.value) })}
                className="w-full accent-primary bg-surface-elevated rounded-lg h-2"
              />
            </div>
          </div>
        </div>

        {/* Risk & Agentic Commerce Controls */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Bot className="w-4 h-4 text-mint" />
            <h3 className="text-sm font-bold text-main">Agent Intent & Duplicate Risk Controls</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Duplicate-Charge Risk Tolerance:</span>
                <span className="text-amber font-mono font-bold">&lt; {form.duplicateRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={form.duplicateRiskThreshold}
                onChange={(e) => setForm({ ...form, duplicateRiskThreshold: Number(e.target.value) })}
                className="w-full accent-amber bg-surface-elevated rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Max Cart Modification / Intent Drift:</span>
                <span className="text-main font-mono font-bold">+{form.maxCartModificationPct}% deviation</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={form.maxCartModificationPct}
                onChange={(e) => setForm({ ...form, maxCartModificationPct: Number(e.target.value) })}
                className="w-full accent-primary bg-surface-elevated rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Max Agent Single Transaction Cap (₹):</span>
                <span className="text-main font-mono font-bold">₹{form.maxAgentTransactionAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={form.maxAgentTransactionAmount}
                onChange={(e) => setForm({ ...form, maxAgentTransactionAmount: Number(e.target.value) })}
                className="w-full accent-primary bg-surface-elevated rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-muted mb-1 font-medium">
                <span>Agent Trust Score Pause Threshold:</span>
                <span className="text-coral font-mono font-bold">&lt; {form.lowTrustScorePauseThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={form.lowTrustScorePauseThreshold}
                onChange={(e) => setForm({ ...form, lowTrustScorePauseThreshold: Number(e.target.value) })}
                className="w-full accent-coral bg-surface-elevated rounded-lg h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
