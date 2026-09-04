import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Activity,
  Zap,
  Bot,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PipelineStageBar } from '../components/PipelineStageBar';

interface LiveAgentPageProps {
  onNavigate: (path: string) => void;
}

export const LiveAgentPage: React.FC<LiveAgentPageProps> = ({ onNavigate }) => {
  const { activityStream, simulateEvent } = useRecovery();
  const [activeTab, setActiveTab] = useState<'all' | 'agent' | 'safety'>('all');

  const filteredStream = activityStream.filter((item) => {
    if (activeTab === 'agent') return !!item.agentName;
    if (activeTab === 'safety') return item.severity === 'critical' || item.severity === 'warning';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Live Agent Activity Stream
            </h2>
            <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-ping" />
              LIVE REASONING ACTIVE
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Watch RecoverAI diagnose payment interruptions, evaluate customer intent, check duplicate-charge risks, and enforce agent scope in real time.
          </p>
        </div>
      </div>

      {/* Real-time 8-stage Pipeline Visualizer */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-primary-bright uppercase">
            Real-Time Agentic Pipeline Lifecycle
          </span>
          <span className="text-[10px] text-muted font-mono">Continuous Stream Ingestion</span>
        </div>
        <PipelineStageBar currentStage="decide" status="normal" />
      </div>

      {/* Quick Simulation Action Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-main flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-bright" />
            Trigger Live Simulation Scenarios
          </span>
          <span className="text-[10px] text-muted font-mono">1-Click Live Test</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          <button
            type="button"
            onClick={() => simulateEvent('upi_timeout')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left hover:border-mint/50 transition-all group"
          >
            <div className="font-semibold text-main group-hover:text-mint transition-colors">
              UPI Timeout (₹4,999)
            </div>
            <div className="text-[10px] text-muted">10m Cooldown Link</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('agent_amount_increase')}
            className="p-2.5 rounded-xl bg-coral/10 hover:bg-coral/20 border border-coral/30 text-left transition-all"
          >
            <div className="font-semibold text-coral">Agent Drift (₹18,000)</div>
            <div className="text-[10px] text-muted">Scope Overrun Blocked</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('duplicate_debit')}
            className="p-2.5 rounded-xl bg-amber/10 hover:bg-amber/20 border border-amber/30 text-left transition-all"
          >
            <div className="font-semibold text-amber">Duplicate Debit Signal</div>
            <div className="text-[10px] text-muted">Retry Blocked</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('card_expired')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left hover:border-primary/50 transition-all group"
          >
            <div className="font-semibold text-main group-hover:text-primary-bright transition-colors">
              Expired Card (₹12,500)
            </div>
            <div className="text-[10px] text-muted">Tokenization Link</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('bank_outage')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left hover:border-amber/50 transition-all"
          >
            <div className="font-semibold text-main">Bank Core Outage</div>
            <div className="text-[10px] text-muted">Recovery Paused</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('webhook_delay')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left hover:border-amber/50 transition-all"
          >
            <div className="font-semibold text-main">Delayed Webhook</div>
            <div className="text-[10px] text-muted">Status Reconciliation</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('high_value_failure')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left hover:border-primary/50 transition-all"
          >
            <div className="font-semibold text-main">VIP Cart (₹42,000)</div>
            <div className="text-[10px] text-muted">Human Escalation</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('customer_abandoned')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left hover:border-mint/50 transition-all"
          >
            <div className="font-semibold text-main">Abandoned Cart</div>
            <div className="text-[10px] text-muted">1 Contextual Reminder</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('customer_paid')}
            className="p-2.5 rounded-xl bg-mint/15 hover:bg-mint/25 border border-mint/40 text-left transition-all"
          >
            <div className="font-semibold text-mint">Customer Paid</div>
            <div className="text-[10px] text-muted">Capture & Issue Receipt</div>
          </button>

          <button
            type="button"
            onClick={() => simulateEvent('customer_ignored')}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-left text-muted"
          >
            <div className="font-semibold text-main">Customer Ignored</div>
            <div className="text-[10px] text-muted">Expire Reservation</div>
          </button>
        </div>
      </div>

      {/* Stream Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              activeTab === 'all'
                ? 'bg-primary/20 border-primary text-primary-bright font-bold'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            All Activity ({activityStream.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agent')}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              activeTab === 'agent'
                ? 'bg-primary/20 border-primary text-primary-bright font-bold'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            Agentic Checkouts Only
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              activeTab === 'safety'
                ? 'bg-primary/20 border-primary text-primary-bright font-bold'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            Safeguard Blocks & Flags
          </button>
        </div>

        <span className="text-[11px] font-mono text-muted">
          Showing {filteredStream.length} real-time events
        </span>
      </div>

      {/* Live Event Stream Feed */}
      <div className="space-y-3">
        {filteredStream.map((item) => {
          const badgeStyles: Record<string, string> = {
            critical: 'bg-coral/15 text-coral border-coral/30',
            warning: 'bg-amber/15 text-amber border-amber/30',
            success: 'bg-mint/15 text-mint border-mint/30',
            info: 'bg-primary/15 text-primary-bright border-primary/30',
          };

          return (
            <div
              key={item.id}
              onClick={() => onNavigate(`/app/cases/${item.caseId}`)}
              className="bg-surface border border-border hover:border-border-light rounded-2xl p-4 sm:p-5 shadow-card transition-all cursor-pointer group space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary-bright">
                    {item.caseId}
                  </span>
                  <span className="text-xs text-muted">·</span>
                  <span className="text-xs font-semibold text-main group-hover:text-primary-bright transition-colors">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                        badgeStyles[item.severity]
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  {item.amount && <span className="text-main font-bold">₹{item.amount.toLocaleString('en-IN')}</span>}
                  <span className="text-muted text-[10px]">{item.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans">{item.details}</p>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted">
                <div className="flex items-center gap-3">
                  <span>Customer: <strong className="text-main">{item.customerAlias}</strong></span>
                  {item.agentName && (
                    <span className="text-mint flex items-center gap-1 font-semibold">
                      <Bot className="w-3 h-3" />
                      {item.agentName}
                    </span>
                  )}
                  {item.confidence && <span>Confidence: {item.confidence}%</span>}
                </div>

                <span className="text-primary-bright flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect Reasoning →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
