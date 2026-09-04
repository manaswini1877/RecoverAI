import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Search,
  Filter,
  Layers,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { PaymentCase } from '../types';

interface CasesPageProps {
  onNavigate: (path: string) => void;
}

export const CasesPage: React.FC<CasesPageProps> = ({ onNavigate }) => {
  const { cases } = useRecovery();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [failureFilter, setFailureFilter] = useState('all');
  const [initiatorFilter, setInitiatorFilter] = useState('all');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.agentName && c.agentName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesFailure = failureFilter === 'all' || c.failureType === failureFilter;
    const matchesInitiator =
      initiatorFilter === 'all' ||
      (initiatorFilter === 'human' && c.initiatedBy === 'human') ||
      (initiatorFilter === 'agent' && c.initiatedBy !== 'human');

    return matchesSearch && matchesStatus && matchesFailure && matchesInitiator;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setFailureFilter('all');
    setInitiatorFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Failed-Payment Case Queue
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-muted">
              {cases.length} TOTAL CASES
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Search, filter, and inspect trust-aware recovery decisions across human and autonomous agent checkouts.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Case ID, customer alias, order ID, or agent name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-main placeholder-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Initiator Filter */}
          <select
            value={initiatorFilter}
            onChange={(e) => setInitiatorFilter(e.target.value)}
            aria-label="Filter by checkout initiator"
            className="bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Initiators</option>
            <option value="agent">AI Agents Only</option>
            <option value="human">Direct Human Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by case status"
            className="bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="action_ready">Action Ready</option>
            <option value="in_progress">In Progress</option>
            <option value="recovered">Recovered</option>
            <option value="escalated">Escalated</option>
            <option value="blocked">Blocked</option>
            <option value="expired">Expired</option>
            <option value="paused">Paused</option>
          </select>

          {/* Failure Type Filter */}
          <select
            value={failureFilter}
            onChange={(e) => setFailureFilter(e.target.value)}
            aria-label="Filter by failure cause"
            className="bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Failure Causes</option>
            <option value="temporary_bank_timeout">Temporary UPI Timeout</option>
            <option value="card_expired">Expired Card</option>
            <option value="insufficient_balance">Insufficient Balance</option>
            <option value="bank_outage">Bank Outage</option>
            <option value="webhook_delay">Delayed Webhook</option>
            <option value="duplicate_debit">Duplicate Debit Signal</option>
            <option value="agent_scope_exceeded">Agent Scope Overrun</option>
            <option value="customer_abandoned">Abandoned Checkout</option>
            <option value="high_value_failure">High-Value Order</option>
          </select>

          {(searchQuery || statusFilter !== 'all' || failureFilter !== 'all' || initiatorFilter !== 'all') && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-xs text-muted hover:text-main"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        {filteredCases.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Layers className="w-10 h-10 text-muted mx-auto opacity-40" />
            <h3 className="text-base font-bold text-main">No cases match these filters</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Try widening your search query, resetting filter dropdowns, or simulating a new payment failure.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-border bg-surface-elevated text-muted font-mono text-[11px] uppercase">
                  <th className="p-3.5 font-semibold">Case ID</th>
                  <th className="p-3.5 font-semibold">Customer Alias</th>
                  <th className="p-3.5 font-semibold">Initiated By</th>
                  <th className="p-3.5 font-semibold">Amount</th>
                  <th className="p-3.5 font-semibold">Failure Diagnosis</th>
                  <th className="p-3.5 font-semibold">Intent</th>
                  <th className="p-3.5 font-semibold">Dup Risk</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCases.map((c) => {
                  const statusStyles: Record<string, string> = {
                    action_ready: 'bg-primary/15 text-primary-bright border-primary/30',
                    in_progress: 'bg-mint/15 text-mint border-mint/30',
                    escalated: 'bg-amber/15 text-amber border-amber/30',
                    blocked: 'bg-coral/15 text-coral border-coral/30',
                    recovered: 'bg-mint/20 text-mint font-bold border-mint/40',
                    expired: 'bg-surface-elevated text-muted border-border',
                    paused: 'bg-amber/10 text-amber border-amber/20',
                  };

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onNavigate(`/app/cases/${c.id}`)}
                      className="hover:bg-surface-elevated/60 transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5 font-mono font-bold text-primary-bright group-hover:underline">
                        {c.id}
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-main">{c.customerAlias}</div>
                        <div className="text-[10px] text-muted">{c.orderId}</div>
                      </td>

                      <td className="p-3.5">
                        {c.agentName ? (
                          <div className="flex items-center gap-1.5 text-mint font-mono font-semibold text-[11px]">
                            <Bot className="w-3.5 h-3.5 text-primary-bright" />
                            {c.agentName}
                          </div>
                        ) : (
                          <span className="text-muted text-[11px]">Direct Checkout</span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-main">
                        ₹{c.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5">
                        <div className="text-main capitalize font-medium">
                          {c.failureType.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-muted">{c.paymentMethod}</div>
                      </td>

                      <td className="p-3.5 font-mono">
                        <span className={c.decision.customerIntent > 75 ? 'text-mint font-bold' : 'text-amber'}>
                          {c.decision.customerIntent}%
                        </span>
                      </td>

                      <td className="p-3.5 font-mono">
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

                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                            statusStyles[c.status] || 'bg-surface-elevated text-muted border-border'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 text-primary-bright opacity-80 group-hover:opacity-100">
                          <span className="text-[11px] font-semibold">Inspect</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
