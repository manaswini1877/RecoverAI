import React from 'react';
import { X, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { PaymentCase } from '../types';

interface BlindRetryComparisonModalProps {
  caseItem: PaymentCase | null;
  onClose: () => void;
}

export const BlindRetryComparisonModal: React.FC<BlindRetryComparisonModalProps> = ({
  caseItem,
  onClose,
}) => {
  if (!caseItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-main p-1 rounded-lg hover:bg-surface-elevated transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 mb-5 border-b border-border">
          <div className="text-[10px] font-mono tracking-widest text-primary-bright uppercase font-semibold">
            Comparative Decision Engine Analysis
          </div>
          <h3 className="text-xl font-bold text-main mt-0.5">
            What Would a Blind Retry System Do?
          </h3>
          <p className="text-xs text-muted mt-1">
            Comparing conventional brute-force retries vs. RecoverAI trust-aware decision for case {caseItem.id}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blind Retry Column */}
          <div className="bg-coral/5 border border-coral/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-coral font-semibold text-sm mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Conventional Blind Retry</span>
              </div>
              <ul className="space-y-2.5 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-coral font-bold">•</span>
                  <span><strong>Immediate 0s retry:</strong> Hammers bank payment rail while switch is still timing out or down.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral font-bold">•</span>
                  <span><strong>Ignores debit signals:</strong> Risks charging the customer twice if asynchronous debit succeeds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral font-bold">•</span>
                  <span><strong>Generic copy:</strong> Sends generic "Payment Failed! Try again now" without context or inventory hold.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral font-bold">•</span>
                  <span><strong>Zero Agent Scope Control:</strong> Blindly permits out-of-scope or mutated cart amounts without human gate.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-coral/20 text-[11px] font-mono text-coral">
              Outcome: Rail penalties, customer distrust, duplicate charges.
            </div>
          </div>

          {/* RecoverAI Column */}
          <div className="bg-mint/5 border border-mint/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-mint font-semibold text-sm mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>RecoverAI Trust Layer</span>
              </div>
              <ul className="space-y-2.5 text-xs text-main">
                <li className="flex items-start gap-2">
                  <span className="text-mint font-bold">•</span>
                  <span><strong>Safe Delay Window:</strong> Introduces 10m cooldown to clear transient gateway congestion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mint font-bold">•</span>
                  <span><strong>5-Point Duplicate Safeguard:</strong> Reconciles webhooks & idempotency locks prior to dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mint font-bold">•</span>
                  <span><strong>Intent-Aware Alternative:</strong> Dispatches alternate UPI/Card link with 20m inventory reservation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mint font-bold">•</span>
                  <span><strong>Agent Intent Scope Check:</strong> Enforces category boundaries & halts cart modification &gt;15%.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-mint/20 text-[11px] font-mono text-mint">
              Outcome: 60.2% recovery rate, 0 duplicate charges, merchant safety.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-surface-highlight hover:bg-surface-elevated text-main border border-border transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
