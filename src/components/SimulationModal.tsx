import React from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  X,
  Zap,
  Clock,
  CreditCard,
  Wallet,
  AlertOctagon,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase?: (caseId: string) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
}) => {
  const { simulateEvent } = useRecovery();
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'upi_timeout',
      title: 'Temporary UPI Timeout',
      subtitle: 'High intent (91%) · Alternate UPI link after 10m buffer',
      amount: '₹4,999',
      badge: 'UPI / Shopping Agent',
      variant: 'mint',
      icon: <Clock className="w-4 h-4 text-mint" />,
    },
    {
      id: 'agent_amount_increase',
      title: 'Agent Intent Drift & Overrun',
      subtitle: 'TravelMate-204 requests ₹18,000 (exceeds ₹12,000 limit) · BLOCKED',
      amount: '₹18,000',
      badge: 'Agent Scope Block',
      variant: 'coral',
      icon: <AlertOctagon className="w-4 h-4 text-coral" />,
    },
    {
      id: 'duplicate_debit',
      title: 'Duplicate Debit Signal Detected',
      subtitle: 'Bank statement debit detected without capture · Retries BLOCKED',
      amount: '₹6,800',
      badge: 'Safety Safeguard',
      variant: 'coral',
      icon: <ShieldAlert className="w-4 h-4 text-coral" />,
    },
    {
      id: 'card_expired',
      title: 'Expired Card Decline',
      subtitle: 'Decline Code 54 · Dispatches secure card update token link',
      amount: '₹12,500',
      badge: 'Cards',
      variant: 'violet',
      icon: <CreditCard className="w-4 h-4 text-primary-bright" />,
    },
    {
      id: 'insufficient_balance',
      title: 'Insufficient Balance',
      subtitle: 'Declined · Gentle single reminder with NetBanking/UPI alternate',
      amount: '₹2,499',
      badge: 'UPI / Account',
      variant: 'amber',
      icon: <Wallet className="w-4 h-4 text-amber" />,
    },
    {
      id: 'bank_outage',
      title: 'Bank Core CBS Outage',
      subtitle: 'Bank rail down 99% · Recovery paused until switch health clears',
      amount: '₹15,000',
      badge: 'Bank Down',
      variant: 'amber',
      icon: <AlertTriangle className="w-4 h-4 text-amber" />,
    },
    {
      id: 'webhook_delay',
      title: 'Delayed Acquirer Webhook',
      subtitle: 'Async state pending · Halted for bank ledger reconciliation',
      amount: '₹8,200',
      badge: 'Reconciliation',
      variant: 'amber',
      icon: <AlertCircle className="w-4 h-4 text-amber" />,
    },
    {
      id: 'high_value_failure',
      title: 'High-Value VIP Order',
      subtitle: 'Exceeds ₹25,000 threshold · Escalated to human operator',
      amount: '₹42,000',
      badge: 'Human Escalation',
      variant: 'violet',
      icon: <TrendingUp className="w-4 h-4 text-primary-bright" />,
    },
    {
      id: 'customer_paid',
      title: 'Customer Completed Payment',
      subtitle: 'Simulates customer paying recovery link · Generates receipt',
      amount: 'Varies',
      badge: 'Revenue Recovered',
      variant: 'mint',
      icon: <CheckCircle2 className="w-4 h-4 text-mint" />,
    },
  ];

  const handleSimulate = (type: any) => {
    const createdCase = simulateEvent(type);
    onClose();
    if (createdCase && onSelectCase) {
      onSelectCase(createdCase.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-main p-1 rounded-lg hover:bg-surface-elevated transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 mb-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary-bright text-xs font-mono font-semibold uppercase">
            <Zap className="w-4 h-4" />
            Deterministic Event Injection Engine
          </div>
          <h3 className="text-xl font-bold text-main mt-0.5">Simulate Payment Failure Event</h3>
          <p className="text-xs text-muted mt-1">
            Trigger realistic payment failure events to observe autonomous diagnosis, duplicate safeguards, and agent intent checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSimulate(sc.id)}
              className="text-left p-3.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border hover:border-border-light transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-surface border border-border group-hover:border-border-light">
                    {sc.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-main group-hover:text-primary-bright transition-colors">
                      {sc.title}
                    </h4>
                    <span className="text-[10px] font-mono text-muted">{sc.badge}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-main">{sc.amount}</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{sc.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
          <span className="text-[11px]">Demo Mode · Synthetic Payment Events</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-muted hover:text-main rounded-lg hover:bg-surface-elevated"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
