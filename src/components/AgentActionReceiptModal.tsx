import React from 'react';
import { AgentActionReceipt } from '../types';
import { useRecovery } from '../context/RecoveryContext';
import { CheckCircle2, Download, X, Shield, Sparkles, FileText } from 'lucide-react';

interface AgentActionReceiptModalProps {
  receipt: AgentActionReceipt | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const AgentActionReceiptModal: React.FC<AgentActionReceiptModalProps> = ({
  receipt,
  isOpen = true,
  onClose,
}) => {
  const { exportReceiptJSON } = useRecovery();
  if (!isOpen || !receipt) return null;

  const displayOutcome = receipt.outcomeDisplay || (receipt.finalOutcome === 'RECOVERED_SUCCESSFULLY' ? 'RECOVERED' : receipt.finalOutcome);
  const paymentStatus = receipt.paymentStatus || (receipt.finalOutcome === 'RECOVERED_SUCCESSFULLY' ? 'CAPTURE_SIMULATED' : 'BLOCKED');
  const recoveryAction = receipt.recoveryAction || receipt.actionSelected || 'Alternate UPI link';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-main p-1 rounded-lg hover:bg-surface-elevated transition-colors"
          aria-label="Close receipt"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
          <div className="p-2.5 rounded-xl bg-mint/15 text-mint border border-mint/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-primary-bright uppercase font-semibold">
              RecoverAI · Mission Audit Log
            </div>
            <h3 className="text-xl font-bold text-main">Agent Action Receipt</h3>
          </div>
        </div>

        {/* Receipt Body Card */}
        <div className="bg-surface-elevated border border-border/80 rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <span className="text-muted text-[10px] uppercase block">Receipt ID</span>
              <span className="text-main font-bold text-sm">{receipt.receiptId}</span>
            </div>
            <div className="text-right">
              <span className="text-muted text-[10px] uppercase block">Timestamp</span>
              <span className="text-main">{new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1 text-xs">
            <div>
              <span className="text-muted text-[10px] uppercase block">Case ID</span>
              <span className="text-primary-bright font-semibold">{receipt.caseId}</span>
            </div>
            <div>
              <span className="text-muted text-[10px] uppercase block">Order ID</span>
              <span className="text-main">{receipt.orderId}</span>
            </div>
            <div>
              <span className="text-muted text-[10px] uppercase block">Customer Alias</span>
              <span className="text-main">{receipt.customerAlias}</span>
            </div>
            <div>
              <span className="text-muted text-[10px] uppercase block">Autonomous Agent</span>
              <span className="text-main">{receipt.agentName || 'None (Direct)'}</span>
            </div>
          </div>

          {/* Key Financial & Operational Metrics Required */}
          <div className="p-4 rounded-xl bg-surface border border-border/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Original Payment Amount:</span>
              <span className="text-main font-bold">₹{receipt.originalPaymentAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Recovered Revenue:</span>
              <span className="text-mint font-bold text-sm">₹{receipt.recoveredAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Outcome:</span>
              <span className={`font-bold uppercase ${displayOutcome === 'RECOVERED' ? 'text-mint' : 'text-coral'}`}>
                {displayOutcome}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Payment Status:</span>
              <span className="text-mint font-bold font-mono">
                {paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Recovery Action:</span>
              <span className="text-primary-bright font-semibold">
                {recoveryAction}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Duplicate Charge Risk:</span>
              <span className="text-mint font-bold">{receipt.duplicateChargeRisk}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Retries Avoided:</span>
              <span className="text-main font-bold">{receipt.retriesAvoided}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Customer Messages Sent:</span>
              <span className="text-main font-bold">{receipt.customerCommunicationCount || 1}</span>
            </div>
          </div>

          <div>
            <span className="text-muted text-[10px] uppercase block mb-1.5 font-sans font-semibold">
              Applied Trust Safeguards:
            </span>
            <div className="space-y-1 font-sans text-xs">
              {receipt.trustSafeguardsApplied.map((sg, idx) => (
                <div key={idx} className="flex items-center gap-2 text-main">
                  <Shield className="w-3.5 h-3.5 text-mint flex-shrink-0" />
                  <span>{sg}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-main">
                <CheckCircle2 className="w-3.5 h-3.5 text-mint flex-shrink-0" />
                <span>{receipt.retriesAvoided} blind retries avoided (Rail fatigue prevented)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted font-sans">
            <span>Policy Governance: {receipt.policyVersion}</span>
            <span className={`font-semibold ${displayOutcome === 'RECOVERED' ? 'text-mint' : 'text-coral'}`}>
              Outcome: {displayOutcome}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted hover:text-main rounded-xl hover:bg-surface-elevated transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => exportReceiptJSON(receipt)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-bright text-white shadow-glow-violet transition-all"
          >
            <Download className="w-4 h-4" />
            Export Receipt JSON
          </button>
        </div>
      </div>
    </div>
  );
};
