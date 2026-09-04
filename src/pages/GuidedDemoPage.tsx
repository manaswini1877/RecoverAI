import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Bot,
  ShieldCheck,
  Clock,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Download,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { AgentCheckoutService } from '../services/AgentCheckoutService';
import { PipelineStageBar } from '../components/PipelineStageBar';
import { SafetyChecklistCard } from '../components/SafetyChecklistCard';
import { AgentActionReceiptModal } from '../components/AgentActionReceiptModal';
import { AgentActionReceipt } from '../types';
import confetti from 'canvas-confetti';

interface GuidedDemoPageProps {
  onNavigate: (route: string) => void;
}

export const GuidedDemoPage: React.FC<GuidedDemoPageProps> = ({ onNavigate }) => {
  const { policy, showToast, completeDemoSafeRecovery, markRecovered } = useRecovery();

  // Demo step state (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [humanDecision, setHumanDecision] = useState<'approved' | 'rejected' | 'paused' | 'revoked' | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<AgentActionReceipt | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const resetGuidedDemo = () => {
    setCurrentStep(1);
    setHumanDecision(null);
    setGeneratedReceipt(null);
    setShowReceiptModal(false);
    showToast('Guided demo reset to Step 1.');
  };

  // Flow A: Successful safe recovery path
  const handleCompleteSafeRecovery = () => {
    const receipt = completeDemoSafeRecovery();
    setGeneratedReceipt(receipt);
    setCurrentStep(7);
    setShowReceiptModal(true);
  };

  // Flow B: Agent intent drift / scope overrun path
  const handleStep5Drift = () => {
    setCurrentStep(5);
    showToast('⚠️ AGENT INTENT DRIFT DETECTED: Checkout expansion blocked.');
  };

  const handleHumanAction = (action: 'approved' | 'rejected' | 'paused' | 'revoked') => {
    setHumanDecision(action);
    setCurrentStep(7);

    // Create receipt
    const finalAmount = action === 'approved' ? 18000 : 9800;
    const finalOutcome =
      action === 'approved'
        ? 'RECOVERED_SUCCESSFULLY'
        : action === 'rejected'
        ? 'RECOVERED_SUCCESSFULLY'
        : 'BLOCKED_BY_SAFETY';

    const receipt: AgentActionReceipt = {
      receiptId: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      caseId: 'REC-10482',
      orderId: 'ORD-77192',
      agentName: 'TravelMate-204',
      customerAlias: 'Customer T-204',
      originalPaymentAmount: 9800,
      recoveredAmount: action === 'paused' || action === 'revoked' ? 0 : finalAmount,
      outcomeDisplay: action === 'paused' || action === 'revoked' ? 'BLOCKED_BY_SAFETY' : 'RECOVERED',
      paymentStatus: action === 'paused' || action === 'revoked' ? 'BLOCKED' : 'CAPTURE_SIMULATED',
      recoveryAction:
        action === 'approved'
          ? 'Approved ₹18k override'
          : action === 'rejected'
          ? 'Alternate UPI link'
          : `Halted (Agent ${action})`,
      failureDiagnosis: 'TEMPORARY UPI TIMEOUT',
      customerIntentScore: 91,
      duplicateChargeRisk: 4,
      actionSelected:
        action === 'approved'
          ? 'Human operator approved ₹18,000 suite upgrade. Alternate UPI link dispatched.'
          : action === 'rejected'
          ? 'Rejected ₹18,000 overrun. Dispatched alternate UPI link for authorized ₹9,800 booking.'
          : `Agent authorization ${action} by operator. Checkout halted.`,
      attemptsCount: 1,
      customerCommunicationCount: 1,
      finalOutcome,
      trustSafeguardsApplied: [
        'Agent identity cryptographic validation (Simulated mTLS signature)',
        'Scope boundary check (₹12,000 limit strictly enforced)',
        'Duplicate charge prevention check executed (4% risk)',
        'Human operator sign-off requirement',
      ],
      retriesAvoided: 1,
      duplicateRiskPrevented: true,
      authViolationBlocked: true,
      humanApprovalRequired: true,
      decisionConfidence: 93,
      policyVersion: 'v1.4',
      timestamp: new Date().toISOString(),
    };

    setGeneratedReceipt(receipt);
    setShowReceiptModal(true);

    if (action === 'approved' || action === 'rejected') {
      markRecovered('REC-10482');
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#35D0A0', '#A78BFA'],
        });
      } catch (e) {}
    }

    showToast(`Decision recorded: ${action.toUpperCase()}. Proceeding to Action Receipt.`);
  };

  const pipelineStages = ['event', 'verify_scope', 'diagnose', 'decide', 'protect', 'recover', 'measure'] as const;

  return (
    <div className="min-h-screen bg-background text-main font-sans selection:bg-primary/30">
      {/* Demo Top Navigation Bar */}
      <div className="bg-surface border-b border-border sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-dark via-primary to-primary-bright flex items-center justify-center text-white font-bold text-sm shadow-glow-violet">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-main">RecoverAI · Guided Hackathon Demo</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary-bright border border-primary/30">
                Track 1: AI Growth & Agentic Commerce
              </span>
            </div>
            <div className="text-xs text-muted">Scenario: TravelMate-204 Autonomous Hotel Checkout</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetGuidedDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-main rounded-xl hover:bg-surface-elevated transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/app/overview')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-main transition-colors"
          >
            <span>Open Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator Progress Bar */}
        <div className="bg-surface border border-border rounded-2xl p-4 mb-6 shadow-card">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-muted pb-3 mb-3 border-b border-border">
            <span>DEMO PRESENTATION PROGRESS</span>
            <span className="text-primary-bright">STEP {currentStep} OF 7</span>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-mono">
            {[
              '1. Initiate',
              '2. Verify Agent',
              '3. Fail (Timeout)',
              '4. Safe Recovery',
              '5. Intent Drift',
              '6. Operator Gate',
              '7. Action Receipt',
            ].map((label, idx) => {
              const stepNum = idx + 1;
              const isPast = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(stepNum)}
                  className={`p-2 rounded-xl cursor-pointer transition-all border ${
                    isCurrent
                      ? 'bg-primary/20 border-primary text-primary-bright font-bold shadow-glow-violet'
                      : isPast
                      ? 'bg-mint/10 border-mint/30 text-mint font-medium'
                      : 'bg-surface-elevated border-border text-subtle hover:text-muted'
                  }`}
                >
                  <div>{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Scenario Card Shell */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* STEP 1: Agent Initiates Checkout */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/15 text-primary-bright">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-primary-bright font-semibold">
                    Step 1 · Autonomous Initiation
                  </div>
                  <h2 className="text-2xl font-bold text-main">TravelMate-204 Initiates Hotel Checkout</h2>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                An autonomous shopping agent (<strong className="text-main">TravelMate-204</strong>) acts on behalf of customer <strong className="text-main">Customer T-204</strong> to reserve a boutique heritage hotel room for a weekend getaway.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-elevated p-4 rounded-xl border border-border text-xs font-mono">
                <div>
                  <span className="text-muted text-[10px] uppercase block">Cart Item</span>
                  <span className="text-main font-semibold text-sm">Boutique Lakeview Suite</span>
                </div>
                <div>
                  <span className="text-muted text-[10px] uppercase block">Checkout Amount</span>
                  <span className="text-main font-bold text-sm">₹9,800</span>
                </div>
                <div>
                  <span className="text-muted text-[10px] uppercase block">Payment Rail</span>
                  <span className="text-mint font-semibold text-sm">UPI Autopay Rail</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-bright text-white font-semibold shadow-glow-violet transition-all text-xs"
                >
                  <span>Proceed: Verify Agent Authorization</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Verify Agent Identity & Scope */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-mint/15 text-mint">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-mint font-semibold">
                    Step 2 · Identity & Scope Verification
                  </div>
                  <h2 className="text-2xl font-bold text-main">Agent Identity & Scope Verified</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-3 text-xs">
                  <div className="font-semibold text-main flex items-center justify-between pb-2 border-b border-border">
                    <span>Agent Trust Profile</span>
                    <span className="text-mint font-mono font-bold">88 / 100 TRUST SCORE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Agent Name:</span>
                    <span className="font-mono text-main font-semibold">TravelMate-204</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Cryptographic Identity:</span>
                    <span className="text-mint font-mono">VERIFIED (Simulated mTLS signature)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Session Validity:</span>
                    <span className="text-main font-mono">Active (Expires in 18 hours)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Historical Success:</span>
                    <span className="text-main font-mono">142 completed / 1 violation</span>
                  </div>
                </div>

                <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-3 text-xs">
                  <div className="font-semibold text-main flex items-center justify-between pb-2 border-b border-border">
                    <span>Authorized Scope Checklist</span>
                    <span className="text-mint font-mono font-bold">WITHIN SCOPE</span>
                  </div>
                  <div className="flex items-center gap-2 text-main">
                    <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Category: <strong>Hotels & Travel</strong> (Authorized)</span>
                  </div>
                  <div className="flex items-center gap-2 text-main">
                    <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Amount: <strong>₹9,800</strong> (Within ₹12,000 ceiling)</span>
                  </div>
                  <div className="flex items-center gap-2 text-main">
                    <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>24h Velocity: <strong>₹9,800 / ₹30,000</strong> (Within budget)</span>
                  </div>
                  <div className="flex items-center gap-2 text-main">
                    <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                    <span>Blind Retry Allowed: <strong>False</strong> (Link recovery only)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-muted hover:text-main"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-bright text-white font-semibold shadow-glow-violet transition-all text-xs"
                >
                  <span>Simulate Payment Attempt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Fails */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber/15 text-amber">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-amber font-semibold">
                    Step 3 · Interruption Ingestion
                  </div>
                  <h2 className="text-2xl font-bold text-main">Payment Failed: Temporary UPI Timeout</h2>
                </div>
              </div>

              <div className="bg-amber/10 border border-amber/30 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Issuing Bank Gateway Timeout (Code: UPITimeout U30)</span>
                </div>
                <p className="text-muted leading-relaxed">
                  The issuing bank switch experienced a 30-second handshake timeout. A standard blind-retry system would immediately attempt the same transaction, risking customer account lockouts or duplicate charges.
                </p>
              </div>

              <div className="bg-surface-elevated p-4 rounded-xl border border-border text-xs font-mono">
                <div className="text-muted text-[10px] uppercase mb-1">RecoverAI Diagnostic Pipeline Triggered:</div>
                <div className="text-main">
                  Ingesting payload → Classifying root cause → Estimating intent → Checking duplicate charge risk...
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-muted hover:text-main"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-bright text-white font-semibold shadow-glow-violet transition-all text-xs"
                >
                  <span>Run Trust-Aware Recovery Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Safe Recovery Reasoning */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-mint/15 text-mint">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-mint font-semibold">
                    Step 4 · Safe Decision Selection
                  </div>
                  <h2 className="text-2xl font-bold text-main">
                    Wait 10 Minutes, Then Send Alternate UPI Link
                  </h2>
                </div>
              </div>

              {/* Confidence Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-surface-elevated p-3 rounded-xl border border-border">
                  <span className="text-[10px] font-mono text-muted uppercase block">Customer Intent</span>
                  <span className="text-xl font-bold font-mono text-mint">91%</span>
                </div>
                <div className="bg-surface-elevated p-3 rounded-xl border border-border">
                  <span className="text-[10px] font-mono text-muted uppercase block">Agent Trust</span>
                  <span className="text-xl font-bold font-mono text-main">88/100</span>
                </div>
                <div className="bg-surface-elevated p-3 rounded-xl border border-border">
                  <span className="text-[10px] font-mono text-muted uppercase block">Duplicate Risk</span>
                  <span className="text-xl font-bold font-mono text-mint">4%</span>
                </div>
                <div className="bg-surface-elevated p-3 rounded-xl border border-border">
                  <span className="text-[10px] font-mono text-muted uppercase block">Decision Confidence</span>
                  <span className="text-xl font-bold font-mono text-primary-bright">93%</span>
                </div>
              </div>

              {/* Explainable Rationale */}
              <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2 text-xs">
                <div className="font-semibold text-main">Why This Decision?</div>
                <p className="text-muted leading-relaxed">
                  TravelMate-204 is a verified agent with a high trust score (88/100). The failure is diagnosed as transient bank UPI gateway congestion. No debit occurred. RecoverAI introduces a 10-minute cooldown buffer and prepares an alternate UPI link rather than hammering the failing bank rail.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-primary/30 space-y-2">
                <span className="text-[10px] font-mono text-primary-bright uppercase font-semibold block">
                  Customer Communication Draft (WhatsApp)
                </span>
                <p className="text-xs text-main font-sans italic bg-surface-elevated p-3 rounded-lg border border-border">
                  "Hi Customer T-204, your hotel booking payment of ₹9,800 via TravelMate-204 timed out at your bank. Your room is safely reserved for 20 minutes. Pay safely via alternate UPI or Card: https://pay.acme.demo/r/rec-10482. We will not charge you twice."
                </p>
              </div>

              {/* Dual Agentic Commerce Pathways */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-main flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-bright" />
                    Select Demo Outcome to Present:
                  </span>
                  <span className="text-[10px] font-mono text-muted">Two Distinct Outcomes Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* FLOW A: Successful Safe Recovery */}
                  <button
                    type="button"
                    onClick={handleCompleteSafeRecovery}
                    className="text-left p-5 rounded-2xl bg-mint/10 hover:bg-mint/20 border-2 border-mint/40 hover:border-mint transition-all shadow-glow-mint group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-mint flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Flow A: Safe Recovery
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mint/20 text-mint font-bold border border-mint/40">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        Customer pays via alternate UPI link. Zero retries on failing bank rail, 0 duplicate charges. Recovered revenue becomes ₹9,800.
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-mint/20 text-xs font-bold text-mint">
                      <span>Simulate customer paid (Complete safe recovery)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* FLOW B: Intent Drift & Scope Overrun */}
                  <button
                    type="button"
                    onClick={handleStep5Drift}
                    className="text-left p-5 rounded-2xl bg-coral/10 hover:bg-coral/20 border-2 border-coral/40 hover:border-coral transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-coral flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4" />
                          Flow B: Agent Intent Drift
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral/20 text-coral font-bold border border-coral/40">
                          SAFEGUARD TEST
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        TravelMate-204 attempts an unauthorized room upgrade to ₹18,000 (+83.7%). Test Constitution block & human review gate.
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-coral/20 text-xs font-bold text-coral">
                      <span>Simulate Agent Attempting Intent Drift</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-muted hover:text-main"
                >
                  ← Back to Step 3
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Agent Attempts Intent Drift (₹18,000 Overrun) */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-coral/15 border border-coral text-coral flex items-center gap-3">
                <AlertOctagon className="w-8 h-8 flex-shrink-0" />
                <div>
                  <div className="font-mono text-xs font-bold tracking-widest uppercase">
                    CRITICAL SAFEGUARD TRIGGERED
                  </div>
                  <h3 className="text-lg font-extrabold text-coral">AGENT CHECKOUT BLOCKED</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2.5">
                  <div className="text-muted uppercase text-[10px]">Autonomous Drift Parameters:</div>
                  <div className="flex justify-between">
                    <span className="text-muted">Agent ID:</span>
                    <span className="text-main font-bold">TravelMate-204</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Original Authorized Amount:</span>
                    <span className="text-main">₹9,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">New Requested Amount:</span>
                    <span className="text-coral font-bold text-sm">₹18,000 (+83.7%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Max Authorized Limit:</span>
                    <span className="text-main">₹12,000</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-coral font-bold">Amount Over Limit:</span>
                    <span className="text-coral font-bold">₹6,000 OVERRUN</span>
                  </div>
                </div>

                <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2.5">
                  <div className="text-muted uppercase text-[10px]">Constitution Enforcement:</div>
                  <div className="flex items-start gap-2 text-coral">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Requested amount ₹18,000 exceeds maximum authorized agent limit of ₹12,000.</span>
                  </div>
                  <div className="flex items-start gap-2 text-coral">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Cart variance (+83.7%) exceeds 15% allowed deviation policy.</span>
                  </div>
                  <div className="flex items-start gap-2 text-amber">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Autonomous debit strictly prohibited. Mandating human operator review.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border text-xs text-muted leading-relaxed">
                <strong className="text-main">Why RecoverAI stopped this:</strong> A naive agentic payment tool would simply execute the new ₹18,000 transaction. RecoverAI enforces merchant policy boundaries and protects customer trust by halting unauthorized checkout scope expansion.
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-bright text-white font-semibold shadow-glow-violet transition-all text-xs"
                >
                  <span>Open Human Operator Decision Gate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Human Decision Gate */}
          {currentStep === 6 && !generatedReceipt && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/15 text-primary-bright">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-primary-bright font-semibold">
                    Step 6 · Human-in-the-Loop Review
                  </div>
                  <h2 className="text-2xl font-bold text-main">Operator Review: Choose Action</h2>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                As the operations manager (Alex Morgan), select how to resolve this agent scope overrun:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleHumanAction('rejected')}
                  className="text-left p-4 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border hover:border-mint/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-main group-hover:text-mint transition-colors">
                      Reject Scope Overrun (Recommended)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mint/15 text-mint border border-mint/30">
                      SAFE
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Reject the ₹18,000 suite upgrade. Dispatch recovery link for the authorized ₹9,800 room.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleHumanAction('approved')}
                  className="text-left p-4 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-main group-hover:text-primary-bright transition-colors">
                      Approve Once (Exception)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary-bright border border-primary/30">
                      VIP OVERRIDE
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Grant a one-time operator override permitting the ₹18,000 Presidential Suite upgrade.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleHumanAction('paused')}
                  className="text-left p-4 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border hover:border-amber/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-amber">
                      Pause Agent
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber/15 text-amber border border-amber/30">
                      SUSPEND
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Temporarily pause TravelMate-204 from executing autonomous checkouts pending audit.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleHumanAction('revoked')}
                  className="text-left p-4 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border hover:border-coral/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-coral">
                      Revoke Authorization
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral/15 text-coral border border-coral/30">
                      PERMANENT
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Permanently revoke TravelMate-204 credentials and invalidate session token.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Action Receipt & Outcome Summary */}
          {generatedReceipt && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-mint/15 text-mint">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-mint font-semibold">
                      Step 7 · Mission Completed
                    </div>
                    <h2 className="text-2xl font-bold text-main">Agent Action Receipt Generated</h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-main transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Inspect Receipt JSON</span>
                </button>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-surface-elevated border border-border rounded-xl p-5 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Receipt Identifier</span>
                    <span className="text-main font-bold">{generatedReceipt.receiptId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted text-[10px] uppercase block">Outcome</span>
                    <span className={`font-bold ${generatedReceipt.recoveredAmount > 0 ? 'text-mint' : 'text-coral'}`}>
                      {generatedReceipt.outcomeDisplay || (generatedReceipt.finalOutcome === 'RECOVERED_SUCCESSFULLY' ? 'RECOVERED' : generatedReceipt.finalOutcome)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs">
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Original Payment Amount</span>
                    <span className="text-main font-bold text-base">₹{generatedReceipt.originalPaymentAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Recovered Revenue</span>
                    <span className="text-mint font-bold text-base">₹{generatedReceipt.recoveredAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Payment Status</span>
                    <span className="text-mint font-bold text-base font-mono">{generatedReceipt.paymentStatus || (generatedReceipt.finalOutcome === 'RECOVERED_SUCCESSFULLY' ? 'CAPTURE_SIMULATED' : 'BLOCKED')}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Recovery Action</span>
                    <span className="text-primary-bright font-bold text-base">{generatedReceipt.recoveryAction || 'Alternate UPI link'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs border-t border-border/60">
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Duplicate Charge Risk</span>
                    <span className="text-mint font-bold text-base">{generatedReceipt.duplicateChargeRisk}%</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Retries Avoided</span>
                    <span className="text-main font-bold text-base">{generatedReceipt.retriesAvoided}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Customer Messages Sent</span>
                    <span className="text-main font-bold text-base">{generatedReceipt.customerCommunicationCount || 1}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase block">Decision Confidence</span>
                    <span className="text-primary-bright font-bold text-base">{generatedReceipt.decisionConfidence}%</span>
                  </div>
                </div>

                <div className="p-3 bg-surface rounded-lg border border-border/60 space-y-1.5 font-sans text-xs">
                  <div className="font-semibold text-main">Executive Summary for Hackathon Presentation:</div>
                  <p className="text-muted leading-relaxed">
                    “TravelMate-204 was authorized to book a hotel up to ₹12,000. It initiated a ₹9,800 UPI checkout. The payment timed out. RecoverAI verified the agent, confirmed scope, verified duplicate debit risk (4%), and prepared a safe alternate link. When the agent attempted to increase the cart to ₹18,000, RecoverAI blocked the transaction and mandated human operator sign-off. This demonstrates both growth and trust: RecoverAI helps safe purchases complete while stopping unsafe autonomous actions.”
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={resetGuidedDemo}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-muted hover:text-main rounded-xl hover:bg-surface-elevated transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Demo</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/app/agent-checkout')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-main font-semibold text-xs transition-colors"
                  >
                    <span>View Agent Checkout Stream</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/app/overview')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-bright text-white font-semibold text-xs shadow-glow-violet transition-all"
                  >
                    <span>Go to Command Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Receipt Modal */}
      <AgentActionReceiptModal
        isOpen={showReceiptModal}
        receipt={generatedReceipt}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};
