import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Bot,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Sliders,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Plus,
  Lock,
  Calendar,
} from 'lucide-react';
import { AgentTrustProfile } from '../types';

export const AgentsPage: React.FC = () => {
  const { agents, updateAgent, showToast } = useRecovery();
  const [selectedAgent, setSelectedAgent] = useState<AgentTrustProfile | null>(null);

  // Edit form state
  const [maxTxAmount, setMaxTxAmount] = useState<number>(12000);
  const [dailyLimit, setDailyLimit] = useState<number>(30000);
  const [canRetry, setCanRetry] = useState<boolean>(false);

  const openEditDrawer = (agent: AgentTrustProfile) => {
    setSelectedAgent(agent);
    setMaxTxAmount(agent.maxTransactionAmount);
    setDailyLimit(agent.dailySpendLimit);
    setCanRetry(agent.canRetryPayment);
  };

  const handleSaveControls = () => {
    if (!selectedAgent) return;
    updateAgent(selectedAgent.agentId, {
      maxTransactionAmount: maxTxAmount,
      dailySpendLimit: dailyLimit,
      canRetryPayment: canRetry,
    });
    setSelectedAgent(null);
    showToast(`Updated controls for ${selectedAgent.agentName}`);
  };

  const togglePause = (agent: AgentTrustProfile) => {
    const nextStatus = agent.status === 'paused' ? 'active' : 'paused';
    updateAgent(agent.agentId, { status: nextStatus });
    showToast(`Agent ${agent.agentName} ${nextStatus === 'paused' ? 'paused' : 'resumed'}.`);
  };

  const revokeAgent = (agent: AgentTrustProfile) => {
    updateAgent(agent.agentId, { status: 'revoked' });
    showToast(`Agent ${agent.agentName} authorization permanently REVOKED.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              AI Agent Registry & Trust Controls
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              4 CONNECTED AGENTS
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Manage registered autonomous shopping, travel, and procurement agents with fine-grained spending and category boundaries.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const isPaused = agent.status === 'paused';
          const isRevoked = agent.status === 'revoked';

          return (
            <div
              key={agent.agentId}
              className={`bg-surface border rounded-2xl p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between ${
                isRevoked
                  ? 'border-coral/40 opacity-70'
                  : isPaused
                  ? 'border-amber/40 bg-amber/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/80 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary-bright flex items-center justify-center font-bold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-main">{agent.agentName}</h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                            agent.status === 'active'
                              ? 'bg-mint/15 text-mint border-mint/30'
                              : agent.status === 'paused'
                              ? 'bg-amber/15 text-amber border-amber/30'
                              : 'bg-coral/15 text-coral border-coral/30'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">{agent.agentType}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-muted uppercase block">Trust Score</span>
                    <span
                      className={`text-lg font-bold font-mono ${
                        agent.trustScore >= 85
                          ? 'text-mint'
                          : agent.trustScore >= 70
                          ? 'text-primary-bright'
                          : 'text-amber'
                      }`}
                    >
                      {agent.trustScore} / 100
                    </span>
                  </div>
                </div>

                {/* Parameters & Scope */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
                  <div className="bg-surface-elevated p-2.5 rounded-xl border border-border/60">
                    <span className="text-muted text-[10px] uppercase block">Max Transaction</span>
                    <span className="text-main font-bold">₹{agent.maxTransactionAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-surface-elevated p-2.5 rounded-xl border border-border/60">
                    <span className="text-muted text-[10px] uppercase block">Daily Spend Limit</span>
                    <span className="text-main font-bold">₹{agent.dailySpendLimit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-surface-elevated p-2.5 rounded-xl border border-border/60 col-span-2">
                    <span className="text-muted text-[10px] uppercase block">Permitted Categories</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.allowedCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-surface border border-border text-main text-[11px]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-muted mb-4 font-sans">
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Identity Signature:</span>
                    <span className="text-mint font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {agent.verifiedIdentity ? 'Verified (mTLS)' : 'Unverified Self-Hosted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Historical Record:</span>
                    <span className="text-main font-mono">
                      {agent.successfulTransactions} successful · {agent.policyViolations} violations
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePause(agent)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-main transition-colors"
                  >
                    {agent.status === 'paused' ? (
                      <>
                        <Play className="w-3.5 h-3.5 text-mint" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>

                  {agent.status !== 'revoked' && (
                    <button
                      type="button"
                      onClick={() => revokeAgent(agent)}
                      className="px-2.5 py-1 rounded-lg hover:bg-coral/10 text-coral transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openEditDrawer(agent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary-bright font-semibold transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Limits</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Controls Modal / Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-bright" />
                <h3 className="text-base font-bold text-main">Configure {selectedAgent.agentName}</h3>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-muted hover:text-main text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted font-medium mb-1">
                  Maximum Transaction Amount (₹)
                </label>
                <input
                  type="number"
                  value={maxTxAmount}
                  onChange={(e) => setMaxTxAmount(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-main font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">
                  Daily 24h Spend Limit (₹)
                </label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-main font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border">
                <div>
                  <div className="font-semibold text-main">Direct Payment Retry</div>
                  <div className="text-[11px] text-muted">Allow agent to re-attempt card or UPI directly without safe link</div>
                </div>
                <input
                  type="checkbox"
                  checked={canRetry}
                  onChange={(e) => setCanRetry(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 text-xs text-muted hover:text-main"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveControls}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white font-semibold text-xs shadow-glow-violet transition-all"
              >
                Save Agent Controls
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
