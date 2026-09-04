import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { CustomerProfile } from '../types';

export const CustomersPage: React.FC = () => {
  const { customers, updateCustomer, showToast } = useRecovery();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preferredPaymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOptOut = (cust: CustomerProfile) => {
    const nextOptOut = !cust.optedOut;
    updateCustomer(cust.id, { optedOut: nextOptOut });
    showToast(
      `Customer ${cust.alias} ${nextOptOut ? 'OPTED OUT. Recovery outreach blocked.' : 'OPTED IN.'}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Customer Recovery Profiles
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-muted">
              PRIVACY-CONSCIOUS ALIASES
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Privacy-safe customer records showing historical checkout recovery responsiveness, preferred rails, and opt-out statuses.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-card">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer alias (e.g. Customer A-104)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-main placeholder-muted focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-muted font-mono text-[11px] uppercase">
                <th className="p-3.5 font-semibold">Customer Alias</th>
                <th className="p-3.5 font-semibold">Successful Tx</th>
                <th className="p-3.5 font-semibold">Interrupted</th>
                <th className="p-3.5 font-semibold">Recovery Rate</th>
                <th className="p-3.5 font-semibold">Lifetime Recovered</th>
                <th className="p-3.5 font-semibold">Preferred Rail</th>
                <th className="p-3.5 font-semibold">Trust Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-sans">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-surface-elevated/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(cust)}
                >
                  <td className="p-3.5 font-bold text-main">
                    <div>{cust.alias}</div>
                    <div className="text-[10px] text-muted font-normal font-mono">{cust.recentActivity}</div>
                  </td>

                  <td className="p-3.5 font-mono text-main">{cust.previousSuccessfulPayments}</td>
                  <td className="p-3.5 font-mono text-muted">{cust.previousFailedPayments}</td>

                  <td className="p-3.5 font-mono">
                    <span className={cust.recoveryRate > 70 ? 'text-mint font-bold' : 'text-amber'}>
                      {cust.recoveryRate}%
                    </span>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-mint">
                    ₹{cust.lifetimeRecoveredValue.toLocaleString('en-IN')}
                  </td>

                  <td className="p-3.5 font-mono text-primary-bright font-medium">
                    {cust.preferredPaymentMethod}
                  </td>

                  <td className="p-3.5">
                    {cust.optedOut ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-coral/15 text-coral border border-coral/30">
                        OPTED OUT
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
                        ACTIVE TRUST
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleOptOut(cust)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                        cust.optedOut
                          ? 'bg-mint/10 hover:bg-mint/20 border-mint/30 text-mint'
                          : 'bg-surface-elevated hover:bg-surface-highlight border-border text-muted hover:text-coral'
                      }`}
                    >
                      {cust.optedOut ? 'Opt Back In' : 'Set Opt-Out'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-main">{selectedCustomer.alias} Profile</h3>
                <span className="text-xs text-muted">Customer ID: {selectedCustomer.id}</span>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-muted hover:text-main text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-surface-elevated p-3 rounded-xl border border-border space-y-1.5">
                <div className="text-muted font-mono text-[10px] uppercase">Risk & Behavior Notes:</div>
                <p className="text-main font-sans">{selectedCustomer.riskNotes}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-surface-elevated p-2.5 rounded-xl border border-border">
                  <span className="text-muted text-[10px] uppercase block">Lifetime Value Recovered</span>
                  <span className="text-mint font-bold text-sm">₹{selectedCustomer.lifetimeRecoveredValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-surface-elevated p-2.5 rounded-xl border border-border">
                  <span className="text-muted text-[10px] uppercase block">Preferred Rail</span>
                  <span className="text-primary-bright font-bold text-sm">{selectedCustomer.preferredPaymentMethod}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-muted font-mono text-[10px] uppercase block">Recovery History Log</span>
                {selectedCustomer.history.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-surface-elevated border border-border/60 text-[11px] font-mono">
                    <span className="text-primary-bright font-bold">{h.caseId}</span>
                    <span className="text-main">₹{h.amount.toLocaleString('en-IN')}</span>
                    <span className="text-muted">{h.date}</span>
                    <span className="text-mint font-semibold">{h.outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-main"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
