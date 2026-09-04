import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import { MetricCard } from '../components/MetricCard';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Bot,
  Layers,
  Activity,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PaymentCase } from '../types';

interface OverviewPageProps {
  onNavigate: (path: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { cases, analytics, activityStream, approveAction, markRecovered } = useRecovery();
  const [chartMode, setChartMode] = useState<'revenue' | 'cases'>('revenue');

  const pendingApprovals = cases.filter((c) => c.status === 'escalated' || (c.status === 'blocked' && c.failureType === 'agent_scope_exceeded'));
  const activeOpportunities = cases.filter((c) => c.status === 'action_ready' || c.status === 'in_progress' || c.status === 'escalated').slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Overview Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">Recovery Command Center</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              LIVE STREAM ACTIVE
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Monitor failed payments, agentic checkout decisions, duplicate safeguards, and recovered revenue in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/demo')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-bright text-white text-xs font-bold shadow-glow-violet transition-all w-fit"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch 5-Step Presentation Demo</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          label="Recoverable Revenue"
          value={`₹${analytics.recoverableRevenue.toLocaleString('en-IN')}`}
          change="+12.4%"
          isPositive={true}
          tooltip="Total value of interrupted checkouts diagnosed as recoverable within the selected period."
          variant="violet"
        />
        <MetricCard
          label="Recovered Revenue"
          value={`₹${analytics.recoveredRevenue.toLocaleString('en-IN')}`}
          change="+18.2%"
          isPositive={true}
          tooltip="Successfully captured revenue via RecoverAI safe links and agentic recovery actions."
          variant="mint"
        />
        <MetricCard
          label="Agent Conversion"
          value={`${analytics.agentCheckoutConversion}%`}
          change="+6.8%"
          isPositive={true}
          tooltip="Conversion rate of checkouts initiated by autonomous shopping and procurement agents."
          variant="mint"
        />
        <MetricCard
          label="Recovery Rate"
          value={`${analytics.recoveryRate}%`}
          change="+4.1%"
          isPositive={true}
          tooltip="Percentage of recoverable payment interruptions safely completed without friction."
          variant="default"
        />
        <MetricCard
          label="Duplicate Risks Blocked"
          value={`${analytics.trustIncidentsPrevented}`}
          change="+8 prevented"
          isPositive={true}
          tooltip="Instances where potential double-charges or asynchronous webhook duplicates were halted."
          variant="amber"
        />
        <MetricCard
          label="Out-of-Scope Blocked"
          value={`₹${analytics.outOfScopeBlockedAmount.toLocaleString('en-IN')}`}
          change="100% safeguarded"
          isPositive={true}
          tooltip="Unauthorized cart increases and category deviations blocked across autonomous agents."
          variant="coral"
        />
      </div>

      {/* Critical Authorization Alerts (if any pending) */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber/10 border border-amber/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber/20 text-amber">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber flex items-center gap-2">
                Human Operator Action Required ({pendingApprovals.length} case(s))
              </div>
              <div className="text-xs text-muted mt-0.5">
                Cases exceeding high-value ceilings (₹25,000) or agent authorization limits require operator review.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/app/cases')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber text-black font-semibold text-xs hover:bg-amber-light transition-colors whitespace-nowrap"
          >
            <span>Review Escalations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Middle Section: Chart & Live Agent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Funnel / Recovery Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h3 className="text-sm font-bold text-main">Recovery Pipeline & Funnel Health</h3>
              <p className="text-xs text-muted">End-to-end conversion from payment failure to captured revenue.</p>
            </div>
            <div className="flex items-center bg-surface-elevated border border-border rounded-lg p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setChartMode('revenue')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  chartMode === 'revenue' ? 'bg-surface text-main font-semibold' : 'text-muted'
                }`}
              >
                Revenue (₹)
              </button>
              <button
                type="button"
                onClick={() => setChartMode('cases')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  chartMode === 'cases' ? 'bg-surface text-main font-semibold' : 'text-muted'
                }`}
              >
                Cases Count
              </button>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-3 py-2">
            {[
              { label: '1. Failed Ingestions', count: 48, revenue: 496500, pct: 100, color: 'bg-primary-bright' },
              { label: '2. Recoverable Opportunities', count: 32, revenue: 310000, pct: 62.4, color: 'bg-primary' },
              { label: '3. Trust-Aware Actions Dispatched', count: 28, revenue: 268000, pct: 54.0, color: 'bg-primary-dark' },
              { label: '4. Successfully Captured Revenue', count: 19, revenue: 186500, pct: 37.5, color: 'bg-mint' },
              { label: '5. Safeguarded / Blocked by Safety', count: 9, revenue: 84000, pct: 16.9, color: 'bg-amber' },
            ].map((stage, idx) => {
              const displayVal = chartMode === 'revenue' ? `₹${stage.revenue.toLocaleString('en-IN')}` : `${stage.count} cases`;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted font-sans text-xs font-medium">{stage.label}</span>
                    <span className="text-main font-bold">{displayVal}</span>
                  </div>
                  <div className="w-full bg-surface-elevated h-3 rounded-full overflow-hidden p-0.5 border border-border/60">
                    <div
                      className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${stage.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted font-mono">
            <span>Overall Conversion Efficiency: 60.2%</span>
            <span className="text-mint font-semibold">Zero Rail Fatigue</span>
          </div>
        </div>

        {/* Live Agent Activity Feed */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-bright" />
              <h3 className="text-sm font-bold text-main">Live Agent Activity</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/app/live-agent')}
              className="text-xs text-primary-bright hover:underline"
            >
              View Stream →
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
            {activityStream.slice(0, 5).map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigate(`/app/cases/${evt.caseId}`)}
                className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border/60 transition-colors cursor-pointer text-xs space-y-1 group"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-main group-hover:text-primary-bright transition-colors line-clamp-1">
                    {evt.title}
                  </span>
                  <span className="text-[10px] text-muted font-mono whitespace-nowrap">{evt.timestamp}</span>
                </div>
                <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">{evt.details}</p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                  <span className="text-primary-bright font-bold">{evt.caseId}</span>
                  {evt.amount && <span>· ₹{evt.amount.toLocaleString('en-IN')}</span>}
                  {evt.agentName && <span className="text-mint">· {evt.agentName}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/60 text-[11px] text-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-mint animate-ping" />
              Deterministic Engine Running
            </span>
            <button
              type="button"
              onClick={() => onNavigate('/app/live-agent')}
              className="font-mono text-primary-bright"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>

      {/* Recovery Opportunities Table */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          <div>
            <h3 className="text-base font-bold text-main">Active Recovery Opportunities</h3>
            <p className="text-xs text-muted">High-intent interrupted checkouts prioritized by recoverability score.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/app/cases')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-main font-semibold transition-colors w-fit"
          >
            <span>View All {cases.length} Cases</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-border/80 text-muted font-mono text-[11px] uppercase">
                <th className="pb-3 font-semibold">Case ID</th>
                <th className="pb-3 font-semibold">Customer / Agent</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Failure Diagnosis</th>
                <th className="pb-3 font-semibold">Intent</th>
                <th className="pb-3 font-semibold">Duplicate Risk</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {activeOpportunities.map((c) => {
                const statusStyles: Record<string, string> = {
                  action_ready: 'bg-primary/15 text-primary-bright border-primary/30',
                  in_progress: 'bg-mint/15 text-mint border-mint/30',
                  escalated: 'bg-amber/15 text-amber border-amber/30',
                  blocked: 'bg-coral/15 text-coral border-coral/30',
                  recovered: 'bg-mint/20 text-mint font-bold border-mint/40',
                };

                return (
                  <tr key={c.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-primary-bright">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/app/cases/${c.id}`)}
                        className="hover:underline flex items-center gap-1"
                      >
                        {c.id}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </button>
                    </td>

                    <td className="py-3">
                      <div className="font-semibold text-main">{c.customerAlias}</div>
                      <div className="text-[10px] text-muted flex items-center gap-1">
                        {c.agentName ? (
                          <span className="text-primary-bright flex items-center gap-1 font-mono">
                            <Bot className="w-3 h-3" />
                            {c.agentName}
                          </span>
                        ) : (
                          'Direct Checkout'
                        )}
                        <span>· {c.paymentMethod}</span>
                      </div>
                    </td>

                    <td className="py-3 font-mono font-bold text-main">
                      ₹{c.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3">
                      <span className="text-main font-medium capitalize">
                        {c.failureType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 font-mono">
                      <span className={c.decision.customerIntent > 75 ? 'text-mint font-bold' : 'text-amber'}>
                        {c.decision.customerIntent}%
                      </span>
                    </td>

                    <td className="py-3 font-mono">
                      <span
                        className={
                          c.decision.duplicateChargeRisk < 10
                            ? 'text-mint'
                            : c.decision.duplicateChargeRisk < 20
                            ? 'text-amber font-bold'
                            : 'text-coral font-bold'
                        }
                      >
                        {c.decision.duplicateChargeRisk}%
                      </span>
                    </td>

                    <td className="py-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                          statusStyles[c.status] || 'bg-surface-elevated text-muted border-border'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      {c.status === 'action_ready' && (
                        <button
                          type="button"
                          onClick={() => approveAction(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-bright text-white text-[11px] font-semibold transition-colors"
                        >
                          Dispatch Link
                        </button>
                      )}
                      {c.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => markRecovered(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-mint/20 hover:bg-mint/30 text-mint border border-mint/40 text-[11px] font-semibold transition-colors"
                        >
                          Simulate Pay
                        </button>
                      )}
                      {c.status === 'escalated' && (
                        <button
                          type="button"
                          onClick={() => onNavigate(`/app/cases/${c.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-amber text-black text-[11px] font-semibold hover:bg-amber-light transition-colors"
                        >
                          Review
                        </button>
                      )}
                      {c.status === 'blocked' && (
                        <span className="text-[11px] text-coral font-mono">Halted</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
