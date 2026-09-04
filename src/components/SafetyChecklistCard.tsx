import React from 'react';
import { SafetyCheckItem } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface SafetyChecklistCardProps {
  checks: SafetyCheckItem[];
  duplicateRisk: number;
  threshold?: number;
  className?: string;
}

export const SafetyChecklistCard: React.FC<SafetyChecklistCardProps> = ({
  checks,
  duplicateRisk,
  threshold = 20,
  className = '',
}) => {
  const isSafe = duplicateRisk < threshold && checks.every((c) => c.passed || c.severity === 'low');

  return (
    <div className={`bg-surface border border-border rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isSafe ? 'bg-mint/10 text-mint' : 'bg-coral/10 text-coral'}`}>
            {isSafe ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-main flex items-center gap-2">
              Payment Safety & Duplicate-Charge Check
              <span
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${
                  isSafe ? 'bg-mint/15 text-mint border border-mint/30' : 'bg-coral/15 text-coral border border-coral/30'
                }`}
              >
                {isSafe ? 'SAFE TO RECOVER' : 'BLOCKED BY SAFETY'}
              </span>
            </h4>
            <p className="text-xs text-muted mt-0.5">
              5-point cryptographic and ledger verification before dispatching any payment action.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Duplicate Risk</div>
          <div
            className={`text-lg font-bold font-mono ${
              duplicateRisk < 10 ? 'text-mint' : duplicateRisk < 20 ? 'text-amber' : 'text-coral'
            }`}
          >
            {duplicateRisk}%
            <span className="text-[10px] text-muted font-normal ml-1">(&lt;{threshold}% req)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {checks.map((check, idx) => {
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                check.passed
                  ? 'bg-surface-elevated/40 border-border/50 text-main'
                  : check.severity === 'critical'
                  ? 'bg-coral/10 border-coral/30 text-coral'
                  : 'bg-amber/10 border-amber/30 text-amber'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-mint" />
                ) : check.severity === 'critical' ? (
                  <XCircle className="w-4 h-4 text-coral" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">{check.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                      check.passed ? 'text-mint' : check.severity === 'critical' ? 'text-coral' : 'text-amber'
                    }`}
                  >
                    {check.passed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{check.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-primary-bright" />
          Protected by RecoverAI Payment Trust Constitution v1.4
        </span>
        <span className="font-mono text-[10px]">Zero blind-retries guarantee</span>
      </div>
    </div>
  );
};
