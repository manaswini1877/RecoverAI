import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Bot,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  UserCheck,
  RotateCcw,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { PipelineStageBar } from '../components/PipelineStageBar';
import { MetricCard } from '../components/MetricCard';

interface AgentCheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const AgentCheckoutPage: React.FC<AgentCheckoutPageProps> = ({ onNavigate }) => {
  const { cases, agents, approveAction, rejectAction, pauseAction, showToast, simulateEvent } = useRecovery();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');

  const agentCases = cases.filter((c) => c.initiatedBy !== 'human');
  const filteredCases =
    selectedAgentId === 'all' ? agentCases : agentCases.filter((c) => c.agentId === selectedAgentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Agentic Checkout Monitoring
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary-bright border border-primary/30">
              TRUST ORCHESTRATION LAYER
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Real-time identity verification, authorization scope enforcement, and intent-drift gating for AI shopping agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => simulateEvent('agent_amount_increase')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-coral/20 hover:bg-coral/30 border border-coral/40 text-coral text-xs font-semibold transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Simulate Scope Overrun</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/demo')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-bold shadow-glow-violet transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided Agent Demo</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Active Agent Sessions"
          value="4 Registered"
          badge="mTLS Active"
          tooltip="Registered autonomous shopping and procurement agents authorized on this merchant workspace."
          variant="violet"
          icon={<Bot className="w-4 h-4 text-primary-bright" />}
        />
        <MetricCard
          label="Scope Overruns Blocked"
          value={`₹${cases.filter((c) => c.failureType === 'agent_scope_exceeded').reduce((acc, c) => acc + (c.requestedAmount || c.amount) - (c.originalAuthorizedAmount || 0), 42000).toLocaleString('en-IN')}`}
          change="100% safeguarded"
          isPositive={true}
          tooltip="Cart value increases exceeding the merchant authorization boundary halted before charge."
          variant="coral"
          icon={<AlertOctagon className="w-4 h-4 text-coral" />}
        />
        <MetricCard
          label="Agent Conversion Rate"
          value="78.4%"
          change="+6.8% vs direct"
          isPositive={true}
          tooltip="Percentage of valid agent-initiated transactions completing successfully."
          variant="mint"
          icon={<TrendingUp className="w-4 h-4 text-mint" />}
        />
        <MetricCard
          label="Mean Trust Score"
          value="81 / 100"
          badge="High Integrity"
          tooltip="Average dynamic trust score across all connected autonomous agents."
          variant="mint"
          icon={<ShieldCheck className="w-4 h-4 text-mint" />}
        />
      </div>

      {/* Pipeline Stage Visualizer */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-primary-bright uppercase">
            Autonomous Checkout Trust Pipeline
          </span>
          <span className="text-[11px] text-muted font-mono">Zero Blind-Retries · Strict Scope</span>
        </div>
        <PipelineStageBar currentStage="verify_scope" status="normal" />
      </div>

      {/* Agent Filter Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted font-mono text-[11px] uppercase mr-1">Filter Agent:</span>
        <button
          type="button"
          onClick={() => setSelectedAgentId('all')}
          className={`px-3 py-1.5 rounded-xl border transition-colors ${
            selectedAgentId === 'all'
              ? 'bg-primary/20 border-primary text-primary-bright font-bold'
              : 'bg-surface-elevated border-border text-muted hover:text-main'
          }`}
        >
          All Agents ({agentCases.length})
        </button>
        {agents.map((agent) => (
          <button
            key={agent.agentId}
            type="button"
            onClick={() => setSelectedAgentId(agent.agentId)}
            className={`px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
              selectedAgentId === agent.agentId
                ? 'bg-primary/20 border-primary text-primary-bright font-bold'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{agent.agentName}</span>
            <span className="text-[10px] font-mono text-muted">({agent.trustScore})</span>
          </button>
        ))}
      </div>

      {/* Live Agent Transactions & Scope Deviations */}
      <div className="space-y-4">
        {filteredCases.map((caseItem) => {
          const isOverrun = caseItem.failureType === 'agent_scope_exceeded';
          const originalAmt = caseItem.originalAuthorizedAmount || caseItem.amount;
          const requestedAmt = caseItem.requestedAmount || caseItem.amount;
          const deviationPct = originalAmt > 0 ? ((requestedAmt - originalAmt) / originalAmt) * 100 : 0;

          return (
            <div
              key={caseItem.id}
              className={`bg-surface border rounded-2xl p-5 sm:p-6 shadow-card transition-all ${
                isOverrun ? 'border-coral/50 bg-coral/5 shadow-glow-coral' : 'border-border'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isOverrun ? 'bg-coral/20 text-coral' : 'bg-primary/15 text-primary-bright'
                    }`}
                  >
                    {isOverrun ? <AlertOctagon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-main">
                        {caseItem.agentName || 'Autonomous Agent'}
                      </h3>
                      <span className="text-xs font-mono font-bold text-primary-bright">
                        {caseItem.id}
                      </span>
                      {isOverrun && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-coral/20 text-coral border border-coral/30 animate-pulse">
                          SCOPE OVERRUN BLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Customer: <strong className="text-main">{caseItem.customerAlias}</strong> · Order: {caseItem.orderId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-muted">Requested Amount</div>
                    <div className="text-lg font-bold font-mono text-main">
                      ₹{requestedAmt.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Intent & Scope Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs font-mono">
                <div className="bg-surface-elevated p-3 rounded-xl border border-border/80">
                  <span className="text-muted text-[10px] uppercase block">Agent Declared Intent</span>
                  <span className="text-main font-sans text-xs mt-0.5 block line-clamp-2">
                    {caseItem.agentIntent || 'Autonomous shopping checkout'}
                  </span>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-border/80">
                  <span className="text-muted text-[10px] uppercase block">Authorized Category</span>
                  <div className="flex items-center gap-1.5 text-mint font-semibold mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{caseItem.category || 'Hotels & Travel'}</span>
                  </div>
                  <span className="text-[10px] text-muted">Ceiling: ₹12,000 / tx</span>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-border/80">
                  <span className="text-muted text-[10px] uppercase block">Cart Variance</span>
                  <div
                    className={`font-bold mt-0.5 ${
                      deviationPct > 15 ? 'text-coral' : 'text-mint'
                    }`}
                  >
                    {deviationPct > 0 ? `+${deviationPct.toFixed(1)}%` : '0.0% (Matched)'}
                  </div>
                  <span className="text-[10px] text-muted">
                    {deviationPct > 15 ? 'Exceeds 15% threshold' : 'Within tolerance limit'}
                  </span>
                </div>
              </div>

              {/* Rationale & Safety Diagnosis */}
              <div className="bg-surface-elevated/60 p-3.5 rounded-xl border border-border/60 text-xs mb-4 space-y-1">
                <div className="font-semibold text-main flex items-center justify-between">
                  <span>Trust Layer Diagnosis & Explanation:</span>
                  <span className="text-primary-bright font-mono text-[10px]">Confidence: {caseItem.decision.confidence}%</span>
                </div>
                <p className="text-muted leading-relaxed">{caseItem.decision.explanation}</p>
              </div>

              {/* Action Controls for Scope Overruns & Escalations */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="text-[11px] font-mono">Status:</span>
                  <span className="text-[11px] font-mono font-bold text-main uppercase">
                    {caseItem.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isOverrun && caseItem.status === 'blocked' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => rejectAction(caseItem.id)}
                        className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-main font-semibold transition-colors"
                      >
                        Reject Overrun (₹9,800 only)
                      </button>
                      <button
                        type="button"
                        onClick={() => approveAction(caseItem.id)}
                        className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-semibold shadow-glow-violet transition-all"
                      >
                        Approve ₹18,000 Once
                      </button>
                    </>
                  ) : caseItem.status === 'action_ready' ? (
                    <button
                      type="button"
                      onClick={() => approveAction(caseItem.id)}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-semibold shadow-glow-violet transition-all"
                    >
                      Dispatch Safe Link
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate(`/app/cases/${caseItem.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-main font-semibold transition-colors"
                    >
                      Inspect Full Case Detail →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
