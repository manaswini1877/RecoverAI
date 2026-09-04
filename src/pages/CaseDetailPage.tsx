import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  ArrowLeft,
  Bot,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  UserCheck,
  Download,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';
import { SafetyChecklistCard } from '../components/SafetyChecklistCard';
import { BlindRetryComparisonModal } from '../components/BlindRetryComparisonModal';
import { CustomerMessageEditorModal } from '../components/CustomerMessageEditorModal';
import { AgentActionReceiptModal } from '../components/AgentActionReceiptModal';
import { PaymentCase } from '../types';

interface CaseDetailPageProps {
  caseId: string;
  onNavigate: (path: string) => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onNavigate }) => {
  const { cases, approveAction, pauseAction, escalateAction, markRecovered, showToast } = useRecovery();
  const caseItem = cases.find((c) => c.id === caseId) || cases[0];

  const [showBlindRetryModal, setShowBlindRetryModal] = useState(false);
  const [showMessageEditorModal, setShowMessageEditorModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [activeChannelTab, setActiveChannelTab] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  if (!caseItem) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-base font-bold text-main">Case not found</h3>
        <button
          onClick={() => onNavigate('/app/cases')}
          className="mt-4 text-xs text-primary-bright underline"
        >
          ← Return to Cases Queue
        </button>
      </div>
    );
  }

  const handleCopyPayload = () => {
    const payload = {
      case_id: caseItem.id,
      amount: caseItem.amount,
      currency: caseItem.currency,
      payment_method: caseItem.paymentMethod.toLowerCase().replace(' ', '_'),
      failure_type: caseItem.failureType,
      initiated_by: caseItem.initiatedBy,
      agent_id: caseItem.agentId,
      agent_name: caseItem.agentName,
      customer_intent: caseItem.decision.customerIntent / 100,
      recoverability: caseItem.decision.recoverability / 100,
      duplicate_charge_risk: caseItem.decision.duplicateChargeRisk / 100,
      recommended_action: caseItem.decision.actionKey,
      delay_minutes: caseItem.decision.delayMinutes,
      channel: caseItem.decision.channel,
      confidence: caseItem.decision.confidence / 100,
      policy_version: caseItem.decision.policyVersion,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
    showToast('Simulated event JSON payload copied to clipboard.');
  };

  const statusStyles: Record<string, string> = {
    action_ready: 'bg-primary/20 text-primary-bright border-primary/40',
    in_progress: 'bg-mint/20 text-mint border-mint/40',
    escalated: 'bg-amber/20 text-amber border-amber/40',
    blocked: 'bg-coral/20 text-coral border-coral/40',
    recovered: 'bg-mint/20 text-mint font-bold border-mint/40',
    expired: 'bg-surface-elevated text-muted border-border',
    paused: 'bg-amber/10 text-amber border-amber/20',
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/app/cases')}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cases Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBlindRetryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-muted hover:text-main transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber" />
            <span>What Would a Blind Retry Do?</span>
          </button>
          {caseItem.receipt && (
            <button
              type="button"
              onClick={() => setShowReceiptModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mint/15 text-mint border border-mint/30 text-xs font-semibold hover:bg-mint/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Inspect Action Receipt</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary-bright flex items-center justify-center font-bold text-base">
              {caseItem.agentName ? <Bot className="w-6 h-6" /> : '₹'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-mono text-main tracking-tight">
                  {caseItem.id}
                </h2>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border uppercase ${
                    statusStyles[caseItem.status] || 'bg-surface-elevated text-muted border-border'
                  }`}
                >
                  {caseItem.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Customer: <strong className="text-main">{caseItem.customerAlias}</strong> · Order ID: {caseItem.orderId} · Created {new Date(caseItem.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {caseItem.status !== 'recovered' && (
              <>
                <button
                  type="button"
                  onClick={() => approveAction(caseItem.id)}
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-semibold shadow-glow-violet transition-all"
                >
                  Approve & Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => pauseAction(caseItem.id)}
                  className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-muted hover:text-main transition-colors"
                >
                  Pause
                </button>
                <button
                  type="button"
                  onClick={() => escalateAction(caseItem.id)}
                  className="px-3.5 py-2 rounded-xl bg-amber/20 hover:bg-amber/30 text-amber border border-amber/30 text-xs font-semibold transition-colors"
                >
                  Escalate
                </button>
                <button
                  type="button"
                  onClick={() => markRecovered(caseItem.id)}
                  className="px-3.5 py-2 rounded-xl bg-mint/20 hover:bg-mint/30 text-mint border border-mint/30 text-xs font-semibold transition-colors"
                >
                  Mark as Recovered
                </button>
              </>
            )}
          </div>
        </div>

        {/* Amount & Method Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
            <span className="text-muted text-[10px] uppercase block">Payment Amount</span>
            <span className="text-main font-bold text-sm">₹{caseItem.amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
            <span className="text-muted text-[10px] uppercase block">Payment Rail</span>
            <span className="text-mint font-semibold text-sm">{caseItem.paymentMethod}</span>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
            <span className="text-muted text-[10px] uppercase block">Failure Reason</span>
            <span className="text-amber font-semibold text-xs capitalize">{caseItem.failureType.replace(/_/g, ' ')}</span>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
            <span className="text-muted text-[10px] uppercase block">Initiator</span>
            <span className="text-primary-bright font-semibold text-xs">
              {caseItem.agentName ? `${caseItem.agentName}` : 'Direct Human'}
            </span>
          </div>
        </div>
      </div>

      {/* Decision Summary Card */}
      <div className="bg-surface border border-primary/40 rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-bright" />
            <h3 className="text-sm font-bold text-main">Autonomous AI Decision & Confidence</h3>
          </div>
          <span className="text-[11px] font-mono text-mint">
            Policy Version: {caseItem.decision.policyVersion}
          </span>
        </div>

        {/* Recommended Action Callout */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="text-[10px] font-mono uppercase text-primary-bright font-semibold">
            Recommended Action:
          </div>
          <div className="text-base font-bold text-main font-sans">
            {caseItem.decision.recommendedAction}
          </div>
        </div>

        {/* Confidence Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-surface-elevated p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-muted uppercase block">Decision Confidence</span>
            <span className="text-xl font-bold font-mono text-primary-bright">{caseItem.decision.confidence}%</span>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-muted uppercase block">Customer Intent</span>
            <span className="text-xl font-bold font-mono text-mint">{caseItem.decision.customerIntent}%</span>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-muted uppercase block">Recoverability</span>
            <span className="text-xl font-bold font-mono text-main">{caseItem.decision.recoverability}%</span>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border">
            <span className="text-[10px] font-mono text-muted uppercase block">Duplicate Risk</span>
            <span
              className={`text-xl font-bold font-mono ${
                caseItem.decision.duplicateChargeRisk < 10
                  ? 'text-mint'
                  : caseItem.decision.duplicateChargeRisk < 20
                  ? 'text-amber'
                  : 'text-coral'
              }`}
            >
              {caseItem.decision.duplicateChargeRisk}%
            </span>
          </div>
        </div>

        {/* Why this decision? */}
        <div className="bg-surface-elevated/70 p-4 rounded-xl border border-border/80 text-xs space-y-1.5">
          <div className="font-semibold text-main">Why this decision?</div>
          <p className="text-muted leading-relaxed">{caseItem.decision.explanation}</p>
        </div>
      </div>

      {/* Safety Checklist Card */}
      <SafetyChecklistCard
        checks={caseItem.decision.safetyChecks}
        duplicateRisk={caseItem.decision.duplicateChargeRisk}
      />

      {/* Communication Preview & Editor Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary-bright" />
            <h3 className="text-sm font-bold text-main">Customer-Facing Communication Preview</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowMessageEditorModal(true)}
            className="px-3 py-1 text-xs rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-main font-semibold"
          >
            Edit Message Copy
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted pb-2 border-b border-border/60">
            <span>Channel: <strong className="text-mint uppercase font-mono">{caseItem.decision.channel}</strong></span>
            <span className="text-[10px] text-muted">Zero Pressure · Contextual Reserve Link</span>
          </div>
          <p className="text-xs text-main font-sans italic leading-relaxed pt-1">
            "{caseItem.messagePayload?.body || 'Your payment did not complete. Your order is safely reserved for 20 minutes.'}"
          </p>
        </div>
      </div>

      {/* Technical Payload & Customer Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* End-to-End Timeline */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-bold text-main pb-2 border-b border-border">Case Audit & Event Timeline</h3>
          <div className="space-y-3">
            {caseItem.timeline.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-[10px] text-muted whitespace-nowrap mt-0.5">{evt.time}</span>
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-main">{evt.stage}</div>
                  <div className="text-[11px] text-muted mt-0.5 leading-relaxed">{evt.description}</div>
                  <div className="text-[9px] font-mono text-subtle mt-0.5">Actor: {evt.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated Technical JSON Payload */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-bright" />
                <h3 className="text-sm font-bold text-main">Technical Event Payload</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="flex items-center gap-1 text-xs text-primary-bright hover:underline"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-mint" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="bg-[#050B14] p-3.5 rounded-xl border border-border text-[11px] font-mono text-[#A78BFA] overflow-x-auto leading-relaxed max-h-64">
{JSON.stringify(
  {
    case_id: caseItem.id,
    amount: caseItem.amount,
    currency: caseItem.currency,
    payment_method: caseItem.paymentMethod.toLowerCase().replace(' ', '_'),
    failure_type: caseItem.failureType,
    initiated_by: caseItem.initiatedBy,
    agent_id: caseItem.agentId,
    agent_name: caseItem.agentName,
    customer_intent: caseItem.decision.customerIntent / 100,
    recoverability: caseItem.decision.recoverability / 100,
    duplicate_charge_risk: caseItem.decision.duplicateChargeRisk / 100,
    recommended_action: caseItem.decision.actionKey,
    delay_minutes: caseItem.decision.delayMinutes,
    channel: caseItem.decision.channel,
    max_attempts: caseItem.decision.maxAttempts,
    confidence: caseItem.decision.confidence / 100,
    policy_version: caseItem.decision.policyVersion,
  },
  null,
  2
)}
            </pre>
          </div>

          <span className="text-[10px] text-muted font-mono pt-2">
            Structured for high interoperability with webhooks, Kafka streams, and LLMs.
          </span>
        </div>
      </div>

      {/* Modals */}
      <BlindRetryComparisonModal
        caseItem={caseItem}
        onClose={() => setShowBlindRetryModal(false)}
      />

      <CustomerMessageEditorModal
        caseItem={caseItem}
        onClose={() => setShowMessageEditorModal(false)}
        onSave={(msg) => {
          caseItem.messagePayload = { ...msg, status: 'edited' };
          showToast('Updated customer message draft.');
        }}
      />

      <AgentActionReceiptModal
        isOpen={showReceiptModal}
        receipt={caseItem.receipt || null}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};
