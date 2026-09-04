import React from 'react';
import { useRecovery } from '../context/RecoveryContext';
import { MetricCard } from '../components/MetricCard';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Bot,
  PieChart,
  Activity,
  Lightbulb,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { analytics } = useRecovery();

  const failureDistribution = [
    { label: 'Temporary UPI Timeout', pct: 42, color: 'bg-primary-bright', amount: '₹1.30L' },
    { label: 'Expired Card Declines', pct: 22, color: 'bg-primary', amount: '₹68.2k' },
    { label: 'Insufficient Balance', pct: 16, color: 'bg-amber', amount: '₹49.6k' },
    { label: 'Delayed Webhook Latency', pct: 10, color: 'bg-coral', amount: '₹31.0k' },
    { label: 'Bank Switch Outage', pct: 6, color: 'bg-subtle', amount: '₹18.6k' },
    { label: 'Customer Abandoned', pct: 4, color: 'bg-mint', amount: '₹12.4k' },
  ];

  const paymentRailRecovery = [
    { method: 'UPI Rail', recovered: '₹1,08,200', rate: '68.4%', count: 24 },
    { method: 'Credit Card', recovered: '₹44,500', rate: '54.2%', count: 8 },
    { method: 'Debit Card', recovered: '₹21,800', rate: '48.0%', count: 5 },
    { method: 'NetBanking', recovered: '₹12,000', rate: '40.1%', count: 3 },
  ];

  const agentTypeConversion = [
    { type: 'QuickCommerce Replenishment (GroceryFlow)', rate: 94, color: 'bg-mint' },
    { type: 'Travel & Hospitality (TravelMate)', rate: 88, color: 'bg-primary-bright' },
    { type: 'B2B Enterprise Procurement (OfficeProcure)', rate: 79, color: 'bg-primary' },
    { type: 'Consumer Repeat Purchase (ReorderBot)', rate: 62, color: 'bg-amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Recovery & Agentic Analytics
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-muted">
              DEMO WORKSPACE DATA
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Deep insights into payment recovery rates, agent conversion efficiency, duplicate-charge prevention, and rail health.
          </p>
        </div>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Recovered Revenue"
          value={`₹${analytics.recoveredRevenue.toLocaleString('en-IN')}`}
          change="+18.2% MoM"
          isPositive={true}
          tooltip="Cumulative captured revenue from trust-aware recovery."
          variant="mint"
        />
        <MetricCard
          label="Agent Checkout Conversion"
          value="78.4%"
          change="+6.8% vs human"
          isPositive={true}
          tooltip="Conversion rate of checkouts initiated by autonomous agents."
          variant="violet"
        />
        <MetricCard
          label="Duplicate Debits Prevented"
          value={`${analytics.trustIncidentsPrevented}`}
          change="+8 this week"
          isPositive={true}
          tooltip="Double charges averted via 5-point verification."
          variant="amber"
        />
        <MetricCard
          label="Mean Recovery Time"
          value="8m 14s"
          change="-2m 04s faster"
          isPositive={true}
          tooltip="Average elapsed time from payment failure to captured recovery."
          variant="default"
        />
      </div>

      {/* Insight Cards (Deterministic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center gap-2 text-primary-bright font-bold text-xs">
            <Lightbulb className="w-4 h-4" />
            <span>Alternate Links Outperform Retries</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            UPI timeouts account for 42% of recoverable revenue. Alternate UPI links with a 10-minute cooldown outperform immediate blind retries by +18.4% while avoiding rail penalties.
          </p>
        </div>

        <div className="bg-mint/10 border border-mint/30 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center gap-2 text-mint font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorization Checks Guarded ₹42k</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Strict category and spend limit enforcement stopped ₹42,000 in unauthorized agent cart expansion (including TravelMate-204’s attempted ₹18,000 suite upgrade).
          </p>
        </div>

        <div className="bg-amber/10 border border-amber/30 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center gap-2 text-amber font-bold text-xs">
            <Clock className="w-4 h-4" />
            <span>Delayed Webhooks Reconciled</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Asynchronous NetBanking cases routed to auto-reconciliation before customer contact prevented 27 potential duplicate debit disputes this cycle.
          </p>
        </div>
      </div>

      {/* Grid of Analytical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Cause Breakdown */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-main">Payment Failure Cause Breakdown</h3>
            <span className="text-[10px] font-mono text-muted">100% of cases</span>
          </div>

          <div className="space-y-3">
            {failureDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-main font-sans">{item.label}</span>
                  <span className="text-muted font-bold">{item.pct}% ({item.amount})</span>
                </div>
                <div className="w-full bg-surface-elevated h-2.5 rounded-full overflow-hidden border border-border/60">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery by Payment Rail */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-main">Recovery by Payment Rail</h3>
            <span className="text-[10px] font-mono text-muted">Captured INR</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted font-mono text-[11px] uppercase">
                  <th className="pb-2.5 font-semibold">Payment Rail</th>
                  <th className="pb-2.5 font-semibold">Recovered</th>
                  <th className="pb-2.5 font-semibold">Success Rate</th>
                  <th className="pb-2.5 font-semibold text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {paymentRailRecovery.map((rail, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/40">
                    <td className="py-2.5 text-main font-sans font-medium">{rail.method}</td>
                    <td className="py-2.5 text-mint font-bold">{rail.recovered}</td>
                    <td className="py-2.5 text-main">{rail.rate}</td>
                    <td className="py-2.5 text-right text-muted">{rail.count} cases</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent Conversion by Specialty */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-main">Checkout Completion by Agent Profile</h3>
            <span className="text-[10px] font-mono text-primary-bright">Intent Alignment</span>
          </div>

          <div className="space-y-3">
            {agentTypeConversion.map((agent, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-main font-sans">{agent.type}</span>
                  <span className="text-mint font-bold">{agent.rate}% Conversion</span>
                </div>
                <div className="w-full bg-surface-elevated h-2.5 rounded-full overflow-hidden border border-border/60">
                  <div className={`h-full rounded-full ${agent.color}`} style={{ width: `${agent.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score vs Duplicate Prevention */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <h3 className="text-sm font-bold text-main">Trust Score & Safety Safeguards</h3>
              <span className="text-[10px] font-mono text-mint">Constitution v1.4</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              RecoverAI continuously correlates agent trust score with transaction velocity and cart variance. Unverified or degraded agents are automatically downgraded to mandatory human sign-off mode.
            </p>
          </div>

          <div className="p-3.5 bg-surface-elevated rounded-xl border border-border text-xs space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-muted">Human Sign-off Rate:</span>
              <span className="text-amber font-bold">14.6% (Strict Gating)</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-muted">Autonomous Safe Dispatch:</span>
              <span className="text-mint font-bold">85.4% (Within Scope)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
